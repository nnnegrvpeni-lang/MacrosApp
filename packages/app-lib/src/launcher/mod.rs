//! Logic for launching Minecraft
use crate::data::ModLoader;
use crate::event::emit::{emit_instance, emit_loading, init_loading};
use crate::event::{InstancePayloadType, LoadingBarType};
use crate::install::{
    InstallJavaStep, InstallPhaseDetails, InstallPhaseId, InstallProgress,
    InstallProgressReporter,
};
use crate::instance::QuickPlayType;
use crate::launcher::download::download_log_config;
use crate::launcher::io::IOError;
use crate::launcher::quick_play_version::{
    QuickPlayServerVersion, QuickPlayVersion,
};
use crate::server_address::{ServerAddress, parse_server_address};
use crate::state::server_join_log::JoinLogEntry;
use crate::state::{
    Credentials, InstanceInstallStage, InstanceLaunchContext, InstanceLink,
    JavaVersion, MemorySettings, ProcessMetadata, WindowSize,
};

use crate::util::io;
use crate::util::rpc::RpcServerBuilder;
use crate::{State, get_resource_file, process};
use chrono::Utc;
use daedalus as d;
use daedalus::minecraft::{LoggingSide, RuleAction, VersionInfo};
use daedalus::modded::{LoaderVersion, Manifest};
use regex::Regex;
use serde::Deserialize;
use std::fmt::Write;
use std::path::{Path, PathBuf};
use tokio::process::Command;

mod args;
pub(crate) mod hooks;

pub mod download;
pub mod quick_play_version;

// All nones -> disallowed
// 1+ true -> allowed
// 1+ false -> disallowed
#[tracing::instrument]
pub fn parse_rules(
    rules: &[d::minecraft::Rule],
    java_version: &str,
    quick_play_type: &QuickPlayType,
    minecraft_updated: bool,
) -> bool {
    let mut x = rules
        .iter()
        .map(|x| {
            parse_rule(x, java_version, quick_play_type, minecraft_updated)
        })
        .collect::<Vec<Option<bool>>>();

    if rules
        .iter()
        .all(|x| matches!(x.action, RuleAction::Disallow))
    {
        x.push(Some(true))
    }

    !(x.iter().any(|x| x == &Some(false)) || x.iter().all(|x| x.is_none()))
}

// if anything is disallowed, it should NOT be included
// if anything is not disallowed, it shouldn't factor in final result
// if anything is not allowed, it should NOT be included
// if anything is allowed, it should be included
#[tracing::instrument]
pub fn parse_rule(
    rule: &d::minecraft::Rule,
    java_version: &str,
    quick_play_type: &QuickPlayType,
    minecraft_updated: bool,
) -> Option<bool> {
    use d::minecraft::{Rule, RuleAction};

    let res = match rule {
        Rule { os: Some(os), .. } => {
            crate::util::platform::os_rule(os, java_version, minecraft_updated)
        }
        Rule {
            features: Some(features),
            ..
        } => {
            !features.is_demo_user.unwrap_or(true)
                || features.has_custom_resolution.unwrap_or(false)
                || !features.has_quick_plays_support.unwrap_or(true)
                || (features.is_quick_play_singleplayer.unwrap_or(false)
                    && matches!(
                        quick_play_type,
                        QuickPlayType::Singleplayer(_)
                    ))
                || (features.is_quick_play_multiplayer.unwrap_or(false)
                    && matches!(quick_play_type, QuickPlayType::Server(..)))
                || !features.is_quick_play_realms.unwrap_or(true)
        }
        _ => return Some(true),
    };

    match rule.action {
        RuleAction::Allow => {
            if res {
                Some(true)
            } else {
                Some(false)
            }
        }
        RuleAction::Disallow => {
            if res {
                Some(false)
            } else {
                None
            }
        }
    }
}

macro_rules! processor_rules {
    ($dest:expr; $($name:literal : client => $client:expr, server => $server:expr;)+) => {
        $(std::collections::HashMap::insert(
            $dest,
            String::from($name),
            daedalus::modded::SidedDataEntry {
                client: String::from($client),
                server: String::from($server),
            },
        );)+
    }
}

pub async fn get_java_version_from_launch_context(
    context: &InstanceLaunchContext,
    version_info: &VersionInfo,
) -> crate::Result<Option<JavaVersion>> {
    if let Some(java) = context.launch_overrides.java_path.as_ref() {
        let java =
            crate::api::jre::check_jre(std::path::PathBuf::from(java)).await;

        if let Ok(java) = java {
            return Ok(Some(java));
        }
    }

    let key = version_info
        .java_version
        .as_ref()
        .map_or(8, |it| it.major_version);

    let state = State::get().await?;

    let java_version = JavaVersion::get(key, &state.pool).await?;

    Ok(java_version)
}

pub async fn get_loader_version_from_profile(
    game_version: &str,
    loader: ModLoader,
    loader_version: Option<&str>,
) -> crate::Result<Option<LoaderVersion>> {
    if loader == ModLoader::Vanilla {
        return Ok(None);
    }

    if loader == ModLoader::Rust {
        let v = loader_version.ok_or_else(|| {
            crate::ErrorKind::LauncherError("No Rust/Horizon version specified".to_string())
        })?;
        return Ok(Some(LoaderVersion {
            id: v.to_string(),
            url: String::new(),
            stable: true,
        }));
    }

    let version = loader_version.unwrap_or("latest");

    let filter = |it: &LoaderVersion| match version {
        "latest" => true,
        "stable" => it.stable,
        id => it.id == *id,
    };

    let versions =
        crate::api::metadata::get_loader_versions(loader.as_meta_str()).await?;

    if let Some(loaders) =
        loader_versions_for_game_version(&versions, game_version)
    {
        let loader_version =
            loaders
                .iter()
                .find(|x| filter(x))
                .or(if version == "stable" {
                    loaders.first()
                } else {
                    None
                });

        Ok(loader_version.cloned())
    } else {
        Ok(None)
    }
}

fn loader_versions_for_game_version<'a>(
    manifest: &'a Manifest,
    game_version: &str,
) -> Option<&'a [LoaderVersion]> {
    let version = manifest.game_versions.iter().find(|x| {
        x.id.replace(daedalus::modded::DUMMY_REPLACE_STRING, game_version)
            == game_version
    })?;

    if let Some(version_group) = &version.version_group {
        manifest
            .version_groups
            .iter()
            .find(|group| group.id == *version_group)
            .map(|group| group.loaders.as_slice())
    } else {
        Some(version.loaders.as_slice())
    }
}

pub(crate) async fn resolve_java_for_launch(
    context: &InstanceLaunchContext,
) -> crate::Result<JavaVersion> {
    let state = State::get().await?;
    let content_set = &context.applied_content_set;
    let (minecraft, version_index) =
        resolve_minecraft_manifest(&content_set.game_version, &state).await?;
    let version = &minecraft.versions[version_index];

    let mut loader_version = get_loader_version_from_profile(
        &content_set.game_version,
        content_set.loader,
        content_set.loader_version.as_deref(),
    )
    .await?;

    if content_set.loader != ModLoader::Vanilla && loader_version.is_none() {
        loader_version = get_loader_version_from_profile(
            &content_set.game_version,
            content_set.loader,
            Some("stable"),
        )
        .await?;
    }

    let version_info = download::download_version_info(
        &state,
        version,
        loader_version.as_ref(),
        None,
        None,
        None,
    )
    .await?;

    let key = version_info
        .java_version
        .as_ref()
        .map_or(8, |it| it.major_version);
    let (java_path, set_java) = if let Some(java_version) =
        get_java_version_from_launch_context(context, &version_info).await?
    {
        (PathBuf::from(java_version.path), false)
    } else {
        (crate::api::jre::auto_install_java(key).await?, true)
    };

    let java_version = crate::api::jre::check_jre(java_path).await?;

    if set_java {
        java_version.upsert(&state.pool).await?;
    }

    Ok(java_version)
}

