//! A minimal OAuth 2.0 authorization code grant flow redirection/reply loopback URI HTTP
//! server implementation, compliant with [RFC 6749]'s authorization code grant flow and
//! [RFC 8252]'s best current practices for OAuth 2.0 in native apps.
//!
//! This server is needed for the step 4 of the OAuth authentication dance represented in
//! figure 1 of [RFC 8252].
//!
//! Further reading: https://www.oauth.com/oauth2-servers/oauth-native-apps/redirect-urls-for-native-apps/
//!
//! [RFC 6749]: https://datatracker.ietf.org/doc/html/rfc6749
//! [RFC 8252]: https://datatracker.ietf.org/doc/html/rfc8252

use std::{
    net::SocketAddr,
    sync::{LazyLock, Mutex},
    time::Duration,
};

use hyper::body::Incoming;
use hyper_util::rt::{TokioIo, TokioTimer};
use theseus::ErrorKind;
use theseus::prelude::tcp_listen_any_loopback;
use tokio::sync::{broadcast, oneshot};

static SERVER_SHUTDOWN: LazyLock<broadcast::Sender<()>> =
    LazyLock::new(|| broadcast::channel(1024).0);

static PENDING_AUTH_CODE: LazyLock<Mutex<Option<String>>> =
    LazyLock::new(|| Mutex::new(None));

static AUTH_CODE_NOTIFY: LazyLock<tokio::sync::Notify> =
    LazyLock::new(tokio::sync::Notify::new);

pub fn is_valid_modrinth_token(token: &str) -> bool {
    (token.starts_with("mra_") || token.starts_with("mrp_") || token.starts_with("mro_"))
        && token.len() > 8
        && token.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-')
}

pub fn extract_auth_code(link: &str) -> String {
    let clean = link.trim_matches('"').trim_matches('\'').trim();
    let decoded = urlencoding::decode(clean)
        .map(|cow| cow.into_owned())
        .unwrap_or_else(|_| clean.to_string());

    for s in [&decoded, &clean.to_string()] {
        if let Some((_, query)) = s.split_once('?') {
            for pair in query.split('&') {
                if let Some((k, v)) = pair.split_once('=') {
                    if k == "code" || k == "token" {
                        let token = v.trim_matches('/').trim_matches('"').trim();
                        let end = token
                            .find(|c: char| !c.is_alphanumeric() && c != '_' && c != '-')
                            .unwrap_or(token.len());
                        let candidate = &token[..end];
                        if is_valid_modrinth_token(candidate) {
                            return candidate.to_string();
                        }
                    }
                }
            }
        }

        for prefix in ["mra_", "mrp_", "mro_"] {
            if let Some(idx) = s.find(prefix) {
                let token_part = &s[idx..];
                let end = token_part
                    .find(|c: char| !c.is_alphanumeric() && c != '_' && c != '-')
                    .unwrap_or(token_part.len());
                let candidate = &token_part[..end];
                if is_valid_modrinth_token(candidate) {
                    return candidate.to_string();
                }
            }
        }

        let end = s
            .find(|c: char| !c.is_alphanumeric() && c != '_' && c != '-')
            .unwrap_or(s.len());
        let candidate = &s[..end];
        if is_valid_modrinth_token(candidate) {
            return candidate.to_string();
        }
    }

    String::new()
}

pub fn submit_auth_code(code: String) {
    let extracted = extract_auth_code(&code);
    if extracted.is_empty() {
        tracing::warn!("submit_auth_code: candidate code ignored (invalid prefix or format)");
        return;
    }
    tracing::info!("submit_auth_code: accepted valid token");
    if let Ok(mut lock) = PENDING_AUTH_CODE.lock() {
        *lock = Some(extracted);
    }
    AUTH_CODE_NOTIFY.notify_waiters();
}

