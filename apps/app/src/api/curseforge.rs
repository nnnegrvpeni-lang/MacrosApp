use crate::api::Result;
use serde::Deserialize;

const CF_API_KEY: &str = "$2a$10$bL4bIL5pUWqfcO7KQtnMReakwtfHbNKh6v1uTpKlzhwoueEJQnPnm";
const CF_API_BASE: &str = "https://api.curseforge.com/v1";

pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new("curseforge")
        .invoke_handler(tauri::generate_handler![
            search,
            get_files,
        ])
        .build()
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SearchParams {
    pub game_id: Option<u32>,
    pub class_id: Option<u32>,
    pub search_filter: Option<String>,
    pub game_version: Option<String>,
    pub mod_loader_type: Option<u32>,
    pub sort_field: Option<u32>,
    pub sort_order: Option<String>,
    pub page_size: Option<u32>,
    pub index: Option<u32>,
}

#[tauri::command]
pub async fn search(params: SearchParams) -> Result<serde_json::Value> {
    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        .build()
        .map_err(|e| theseus::Error::from(theseus::ErrorKind::OtherError(e.to_string())))?;

    let mut query = vec![
        ("gameId".to_string(), params.game_id.unwrap_or(432).to_string()),
        ("classId".to_string(), params.class_id.unwrap_or(6).to_string()),
        ("pageSize".to_string(), params.page_size.unwrap_or(20).to_string()),
        ("index".to_string(), params.index.unwrap_or(0).to_string()),
    ];

    if let Some(q) = params.search_filter {
        if !q.trim().is_empty() {
            query.push(("searchFilter".to_string(), q.trim().to_string()));
        }
    }
    if let Some(gv) = params.game_version {
        if !gv.trim().is_empty() {
            query.push(("gameVersion".to_string(), gv.trim().to_string()));
        }
    }
    if let Some(mlt) = params.mod_loader_type {
        if mlt != 0 {
            query.push(("modLoaderType".to_string(), mlt.to_string()));
        }
    }
    if let Some(sf) = params.sort_field {
        query.push(("sortField".to_string(), sf.to_string()));
    }
    if let Some(so) = params.sort_order {
        query.push(("sortOrder".to_string(), so));
    }

    let url = format!("{CF_API_BASE}/mods/search");
    let resp = client
        .get(&url)
        .header("x-api-key", CF_API_KEY)
        .header("Accept", "application/json")
        .query(&query)
        .send()
        .await
        .map_err(|e| theseus::Error::from(theseus::ErrorKind::OtherError(e.to_string())))?;

    let val = resp
        .json::<serde_json::Value>()
        .await
        .map_err(|e| theseus::Error::from(theseus::ErrorKind::OtherError(e.to_string())))?;

    Ok(val)
}

#[tauri::command]
pub async fn get_files(mod_id: u32) -> Result<serde_json::Value> {
    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        .build()
        .map_err(|e| theseus::Error::from(theseus::ErrorKind::OtherError(e.to_string())))?;

    let url = format!("{CF_API_BASE}/mods/{mod_id}/files?pageSize=50");
    let resp = client
        .get(&url)
        .header("x-api-key", CF_API_KEY)
        .header("Accept", "application/json")
        .send()
        .await
        .map_err(|e| theseus::Error::from(theseus::ErrorKind::OtherError(e.to_string())))?;

    let val = resp
        .json::<serde_json::Value>()
        .await
        .map_err(|e| theseus::Error::from(theseus::ErrorKind::OtherError(e.to_string())))?;

    Ok(val)
}