/// Resolves the Minecraft version manifest and finds the index for the given
/// game version. If the version isn't found in the cache, forces a manifest
/// refresh to pick up newly-released versions.
pub async fn resolve_minecraft_manifest(
    game_version: &str,
    state: &State,
) -> crate::Result<(d::minecraft::VersionManifest, usize)> {
    let minecraft = crate::api::metadata::get_minecraft_versions().await?;

    if let Some(idx) = minecraft
        .versions
        .iter()
        .position(|it| it.id == game_version)
    {
        return Ok((minecraft, idx));
    }

    // Version not found in cache — force a manifest refresh in case it was
    // released after the cache was populated.
    let refreshed = crate::state::CachedEntry::get_minecraft_manifest(
        Some(crate::state::CacheBehaviour::MustRevalidate),
        &state.pool,
        &state.api_semaphore,
    )
    .await?
    .ok_or_else(|| {
        crate::ErrorKind::NoValueFor("minecraft versions".to_string())
    })?;

    let idx = refreshed
        .versions
        .iter()
        .position(|it| it.id == game_version)
        .ok_or(crate::ErrorKind::LauncherError(format!(
            "Invalid game version: {game_version}"
        )))?;

    Ok((refreshed, idx))
}

async fn get_instance_full_path(instance_path: &str) -> crate::Result<PathBuf> {
    let state = State::get().await?;
    let instances_dir = state.directories.instances_dir();
    let full_path = io::canonicalize(instances_dir.join(instance_path))?;
    Ok(full_path)
}

