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

pub fn extract_auth_code(link: &str) -> String {
    let clean = link.trim_matches('"').trim_matches('\'').trim();
    if let Some((_, query)) = clean.split_once('?') {
        for pair in query.split('&') {
            if let Some((k, v)) = pair.split_once('=') {
                if k == "code" || k == "token" {
                    let token = v.trim_matches('/').trim_matches('"').trim();
                    if !token.is_empty() {
                        return token.to_string();
                    }
                }
            }
        }
    }
    if let Some(idx) = clean.find("mra_") {
        let token_part = &clean[idx..];
        let end = token_part
            .find(|c: char| !c.is_alphanumeric() && c != '_' && c != '-')
            .unwrap_or(token_part.len());
        let token = &token_part[..end];
        if !token.is_empty() {
            return token.to_string();
        }
    }
    clean.to_string()
}

pub fn submit_auth_code(code: String) {
    let extracted = extract_auth_code(&code);
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
            .find_map(|(key, value)| (key == "code").then_some(value))
    });

    let response = if let Some(auth_code) = auth_code {
        *auth_code_out.lock().unwrap() = Some(auth_code.to_string());

        let html = format!(
            r#"<!doctype html><html><head><meta charset="utf-8"><title>Macros - Авторизация успешна</title><style>body{{font-family:system-ui,-apple-system,sans-serif;background:#121212;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}}.card{{background:#1f1f1f;border:1px solid #333;border-radius:16px;padding:32px;text-align:center;max-width:420px;box-shadow:0 8px 24px rgba(0,0,0,0.5);}}.icon{{width:60px;height:60px;background:#00af5c22;color:#00af5c;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:32px;font-weight:bold;}}h1{{margin:0 0 12px;font-size:22px;color:#fff;}}p{{color:#a1a1aa;font-size:14px;line-height:1.5;margin:0 0 24px;}}.btn{{display:inline-block;background:#00af5c;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:600;font-size:14px;border:none;cursor:pointer;}}</style></head><body><div class="card"><div class="icon">✓</div><h1>Вход выполнен!</h1><p>Вы успешно вошли в аккаунт. Лаунчер Macros уже завершил вход. Можете закрыть эту страницу.</p><button class="btn" onclick="window.close()">Закрыть страницу</button></div><script>try{{window.location.href="modrinth://{auth_code}";}}catch(e){{}}setTimeout(function(){{window.close();}},2000);</script></body></html>"#
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
                r#"<!doctype html><html><head><meta charset="utf-8"><title>Ошибка</title><style>body{font-family:sans-serif;background:#121212;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}.card{background:#1f1f1f;border:1px solid #333;border-radius:16px;padding:32px;text-align:center;max-width:400px;}</style></head><body><div class="card"><h1 style="color:#cb2245;">Ошибка</h1><p>Код авторизации не найден. Попробуйте войти снова.</p></div></body></html>"#.to_string()
            )
    }?;

    Ok(response)
}