/// Starts a temporary HTTP server to receive OAuth 2.0 authorization code grant flow redirects
/// on a loopback interface with an ephemeral port. The caller can know the bound socket address
/// by listening on the counterpart channel for `listen_socket_tx`.
///
/// If the server is stopped before receiving an authorization code, `Ok(None)` is returned.
pub async fn listen(
    listen_socket_tx: oneshot::Sender<Result<SocketAddr, theseus::Error>>,
) -> Result<Option<String>, theseus::Error> {
    let listener = match tcp_listen_any_loopback().await {
        Ok(listener) => {
            listen_socket_tx
                .send(listener.local_addr().map_err(|e| {
                    ErrorKind::OtherError(format!(
                        "Failed to get auth code reply socket address: {e}"
                    ))
                    .into()
                }))
                .ok();

            listener
        }
        Err(e) => {
            let error_msg =
                format!("Failed to bind auth code reply socket: {e}");

            listen_socket_tx
                .send(Err(ErrorKind::OtherError(error_msg.clone()).into()))
                .ok();

            return Err(ErrorKind::OtherError(error_msg).into());
        }
    };

    if let Ok(mut lock) = PENDING_AUTH_CODE.lock() {
        if let Some(code) = lock.take() {
            return Ok(Some(code));
        }
    }

    let mut auth_code = Mutex::new(None);
    let mut shutdown_notification = SERVER_SHUTDOWN.subscribe();

    while auth_code.get_mut().unwrap().is_none() {
        let client_socket = tokio::select! {
            biased;
            _ = shutdown_notification.recv() => {
                break;
            }
            _ = AUTH_CODE_NOTIFY.notified() => {
                if let Ok(mut lock) = PENDING_AUTH_CODE.lock() {
                    if let Some(code) = lock.take() {
                        *auth_code.get_mut().unwrap() = Some(code);
                        break;
                    }
                }
                continue;
            }
            conn_accept_result = listener.accept() => {
                match conn_accept_result {
                    Ok((socket, _)) => socket,
                    Err(e) => {
                        tracing::warn!("Failed to accept auth code reply: {e}");
                        continue;
                    }
                }
            }
        };

        if auth_code.get_mut().unwrap().is_some() {
            break;
        }

        if let Err(e) = hyper::server::conn::http1::Builder::new()
            .keep_alive(false)
            .header_read_timeout(Duration::from_secs(5))
            .timer(TokioTimer::new())
            .auto_date_header(false)
            .serve_connection(
                TokioIo::new(client_socket),
                hyper::service::service_fn(|req| handle_reply(req, &auth_code)),
            )
            .await
        {
            tracing::warn!("Failed to handle auth code reply: {e}");
        }
    }

    Ok(auth_code.into_inner().unwrap())
}

/// Stops any active OAuth 2.0 authorization code grant flow reply listening HTTP servers.
pub fn stop_listeners() {
    SERVER_SHUTDOWN.send(()).ok();
}

async fn handle_reply(
    req: hyper::Request<Incoming>,
    auth_code_out: &Mutex<Option<String>>,
) -> Result<hyper::Response<String>, hyper::http::Error> {
    if req.method() == hyper::Method::OPTIONS {
        return hyper::Response::builder()
            .status(hyper::StatusCode::NO_CONTENT)
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Private-Network", "true")
            .header("Access-Control-Allow-Methods", "GET, OPTIONS")
            .header("Access-Control-Allow-Headers", "*")
            .body("".into());
    }

    if req.method() != hyper::Method::GET {
        return hyper::Response::builder()
            .status(hyper::StatusCode::METHOD_NOT_ALLOWED)
            .header("Allow", "GET, OPTIONS")
            .body("".into());
    }

    // The authorization code is guaranteed to be sent as a "code" query parameter
    // in the request URI query string as per RFC 6749 § 4.1.2
    let auth_code = req.uri().query().and_then(|query_string| {
        query_string
            .split('&')
            .filter_map(|query_pair| query_pair.split_once('='))
            .find_map(|(key, value)| (key == "code" || key == "token").then_some(value))
    });

    let valid_auth_code = auth_code.and_then(|c| {
        let ext = extract_auth_code(c);
        if ext.is_empty() {
            None
        } else {
            Some(ext)
        }
    });

    let response = if let Some(auth_code) = valid_auth_code {
        *auth_code_out.lock().unwrap() = Some(auth_code.clone());

        let html = format!(
            r#"<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Macros — Авторизация успешна</title>
<style>
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
	background: radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.12) 0%, rgba(5, 5, 7, 0) 65%), #050507;
	color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	padding: 20px;
	overflow: hidden;
}}
.card {{
	background: linear-gradient(180deg, rgba(22, 22, 26, 0.8) 0%, rgba(12, 12, 15, 0.95) 100%);
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 28px;
	padding: 48px 36px 40px;
	text-align: center;
	max-width: 420px;
	width: 100%;
	backdrop-filter: blur(24px);
	box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 50px rgba(16, 185, 129, 0.08);
	animation: pop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}}