pub async fn install_minecraft_with_reporter(
    context: &InstanceLaunchContext,
    repairing: bool,
    reporter: Option<InstallProgressReporter>,
) -> crate::Result<()> {
    let instance = &context.instance;
    let content_set = &context.applied_content_set;
    let phase_details = InstallPhaseDetails::Minecraft {
        game_version: content_set.game_version.clone(),
        loader: content_set.loader,
    };
    let loading_bar = if reporter.is_none() {
        Some(
            init_loading(
                LoadingBarType::MinecraftDownload {
                    // If we are downloading minecraft for a profile, provide its name and uuid
                    instance_name: instance.name.clone(),
                    instance_id: instance.id.clone(),
                },
                100.0,
                "Downloading Minecraft",
            )
            .await?,
        )
    } else {
        None
    };

    let state = State::get().await?;
    let previous_install_stage = instance.install_stage;

    crate::state::instances::commands::set_instance_install_stage(
        &instance.id,
        InstanceInstallStage::MinecraftInstalling,
        &state.pool,
    )
    .await?;
    emit_instance(&instance.id, InstancePayloadType::Edited).await?;

    let result = async {
    let instance_path = get_instance_full_path(&instance.path).await?;

    if content_set.loader == ModLoader::Rust {
        if let Some(reporter) = &reporter {
            reporter
                .update(
                    InstallPhaseId::ResolvingLoader,
                    None,
                    phase_details.clone(),
                )
                .await?;
        }

        ensure_horizon_installed(&instance_path, &state, reporter.as_ref(), loading_bar.as_ref()).await?;

        crate::state::instances::commands::set_instance_install_stage(
            &instance.id,
            InstanceInstallStage::Installed,
            &state.pool,
        )
        .await?;
        emit_instance(&instance.id, InstancePayloadType::Edited).await?;

        if let Some(reporter) = &reporter {
            reporter
                .update(
                    InstallPhaseId::Finalizing,
                    None,
                    phase_details.clone(),
                )
                .await?;
        }

        if let Some(loading_bar) = &loading_bar {
            emit_loading(loading_bar, 1.0, Some("Finished installing"))?;
        }
        return Ok::<(), crate::Error>(());
    }
    if let Some(reporter) = &reporter {
        reporter
            .update(
                InstallPhaseId::ResolvingMinecraft,
                None,
                phase_details.clone(),
            )
            .await?;
    }
    let (minecraft, version_index) =
        resolve_minecraft_manifest(&content_set.game_version, &state).await?;
    let version = &minecraft.versions[version_index];
    let minecraft_updated = version_index
        <= minecraft
            .versions
            .iter()
            .position(|x| x.id == "22w16a")
            .unwrap_or(0);

    if content_set.loader != ModLoader::Vanilla
        && let Some(reporter) = &reporter
    {
        reporter
            .update(
                InstallPhaseId::ResolvingLoader,
                None,
                phase_details.clone(),
            )
            .await?;
    }

    let mut loader_version = get_loader_version_from_profile(
        &content_set.game_version,
        content_set.loader,
        content_set.loader_version.as_deref(),
    )
    .await?;

    // If no loader version is selected, try to select the stable version!
    if content_set.loader != ModLoader::Vanilla && loader_version.is_none() {
        loader_version = get_loader_version_from_profile(
            &content_set.game_version,
            content_set.loader,
            Some("stable"),
        )
        .await?;

        crate::state::instances::commands::set_applied_content_set_loader_version(
            &instance.id,
            loader_version.as_ref().map(|x| x.id.as_str()),
            &state.pool,
        )
        .await?;
    }

    let version_jar =
        loader_version.as_ref().map_or(version.id.clone(), |it| {
            format!("{}-{}", version.id.clone(), it.id.clone())
        });

    // Download version info (5)
    let mut version_info = download::download_version_info(
        &state,
        version,
        loader_version.as_ref(),
        Some(repairing),
        loading_bar.as_ref(),
        reporter.as_ref(),
    )
    .await?;

    let key = version_info
        .java_version
        .as_ref()
        .map_or(8, |it| it.major_version);
    if let Some(reporter) = &reporter {
        reporter
            .update(
                InstallPhaseId::PreparingJava,
                Some(InstallProgress {
                    current: 0,
                    total: 4,
                    secondary: None,
                }),
                InstallPhaseDetails::Java {
                    major_version: key,
                    step: InstallJavaStep::Resolving,
                },
            )
            .await?;
    }
    let (java_version, set_java) = if let Some(java_version) =
        get_java_version_from_launch_context(context, &version_info).await?
    {
        (std::path::PathBuf::from(java_version.path), false)
    } else {
        let path = if let Some(reporter) = &reporter {
            crate::api::jre::auto_install_java_with_reporter(
                key,
                reporter.clone(),
            )
            .await?
        } else {
            crate::api::jre::auto_install_java_with_loading(key, true).await?
        };

        (path, true)
    };

    // Test jre version
    if let Some(reporter) = &reporter {
        reporter
            .update(
                InstallPhaseId::PreparingJava,
                Some(InstallProgress {
                    current: 4,
                    total: 4,
                    secondary: None,
                }),
                InstallPhaseDetails::Java {
                    major_version: key,
                    step: InstallJavaStep::Validating,
                },
            )
            .await?;
    }
    let java_version = crate::api::jre::check_jre(java_version.clone()).await?;

    if set_java {
        java_version.upsert(&state.pool).await?;
    }

    // Download minecraft (5-90)
    if let Some(reporter) = &reporter {
        reporter
            .update(
                InstallPhaseId::DownloadingMinecraft,
                None,
                phase_details.clone(),
            )
            .await?;
    }
    download::download_minecraft(
        &state,
        &version_info,
        loading_bar.as_ref(),
        &java_version.architecture,
        repairing,
        minecraft_updated,
        reporter.clone(),
        phase_details.clone(),
    )
    .await?;

    let client_path = state
        .directories
        .version_dir(&version_jar)
        .join(format!("{version_jar}.jar"));
    if let Some(processors) = &version_info.processors {
        let libraries_dir = state.directories.libraries_dir();

        if let Some(ref mut data) = version_info.data {
            processor_rules! {
                data;
                "SIDE":
                    client => "client",
                    server => "";
                "MINECRAFT_JAR" :
                    client => client_path.to_string_lossy(),
                    server => "";
                "MINECRAFT_VERSION":
                    client => content_set.game_version.clone(),
                    server => "";
                "ROOT":
                    client => instance_path.to_string_lossy(),
                    server => "";
                "LIBRARY_DIR":
                    client => libraries_dir.to_string_lossy(),
                    server => "";
            }

            if let Some(loading_bar) = &loading_bar {
                emit_loading(
                    loading_bar,
                    0.0,
                    Some("Running forge processors"),
                )?;
            }
            let total_length = processors.len();
            if let Some(reporter) = &reporter {
                reporter
                    .update(
                        InstallPhaseId::RunningLoaderProcessors,
                        Some(InstallProgress {
                            current: 0,
                            total: total_length as u64,
                            secondary: None,
                        }),
                        phase_details.clone(),
                    )
                    .await?;
            }

            // Forge processors (90-100)
            for (index, processor) in processors.iter().enumerate() {
                if let Some(sides) = &processor.sides
                    && !sides.contains(&String::from("client"))
                {
                    if let Some(reporter) = &reporter {
                        reporter
                            .update(
                                InstallPhaseId::RunningLoaderProcessors,
                                Some(InstallProgress {
                                    current: (index + 1) as u64,
                                    total: total_length as u64,
                                    secondary: None,
                                }),
                                phase_details.clone(),
                            )
                            .await?;
                    }
                    continue;
                }

                let cp = {
                    let mut cp = processor.classpath.clone();
                    cp.push(processor.jar.clone());
                    cp
                };

                let child = Command::new(&java_version.path)
                    .arg("-cp")
                    .arg(args::get_class_paths_jar(
                        &libraries_dir,
                        &cp,
                        &java_version.architecture,
                    )?)
                    .arg(
                        args::get_processor_main_class(args::get_lib_path(
                            &libraries_dir,
                            &processor.jar,
                            false,
                        )?)
                        .await?
                        .ok_or_else(|| {
                            crate::ErrorKind::LauncherError(format!(
                                "Could not find processor main class for {}",
                                processor.jar
                            ))
                        })?,
                    )
                    .args(args::get_processor_arguments(
                        &libraries_dir,
                        &processor.args,
                        data,
                    )?)
                    .output()
                    .await
                    .map_err(|e| IOError::with_path(e, &java_version.path))
                    .map_err(|err| {
                        crate::ErrorKind::LauncherError(format!(
                            "Error running processor: {err}",
                        ))
                    })?;

                if !child.status.success() {
                    return Err(crate::ErrorKind::LauncherError(format!(
                        "Processor error: {}",
                        String::from_utf8_lossy(&child.stderr)
                    ))
                    .as_error());
                }

                if let Some(loading_bar) = &loading_bar {
                    emit_loading(
                        loading_bar,
                        30.0 / total_length as f64,
                        Some(&format!(
                            "Running forge processor {index}/{total_length}"
                        )),
                    )?;
                }
                if let Some(reporter) = &reporter {
                    reporter
                        .update(
                            InstallPhaseId::RunningLoaderProcessors,
                            Some(InstallProgress {
                                current: (index + 1) as u64,
                                total: total_length as u64,
                                secondary: None,
                            }),
                            phase_details.clone(),
                        )
                        .await?;
                }
            }
        }
    }

    let protocol_version = read_protocol_version_from_jar(client_path).await?;

    crate::state::instances::commands::set_applied_content_set_protocol_version(
        &instance.id,
        protocol_version,
        &state.pool,
    )
    .await?;
	if reporter.is_none() {
		crate::state::instances::commands::set_instance_install_stage(
			&instance.id,
			InstanceInstallStage::Installed,
			&state.pool,
		)
		.await?;
		emit_instance(&instance.id, InstancePayloadType::Edited).await?;
	}
    if let Some(loading_bar) = &loading_bar {
        emit_loading(loading_bar, 1.0, Some("Finished installing"))?;
    }

    Ok::<(), crate::Error>(())
    }
    .await;

    if result.is_err() {
        if let Err(error) =
            crate::state::instances::commands::set_instance_install_stage(
                &instance.id,
                previous_install_stage,
                &state.pool,
            )
            .await
        {
            tracing::error!(
                "Failed to restore install stage for instance {}: {error}",
                instance.id
            );
        } else if let Err(error) =
            emit_instance(&instance.id, InstancePayloadType::Edited).await
        {
            tracing::error!(
                "Failed to emit restored install stage for instance {}: {error}",
                instance.id
            );
        }
    }

    result
}

pub async fn install_minecraft_for_instance_id_with_reporter(
    instance_id: &str,
    repairing: bool,
    reporter: Option<InstallProgressReporter>,
) -> crate::Result<()> {
    let state = State::get().await?;
    let context =
        crate::state::instances::commands::get_instance_launch_context(
            instance_id,
            &state.pool,
        )
        .await?
        .ok_or_else(|| {
            crate::ErrorKind::OtherError(format!(
                "Tried to install a nonexistent or unloaded instance {instance_id}!"
            ))
        })?;

    install_minecraft_with_reporter(&context, repairing, reporter).await
}

pub async fn read_protocol_version_from_jar(
    path: PathBuf,
) -> crate::Result<Option<u32>> {
    let zip = async_zip::tokio::read::fs::ZipFileReader::new(path).await?;
    let Some(entry_index) = zip
        .file()
        .entries()
        .iter()
        .position(|x| matches!(x.filename().as_str(), Ok("version.json")))
    else {
        return Ok(None);
    };

    #[derive(Deserialize, Debug)]
    struct VersionData {
        protocol_version: Option<u32>,
    }

    let mut data = vec![];
    zip.reader_with_entry(entry_index)
        .await?
        .read_to_end_checked(&mut data)
        .await?;
    let data: VersionData = serde_json::from_slice(&data)?;

    Ok(data.protocol_version)
}

