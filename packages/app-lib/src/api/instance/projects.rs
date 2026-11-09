use crate::event::emit::{emit_instance, emit_loading, init_loading};
use crate::event::{InstancePayloadType, LoadingBarType};
use crate::state::instances::adapters::sqlite::instance_rows;
use crate::state::{
    CacheBehaviour, CacheValue, CachedEmbeddedContentMetadata, CachedEntry,
    ContentSourceKind, EmbeddedContentMetadata, ProjectType, State,
};
use crate::util::fetch;
use modrinth_content_management::{
    ContentType, ResolutionPreferences, ResolveContentPlan,
};
use std::collections::HashMap;
use std::path::Path;

#[derive(Clone, Debug, serde::Deserialize, serde::Serialize)]
pub struct InstallProjectWithDependenciesRequest {
    pub project_id: String,
    pub version_id: Option<String>,
    pub content_type: ContentType,
    #[serde(default)]
    pub selected: ResolutionPreferences,
}

#[tracing::instrument]
pub async fn update_all_projects(
    instance_id: &str,
) -> crate::Result<HashMap<String, String>> {
    let state = State::get().await?;
    ensure_instance_content_unlocked(instance_id, &state).await?;
    let instance = get_instance_display_info(instance_id, &state).await?;
    let loading_bar = init_loading(
        LoadingBarType::InstanceUpdate {
            instance_id: instance.id.clone(),
            instance_name: instance.name.clone(),
        },
        100.0,
        "Updating instance",
    )
    .await?;
    let map = crate::state::instances::commands::update_all_projects(
        instance_id,
        &state,
    )
    .await?;
    emit_loading(&loading_bar, 100.0, Some("Updated instance"))?;
    emit_instance(&instance.id, InstancePayloadType::Edited).await?;

    Ok(map)
}

#[tracing::instrument]
pub async fn update_project(
    instance_id: &str,
    project_path: &str,
    skip_send_event: Option<bool>,
) -> crate::Result<String> {
    let state = State::get().await?;
    ensure_shared_instance_can_modify_project(
        instance_id,
        project_path,
        &state,
    )
    .await?;
    ensure_project_not_frozen(instance_id, project_path, &state).await?;
    let path = crate::state::instances::commands::update_project(
        instance_id,
        project_path,
        &state,
    )
    .await?;
    if !skip_send_event.unwrap_or(false) {
        emit_instance(instance_id, InstancePayloadType::Edited).await?;
    }

    Ok(path)
}

#[tracing::instrument]
pub async fn add_project_from_version(
    instance_id: &str,
    version_id: &str,
    reason: fetch::DownloadReason,
    dependent_on_version_id: Option<String>,
) -> crate::Result<String> {
    let state = State::get().await?;
    ensure_instance_content_unlocked(instance_id, &state).await?;
    let project_path =
        crate::state::instances::commands::add_project_from_version(
            instance_id,
            version_id,
            reason,
            dependent_on_version_id,
            crate::state::ContentSourceKind::Local,
            &state,
        )
        .await?;
    emit_instance(instance_id, InstancePayloadType::Edited).await?;

    Ok(project_path)
}

#[tracing::instrument]
pub async fn install_project_with_dependencies(
    instance_id: &str,
    request: InstallProjectWithDependenciesRequest,
) -> crate::Result<ResolveContentPlan> {
    let state = State::get().await?;
    let metadata = super::get::get(instance_id).await?.ok_or_else(|| {
        crate::ErrorKind::InputError("Unknown instance".to_string())
    })?;
    ensure_metadata_content_unlocked(&metadata)?;
    let plan = crate::state::instances::commands::resolve_install_plan(
        instance_id,
        crate::state::instances::commands::InstanceInstallProjectRequest {
            project_id: request.project_id,
            version_id: request.version_id,
            content_type: request.content_type,
            selected: request.selected,
        },
        &state,
    )
    .await?;

    let instance_id = metadata.instance.id;
    let project_ids = plan_project_ids(&plan);
    let install_plan = plan.clone();
    tokio::spawn(async move {
        match crate::state::instances::commands::install_resolved_content_plan(
            &instance_id,
            &install_plan,
            &state,
        )
        .await
        {
            Ok(()) => {
                if let Err(error) = emit_instance(
                    &instance_id,
                    InstancePayloadType::ContentInstallFinished {
                        project_ids: project_ids.clone(),
                    },
                )
                .await
                {
                    tracing::error!(
                        "Failed to emit content install finished event: {error}"
                    );
                }
                if let Err(error) =
                    emit_instance(&instance_id, InstancePayloadType::Edited)
                        .await
                {
                    tracing::error!(
                        "Failed to emit instance edited event after content install: {error}"
                    );
                }
            }
            Err(error) => {
                if let Err(emit_error) = emit_instance(
                    &instance_id,
                    InstancePayloadType::ContentInstallFailed {
                        project_ids,
                        message: error.to_string(),
                    },
                )
                .await
                {
                    tracing::error!(
                        "Failed to emit content install failed event: {emit_error}"
                    );
                }
            }
        }
    });

    Ok(plan)
}

