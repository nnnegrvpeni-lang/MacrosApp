//! Theseus tag management interface
use crate::state::CachedEntry;
pub use crate::{
    State,
    state::{Category, DonationPlatform, GameVersion, Loader},
};

/// Get category tags
#[tracing::instrument]
pub async fn get_category_tags() -> crate::Result<Vec<Category>> {
    let state = State::get().await?;
    let categories =
        CachedEntry::get_categories(None, &state.pool, &state.api_semaphore)
            .await?
            .ok_or_else(|| {
                crate::ErrorKind::NoValueFor("category tags".to_string())
            })?;

    Ok(categories)
}

/// Get report type tags
#[tracing::instrument]
pub async fn get_report_type_tags() -> crate::Result<Vec<String>> {
    let state = State::get().await?;
    let report_types =
        CachedEntry::get_report_types(None, &state.pool, &state.api_semaphore)
            .await?
            .ok_or_else(|| {
                crate::ErrorKind::NoValueFor("report type tags".to_string())
            })?;

    Ok(report_types)
}

/// Get loader tags
#[tracing::instrument]
pub async fn get_loader_tags() -> crate::Result<Vec<Loader>> {
    let state = State::get().await?;
    let mut loaders =
        CachedEntry::get_loaders(None, &state.pool, &state.api_semaphore)
            .await?
            .unwrap_or_default();

    if !loaders.iter().any(|l| l.name.eq_ignore_ascii_case("rust")) {
        loaders.push(Loader {
            name: "rust".to_string(),
            icon: std::path::PathBuf::new(),
            supported_project_types: vec!["mod".to_string()],
        });
    }

    Ok(loaders)
}

/// Get game version tags
#[tracing::instrument]
pub async fn get_game_version_tags() -> crate::Result<Vec<GameVersion>> {
    let state = State::get().await?;
    let mut game_versions =
        CachedEntry::get_game_versions(None, &state.pool, &state.api_semaphore)
            .await?
            .unwrap_or_default();

    if !game_versions.iter().any(|v| v.version == "26.3") {
        game_versions.insert(
            0,
            GameVersion {
                version: "26.3".to_string(),
                version_type: "release".to_string(),
                date: "2026-03-01T00:00:00Z".to_string(),
                major: false,
            },
        );
    }

    Ok(game_versions)
}

/// Get donation platform tags
#[tracing::instrument]
pub async fn get_donation_platform_tags() -> crate::Result<Vec<DonationPlatform>>
{
    let state = State::get().await?;
    let donation_platforms = CachedEntry::get_donation_platforms(
        None,
        &state.pool,
        &state.api_semaphore,
    )
    .await?
    .ok_or_else(|| {
        crate::ErrorKind::NoValueFor("donation platform tags".to_string())
    })?;

    Ok(donation_platforms)
}