fn link_project_and_version(
    link: &InstanceLink,
) -> (Option<&String>, Option<&String>) {
    match link {
        InstanceLink::ModrinthModpack {
            project_id,
            version_id,
        } => (Some(project_id), Some(version_id)),
        InstanceLink::ServerProject { project_id } => (Some(project_id), None),
        InstanceLink::ServerProjectModpack {
            server_project_id,
            content_version_id,
            ..
        } => (Some(server_project_id), Some(content_version_id)),
        InstanceLink::ImportedModpack {
            project_id,
            version_id,
            ..
        } => (project_id.as_ref(), version_id.as_ref()),
        InstanceLink::Unmanaged
        | InstanceLink::ModrinthHosting { .. }
        | InstanceLink::SharedInstance { .. } => (None, None),
    }
}

#[tracing::instrument(skip_all)]
#[allow(clippy::too_many_arguments)]
pub async fn launch_minecraft(
    java_args: &[String],
    env_args: &[(String, String)],
    mc_set_options: &[(String, String)],
    wrapper: &Option<String>,
    memory: &MemorySettings,
    resolution: &WindowSize,
    credentials: &Credentials,
    post_exit_hook: Option<String>,
    context: &InstanceLaunchContext,
    mut quick_play_type: QuickPlayType,
) -> crate::Result<ProcessMetadata> {
    let instance = &context.instance;
    let content_set = &context.applied_content_set;

    if instance.install_stage == InstanceInstallStage::PackInstalling
        || instance.install_stage == InstanceInstallStage::MinecraftInstalling
    {
        return Err(crate::ErrorKind::LauncherError(
            "Instance is still installing".to_string(),
        )
        .into());
    }

    if instance.install_stage != InstanceInstallStage::Installed {
        return Err(crate::ErrorKind::LauncherError(
            "Instance is not installed; start an install job first".to_string(),
        )
        .into());
    }

    let state = State::get().await?;

    let instance_path = get_instance_full_path(&instance.path).await?;

    if content_set.loader == ModLoader::Rust {
        return launch_rust_horizon(
            &state,
            instance,
            &instance_path,
            credentials,
            &quick_play_type,
            wrapper,
            post_exit_hook,
            env_args,
        )
        .await;
    }

    let (minecraft, version_index) =
        resolve_minecraft_manifest(&content_set.game_version, &state).await?;
    let version = &minecraft.versions[version_index];
    let minecraft_updated = version_index
        <= minecraft
            .versions
            .iter()
            .position(|x| x.id == "22w16a")
            .unwrap_or(0);

    let loader_version = get_loader_version_from_profile(
        &content_set.game_version,
        content_set.loader,
        content_set.loader_version.as_deref(),
    )
    .await?;

    if content_set.loader != ModLoader::Vanilla && loader_version.is_none() {
        return Err(crate::ErrorKind::LauncherError(format!(
            "No loader version selected for {}",
            content_set.loader.as_str()
        ))
        .into());
    }

    let version_jar =
        loader_version.as_ref().map_or(version.id.clone(), |it| {
            format!("{}-{}", version.id.clone(), it.id.clone())
        });

    let mut version_info = download::download_version_info(
        &state,
        version,
        loader_version.as_ref(),
        None,
        None,
        None,
    )
    .await?;
    if version_info.logging.is_none() {
        let requires_logging_info = version_index
            <= minecraft
                .versions
                .iter()
                .position(|x| x.id == "13w39a")
                .unwrap_or(0);
        if requires_logging_info {
            version_info = download::download_version_info(
                &state,
                version,
                loader_version.as_ref(),
                Some(true),
                None,
                None,
            )
            .await?;
        }
    }

    let _ =
        download_log_config(&state, &version_info, None, false, None).await?;

    let java_version =
        get_java_version_from_launch_context(context, &version_info)
            .await?
            .ok_or_else(|| {
                crate::ErrorKind::LauncherError(
                    "Missing correct java installation".to_string(),
                )
            })?;

    // Test jre version
    let java_version =
        crate::api::jre::check_jre(java_version.path.clone().into()).await?;

    let client_path = state
        .directories
        .version_dir(&version_jar)
        .join(format!("{version_jar}.jar"));

    let args = version_info.arguments.clone().unwrap_or_default();
    let mut command = match wrapper {
        Some(hook) => {
            let mut cmd = shlex::split(hook)
                .ok_or_else(|| {
                    crate::ErrorKind::LauncherError(format!(
                        "Invalid wrapper command: {hook}",
                    ))
                })?
                .into_iter();
            let mut command = Command::new(cmd.next().ok_or(
                crate::ErrorKind::LauncherError(
                    "Empty wrapper command".to_owned(),
                ),
            )?);
            command.args(cmd);
            command.arg(&java_version.path);
            command
        }
        None => Command::new(&java_version.path),
    };

    let env_args = Vec::from(env_args);

    // Check if instance has a running process, and reject running the command if it does
    // Done late so a quick double call doesn't launch two instances
    let existing_processes = process::get_by_instance_id(&instance.id).await?;
    if let Some(process) = existing_processes.first() {
        return Err(crate::ErrorKind::LauncherError(format!(
            "Instance {} is already running as process {}",
            instance.id, process.uuid
        ))
        .as_error());
    }

    let natives_dir = state.directories.version_natives_dir(&version_jar);
    if !natives_dir.exists() {
        io::create_dir_all(&natives_dir).await?;
    }

    let quick_play_version =
        QuickPlayVersion::find_version(version_index, &minecraft.versions);
    tracing::debug!(
        "Found QuickPlayVersion for {}: {quick_play_version:?}",
        content_set.game_version
    );
    if let QuickPlayType::Server(address) = &mut quick_play_type
        && quick_play_version.server >= QuickPlayServerVersion::BuiltinLegacy
    {
        // Record last-played for the original server address immediately so
        // recent-worlds can match without DNS/SRV resolution.
        let original = match address {
            ServerAddress::Unresolved(address) => parse_server_address(address)
                .ok()
                .map(|(h, p)| (h.to_owned(), p)),
            ServerAddress::Resolved {
                original_host,
                original_port,
                ..
            } => Some((original_host.clone(), *original_port)),
        };
        if let Some((host, port)) = original
            && let Err(e) = (JoinLogEntry {
                instance_id: instance.id.clone(),
                host,
                port,
                join_time: Utc::now(),
            })
            .upsert(&state.pool)
            .await
        {
            tracing::warn!("Failed to write server join log entry: {e}");
        }

        address.resolve().await?;
    }

    let mut used_ely_authlib = false;
    if credentials.is_elyby() {
        used_ely_authlib = patch_libraries_for_elyby(&state, &mut version_info.libraries).await;
    }

    let (main_class_keep_alive, main_class_path) =
        get_resource_file!(env "JAVA_JARS_DIR" / "theseus.jar")?;

    let rpc_server = RpcServerBuilder::new().launch().await?;

    command.args(
        args::get_jvm_arguments(
            args.get(&d::minecraft::ArgumentType::Jvm)
                .map(|x| x.as_slice()),
            &natives_dir,
            &state.directories.libraries_dir(),
            &state.directories.log_configs_dir(),
            &args::get_class_paths(
                &state.directories.libraries_dir(),
                version_info.libraries.as_slice(),
                &[&main_class_path, &client_path],
                &java_version.architecture,
                minecraft_updated,
            )?,
            &main_class_path,
            &version_jar,
            *memory,
            Vec::from(java_args),
            &java_version.architecture,
            &quick_play_type,
            quick_play_version,
            version_info
                .logging
                .as_ref()
                .and_then(|x| x.get(&LoggingSide::Client)),
            rpc_server.address(),
        )?
        .into_iter(),
    );

    // The java launcher requires access to java.lang.reflect in order to force access in to
    // whatever module the main class is in
    if java_version.parsed_version >= 9 {
        command.arg("--add-opens=java.base/java.lang.reflect=ALL-UNNAMED");
    }

    // The java launcher code requires internal JDK code in Java 25+ in order to support JEP 512
    if java_version.parsed_version >= 25 {
        command.arg("--add-opens=jdk.internal/jdk.internal.misc=ALL-UNNAMED");
    }

    if credentials.is_elyby() {
        if used_ely_authlib {
            command.arg("-Dminecraft.api.env=ELY");
            command.arg("-Dely.authlib.offlineProfileLookupUrl=https://skinsystem.ely.by/profile/");
            command.arg("-Dely.authlib.fetchMissingSkinsByUsername=true");
            command.arg("-Dely.authlib.skipValidatePropertySignature=true");
            command.arg("-Dely.authlib.skipFetchBlockList=true");
            command.arg("-Dely.authlib.skipFetchPrivileges=true");
            command.arg("-Dely.authlib.disableReports=true");
        } else {
            let caches_dir = state.directories.caches_dir();
            let _ = tokio::fs::create_dir_all(&caches_dir).await;
            let authlib_path = caches_dir.join("authlib-injector.jar");
            let is_valid = match tokio::fs::metadata(&authlib_path).await {
                Ok(meta) => meta.len() >= 100_000,
                Err(_) => false,
            };
            if !is_valid {
                const BUNDLED_AUTHLIB: &[u8] =
                    include_bytes!("../../assets/authlib-injector.jar");
                let _ = tokio::fs::write(&authlib_path, BUNDLED_AUTHLIB).await;
            }

            if authlib_path.exists() {
                let normalized_path = authlib_path.to_string_lossy().replace('\\', "/");
                command.arg(format!(
                    "-javaagent:{}={}",
                    normalized_path,
                    "https://authserver.ely.by/api/authlib-injector"
                ));
                command.arg("-Dauthlibinjector.noMojangNamespace=true");
                command.arg("-Dauthlibinjector.side=client");
            }
        }
    }

    command
        .arg("com.modrinth.theseus.MinecraftLaunch")
        .arg(version_info.main_class.clone())
        .args(
            args::get_minecraft_arguments(
                args.get(&d::minecraft::ArgumentType::Game)
                    .map(|x| x.as_slice()),
                version_info.minecraft_arguments.as_deref(),
                credentials,
                &version.id,
                &version_info.asset_index.id,
                &instance_path,
                &state.directories.assets_dir(),
                &version.type_,
                *resolution,
                &java_version.architecture,
                &quick_play_type,
                quick_play_version,
            )
            .await?
            .into_iter(),
        )
        .current_dir(instance_path.clone());

    // CARGO-set DYLD_LIBRARY_PATH breaks Minecraft on macOS during testing on playground
    #[cfg(target_os = "macos")]
    if std::env::var("CARGO").is_ok() {
        command.env_remove("DYLD_FALLBACK_LIBRARY_PATH");
    }
    // Java options should be set in instance options (the existence of _JAVA_OPTIONS overwrites them)
    command.env_remove("_JAVA_OPTIONS");

    command.envs(env_args.iter().cloned());

    // Overwrites the minecraft options.txt file with the settings from the profile
    // Uses 'a:b' syntax which is not quite yaml
    if !mc_set_options.is_empty() {
        let options_path = instance_path.join("options.txt");

        let (mut options_string, input_encoding) = if options_path.exists() {
            io::read_any_encoding_to_string(&options_path).await?
        } else {
            (String::new(), encoding_rs::UTF_8)
        };

        // UTF-16 encodings may be successfully detected and read, but we cannot encode
        // them back, and it's technically possible that the game client strongly expects
        // such encoding
        if input_encoding != input_encoding.output_encoding() {
            return Err(crate::ErrorKind::LauncherError(format!(
                "The instance options.txt file uses an unsupported encoding: {}. \
                Please either turn off instance options that need to modify this file, \
                or convert the file to an encoding that both the game and this app support, \
                such as UTF-8.",
                input_encoding.name()
            ))
            .into());
        }

        for (key, value) in mc_set_options {
            let re = Regex::new(&format!(r"(?m)^{}:.*$", regex::escape(key)))?;
            // check if the regex exists in the file
            if !re.is_match(&options_string) {
                // The key was not found in the file, so append it
                write!(&mut options_string, "\n{key}:{value}").unwrap();
            } else {
                let replaced_string = re
                    .replace_all(&options_string, &format!("{key}:{value}"))
                    .to_string();
                options_string = replaced_string;
            }
        }

        io::write(&options_path, input_encoding.encode(&options_string).0)
            .await?;
    }

    crate::state::instances::commands::set_instance_last_played(
        &instance.id,
        Utc::now(),
        &state.pool,
    )
    .await?;

    // If in tauri, and the 'minimize on launch' setting is enabled, minimize the window
    #[cfg(feature = "tauri")]
    {
        use crate::EventState;

        let window = EventState::get_main_window().await?;
        if let Some(window) = window {
            let settings = crate::state::Settings::get(&state.pool).await?;
            if settings.hide_on_process_start {
                window.minimize()?;
            }
        }
    }

    let _ = state
        .discord_rpc
        .set_activity(&format!("Playing {}", instance.name), true)
        .await;

    let _ = state
        .friends_socket
        .update_status(Some(instance.name.clone()))
        .await;

    // Create Minecraft child by inserting it into the state
    // This also spawns the process and prepares the subsequent processes
    state
        .process_manager
        .insert_new_process(
            &instance.id,
            &instance.path,
            &instance.name,
            command,
            post_exit_hook,
            env_args,
            state.directories.instance_logs_dir(&instance.path),
            version_info.logging.is_some(),
            main_class_keep_alive,
            rpc_server,
            async |process: &ProcessMetadata, rpc_server| {
                let process_start_time = process.start_time.to_rfc3339();
                let instance_created_time = instance.created.to_rfc3339();
                let instance_modified_time = instance.modified.to_rfc3339();
                let (link_project_id, link_version_id) =
                    link_project_and_version(&context.link);
                let system_properties = [
                    ("modrinth.process.startTime", Some(&process_start_time)),
                    ("modrinth.profile.created", Some(&instance_created_time)),
                    ("modrinth.profile.icon", instance.icon_path.as_ref()),
                    ("modrinth.profile.link.project", link_project_id),
                    ("modrinth.profile.link.version", link_version_id),
                    (
                        "modrinth.profile.modified",
                        Some(&instance_modified_time),
                    ),
                    ("modrinth.profile.name", Some(&instance.name)),
                ];
                for (key, value) in system_properties {
                    let Some(value) = value else {
                        continue;
                    };
                    rpc_server
                        .call_method_2::<()>("set_system_property", key, value)
                        .await?;
                }
                rpc_server.call_method::<()>("launch").await?;
                Ok(())
            },
        )
        .await
}

