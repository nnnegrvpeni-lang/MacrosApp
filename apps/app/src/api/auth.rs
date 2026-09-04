use crate::api::Result;
use chrono::{Duration, Utc};
use tauri::plugin::TauriPlugin;
use tauri::{Manager, Runtime, UserAttentionType};
use tauri_plugin_opener::OpenerExt;
use theseus::prelude::*;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::<R>::new("auth")
        .invoke_handler(tauri::generate_handler![
            check_reachable,
            login,
            login_offline,
            login_elyby,
            login_elyby_web,
            start_elyby_device_code,
            poll_elyby_device_code,
            remove_user,
            get_default_user,
            set_default_user,
            get_users,
        ])
        .build()
}

/// Checks if the authentication servers are reachable.
#[tauri::command]
pub async fn check_reachable() -> Result<()> {
    minecraft_auth::check_reachable().await?;
    Ok(())
}

/// Authenticate a user with Hydra - part 1
/// This begins the authentication flow quasi-synchronously, returning a URL to visit (that the user will sign in at)
#[tauri::command]
pub async fn login<R: Runtime>(
    app: tauri::AppHandle<R>,
) -> Result<Option<Credentials>> {
    let flow = minecraft_auth::begin_login().await?;

    let start = Utc::now();

    if let Some(window) = app.get_webview_window("signin") {
        window.close()?;
    }

    let window = tauri::WebviewWindowBuilder::new(
        &app,
        "signin",
        tauri::WebviewUrl::External(flow.auth_request_uri.parse().map_err(
            |_| {
                theseus::ErrorKind::OtherError(
                    "Error parsing auth redirect URL".to_string(),
                )
                .as_error()
            },
        )?),
    )
    .title("Sign into Macros")
    .always_on_top(true)
    .min_inner_size(500.0, 500.0)
    .inner_size(1000.0, 700.0)
    .focused(true)
    .center()
    .build()?;

    window.request_user_attention(Some(UserAttentionType::Critical))?;

    while (Utc::now() - start) < Duration::minutes(10) {
        if window.title().is_err() {
            // user closed window, cancelling flow
            return Ok(None);
        }

        if window
            .url()?
            .as_str()
            .starts_with("https://login.live.com/oauth20_desktop.srf")
            && let Some((_, code)) =
                window.url()?.query_pairs().find(|x| x.0 == "code")
        {
            window.close()?;
            let val = minecraft_auth::finish_login(&code.clone(), flow).await?;

            return Ok(Some(val));
        }

        tokio::time::sleep(std::time::Duration::from_millis(50)).await;
    }

    window.close()?;
    Ok(None)
}

#[tauri::command]
pub async fn login_offline(username: String) -> Result<Credentials> {
    Ok(minecraft_auth::login_offline(&username).await?)
}

#[tauri::command]
pub async fn login_elyby(
    username: String,
    password: String,
) -> Result<Credentials> {
    Ok(minecraft_auth::login_elyby(&username, &password).await?)
}

#[tauri::command]
pub async fn start_elyby_device_code<R: Runtime>(
    app: tauri::AppHandle<R>,
) -> Result<minecraft_auth::ElyByDeviceCodeInfo> {
    let info = minecraft_auth::start_elyby_device_code().await?;
    let open_url = if info.verification_uri.contains('?') {
        format!("{}&otc={}", info.verification_uri, info.user_code)
    } else {
        format!("{}?otc={}", info.verification_uri, info.user_code)
    };
    let _ = app.opener().open_url(&open_url, None::<&str>);
    Ok(info)
}

#[tauri::command]
pub async fn poll_elyby_device_code(
    device_code: String,
) -> Result<Option<Credentials>> {
    Ok(minecraft_auth::poll_elyby_device_code(&device_code).await?)
}

#[tauri::command]
pub async fn login_elyby_web<R: Runtime>(
    app: tauri::AppHandle<R>,
) -> Result<Option<Credentials>> {
    let info = minecraft_auth::start_elyby_device_code().await?;
    let open_url = if info.verification_uri.contains('?') {
        format!("{}&otc={}", info.verification_uri, info.user_code)
    } else {
        format!("{}?otc={}", info.verification_uri, info.user_code)
    };
    let _ = app.opener().open_url(&open_url, None::<&str>);
    let start = Utc::now();
    let interval = std::cmp::max(info.interval, 3);

    while (Utc::now() - start) < Duration::seconds(info.expires_in) {
        tokio::time::sleep(std::time::Duration::from_secs(interval)).await;
        match minecraft_auth::poll_elyby_device_code(&info.device_code).await {
            Ok(Some(creds)) => return Ok(Some(creds)),
            Ok(None) => continue,
            Err(e) => return Err(e.into()),
        }
    }

    Ok(None)
}

#[tauri::command]
pub async fn remove_user(user: uuid::Uuid) -> Result<()> {
    Ok(minecraft_auth::remove_user(user).await?)
}

#[tauri::command]
pub async fn get_default_user() -> Result<Option<uuid::Uuid>> {
    Ok(minecraft_auth::get_default_user().await?)
}

#[tauri::command]
pub async fn set_default_user(user: uuid::Uuid) -> Result<()> {
    Ok(minecraft_auth::set_default_user(user).await?)
}

/// Get a copy of the list of all user credentials
#[tauri::command]
pub async fn get_users() -> Result<Vec<Credentials>> {
    Ok(minecraft_auth::users().await?)
}
