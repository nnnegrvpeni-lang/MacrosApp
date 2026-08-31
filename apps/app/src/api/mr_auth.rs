use crate::api::Result;
use crate::api::TheseusSerializableError;
use crate::api::oauth_utils;
use tauri::Manager;
use tauri::Runtime;
use tauri::plugin::TauriPlugin;
use tauri_plugin_opener::OpenerExt;
use theseus::prelude::*;
use tokio::sync::oneshot;

pub fn init<R: tauri::Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("mr-auth")
        .invoke_handler(tauri::generate_handler![
            modrinth_login,
            logout,
            get,
            cancel_modrinth_login,
            submit_manual_auth_code,
            direct_modrinth_login,
            direct_modrinth_2fa,
        ])
        .build()
}

#[derive(serde::Deserialize)]
struct LoginResponse {
    session: Option<String>,
    flow: Option<String>,
    error: Option<String>,
    description: Option<String>,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct DirectLoginResult {
    pub success: bool,
    pub session: Option<String>,
    pub flow: Option<String>,
    pub error: Option<String>,
}

#[tauri::command]
pub async fn direct_modrinth_login(
    username: String,
    password: String,
) -> Result<DirectLoginResult> {
    let client = reqwest::Client::new();
    let resp = client
        .post("https://api.modrinth.com/v2/auth/login")
        .header("User-Agent", "modrinth/theseus/1.0.0 (contact@modrinth.com)")
        .json(&serde_json::json!({
            "username": username,
            "password": password,
        }))
        .send()
        .await
        .map_err(|e| TheseusSerializableError::Theseus(theseus::ErrorKind::OtherError(e.to_string()).into()))?;

    let status = resp.status();
    let body = resp.text().await.unwrap_or_default();

    if !status.is_success() {
        let err_desc = serde_json::from_str::<serde_json::Value>(&body)
            .ok()
            .and_then(|v| v.get("description").and_then(|d| d.as_str()).map(|s| s.to_string()))
            .unwrap_or_else(|| format!("Ошибка авторизации (HTTP {status})"));
        return Ok(DirectLoginResult {
            success: false,
            session: None,
            flow: None,
            error: Some(err_desc),
        });
    }

    let parsed = serde_json::from_str::<LoginResponse>(&body)
        .map_err(|e| TheseusSerializableError::Theseus(theseus::ErrorKind::OtherError(e.to_string()).into()))?;

    if let Some(session) = &parsed.session {
        let _ = mr_auth::authenticate_finish_flow(session).await?;
        return Ok(DirectLoginResult {
            success: true,
            session: Some(session.clone()),
            flow: None,
            error: None,
        });
    }

    Ok(DirectLoginResult {
        success: false,
        session: None,
        flow: parsed.flow,
        error: parsed.error.or(parsed.description),
    })
}

#[tauri::command]
pub async fn direct_modrinth_2fa(
    flow: String,
    code: String,
) -> Result<DirectLoginResult> {
    let client = reqwest::Client::new();
    let resp = client
        .post("https://api.modrinth.com/v2/auth/login/2fa")
        .header("User-Agent", "modrinth/theseus/1.0.0 (contact@modrinth.com)")
        .json(&serde_json::json!({
            "flow": flow,
            "code": code,
        }))
        .send()
        .await
        .map_err(|e| TheseusSerializableError::Theseus(theseus::ErrorKind::OtherError(e.to_string()).into()))?;

    let status = resp.status();
    let body = resp.text().await.unwrap_or_default();

    if !status.is_success() {
        let err_desc = serde_json::from_str::<serde_json::Value>(&body)
            .ok()
            .and_then(|v| v.get("description").and_then(|d| d.as_str()).map(|s| s.to_string()))
            .unwrap_or_else(|| format!("Неверный код 2FA (HTTP {status})"));
        return Ok(DirectLoginResult {
            success: false,
            session: None,
            flow: None,
            error: Some(err_desc),
        });
    }

    let parsed = serde_json::from_str::<LoginResponse>(&body)
        .map_err(|e| TheseusSerializableError::Theseus(theseus::ErrorKind::OtherError(e.to_string()).into()))?;

    if let Some(session) = &parsed.session {
        let _ = mr_auth::authenticate_finish_flow(session).await?;
        return Ok(DirectLoginResult {
            success: true,
            session: Some(session.clone()),
            flow: None,
            error: None,
        });
    }

    Ok(DirectLoginResult {
        success: false,
        session: None,
        flow: None,
        error: parsed.error.or(parsed.description),
    })
}

#[tauri::command]
pub async fn modrinth_login<R: Runtime>(
    app: tauri::AppHandle<R>,
    flow: mr_auth::ModrinthAuthFlow,
) -> Result<ModrinthCredentials> {
    let (auth_code_recv_socket_tx, auth_code_recv_socket) = oneshot::channel();
    let auth_code = tokio::spawn(oauth_utils::auth_code_reply::listen(
        auth_code_recv_socket_tx,
    ));

    let auth_code_recv_socket = match auth_code_recv_socket.await {
        Ok(Ok(addr)) => addr,
        Ok(Err(e)) => return Err(TheseusSerializableError::Theseus(e)),
        Err(_) => {
            return Err(TheseusSerializableError::Theseus(
                theseus::ErrorKind::OtherError("Auth socket channel closed".into()).into(),
            ));
        }
    };

    let auth_request_uri = format!(
        "{}?launcher=true&ipver={}&port={}",
        mr_auth::authenticate_begin_flow(flow),
        if auth_code_recv_socket.is_ipv4() {
            "4"
        } else {
            "6"
        },
        auth_code_recv_socket.port()
    );

    let _ = app.opener().open_url(auth_request_uri.clone(), None::<&str>);

    let auth_code = match auth_code.await {
        Ok(Ok(Some(code))) => code,
        Ok(Ok(None)) => {
            return Err(TheseusSerializableError::Theseus(
                theseus::ErrorKind::OtherError("Login canceled".into()).into(),
            ));
        }
        Ok(Err(e)) => return Err(TheseusSerializableError::Theseus(e)),
        Err(_) => {
            return Err(TheseusSerializableError::Theseus(
                theseus::ErrorKind::OtherError("Auth task failed".into()).into(),
            ));
        }
    };

    let credentials = mr_auth::authenticate_finish_flow(&auth_code).await?;

    if let Some(main_window) = app.get_webview_window("main") {
        let _ = main_window.unminimize();
        let _ = main_window.show();
        let _ = main_window.set_focus();
        #[cfg(target_os = "windows")]
        if let Ok(hwnd) = main_window.hwnd() {
            unsafe {
                use windows::Win32::UI::WindowsAndMessaging::{
                    SetForegroundWindow, ShowWindow, SW_RESTORE,
                };
                use windows::Win32::Foundation::HWND;
                let _ = ShowWindow(HWND(hwnd.0), SW_RESTORE);
                let _ = SetForegroundWindow(HWND(hwnd.0));
            }
        }
    }

    Ok(credentials)
}

#[tauri::command]
pub async fn logout() -> Result<()> {
    Ok(theseus::mr_auth::logout().await?)
}

#[tauri::command]
pub async fn get() -> Result<Option<ModrinthCredentials>> {
    Ok(theseus::mr_auth::get_credentials().await?)
}

#[tauri::command]
pub fn cancel_modrinth_login() {
    oauth_utils::auth_code_reply::stop_listeners();
}

#[tauri::command]
pub fn submit_manual_auth_code(code: String) {
    oauth_utils::auth_code_reply::submit_auth_code(code);
}