pub async fn patch_libraries_for_elyby(
	state: &State,
	libraries: &mut Vec<daedalus::minecraft::Library>,
) -> bool {
	let mojang_lib_idx = match libraries
		.iter()
		.position(|l| l.name.starts_with("com.mojang:authlib:"))
	{
		Some(idx) => idx,
		None => return false,
	};

	let mojang_name = libraries[mojang_lib_idx].name.clone();
	let version = match mojang_name.split(':').nth(2) {
		Some(v) => v,
		None => return false,
	};

	tracing::info!(
		"Attempting to patch Mojang authlib {version} with Ely.by authlib"
	);

	#[derive(serde::Deserialize)]
	struct ElyMetaArtifact {
		url: String,
	}

	#[derive(serde::Deserialize)]
	struct ElyMetaDownloads {
		artifact: Option<ElyMetaArtifact>,
	}

	#[derive(serde::Deserialize)]
	struct ElyMetaLibrary {
		name: String,
		downloads: Option<ElyMetaDownloads>,
	}

	#[derive(serde::Deserialize)]
	struct ElyMetaResponse {
		libraries: Vec<ElyMetaLibrary>,
	}

	let client = reqwest::Client::builder()
		.user_agent("Macros/1.0.0")
		.timeout(std::time::Duration::from_secs(10))
		.build()
		.unwrap_or_else(|_| crate::util::fetch::INSECURE_REQWEST_CLIENT.clone());

	let mut meta: Option<ElyMetaResponse> = None;
	for base in &[
		"https://elyprismlauncher.github.io/meta/v1/by.ely.authlib",
		"https://meta.pineconemc.ru/v1/by.ely.authlib",
	] {
		let meta_url = format!("{base}/{version}.json");
		if let Ok(resp) = client.get(&meta_url).send().await {
			if resp.status().is_success() {
				if let Ok(parsed) = resp.json::<ElyMetaResponse>().await {
					meta = Some(parsed);
					break;
				}
			}
		}
	}

	let ely_lib_info = match meta.and_then(|m| m.libraries.into_iter().next()) {
		Some(l) => l,
		None => {
			tracing::warn!(
				"No Ely.by authlib metadata found for version {version}"
			);
			return false;
		}
	};

	let rel_path = match daedalus::get_path_from_artifact(&ely_lib_info.name) {
		Ok(p) => p,
		Err(e) => {
			tracing::warn!(
				"Failed to get artifact path for {}: {e}",
				ely_lib_info.name
			);
			return false;
		}
	};

	let target_jar = state.directories.libraries_dir().join(&rel_path);

	let needs_download = match tokio::fs::metadata(&target_jar).await {
		Ok(m) => m.len() == 0,
		Err(_) => true,
	};

	if needs_download {
		if let Some(downloads) = &ely_lib_info.downloads
			&& let Some(artifact) = &downloads.artifact
		{
			tracing::info!("Downloading Ely.by authlib from {}", artifact.url);
			match client.get(&artifact.url).send().await {
				Ok(resp) if resp.status().is_success() => {
					if let Ok(bytes) = resp.bytes().await {
						if let Some(parent) = target_jar.parent() {
							let _ = tokio::fs::create_dir_all(parent).await;
						}
						if let Err(e) =
							tokio::fs::write(&target_jar, &bytes).await
						{
							tracing::error!(
								"Failed to write Ely.by authlib jar: {e}"
							);
							return false;
						}
					} else {
						return false;
					}
				}
				_ => return false,
			}
		} else {
			return false;
		}
	}

	if target_jar.exists() {
		tracing::info!("Successfully patched authlib to {}", ely_lib_info.name);
		libraries.retain(|l| !l.name.starts_with("com.mojang:authlib:"));
		libraries.insert(0, daedalus::minecraft::Library {
			downloads: None,
			extract: None,
			name: ely_lib_info.name,
			url: None,
			natives: None,
			rules: None,
			checksums: None,
			include_in_classpath: true,
			downloadable: false,
		});
		return true;
	}

	false
}