fn plan_project_ids(plan: &ResolveContentPlan) -> Vec<String> {
    let mut project_ids = Vec::with_capacity(plan.dependencies.len() + 1);
    project_ids.push(plan.primary.project_id.clone());
    project_ids.extend(
        plan.dependencies
            .iter()
            .map(|dependency| dependency.project_id.clone()),
    );
    project_ids
}

#[tracing::instrument]
pub async fn switch_project_version_with_dependencies(
    instance_id: &str,
    project_path: &str,
    version_id: &str,
) -> crate::Result<String> {
    let state = State::get().await?;
    ensure_shared_instance_can_modify_project(
        instance_id,
        project_path,
        &state,
    )
    .await?;
    ensure_project_not_frozen(instance_id, project_path, &state).await?;
    let metadata = super::get::get(instance_id).await?.ok_or_else(|| {
        crate::ErrorKind::InputError("Unknown instance".to_string())
    })?;
    let path =
        crate::state::instances::commands::switch_project_version_with_dependencies(
            instance_id,
            project_path,
            version_id,
            &state,
        )
        .await?;
    emit_instance(&metadata.instance.id, InstancePayloadType::Edited).await?;

    Ok(path)
}

#[tracing::instrument]
pub async fn add_project_from_path(
    instance_id: &str,
    path: &Path,
    project_type: Option<ProjectType>,
) -> crate::Result<String> {
    let state = State::get().await?;
    ensure_instance_content_unlocked(instance_id, &state).await?;
    let project_path =
        crate::state::instances::commands::add_project_from_path(
            instance_id,
            path,
            project_type,
            &state,
        )
        .await?;
    emit_instance(instance_id, InstancePayloadType::Edited).await?;

    Ok(project_path)
}

#[tracing::instrument]
pub async fn add_project_bytes(
    instance_id: &str,
    file_name: &str,
    bytes: bytes::Bytes,
    hash: Option<&str>,
    project_type: Option<ProjectType>,
    source_kind: ContentSourceKind,
    project_id: Option<&str>,
    version_id: Option<&str>,
) -> crate::Result<String> {
    let state = State::get().await?;
    ensure_instance_content_unlocked(instance_id, &state).await?;
    let project_path =
        crate::state::instances::commands::add_project_bytes(
            instance_id,
            file_name,
            bytes,
            hash,
            project_type,
            source_kind,
            project_id,
            version_id,
            &state,
        )
        .await?;
    emit_instance(instance_id, InstancePayloadType::Edited).await?;
    if let Some(pid) = project_id {
        emit_instance(
            instance_id,
            InstancePayloadType::ContentInstallFinished {
                project_ids: vec![pid.to_string()],
            },
        )
        .await?;
    }

    Ok(project_path)
}

#[tracing::instrument]
pub async fn is_file_on_modrinth(path: &Path) -> crate::Result<bool> {
    let state = State::get().await?;
    let (_, hash) = fetch::sha1_file_async(path).await?;
    let files = CachedEntry::get_file_many(
        &[&hash],
        Some(CacheBehaviour::Bypass),
        &state.pool,
        &state.api_semaphore,
    )
    .await?;

    Ok(!files.is_empty())
}

#[tracing::instrument]
pub async fn toggle_disable_project(
    instance_id: &str,
    project: &str,
    desired_enabled: Option<bool>,
) -> crate::Result<String> {
    let state = State::get().await?;
    ensure_shared_instance_can_modify_project(instance_id, project, &state)
        .await?;
    let res = crate::state::instances::commands::toggle_disable_project(
        instance_id,
        project,
        desired_enabled,
        &state,
    )
    .await?;
    emit_instance(instance_id, InstancePayloadType::Edited).await?;

    Ok(res)
}

#[tracing::instrument]
pub async fn remove_project(
    instance_id: &str,
    project: &str,
) -> crate::Result<()> {
    let state = State::get().await?;
    ensure_shared_instance_can_modify_project(instance_id, project, &state)
        .await?;
    crate::state::instances::commands::remove_project(
        instance_id,
        project,
        &state,
    )
    .await?;
    emit_instance(instance_id, InstancePayloadType::Edited).await?;

    Ok(())
}

#[tracing::instrument]
pub async fn set_project_locked(
    instance_id: &str,
    project: &str,
    locked: bool,
) -> crate::Result<()> {
    let state = State::get().await?;
    ensure_shared_instance_can_modify_project(instance_id, project, &state)
        .await?;
    crate::state::instances::commands::set_project_locked(
        instance_id,
        project,
        locked,
        &state,
    )
    .await?;
    emit_instance(instance_id, InstancePayloadType::Edited).await?;

    Ok(())
}

