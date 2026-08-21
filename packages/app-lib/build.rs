use std::ffi::OsString;
use std::path::PathBuf;
use std::process::{Command, exit};
use std::{env, fs};

fn main() {
    println!("cargo::rerun-if-changed=.env");
    println!("cargo::rerun-if-changed=java/gradle");
    println!("cargo::rerun-if-changed=java/src");
    println!("cargo::rerun-if-changed=java/build.gradle.kts");
    println!("cargo::rerun-if-changed=java/settings.gradle.kts");
    println!("cargo::rerun-if-changed=java/gradle.properties");

    set_env();
    build_java_jars();
}

fn set_env() {
    let manifest_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap_or_default());
    let _ = dotenvy::from_path(manifest_dir.join(".env"));
    let _ = dotenvy::from_path(manifest_dir.join(".env.prod"));
    let _ = dotenvy::dotenv();

    let vars = [
        ("MODRINTH_URL", "https://modrinth.com/"),
        ("MODRINTH_API_BASE_URL", "https://api.modrinth.com/"),
        ("SHARED_INSTANCES_API_BASE_URL", "https://shared-instances.modrinth.com/"),
        ("MODRINTH_ARCHON_BASE_URL", "https://archon.modrinth.com/"),
        ("MODRINTH_API_URL", "https://api.modrinth.com/v2/"),
        ("MODRINTH_API_URL_V3", "https://api.modrinth.com/v3/"),
        ("MODRINTH_SOCKET_URL", "wss://api.modrinth.com/"),
        ("MODRINTH_LAUNCHER_META_URL", "https://launcher-meta.modrinth.com/"),
    ];

    for (k, v) in vars {
        let val = env::var(k).unwrap_or_else(|_| v.to_string());
        println!("cargo::rustc-env={k}={val}");
    }

    for (var_name, var_value) in
        dotenvy::dotenv_iter().into_iter().flatten().flatten()
    {
        if var_name == "DATABASE_URL" {
            // The sqlx database URL is a build-time detail that should not be exposed to the crate
            continue;
        }

        println!("cargo::rustc-env={var_name}={var_value}");
    }
}

fn build_java_jars() {
    let out_dir =
        dunce::canonicalize(PathBuf::from(env::var_os("OUT_DIR").unwrap()))
            .unwrap();

    println!(
        "cargo::rustc-env=JAVA_JARS_DIR={}",
        out_dir.join("java/libs").display()
    );

    let gradle_path = fs::canonicalize(
        #[cfg(target_os = "windows")]
        "java\\gradlew.bat",
        #[cfg(not(target_os = "windows"))]
        "java/gradlew",
    )
    .unwrap();

    let mut build_dir_str = OsString::from("-Dorg.gradle.project.buildDir=");
    build_dir_str.push(out_dir.join("java"));
    let exit_status = Command::new(gradle_path)
        .arg(build_dir_str)
        .arg("build")
        .arg("--no-daemon")
        .arg("--console=rich")
        .current_dir(dunce::canonicalize("java").unwrap())
        .status()
        .expect("Failed to wait on Gradle build");

    if !exit_status.success() {
        println!("cargo::error=Gradle build failed with {exit_status}");
        exit(exit_status.code().unwrap_or(1));
    }
}