async fn launch_rust_horizon(
    state: &State,
    instance: &crate::state::Instance,
    instance_path: &std::path::Path,
    credentials: &Credentials,
    quick_play_type: &QuickPlayType,
    wrapper: &Option<String>,
    post_exit_hook: Option<String>,
    env_args: &[(String, String)],
) -> crate::Result<ProcessMetadata> {
    let existing_processes = process::get_by_instance_id(&instance.id).await?;
    if let Some(proc) = existing_processes.first() {
        return Err(crate::ErrorKind::LauncherError(format!(
            "Instance {} is already running as process {}",
            instance.id, proc.uuid
        ))
        .as_error());
    }

    let binary = if instance_path.join("horizon-client.exe").exists()
        && find_horizon_resources(instance_path, state).is_some()
    {
        instance_path.join("horizon-client.exe")
    } else {
        ensure_horizon_installed(instance_path, state, None, None).await?
    };

    let resources_dir = find_horizon_resources(instance_path, state)
        .ok_or_else(|| {
            crate::ErrorKind::LauncherError(
                "Horizon 26.3 resources not found. Ensure 26.3 assets are prepared or set HORIZON_RESOURCES_PATH".to_string(),
            )
        })?;

    let mut command = match wrapper {
        Some(hook) => {
            let mut cmd = shlex::split(hook)
                .ok_or_else(|| {
                    crate::ErrorKind::LauncherError(format!(
                        "Invalid wrapper command: {hook}",
                    ))
                })?
                .into_iter();
            let mut command = Command::new(cmd.next().ok_or_else(|| {
                crate::ErrorKind::LauncherError("Empty wrapper command".to_owned())
            })?);
            command.args(cmd);
            command.arg(binary);
            command
        }
        None => Command::new(binary),
    };

    command.current_dir(instance_path);
    #[cfg(windows)]
    {
        command.creation_flags(0x08000000);
    }
    let player_name = if credentials.offline_profile.name.is_empty() {
        "Player"
    } else {
        &credentials.offline_profile.name
    };
    command.arg("--name").arg(player_name);
    command.arg("--game-dir").arg(instance_path);
    command.arg("--resources").arg(resources_dir);

    if let QuickPlayType::Server(address) = quick_play_type {
        command.arg("--server").arg(address.to_string());
    }

    let logs_folder = state.directories.instance_logs_dir(&instance.path);
    let keep_alive = tempfile::tempdir().map_err(IOError::from)?;
    let rpc_server = RpcServerBuilder::new().launch().await?;

    let _ = state
        .friends_socket
        .update_status(Some(instance.name.clone()))
        .await;

    state
        .process_manager
        .insert_new_process(
            &instance.id,
            &instance.path,
            &instance.name,
            command,
            post_exit_hook,
            env_args.to_vec(),
            logs_folder,
            false,
            keep_alive,
            rpc_server,
            async |_process: &ProcessMetadata, _rpc_server| Ok(()),
        )
        .await
}