async fn ensure_shared_instance_can_modify_project(
    instance_id: &str,
    project_path: &str,
    state: &State,
) -> crate::Result<()> {
    let metadata = crate::state::instances::commands::get_instance_metadata(
        instance_id,
        &state.pool,
    )
    .await?
    .ok_or_else(|| {
        crate::ErrorKind::InputError("Unknown instance".to_string())
    })?;
    ensure_metadata_content_unlocked(&metadata)?;
    if !metadata
        .shared_instance
        .is_some_and(|attachment| attachment.role.is_member())
    {
        return Ok(());
    }

    let source_kind =
        crate::state::instances::commands::content_source_kind_for_project_path(
            instance_id,
            project_path,
            state,
        )
        .await?;
    if source_kind.is_some_and(ContentSourceKind::is_shared_instance_managed) {
        return Err(crate::ErrorKind::InputError(
            "Shared instance managed content cannot be changed directly."
                .to_string(),
        )
        .into());
    }

    Ok(())
}

async fn ensure_project_not_frozen(
    instance_id: &str,
    project_path: &str,
    state: &State,
) -> crate::Result<()> {
    if crate::state::instances::commands::is_project_locked(
        instance_id,
        project_path,
        state,
    )
    .await?
    {
        return Err(crate::ErrorKind::InputError(
            "Frozen content cannot change versions. Unfreeze it first."
                .to_string(),
        )
        .into());
    }

    Ok(())
}

#[tracing::instrument]
pub async fn update_managed_modrinth_version(
    instance_id: &str,
    version_id: &str,
) -> crate::Result<crate::install::InstallJobSnapshot> {
    let state = State::get().await?;
    let metadata = crate::state::instances::commands::get_instance_metadata(
        instance_id,
        &state.pool,
    )
    .await?
    .ok_or_else(|| {
        crate::ErrorKind::InputError("Unknown instance".to_string())
    })?;
    ensure_metadata_content_unlocked(&metadata)?;

    let post_install_edit = match &metadata.link {
        crate::state::InstanceLink::ServerProjectModpack {
            server_project_id,
            content_project_id,
            ..
        } => Some(crate::install::InstallPostInstallEdit {
            name: Some(metadata.instance.name.clone()),
            icon_path: Some(metadata.instance.icon_path.clone()),
            link: Some(crate::state::InstanceLink::ServerProjectModpack {
                server_project_id: server_project_id.clone(),
                content_project_id: content_project_id.clone(),
                content_version_id: version_id.to_string(),
            }),
        }),
        _ => None,
    };

    let project_id = match &metadata.link {
        crate::state::InstanceLink::ModrinthModpack { project_id, .. } => {
            project_id.clone()
        }
        crate::state::InstanceLink::ServerProjectModpack {
            content_project_id,
            ..
        } => content_project_id.clone(),
        _ => {
            return Err(unmanaged_pack_error(&metadata.instance.id).into());
        }
    };

    crate::install::install_pack_to_existing_instance(
        metadata.instance.id,
        crate::api::pack::install_from::CreatePackLocation::FromVersionId {
            project_id,
            version_id: version_id.to_string(),
            title: metadata.instance.name.clone(),
            icon_url: None,
        },
        post_install_edit,
    )
    .await
}

#[tracing::instrument]
pub async fn repair_managed_modrinth(
    instance_id: &str,
) -> crate::Result<crate::install::InstallJobSnapshot> {
    let state = State::get().await?;
    let metadata = crate::state::instances::commands::get_instance_metadata(
        instance_id,
        &state.pool,
    )
    .await?
    .ok_or_else(|| {
        crate::ErrorKind::InputError("Unknown instance".to_string())
    })?;
    ensure_metadata_content_unlocked(&metadata)?;

    let post_install_edit = match &metadata.link {
        crate::state::InstanceLink::ServerProjectModpack { .. } => {
            Some(crate::install::InstallPostInstallEdit {
                name: Some(metadata.instance.name.clone()),
                icon_path: Some(metadata.instance.icon_path.clone()),
                link: Some(metadata.link.clone()),
            })
        }
        _ => None,
    };

    let (project_id, version_id) = match &metadata.link {
        crate::state::InstanceLink::ModrinthModpack {
            project_id,
            version_id,
        } => (project_id.clone(), version_id.clone()),
        crate::state::InstanceLink::ServerProjectModpack {
            content_project_id,
            content_version_id,
            ..
        } => (content_project_id.clone(), content_version_id.clone()),
        _ => {
            return Err(unmanaged_pack_error(&metadata.instance.id).into());
        }
    };

    crate::install::install_pack_to_existing_instance(
        metadata.instance.id,
        crate::api::pack::install_from::CreatePackLocation::FromVersionId {
            project_id,
            version_id,
            title: metadata.instance.name.clone(),
            icon_url: None,
        },
        post_install_edit,
    )
    .await
}

