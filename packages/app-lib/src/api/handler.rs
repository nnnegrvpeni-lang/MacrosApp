use std::path::PathBuf;

use crate::{
    event::{
        CommandPayload,
        emit::{emit_command, emit_warning},
    },
    util::io,
};
use url::form_urlencoded;
use urlencoding::decode;

/// Handles external functions (such as through URL deep linkage)
/// Link is extracted value (link) in somewhat URL format, such as
/// subdomain1/subdomain2
/// (Does not include modrinth://)
pub async fn handle_url(sublink: &str) -> crate::Result<CommandPayload> {
    let (raw_path, query) = sublink.split_once('?').unwrap_or((sublink, ""));
    let path_clean = raw_path.trim_matches('/');

    // Handle OAuth callbacks: auth, callback, sign-in, etc.
    if path_clean == "auth"
        || path_clean.starts_with("auth/")
        || path_clean == "callback"
        || path_clean.starts_with("callback/")
        || path_clean == "sign-in"
        || (path_clean.is_empty() && query.contains("code="))
    {
        let mut code = None;
        for (key, value) in form_urlencoded::parse(query.as_bytes()) {
            if key == "code" || key == "token" {
                code = Some(value.into_owned());
            }
        }
        if let Some(code) = code {
            tracing::info!("Received auth code via deep link, finishing login flow...");
            let _ = crate::api::mr_auth::authenticate_finish_flow(&code).await;
            return Err(crate::ErrorKind::OtherError("auth_handled".to_string()).into());
        }
    }

    Ok(match path_clean.split_once('/') {
        // /mod/{id}   -    Installs a mod of mod id
        Some(("mod", id)) => CommandPayload::InstallMod { id: id.to_string() },
        // /version/{id}   -    Installs a specific version of id
        Some(("version", id)) => {
            CommandPayload::InstallVersion { id: id.to_string() }
        }
        // /modpack/{id}   -    Installs a modpack of modpack id
        Some(("modpack", id)) => {
            CommandPayload::InstallModpack { id: id.to_string() }
        }
        // /server/{id}   -    Opens a server project page and triggers play flow
        Some(("server", id)) => {
            CommandPayload::InstallServer { id: id.to_string() }
        }
        // /share/{invite_id}
        Some(("share", raw)) => {
            let (raw, _) = raw.split_once('?').unwrap_or((raw, ""));

            match decode(raw) {
                Ok(decoded) => CommandPayload::InstallSharedInstanceInvite {
                    invite_id: decoded.to_string(),
                },
                Err(e) => {
                    emit_warning(&format!(
                        "Invalid UTF-8 in shared instance invite path: {e}"
                    ))
                    .await?;
                    return Err(crate::ErrorKind::InputError(format!(
                        "Invalid UTF-8 in shared instance invite path: {e}"
                    ))
                    .into());
                }
            }
        }
        // /launch/instance/{id}   -    Launches an instance
        Some(("launch", rest)) if rest.starts_with("instance/") => {
            let raw = rest.trim_start_matches("instance/");
            let (raw, query) = raw.split_once('?').unwrap_or((raw, ""));
            let mut server = None;
            let mut singleplayer_world = None;

            for (key, value) in form_urlencoded::parse(query.as_bytes()) {
                match &*key {
                    "server" => server = Some(value.into_owned()),
                    "singleplayer_world" => {
                        singleplayer_world = Some(value.into_owned());
                    }
                    _ => {}
                }
            }

            if server.is_some() && singleplayer_world.is_some() {
                emit_warning(
                    "Invalid command, cannot launch both a server and a singleplayer world",
                )
                .await?;
                return Err(crate::ErrorKind::InputError(
                    "Cannot launch both a server and a singleplayer world"
                        .to_string(),
                )
                .into());
            }

            match decode(raw) {
                Ok(decoded) => CommandPayload::LaunchInstance {
                    id: decoded.to_string(),
                    server,
                    singleplayer_world,
                },
                Err(e) => {
                    emit_warning(&format!(
                        "Invalid UTF-8 in instance path: {e}"
                    ))
                    .await?;
                    return Err(crate::ErrorKind::InputError(format!(
                        "Invalid UTF-8 in instance path: {e}"
                    ))
                    .into());
                }
            }
        }
        _ => {
            emit_warning(&format!(
                "Invalid command, unrecognized path: {sublink}"
            ))
            .await?;
            return Err(crate::ErrorKind::InputError(format!(
                "Invalid command, unrecognized path: {sublink}"
            ))
            .into());
        }
    })
}

pub async fn parse_command(
    command_string: &str,
) -> crate::Result<CommandPayload> {
    tracing::debug!("Parsing external command: {command_string}");

    let clean = command_string.trim_matches('"').trim_matches('\'');

    // modrinth://some-command or macros://some-command
    // This occurs when following a web redirect link
    if let Some(sublink) = clean.strip_prefix("modrinth://") {
        Ok(handle_url(sublink).await?)
    } else if let Some(sublink) = clean.strip_prefix("macros://") {
        Ok(handle_url(sublink).await?)
    } else {
        // We assume anything else is a filepath to an .mrpack file
        let path = PathBuf::from(clean);
        let path = io::canonicalize(path)?;
        if let Some(ext) = path.extension()
            && ext == "mrpack"
        {
            return Ok(CommandPayload::RunMRPack {
                path: path.to_string_lossy().into_owned(),
            });
        }
        emit_warning(&format!(
            "Invalid command, unrecognized filetype: {}",
            path.display()
        ))
        .await?;
        Err(crate::ErrorKind::InputError(format!(
            "Invalid command, unrecognized filetype: {}",
            path.display()
        ))
        .into())
    }
}

pub async fn parse_and_emit_command(command_string: &str) -> crate::Result<()> {
    let command = parse_command(command_string).await?;
    emit_command(command).await?;
    Ok(())
}
