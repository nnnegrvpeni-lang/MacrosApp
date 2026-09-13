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

        let html = r#"<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Macros — Successfully Authenticated</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
	font-family: 'Google Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
	background-color: #131314;
	color: #e3e3e3;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	padding: 24px;
	text-align: center;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.brand-row {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	margin-bottom: 24px;
	user-select: none;
}
.brand-logo {
	width: 34px;
	height: 34px;
	object-fit: contain;
}
.brand-name {
	font-size: 24px;
	font-weight: 500;
	color: #ffffff;
	letter-spacing: -0.01em;
}
h1 {
	font-size: 26px;
	font-weight: 400;
	color: #f1f3f4;
	margin-bottom: 12px;
	letter-spacing: -0.01em;
}
p {
	font-size: 13.5px;
	color: #9aa0a6;
	line-height: 1.5;
	margin-bottom: 24px;
}
a {
	color: #8ab4f8;
	text-decoration: none;
	transition: color 0.15s ease;
}
a:hover {
	text-decoration: underline;
	color: #aecbfa;
}
.footer {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	font-size: 13px;
	color: #5f6368;
	user-select: none;
}
.footer a {
	color: #8ab4f8;
}
</style>
</head>
<body>
<div class="brand-row">
	<img class="brand-logo" src="data:image/png;base64,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" alt="Macros" />
	<span class="brand-name">Macros</span>
</div>
<h1>You have successfully authenticated.</h1>
<p>You should be redirected back to the product. <a href="javascript:void(0)" onclick="window.close()">Click here</a> if not working.</p>
<div class="footer">
	<a href="https://macrosapp.duckdns.org" target="_blank">Website</a>
	<span>|</span>
	<a href="https://github.com/nnnegrvpeni-lang/MacrosApp" target="_blank">GitHub</a>
