use crate::State;
use crate::state::CachedEntry;
pub use daedalus::minecraft::VersionManifest;
pub use daedalus::modded::Manifest;

#[tracing::instrument]
pub async fn get_minecraft_versions() -> crate::Result<VersionManifest> {
    let state = State::get().await?;
    let minecraft_versions = CachedEntry::get_minecraft_manifest(
        None,
        &state.pool,
        &state.api_semaphore,
    )
    .await?
    .ok_or_else(|| {
        crate::ErrorKind::NoValueFor("minecraft versions".to_string())
    })?;

    Ok(minecraft_versions)
}

#[derive(serde::Deserialize)]
struct GitHubRelease {
    tag_name: String,
    #[serde(default)]
    draft: bool,
}

async fn fetch_horizon_versions_from_github() -> crate::Result<Vec<daedalus::modded::LoaderVersion>> {
    let client = reqwest::Client::builder()
        .user_agent("MacrosApp/1.0")
        .build()
        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to build HTTP client: {e}")))?;

    let response = client
        .get("https://api.github.com/repos/horizon-rust/horizon/releases")
        .send()
        .await
        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to fetch Horizon releases from GitHub: {e}")))?;

    if !response.status().is_success() {
        return Err(crate::ErrorKind::OtherError(format!(
            "GitHub releases API returned HTTP {}",
            response.status()
        )).into());
    }

    let releases: Vec<GitHubRelease> = response
        .json()
        .await
        .map_err(|e| crate::ErrorKind::OtherError(format!("Failed to parse GitHub releases: {e}")))?;

    let mut versions = Vec::new();
    for rel in releases {
        if rel.draft {
            continue;
        }
        let tag = rel.tag_name.trim();
        let clean_ver = tag
            .trim_start_matches("launcher@")
            .trim_start_matches('v');
        if clean_ver.chars().next().map_or(false, |c| c.is_ascii_digit()) && clean_ver.contains('.') {
            if !versions.contains(&clean_ver.to_string()) {
                versions.push(clean_ver.to_string());
                if versions.len() >= 2 {
                    break;
                }
            }
        }
    }

    if versions.is_empty() {
        return Err(crate::ErrorKind::OtherError("No Horizon versions found on GitHub releases".to_string()).into());
    }

    Ok(versions
        .into_iter()
        .enumerate()
        .map(|(i, v)| daedalus::modded::LoaderVersion {
            id: v,
            url: String::new(),
            stable: i == 0,
        })
        .collect())
}

// #[tracing::instrument]
pub async fn get_loader_versions(loader: &str) -> crate::Result<Manifest> {
    if loader == "rust" || loader == "horizon" {
        let loaders = fetch_horizon_versions_from_github().await?;
        return Ok(Manifest {
            game_versions: vec![daedalus::modded::Version {
                id: "26.3".to_string(),
                stable: true,
                version_group: None,
                loaders,
            }],
            version_groups: Vec::new(),
        });
    }

    let state = State::get().await?;
    let cache_key =
        daedalus::modded::loader_manifest_metadata(loader).cache_key;
    let loaders = CachedEntry::get_loader_manifest(
        &cache_key,
        None,
        &state.pool,
        &state.api_semaphore,
    )
    .await?
    .ok_or_else(|| {
        crate::ErrorKind::NoValueFor(format!("{loader} loader versions"))
    })?;

    Ok(loaders.manifest)
}
