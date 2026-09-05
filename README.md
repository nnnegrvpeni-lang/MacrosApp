# MacrosApp 🎮

[![GitHub Release](https://img.shields.io/github/v/release/nnnegrvpeni-lang/MacrosApp?style=for-the-badge&color=00AF5C)](https://github.com/nnnegrvpeni-lang/MacrosApp/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](COPYING.md)
[![Platform](https://img.shields.io/badge/Platform-Windows-0078D6?style=for-the-badge&logo=windows)](https://github.com/nnnegrvpeni-lang/MacrosApp/releases)

**MacrosApp** is a fast, lightweight, and modified fork of the Modrinth App featuring native **Ely.by** skins and accounts support, **Offline mode (No-Auth)**, unified **CurseForge** catalog browsing, **Discord Rich Presence**, non-intrusive **update notifications**, and a completely **ad-free** experience.

---

## 🌟 Key Features

### 🔔 Smart Update Notifications
- Non-intrusive update checks powered directly by GitHub Releases API.
- Graceful startup toast notifications with 10-second auto-dismiss.
- Compact update badge in the top bar and dedicated update management in Settings.

### 🔑 Seamless Modrinth Authentication
- Built-in OAuth window with automatic session capture.
- Instant single-click sign-in without external browser redirects or manual token copying.

### 🦊 Native Ely.by Integration
- **Secure OAuth2 Login**: Sign in via the official Ely.by website with a confirmation code — zero password exposure inside the launcher.
- **In-Game Skins & Capes**: Full skin and cape rendering powered by the official `by.ely:authlib` library.
- **Launcher Preview**: 2D/3D skin and cape rendering in the profile switcher and sidebar.

### 🎮 Offline Accounts (No-Auth)
- Launch Minecraft under any custom nickname without requiring a Microsoft account.
- Compliant Java offline UUID generation (`MD5("OfflinePlayer:" + username)`).
- Quick account switching between Microsoft, Ely.by, and Offline accounts.

### 📦 Unified Catalog: Modrinth + CurseForge
- Direct **Modrinth / CurseForge** source switch in the browse view.
- Search, filter versions, and install mods, modpacks, resource packs, and shaders directly into your instances from both ecosystems.

### 💬 Discord Rich Presence
- Real-time Discord status showcasing the active instance, Minecraft version, and play time.

### 📰 Multi-Feed News
- Stay up to date with multi-tab news feeds (Macros, Minecraft, and Modrinth articles) with a customizable visibility toggle in Settings.

### 🚫 100% Ad-Free
- No video ad players.
- Removed Modrinth+ upsells and sponsored banners.
- Clean, focused, and distraction-free UI.

---

## 📥 Download

Prebuilt binaries for Windows:

👉 **[Download Latest MacrosApp Release](https://github.com/nnnegrvpeni-lang/MacrosApp/releases/latest)**

- **`Macros_1.2.3_x64-setup.exe`** — Official Windows installer (NSIS).
- **`Macros.exe`** — Portable standalone executable (no installation required).

---

## 🛠️ Building from Source

### Prerequisites
- **Node.js** (v20+)
- **pnpm** (`npm install -g pnpm`)
- **Rust** (stable toolchain)

### Build Steps
```bash
# 1. Clone the repository
git clone https://github.com/nnnegrvpeni-lang/MacrosApp.git
cd MacrosApp

# 2. Install dependencies
pnpm install

# 3. Build the application and installer
pnpm --filter @modrinth/app build
```

The output executables and installer will be located in:
- `target/release/bundle/nsis/Macros_1.2.2_x64-setup.exe` — Windows installer
- `target/release/Macros.exe` — Standalone binary

---

## 📜 License

MacrosApp is open-source software licensed under the **GNU General Public License v3.0 (GPLv3)**. See [COPYING.md](COPYING.md) for full license details.
