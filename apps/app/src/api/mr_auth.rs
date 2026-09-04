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
    let auth_code_task = tokio::spawn(oauth_utils::auth_code_reply::listen(
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

    let loopback_port = auth_code_recv_socket.port();
    let auth_request_uri = format!(
        "{}?launcher=true&ipver={}&port={}",
        mr_auth::authenticate_begin_flow(flow),
        if auth_code_recv_socket.is_ipv4() {
            "4"
        } else {
            "6"
        },
        loopback_port
    );

    if let Some(existing) = app.get_webview_window("modrinth_signin") {
        let _ = existing.close();
    }

    let parsed_url = match auth_request_uri.parse() {
        Ok(u) => u,
        Err(_) => {
            return Err(TheseusSerializableError::Theseus(
                theseus::ErrorKind::OtherError("Error parsing auth redirect URL".into()).into(),
            ));
        }
    };

    let injection_script = format!(
        r#"
(function() {{
    var port = {};
    var intercepted = false;

    function notifyCode(code) {{
        if (intercepted || !code) return;
        if (code.indexOf('mra_') !== 0 && code.indexOf('mrp_') !== 0) return;
        intercepted = true;
        try {{
            window.location.href = 'http://127.0.0.1:' + port + '/?code=' + encodeURIComponent(code);
        }} catch(e) {{}}
    }}

    function scan() {{
        if (intercepted) return;
        try {{
            var iframes = document.querySelectorAll('iframe');
            for (var i = 0; i < iframes.length; i++) {{
                var src = iframes[i].src || '';
                var match = src.match(/(mr[ap]_[a-zA-Z0-9_\-]+)/);
                if (match && match[1]) {{
                    notifyCode(match[1]);
                    return;
                }}
            }}

            var cookies = document.cookie.split(';');
            for (var j = 0; j < cookies.length; j++) {{
                var parts = cookies[j].trim().split('=');
                if (parts[0] === 'auth-token' && parts[1]) {{
                    var token = decodeURIComponent(parts[1]);
                    if (token.indexOf('mra_') === 0 || token.indexOf('mrp_') === 0) {{
                        notifyCode(token);
                        return;
                    }}
                }}
            }}

            for (var k = 0; k < localStorage.length; k++) {{
                var key = localStorage.key(k);
                var val = localStorage.getItem(key) || '';
                if (val.indexOf('mra_') !== -1 || val.indexOf('mrp_') !== -1) {{
                    var match = val.match(/(mr[ap]_[a-zA-Z0-9_\-]+)/);
                    if (match && match[1]) {{
                        notifyCode(match[1]);
                        return;
                    }}
                }}
            }}
        }} catch(e) {{}}
    }}

    try {{
        var observer = new MutationObserver(scan);
        observer.observe(document.documentElement || document.body, {{
            childList: true,
            subtree: true,
            attributes: true
        }});
    }} catch(e) {{}}

    setInterval(scan, 200);
}})();
"#,
        loopback_port
    );

    let window_res = tauri::WebviewWindowBuilder::new(
        &app,
        "modrinth_signin",
        tauri::WebviewUrl::External(parsed_url),
    )
    .title("Вход в Modrinth - Macros")
    .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0")
    .min_inner_size(480.0, 580.0)
    .inner_size(540.0, 720.0)
    .focused(true)
    .center()
    .initialization_script(&injection_script)
    .on_navigation({
        move |url| {
            let url_str = url.as_str();
            if url_str.contains("mra_") || url_str.contains("mrp_") || url.scheme() == "modrinth" || url.scheme() == "macros" {
                let code = oauth_utils::auth_code_reply::extract_auth_code(url_str);
                if !code.is_empty() {
                    oauth_utils::auth_code_reply::submit_auth_code(code);
                }
            }
            true
        }
    })
    .build();

    let (cancel_tx, mut cancel_rx) = oneshot::channel::<()>();

    match window_res {
        Ok(win) => {
            let win_watcher = win.clone();
            tokio::spawn(async move {
                loop {
                    tokio::time::sleep(std::time::Duration::from_millis(300)).await;
                    if win_watcher.title().is_err() {
                        let _ = cancel_tx.send(());
                        break;
                    }
                }
            });
        }
        Err(e) => {
            tracing::warn!("Failed to create modrinth_signin webview window: {e}, falling back to default browser");
            let _ = app.opener().open_url(&auth_request_uri, None::<&str>);
        }
    };

    let auth_code_res = tokio::select! {
        res = auth_code_task => {
            res
        }
        _ = &mut cancel_rx => {
            oauth_utils::auth_code_reply::stop_listeners();
            return Err(TheseusSerializableError::Theseus(
                theseus::ErrorKind::OtherError("Вход отменён".into()).into(),
            ));
        }
    };

    if let Some(win) = app.get_webview_window("modrinth_signin") {
        let _ = win.close();
    }

    let auth_code = match auth_code_res {
        Ok(Ok(Some(code))) => code,
        Ok(Ok(None)) => {
            return Err(TheseusSerializableError::Theseus(
                theseus::ErrorKind::OtherError("Вход отменён".into()).into(),
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
pub fn cancel_modrinth_login<R: Runtime>(app: tauri::AppHandle<R>) {
    if let Some(win) = app.get_webview_window("modrinth_signin") {
        let _ = win.close();
    }
    oauth_utils::auth_code_reply::stop_listeners();
}

#[tauri::command]
pub fn submit_manual_auth_code(code: String) {
    oauth_utils::auth_code_reply::submit_auth_code(code);
}