@keyframes pop {{
	0% {{ opacity: 0; transform: scale(0.94) translateY(10px); }}
	100% {{ opacity: 1; transform: scale(1) translateY(0); }}
}}
.icon-wrap {{
	width: 72px;
	height: 72px;
	border-radius: 22px;
	background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%);
	border: 1px solid rgba(16, 185, 129, 0.35);
	box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 24px;
}}
.icon-wrap svg {{
	width: 36px;
	height: 36px;
	stroke: #10b981;
}}
.status-pill {{
	display: inline-flex;
	align-items: center;
	gap: 6px;
	background: rgba(16, 185, 129, 0.1);
	border: 1px solid rgba(16, 185, 129, 0.25);
	color: #34d399;
	font-size: 12px;
	font-weight: 500;
	padding: 4px 12px;
	border-radius: 9999px;
	margin-bottom: 16px;
}}
.status-pill .dot {{
	width: 6px;
	height: 6px;
	background: #10b981;
	border-radius: 50%;
	box-shadow: 0 0 8px #10b981;
	animation: pulse 2s infinite;
}}
@keyframes pulse {{
	0%, 100% {{ opacity: 1; transform: scale(1); }}
	50% {{ opacity: 0.4; transform: scale(0.85); }}
}}
h1 {{
	font-size: 22px;
	font-weight: 700;
	letter-spacing: -0.02em;
	color: #f4f4f5;
	margin-bottom: 10px;
}}
p {{
	color: #a1a1aa;
	font-size: 13.5px;
	line-height: 1.55;
	margin-bottom: 28px;
}}
.btn {{
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	background: #10b981;
	color: #041309;
	font-weight: 600;
	font-size: 14px;
	padding: 13px 24px;
	border-radius: 14px;
	border: none;
	cursor: pointer;
	text-decoration: none;
	transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	box-shadow: 0 4px 20px rgba(16, 185, 129, 0.25);
}}
.btn:hover {{
	background: #059669;
	transform: translateY(-1px);
	box-shadow: 0 6px 24px rgba(16, 185, 129, 0.35);
}}
.btn:active {{
	transform: translateY(0);
}}
.footnote {{
	margin-top: 18px;
	font-size: 12px;
	color: #52525b;
}}
</style>
</head>
<body>
<div class="card">
	<div class="icon-wrap">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
	</div>
	<div class="status-pill">
		<span class="dot"></span>
		<span>Синхронизировано</span>
	</div>
	<h1>Авторизация успешна</h1>
	<p>Ваш аккаунт Macros ID успешно подключен к лаунчеру. Теперь вы можете закрыть эту страницу.</p>
	<button class="btn" onclick="window.close()">Закрыть страницу</button>
	<div class="footnote" id="timerText">Вкладка закроется автоматически...</div>
</div>
<script>
setTimeout(function() {{
	window.close();
	setTimeout(function() {{
		var t = document.getElementById('timerText');
		if (t) t.innerText = 'Вы можете безопасно закрыть эту вкладку вручную';
	}}, 500);
}}, 1200);
</script>
</body>
</html>"#
        );

        hyper::Response::builder()
            .status(hyper::StatusCode::OK)
            .header("Content-Type", "text/html;charset=utf-8")
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Private-Network", "true")
            .body(html)
    } else {
        hyper::Response::builder()
            .status(hyper::StatusCode::BAD_REQUEST)
            .header("Content-Type", "text/html;charset=utf-8")
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Private-Network", "true")
            .body(
                r#"<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Ошибка авторизации</title><style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#050507;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px;}.card{background:#121215;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:40px 32px;text-align:center;max-width:400px;width:100%;}h1{font-size:20px;color:#ef4444;margin-bottom:8px;}p{color:#a1a1aa;font-size:13.5px;line-height:1.5;}</style></head><body><div class="card"><h1>Ошибка авторизации</h1><p>Код авторизации не найден или устарел. Попробуйте войти снова через лаунчер.</p></div></body></html>"#.to_string()
            )
    }?;

    Ok(response)
}