async fn download_file_streaming(
    client: &reqwest::Client,
    url: &str,
    target_path: &Path,
    phase: InstallPhaseId,
    phase_details: &InstallPhaseDetails,
    reporter: Option<&InstallProgressReporter>,
    loading_bar: Option<&crate::event::LoadingBarId>,
    label: &str,
) -> crate::Result<()> {
    if let Some(parent) = target_path.parent() {
        crate::util::io::create_dir_all(parent).await?;
    }

    let mut resp = client
        .get(url)
        .send()
        .await
        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to download from {url}: {e}")))?;

    if !resp.status().is_success() {
        return Err(crate::ErrorKind::OtherError(format!(
            "Failed download from {url}: HTTP {}",
            resp.status()
        ))
        .into());
    }

    let total = resp.content_length().unwrap_or(0);
    let mut downloaded = 0u64;

    use tokio::io::AsyncWriteExt;
    let mut file = tokio::fs::File::create(target_path)
        .await
        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to create file {:?}: {e}", target_path)))?;

    let mut last_report = std::time::Instant::now();

    while let Some(chunk) = resp
        .chunk()
        .await
        .map_err(|e| crate::ErrorKind::OtherError(format!("Error reading download stream from {url}: {e}")))?
    {
        file.write_all(&chunk)
            .await
            .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to write chunk to {:?}: {e}", target_path)))?;
        downloaded += chunk.len() as u64;

        if last_report.elapsed() >= std::time::Duration::from_millis(150) || (total > 0 && downloaded == total) {
            last_report = std::time::Instant::now();
            if let Some(reporter) = reporter {
                let prog = if total > 0 {
                    Some(InstallProgress {
                        current: downloaded,
                        total,
                        secondary: None,
                    })
                } else {
                    None
                };
                let _ = reporter.update(phase, prog, phase_details.clone()).await;
            }
            if let Some(bar) = loading_bar {
                let frac = if total > 0 {
                    downloaded as f64 / total as f64
                } else {
                    0.5
                };
                let _ = emit_loading(bar, frac, Some(label));
            }
        }
    }

    file.flush()
        .await
        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to flush file {:?}: {e}", target_path)))?;

    Ok(())
}

async fn ensure_horizon_installed(
    instance_path: &Path,
    state: &State,
    reporter: Option<&InstallProgressReporter>,
    loading_bar: Option<&crate::event::LoadingBarId>,
) -> crate::Result<PathBuf> {
    let mods_dir = instance_path.join("horizon-mods");
    crate::util::io::create_dir_all(&mods_dir).await?;
    crate::util::io::create_dir_all(&instance_path.join("resourcepacks")).await?;
    crate::util::io::create_dir_all(&instance_path.join("shaderpacks")).await?;

    let native_dir = instance_path.join("horizon-native-mods");
    if native_dir.exists() {
        let _ = tokio::fs::remove_dir_all(&native_dir).await;
    }

    let runtimes_dir = state.directories.config_dir.join("runtimes").join("horizon");
    let cached_bin = runtimes_dir.join("horizon-client.exe");
    let cached_prepare = runtimes_dir.join("horizon-prepare.exe");
    let bin_path = instance_path.join("horizon-client.exe");

    let phase_details = InstallPhaseDetails::Minecraft {
        game_version: "26.3".to_string(),
        loader: ModLoader::Rust,
    };

    // 1. Ensure Minecraft jars & prepare resources
    ensure_horizon_resources(instance_path, state, reporter, loading_bar).await?;

    // 2. Ensure Horizon binaries (client & prepare)
    let client_bin = if bin_path.exists() {
        bin_path
    } else if cached_bin.exists() {
        tracing::info!("Using cached Horizon binary: {:?}", cached_bin);
        let _ = tokio::fs::copy(&cached_bin, &bin_path).await;
        if cached_prepare.exists() {
            let _ = tokio::fs::copy(&cached_prepare, &instance_path.join("horizon-prepare.exe")).await;
        }
        bin_path
    } else {
        crate::util::io::create_dir_all(&runtimes_dir).await?;
        let download_url = "https://github.com/horizon-rust/horizon/releases/download/nightly/horizon-windows-x64.zip";
        let zip_temp = runtimes_dir.join("horizon-download.zip");

        let client = reqwest::Client::builder()
            .user_agent("MacrosApp/1.0")
            .build()
            .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to build HTTP client: {e}")))?;

        download_file_streaming(
            &client,
            download_url,
            &zip_temp,
            InstallPhaseId::ResolvingLoader,
            &phase_details,
            reporter,
            loading_bar,
            "Downloading Horizon...",
        )
        .await?;

        let bytes = tokio::fs::read(&zip_temp).await.map_err(|e| {
            crate::ErrorKind::OtherError(format!("Failed to read downloaded Horizon zip: {e}"))
        })?;
        let _ = tokio::fs::remove_file(&zip_temp).await;

        let mut archive = zip::ZipArchive::new(std::io::Cursor::new(bytes))
            .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to open Horizon zip: {e}")))?;

        for i in 0..archive.len() {
            let mut file = archive.by_index(i)
                .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to read zip entry: {e}")))?;
            let name = file.name().to_string();
            if name.ends_with("horizon-client.exe") || name.ends_with("horizon-prepare.exe") || name.ends_with("research-lock.json") {
                if let Some(file_name) = std::path::Path::new(&name).file_name() {
                    let out_cached = runtimes_dir.join(file_name);
                    let mut out_file = std::fs::File::create(&out_cached)
                        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to create file {:?}: {e}", out_cached)))?;
                    std::io::copy(&mut file, &mut out_file)
                        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to write file {:?}: {e}", out_cached)))?;
                }
            }
        }

        if cached_bin.exists() {
            let _ = tokio::fs::copy(&cached_bin, &bin_path).await;
            if cached_prepare.exists() {
                let _ = tokio::fs::copy(&cached_prepare, &instance_path.join("horizon-prepare.exe")).await;
            }
            bin_path
        } else {
            return Err(crate::ErrorKind::OtherError("horizon-client.exe was not found inside the downloaded archive".to_string()).into());
        }
    };

    Ok(client_bin)
}

