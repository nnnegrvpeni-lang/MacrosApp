use tauri::plugin::TauriPlugin;
use theseus::prelude::{UserFriend, UserStatus};

pub fn init<R: tauri::Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("friends")
        .invoke_handler(tauri::generate_handler![
            friends,
            friend_statuses,
            add_friend,
            remove_friend
        ])
        .build()
}

#[tauri::command]
pub async fn friends() -> crate::api::Result<Vec<UserFriend>> {
    match theseus::friends::friends().await {
        Ok(f) => Ok(f),
        Err(e) => {
            tracing::warn!("Failed to fetch friends from API: {e}");
            Ok(Vec::new())
        }
    }
}

#[tauri::command]
pub async fn friend_statuses() -> crate::api::Result<Vec<UserStatus>> {
    Ok(theseus::friends::friend_statuses().await?)
}

#[tauri::command]
pub async fn add_friend(user_id: &str) -> crate::api::Result<()> {
    Ok(theseus::friends::add_friend(user_id).await?)
}

#[tauri::command]
pub async fn remove_friend(user_id: &str) -> crate::api::Result<()> {
    Ok(theseus::friends::remove_friend(user_id).await?)
}