fn unmanaged_pack_error(instance_id: &str) -> crate::ErrorKind {
    crate::ErrorKind::InputError(format!(
        "Instance {instance_id} is not a managed Modrinth pack, or has been disconnected."
    ))
}

async fn ensure_instance_content_unlocked(
    instance_id: &str,
    state: &State,
) -> crate::Result<()> {
    if instance_rows::is_instance_quarantined(instance_id, &state.pool).await? {
        return Err(quarantined_content_error().into());
    }

    Ok(())
}

fn ensure_metadata_content_unlocked(
    metadata: &crate::state::InstanceMetadata,
) -> crate::Result<()> {
    if metadata.quarantined {
        return Err(quarantined_content_error().into());
    }

    Ok(())
}

fn quarantined_content_error() -> crate::ErrorKind {
    crate::ErrorKind::InputError(
        "Content in quarantined instances cannot be changed.".to_string(),
    )
}

async fn get_instance_display_info(
    instance_id: &str,
    state: &State,
) -> crate::Result<instance_rows::InstanceDisplayInfo> {
    instance_rows::get_instance_display_info(instance_id, &state.pool)
        .await?
        .ok_or_else(|| {
            crate::ErrorKind::InputError("Unknown instance".to_string()).into()
        })
}

pub async fn install_horizon_mod(
    instance_id: &str,
    project_id: &str,
    download_url: &str,
    file_name: &str,
    version_id: Option<String>,
    icon_url: Option<String>,
    title: Option<String>,
) -> crate::Result<String> {
    let state = State::get().await?;
    ensure_instance_content_unlocked(instance_id, &state).await?;

    let client = reqwest::Client::builder()
        .user_agent("MacrosApp/1.0")
        .build()
        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to build HTTP client: {e}")))?;

    let response = client
        .get(download_url)
        .send()
        .await
        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to download mod: {e}")))?;

    if !response.status().is_success() {
        return Err(crate::ErrorKind::OtherError(format!(
            "Failed to download Horizon mod (HTTP {}): {download_url}",
            response.status()
        )).into());
    }

    let bytes = response
        .bytes()
        .await
        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to read mod bytes: {e}")))?;

    let sha1 = fetch::sha1_async(bytes.clone()).await?;

    let mut cached_icon_path = None;
    if let Some(ref icon_url_str) = icon_url {
        if let Ok(icon_resp) = client.get(icon_url_str).send().await {
            if icon_resp.status().is_success() {
                if let Ok(icon_bytes) = icon_resp.bytes().await {
                    if let Ok(path) = super::icon::cache_icon(icon_bytes, &state).await {
                        cached_icon_path = Some(path.to_string_lossy().to_string());
                    }
                }
            }
        }
    }

    let display_title = title.clone().unwrap_or_else(|| project_id.to_string());
    let display_version = version_id.clone().unwrap_or_else(|| "1.0.0".to_string());
    let embedded_meta = EmbeddedContentMetadata {
        name: Some(display_title.clone()),
        version: Some(display_version.clone()),
        icon_path: cached_icon_path,
    };
    let cache_key = format!("{sha1}-rust");
    let entry = CacheValue::EmbeddedContentMetadata(
        CachedEmbeddedContentMetadata {
            cache_key,
            hash: sha1.clone(),
            metadata: Some(embedded_meta),
        },
    )
    .get_entry();
    let _ = CachedEntry::upsert_many(&[entry], &state.pool).await;

    let res = add_project_bytes(
        instance_id,
        file_name,
        bytes.clone(),
        Some(&sha1),
        Some(ProjectType::Mod),
        ContentSourceKind::Local,
        None,
        None,
    )
    .await?;

    if let Ok(instance_path) = super::paths::get_full_path(instance_id).await {
        let native_dir = instance_path.join("horizon-native-mods");
        if native_dir.exists() {
            let _ = tokio::fs::remove_dir_all(&native_dir).await;
        }

        let mod_list_path = instance_path.join("horizon-mods.txt");
        let line = format!("mod.{project_id}:true");
        let content = tokio::fs::read_to_string(&mod_list_path).await.unwrap_or_default();
        if !content.lines().any(|l| l.trim() == line) {
            let mut new_content = content;
            if !new_content.is_empty() && !new_content.ends_with('\n') {
                new_content.push('\n');
            }
            new_content.push_str(&line);
            new_content.push('\n');
            let _ = tokio::fs::write(&mod_list_path, new_content).await;
        }
    }

    let _ = emit_instance(instance_id, InstancePayloadType::Edited).await;

    Ok(res)
}