async fn ensure_horizon_resources(
    instance_path: &Path,
    state: &State,
    reporter: Option<&InstallProgressReporter>,
    loading_bar: Option<&crate::event::LoadingBarId>,
) -> crate::Result<PathBuf> {
    let instance_res = instance_path.join("resources");
    if is_valid_horizon_resources(&instance_res) {
        tracing::info!("Horizon resources already exist in instance: {:?}", instance_res);
        return Ok(instance_res);
    }

    let runtimes_dir = state.directories.config_dir.join("runtimes").join("horizon");
    let global_res = runtimes_dir.join("resources");

    let phase_details = InstallPhaseDetails::Minecraft {
        game_version: "26.3".to_string(),
        loader: ModLoader::Rust,
    };

    if is_valid_horizon_resources(&global_res) {
        tracing::info!("Using global cached Horizon 26.3 resources at {:?}", global_res);
        if let Some(reporter) = reporter {
            reporter
                .update(
                    InstallPhaseId::RunningLoaderProcessors,
                    None,
                    phase_details.clone(),
                )
                .await?;
        }
        if let Some(bar) = loading_bar {
            let _ = emit_loading(bar, 0.7, Some("Linking Horizon 26.3 resources to instance..."));
        }

        link_or_copy_dir(&global_res, &instance_res).await.map_err(|e| {
            crate::ErrorKind::OtherError(format!(
                "Failed to copy Horizon resources to {:?}: {e}",
                instance_res
            ))
        })?;

        return Ok(instance_res);
    }

    // Step 1: Download Minecraft client and server jars
    let cache_dir = runtimes_dir.join("cache");
    crate::util::io::create_dir_all(&cache_dir).await?;
    let client_jar = cache_dir.join("minecraft-26.3-client.jar");
    let server_jar = cache_dir.join("minecraft-26.3-server.jar");

    let client_http = reqwest::Client::builder()
        .user_agent("MacrosApp/1.0")
        .build()
        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to build HTTP client: {e}")))?;

    if !client_jar.exists()
        || tokio::fs::metadata(&client_jar).await.map(|m| m.len()).unwrap_or(0) == 0
    {
        let client_url =
            "https://piston-data.mojang.com/v1/objects/e877b6a07acd633fb3bb475002175cec036e7b87/client.jar";
        download_file_streaming(
            &client_http,
            client_url,
            &client_jar,
            InstallPhaseId::DownloadingMinecraft,
            &phase_details,
            reporter,
            loading_bar,
            "Downloading Minecraft 26.3 client...",
        )
        .await?;
    }

    if !server_jar.exists()
        || tokio::fs::metadata(&server_jar).await.map(|m| m.len()).unwrap_or(0) == 0
    {
        let server_url =
            "https://piston-data.mojang.com/v1/objects/33680f5f2ac32864d6d7cf5e56a705fdb3e05f4c/server.jar";
        download_file_streaming(
            &client_http,
            server_url,
            &server_jar,
            InstallPhaseId::DownloadingMinecraft,
            &phase_details,
            reporter,
            loading_bar,
            "Downloading Minecraft 26.3 server...",
        )
        .await?;
    }

    // Step 2: Ensure horizon-prepare binary exists
    let prepare_bin = if runtimes_dir.join("horizon-prepare.exe").exists() {
        runtimes_dir.join("horizon-prepare.exe")
    } else if instance_path.join("horizon-prepare.exe").exists() {
        instance_path.join("horizon-prepare.exe")
    } else {
        crate::util::io::create_dir_all(&runtimes_dir).await?;
        let download_url = "https://github.com/horizon-rust/horizon/releases/download/nightly/horizon-windows-x64.zip";
        let zip_temp = runtimes_dir.join("horizon-download.zip");

        download_file_streaming(
            &client_http,
            download_url,
            &zip_temp,
            InstallPhaseId::ResolvingLoader,
            &phase_details,
            reporter,
            loading_bar,
            "Downloading Horizon...",
        )
        .await?;

        let bytes = tokio::fs::read(&zip_temp).await.map_err(|e| {
            crate::ErrorKind::OtherError(format!("Failed to read downloaded Horizon zip: {e}"))
        })?;
        let _ = tokio::fs::remove_file(&zip_temp).await;

        let mut archive = zip::ZipArchive::new(std::io::Cursor::new(bytes))
            .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to open Horizon zip: {e}")))?;

        for i in 0..archive.len() {
            let mut file = archive.by_index(i)
                .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to read zip entry: {e}")))?;
            let name = file.name().to_string();
            if name.ends_with("horizon-client.exe") || name.ends_with("horizon-prepare.exe") || name.ends_with("research-lock.json") {
                if let Some(file_name) = std::path::Path::new(&name).file_name() {
                    let out_cached = runtimes_dir.join(file_name);
                    let mut out_file = std::fs::File::create(&out_cached)
                        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to create file {:?}: {e}", out_cached)))?;
                    std::io::copy(&mut file, &mut out_file)
                        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to write file {:?}: {e}", out_cached)))?;
                }
            }
        }

        runtimes_dir.join("horizon-prepare.exe")
    };

    if !prepare_bin.exists() {
        return Err(crate::ErrorKind::OtherError(
            "horizon-prepare.exe was not found to extract resources".to_string(),
        )
        .into());
    }

    // Step 3: Run horizon-prepare to extract and prepare resources
    if let Some(reporter) = reporter {
        reporter
            .update(
                InstallPhaseId::RunningLoaderProcessors,
                None,
                phase_details.clone(),
            )
            .await?;
    }
    if let Some(bar) = loading_bar {
        let _ = emit_loading(bar, 0.6, Some("Preparing Horizon 26.3 resources..."));
    }

    if !global_res.exists() {
        let _ = tokio::fs::create_dir_all(&global_res).await;
    }

    let mut prepare_cmd = tokio::process::Command::new(&prepare_bin);
    prepare_cmd
        .arg("--complete")
        .arg("--client-jar")
        .arg(&client_jar)
        .arg("--server-jar")
        .arg(&server_jar)
        .arg("--root")
        .arg(&runtimes_dir)
        .arg("--output")
        .arg(&global_res);

    #[cfg(windows)]
    {
        prepare_cmd.creation_flags(0x08000000);
    }

    let output = prepare_cmd
        .output()
        .await
        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to execute horizon-prepare: {e}")))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);
        tracing::error!("horizon-prepare failed: stdout={}, stderr={}", stdout, stderr);
        return Err(crate::ErrorKind::OtherError(format!(
            "horizon-prepare failed to extract resources: {stderr}"
        ))
        .into());
    }

    link_or_copy_dir(&global_res, &instance_res).await.map_err(|e| {
        crate::ErrorKind::OtherError(format!(
            "Failed to link/copy prepared resources to instance: {e}"
        ))
    })?;

    Ok(instance_res)
}

fn is_valid_horizon_resources(p: &Path) -> bool {
    p.exists()
        && (p.join("asset-index.json").exists()
            || p.join("assets").exists()
            || p.join("data").exists()
            || p.join("client-classes").exists()
            || p.join("horizon-data.bin").exists()
            || p.join("horizon-resources.json").exists())
}

async fn link_or_copy_dir(src: &Path, dst: &Path) -> std::io::Result<()> {
    if is_valid_horizon_resources(dst) {
        return Ok(());
    }

    // Clean up any stale or broken reparse point/junction
    if let Ok(meta) = tokio::fs::symlink_metadata(dst).await {
        if meta.file_type().is_symlink() || !dst.exists() {
            let _ = tokio::fs::remove_dir_all(dst).await;
            let _ = tokio::fs::remove_file(dst).await;
        }
    }

    if let Some(parent) = dst.parent() {
        if !parent.exists() {
            let _ = tokio::fs::create_dir_all(parent).await;
        }
    }

    copy_dir_recursive(src, dst).await
}

fn copy_dir_recursive<'a>(
    src: &'a Path,
    dst: &'a Path,
) -> std::pin::Pin<Box<dyn std::future::Future<Output = std::io::Result<()>> + Send + 'a>> {
    Box::pin(async move {
        if !dst.exists() {
            let _ = tokio::fs::create_dir_all(dst).await;
        }
        let mut entries = tokio::fs::read_dir(src).await?;
        while let Some(entry) = entries.next_entry().await? {
            let entry_path = entry.path();
            let dest_path = dst.join(entry.file_name());
            let file_type = entry.file_type().await?;
            if file_type.is_dir() {
                copy_dir_recursive(&entry_path, &dest_path).await?;
            } else {
                if dest_path.exists() {
                    continue;
                }
                if tokio::fs::hard_link(&entry_path, &dest_path).await.is_err() {
                    tokio::fs::copy(&entry_path, &dest_path).await?;
                }
            }
        }
        Ok(())
    })
}

fn find_horizon_resources(instance_path: &Path, state: &State) -> Option<PathBuf> {
    if let Ok(env_path) = std::env::var("HORIZON_RESOURCES_PATH") {
        let p = PathBuf::from(env_path);
        if is_valid_horizon_resources(&p) {
            return Some(p);
        }
    }

    let candidates = [
        instance_path.join("resources"),
        state.directories.config_dir.join("runtimes").join("horizon").join("resources"),
    ];

    candidates.into_iter().find(|p| is_valid_horizon_resources(p))
}