</div>
<script>
setTimeout(function() {
	window.close();
}, 1500);
</script>
</body>
</html>"#.to_string();

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
                r#"<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Macros — Authentication Failed</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
	font-family: 'Google Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
	background-color: #131314;
	color: #e3e3e3;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	padding: 24px;
	text-align: center;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.brand-row {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	margin-bottom: 24px;
	user-select: none;
}
.brand-logo {
	width: 34px;
	height: 34px;
	object-fit: contain;
}
.brand-name {
	font-size: 24px;
	font-weight: 500;
	color: #ffffff;
	letter-spacing: -0.01em;
}
h1 {
	font-size: 26px;
	font-weight: 400;
	color: #f28b82;
	margin-bottom: 12px;
	letter-spacing: -0.01em;
}
p {
	font-size: 13.5px;
	color: #9aa0a6;
	line-height: 1.5;
	margin-bottom: 24px;
}
a {
	color: #8ab4f8;
	text-decoration: none;
}
a:hover {
	text-decoration: underline;
}
.footer {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	font-size: 13px;
	color: #5f6368;
	user-select: none;
}
.footer a {
	color: #8ab4f8;
}
</style>
</head>
<body>
<div class="brand-row">
	<img class="brand-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAUzUlEQVR42u1bCXhURfLvfvecuRMCiUC4BURUVERWEURYEJeV9VpwcRXFY3E/8T4WRREvFFBBQHcXXU9ABOVGQBCUQMIRYghnDkISEpJMJjPz5h3d/+qeGQguagLx/337ySOTTCYzXV1Vv6r6VfVDQr/xSzpngHMGOGeAcwY4Z4BzBvjtXuL/9O4xfOGzW0I4K/kCxlhEkiDis1rnjDbOZFKEKTzg+Rk78ow+CGojQcIStSmBTRDYBGWGgNfh2a+reEw2saktiTJSVBmZpkXhNRn+2mz5zTYAszYlFIPqdmb3xJTbZvZ+npro+NG99WVMODcMQeRXUR4QRykVmez2PVOTxy3utXDwg+3GH8sLfFN5OHCcyQdc4OYYoVkGYMZnymmyg/7xuQvG3vSv9kva9XYM7H1ryrjE1g6hdGtwQ7DBILAFFhK0xZUHrIlIoUMf7fqnMZ92WZvYVuihpuDz+tyRdr87STPKtumb9YDRLCPgZijP4o1efkPW5cNfaPdiSg9pQIgYiIaRAV4HJIrIX20fWv9G5VPLXyz4BPTHLWUEjLnnaXyKy/HImquWpvUig3yGzqxssTwIgERuVRSDAbFkWt+cnqV51fUCGIyw4PwlRDdRecSSjcfjRpeM6nB5Wg9tgIUsRHVqAOAl2yYm/Ia0ZCkrubUnMb1twhmF1+nk4kZpPi3T6yjJDX7q85FKtyIhbFOB2IQ4VEGsC6Hqr18pf6jd+SmtREkQmqJ80w0g8CxLBk1sP8ayTe3D28vaFm21lriciiKKguDUFLk4T189d1BhcnWxv+KWOV3+A5+yIF9IAMczqhLsM6ACPCgSFayw1/qMS3zK25pe9MV9pb13rdBnqqC5y6HKBVv9iz65qahTXDq+cMiUtu9pDgeJAucX5TSNCOFIqARtPaHvX9xTE3ua1+a8XzGhdHPSP3vd5n0595PyV/ct8X96zaPp73QfGj+6opDmMNsS27YQjwPQBKoEpeCzX/AMz/LwXtuilqpqSHUJqL4mGOab9Uqpva7zjnZ3sgfm/9u4e2MB/bo2UNWmKtdeOOgfKZ9n9fEOOLDDtzas63wpilooBGKRrEgCDaIwanWR45qR08/b06abctXb/XZ2q9pp7Bu3tuuxjkM9o+tqycElTxSMEyECRj7X/Z5H1vZ7v2f/zLbERhZPYlAlft7rVGTKd+iVlvropr5LnvmhX+6gB3oMZl7Y8UHdS1XH7YMJ7bXOgycnbvBm4L4HFppzxy7qXNy6jzYgaJtIdAtu0gx21CxoJiR7TQ9SkBUwSYPfMnoOdT3UsU9C387DPOMF0XIypQu/CM4v2eLfMaNqUOmQf7R6J2ugc8z9G87fO3Z2r8cTUjyIKQe6iI3Dgu0XDCNDbScCUu3rn+g25u/Zvfan9sEjpASr981vtl41vXT4ugPrjudvXVS0QoOIDBATpfcRR14wsG0fyJAOM2Qhj6ig0k3+VcSwmlwJmmQAKH0MynjhE/nvLHv9+F1Ol8d0gbQAshEFmOoBqw7zxQC+sp0ggCF2Lw28TExHCFMbhUK60m98ytSndl5aMOCvWUNgYzZXFqAOCUtksQ6GMdv1Ss54ckvfr65/8bz3TRT2hustXYHoD/jokZVTD08NGAZKSHPGAZhAQYJEotTbPhTAooVkRQ0tnFgydPUTZc9CXuJcoeUQgCmv65eMTPtd4eqqzS913+3cu8b4dzLyIiXNjSzLIgJPFRSFA8h39fisu6qKffrswftSy3aIyxNcTiEAqNHS7K5/fi9rxWPrrlzUuU9aexYWtkVsWVDIiCfPv3vi1t6FrfsKw/x+XRchjcV7HdqhjcYnL3TZkVldUt/QqZc7XUQazweMgkqCjLQkUTuaZ2ycfuGe+JqikHnX5z0WOOMkO4asliqD/H1dB6Zf8cDKrgV9/up+6tO/7L9j7rh9V1fkVZZALdAIxxuFPIF0OZ6mjnouc16/Cd7Zn43fP2r5i75RTpeXSqKA/PWmnjVA/eND3/c8cPuM3pO6X9Wm+8PfXrxmxJSMObZgOnW/FdI8SJM1hS54rGTU7Ot233rtM21efuDLnls8GVobM0wCnO8SjGyH4d64fNfueQMLrrrynsxH71zUZa2SaGWYAbvJujUrBzTUWQ3Ae9CgiZmTnyzsXY6poeWtLC5zxMsuwnM9RXqIEEEWrXqko14jE0bf93XHCv+Rev+swYUp5fnC2gSvUwsFLDtsWrjfhMRnJ2w4f0+bvtogXzBsUJPabo/iOH6Y5k67KD/p0Nq67Im5Pff0vz/pUZZ8k5JSWXXlpmbeZYwbjEruWnr+uiseiHteh70ZphggVG7pJBjBUlDwS6wFawiGQ9Sttxr7bqeVV4zsfEHtsYY6KboUMYGZ2FDw4H3BgBUS3NQ7alb6qt/dF/fqovFFQ7589dg4p8spKirGgQZTD4bD1AiSsKQixeXUxA3vHp80/aL8i3vdkHzbQzk9StK6qd1DfqKLsL5p6bIAlYghTYAiZ+lYb9PZkZl+KRoQDFoW24NhhLBhhCO5i7aYAWKkwcG9LEpUJuCvBvAycopOLEhcFqMLkA9wIBgizGTAEmUK9vCHbavHHxLuvOerdkfq9wd3zB1anFK/z/FdvFvTBDCV0ymrxFBr3r350MXbZx17afyq81cNmZT6VggUMQ1kMyIk8NUpDZMGGqEllAvUTdGyQigoSdCNstZU/C+/tYQBIqbUBIHGVo2yQ2TrQV2U5ROiFLciYt4GRF6Cp4IgUyloWCaOo61um3ve9ivvjn/4o7GHrlg7o+5BSZNx/pr6RW/0zktOTlXTAfK+NpdKgxt00wSSSeFLZH0A26qmuQnSdZ6SeMZhLBETzN4Wy3hYg4eCm+HUJocAxDfxwc/4E+WV/ZQkEUNAc8PYrB9wOQSH4oRIJSfSMNuoICFAAyL1QFZ6jHQ91ra/84alj5TdMrnjQYeqieIfpmXN7znMM8ZvhKDoYEuE93MOCRZk5BE+ihoCYeyvo4SFg0EjDBOkYv4mjniKNSrAsAAjs2UNEIOLdDKsaORbXW0tSSeJ/HUB/vlq/LBbW3WiVkg3TBNrQHlAIxqxowCEBwUN21STcdcx/2q7c9fiuGnpfRw3JGaIHf0hwxJlwBbsK+JhyCmEjV1AMdiqrEhAj+NxZNzABiOIBsNMHOxMZUnRRm4pEamSC/JFfSRofoENNa9JMVE0BHCjEsl3yYWx4uNpLXTMW+ifWVKIv/W6VQf8jXEhi3+GRsgZQwOxkB0wDQpomOjJoB2DYUhiCqfJrAniytsmMSUViw6XLHz55uGny/N9Ozv1S7gsDMtBt8uV0xw2heoaMRbbhRLGomq1dAjEAoHQE+6PwZuBAjDKojKoW2bvmxLvTHA7haV/KxqeNShu1NUTE+eIoiHpOrGwzOmvwBMmxDZbQbfAFBjCGJJYJG0zmki416HblMtLwoXrH68cJQLSb1uUme9tZ3exwQKiCjwIVgtBHrZtlgswZ6IGMERLaBykLZEEow6H3vu/CLat21G0QjxCQrJhPtfx9+odY75oXYJDRs3nYyvOK8kmX7g1VQLOLhCgvKcsDS1zdILEgW1xr4ui6lCE7z9smLxkTEWfLgNdt978aZs8T1vchRjEFnnNxVwoxAuNtr38O4gHetn0iVzTEHDC77QR+CPeskybDURpFA+8CQlDjAua4B08KfXzkpzgyg2vVdz1Q0fPvP4Px833xKHkoG4SVs9ZJQFP8yTJYx0M5HQockWpnrf+2aqbVEn23vxxRl5Ca6FtQyhMRKgvAms0KLMVZT0KgpkoJJZIshQ4DwggQzeb6P9mIiDiO3zKyzy/EYTpKV5FvP4HwpaZfrFjyG0fZxyJa223+2h0cdauZfp0l+YUWAjYYChW4ohFTFnBoqYqOPujwBOL7ij5XbdrXffeNCd9qzMdtQVaYUqyAFd0/B0VxqpyIASosaJTK0aQIuPDJiOgWfMAqhAuBtGTZmDeo6TR8+iDMNeKVIKRtWWaBPW/N+ntP83M/GbPZ7VzFo6v7mlWagVumCQhAJBTk2VfmZC3+IGqXtW54dzbP+mw98Jb4ifUh8I20GNAC2Qa1j/yQodOKcPM+403iWPx1KIGiMWLLNMT46FGLoeN4Zh4Gi0NDkUCqBIYWMKWgcoEgAjFtUe9R8/PKGh7hXTLgntKL8n5UH9Exk59z6Lw5JV/Pzqs6xD1kWGvJazSElGaHiYmlEROgghUEkUF1i/CrxHwczms+Dg0TJmkSIXBSIVuTFREdCpWz9IAMV2dfEx3Av+Y12IW9IIQsQnFBBIU8h0Qvsn9p/k3GJ8jKG0iIMBmtNiyqB0yTXrZ7d6nRs5OzS/N9uW8P6wosboweGDEnNQ93Ye7RwehWgB4SKRUUpbtRSdU0+z3ghMPrQ9/pMgCs6vNzQDfRdp4bspqJ7zQpElAMwwQWz9ITS6LnhJjjabf4G5G4CqLaoJz79z41qzhhT1qDwrfOsEtNqOGApsEUcxosaeN1G7EjLR117+dsuWqJxPe1xJEL3gdiBAsAWWRAV7TJMlXIWV/cHvxpfPv+v71Y6W+AJs6sdEaL6WAhrCf63zCUZZgI1uwW9YAsYtEKOcplSCSvEkMEBFCRCJJYdeyw/kvXrCl/44Fvpc1RRQYAhhMgavKNtSqsGXTxM7ShYZJGIkjcNIlcfYGLABmDHj3Ev25l7pvu2zzB/u2sfVUWRVO8QgbpSmYl0EarUqQeNjE7VfKASTGgGmUD0b/YdwoCZ28ZE1UQsEQ+uDOHY/7y608Fg5gRJu/CxoYRpFhFAbljUUSI0kc3sAIkVC5n6ycd2POs4GaBixrgsrWsw0jOnmKZSJYTFIoO6GN7ICNyRxIIMqPsNtCBmDYp9FEx5M9ExCHY5mPP5jvqRBhIhZAWlIEOeg30frXqp5xQHhAyYv66sQeBRLl7JGKQoDZymjFpMNP27YBHhZEKJYc03ogRGLyuWokclYX3Qw3SkC3bN20o/ikLWuAuGSHR2EQh1kAgDaSEMH4Ik+CQGGhnrPtOZMVT0w9xueZnLVv719ydG94owKnOOxkF0WNwAtrVAFo7CxAOS7aTj7d9nF5DgMdfN6KOdLTyuXlLMiMMBL2GYkafBVoMk3WJUpu3UXtcMuGAKWR095N845/VnbQyIuDsRXwYl6B46Q0GVo81ukil1dy+xtQ9eZXap6OVUUaOTHGZthEKyYXP80oPytrHAX4ZBjxcwyoaBA4aOWkg8+xzgv6yAhcoqfNexY2zA4baq3HI7rgOA6ImWArMD0FVBmqU5ADAXJs9UNl9/P62MTj2SYSoYizAzWkev6IA70XP11+n6holguUcakahn7e6Ybzgu0LaufMujQ/w3dEL2ExzcoZRyokP5aZvvu4eFPhhvovVFUUoIGxTsQoQwGgQpEllLuk+p3dy4sL2JEaa4mi4vnP6ryGnTMuK2izfVFgjhvOADRF8sDZG/V4Zc/e9f5l7w042MEhOk3NLUeO6FtsKhyloNc8ljnu/k3d95dnh7+adfnBpPxsfQXUabm2wjj48SOlN3/9TMX4G+e1Wzp8euZ/mPKQHE+sH6EKFK16vmgyz9LspDtGaaI3WECEB9dMKX2By8SYNJLPe5brJreefuPszAUbJh0d/+7txddUlZg7A0h1rJpac8+ye6uGXzcl88NRb3X4UMYa64cF3NJJ0PQ3hD2JpP09q7NKrn009YnFY/cP3/RxQfamacdeVCRn6MGc7r5u/byD64/rvqhnT+yAxT3zav66Yzv2rmyY74AyBzmDHW+zv1kKMKgdH9TOLNlWVQYHJnLM+zGEsKuqwh/ucrlz2ITcLr6Mdq7kz+/44da8ZZUHSrYb68dv6rq/87XyiBq/WGnLasvmgNgFdI4PpQMh3exxk+vxh3b2qEhqI3uunNDq4ZFTk5dSAU5zAHlwoBlrDk9FEvcqRaunHIYYl8BLRCKM9SlI9ut29aopB16JQB6fdqIBhhHYMATs5hk6OeWzG2acNye9g8s9elFGvpwU6khYfrECouH3/zpVIGDpEUVglBEM2Yak2ClpF6pZjhSrE5vJC0QIsSwtmkLEe/jUDTCvMqgXfFtxeNtH1W/D6TpUFBJWYONb3617qXK/rzZyi82PBtoxpifyezTY7+EQGCKlh/vKhAwtyYRWWYCEyIYykiRTQZR/DMAWQkCUALG5NESlxFJ0OIhYodJFFL2Fhr3vZwQD9+HGWTn14NRQgPhkB3bU1ZCib6YVvcmVPN2ZXmw5K2oYRqL4T6LDUZQNhrehbRL57kQdC7J1quVaygAyUkiEsERrN3sNmAok6ZMEKerpn1qDQ17EctkeX2XOAt/rcdiJvnnjyPNVRTXGab3fSA+iRo1Do9QXOIgt2oyLc9cwh9gY6qPU9DtzmmWAeAfSOAKAiNDoWJqwPIYFfn8aS2aMMshwRv+zC1F+2ow2zyqdc7RYXPXde+Uf/aT3G11Oj+Lhhx/sXgP2fiFiBFZwwAw2G57LTsUjUPFH0Dl7A3CPFi7X15pBucTtkhxAPjArtN64ZImdU1lMuAfDGaESKPjcmBkD/E+ggLPZw9urK6f13zKstrxeZwH7M3eP8NdLvjY/gePXes2FnKYNpxAmtN8mqyasbSaQmWR964zqqcG6ECdClLZQCPDkBQO37744lPtC9+wOOxeGpjhdcJgHH1cQ4NI2ZBcESGmusXjm5buy1ryWtxRxmk5/bjrJgIurSmvsXxrg8xIK622Ys3/VS5fktj+STRZ4RQcLRdVSLOROkL2+MjF77pC9nVZO3b2YHec39V7FpveNbAIrYrGhNmjnLDiyrizH/KzbkNQrchcUr0jq5MoozbeWz/n99gnHy/wBlulRE29QwALGqGn3dzKyJNaVBYKb3y1foMZ7j6Z18Lbbu6pmJVbkunnX7/7zkd3H69mNWU29OaJpQXK6DWM2o0OmO8EBvb3tRFQ2/NUBfhcJ4/1spoN+pYvdWkMiExDSukuSu+aoX9f9Bs8pIFvktLs5+pzxRn4kDPNxNbYpbdEbRE+/aeYDkBfrKjHj1pjlwuYLx2e3kZPzsP8HvU+LRhqrx2e6BvqNX+f+y8w5A5wzwDkDnDPAOQP8hq//A2+QmRUlIQfhAAAAAElFTkSuQmCC" alt="Macros" />
	<span class="brand-name">Macros</span>
</div>
<h1>Authentication failed.</h1>
<p>The authorization code was invalid or has expired. Please try signing in again from the launcher.</p>
<div class="footer">
	<a href="https://macrosapp.duckdns.org" target="_blank">Website</a>
	<span>|</span>
	<a href="https://github.com/nnnegrvpeni-lang/MacrosApp" target="_blank">GitHub</a>
</div>
</body>
</html>"#.to_string()
            )
    }?;

    Ok(response)
}
