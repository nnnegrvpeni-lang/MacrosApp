# MacrosApp 🎮

[![GitHub Release](https://img.shields.io/github/v/release/nnnegrvpeni-lang/MacrosApp?style=for-the-badge&color=00AF5C)](https://github.com/nnnegrvpeni-lang/MacrosApp/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](COPYING.md)
[![Platform](https://img.shields.io/badge/Platform-Windows-0078D6?style=for-the-badge&logo=windows)](https://github.com/nnnegrvpeni-lang/MacrosApp/releases)

**MacrosApp** — быстрый, открытый и модифицированный форк Modrinth App с нативной поддержкой **Ely.by**, **оффлайн-режима (No-Auth)**, **каталога CurseForge**, **Discord Rich Presence** и **полным отключением рекламы**.

---

## 🌟 Возможности / Features

### 🦊 Нативная интеграция Ely.by
- **Безопасная авторизация через OAuth2**: вход в один клик через официальный сайт Ely.by в браузере с кодом подтверждения — никаких вводов паролей в лаунчере.
- **Скиносистема Ely.by**: скины и плащи работают прямо в игре на базе официальной библиотеки `by.ely:authlib`.
- **Отображение в лаунчере**: 2D/3D рендеринг скина и плаща в меню профиля и боковой панели.

### 🎮 Оффлайн-аккаунты (Offline / No-Auth)
- Запуск игры под любым ником без необходимости привязки учётной записи Microsoft.
- Корректная генерация оффлайн UUID по стандарту Java (`MD5("OfflinePlayer:" + username)`).
- Поддержка быстрого переключения между типами аккаунтов (Microsoft, Ely.by, Offline).

### 📦 Единый каталог: Modrinth + CurseForge
- Удобный переключатель **Modrinth / CurseForge** прямо в интерфейсе каталога.
- Полноценный поиск, просмотр информации, фильтрация версий и прямая установка модов, модпаков, ресурс-паков и шейдеров из обеих экосистем.

### 💬 Discord Rich Presence
- Интеграция со статусом Discord: красивое отображение запущенной сборки, версии и времени игры.

### 🚫 Полное отсутствие рекламы (Ad-Free)
- Вырезан рекламный видеоплеер в боковой панели.
- Удалены навязчивые баннеры подписок `Modrinth+`.
- Чистый, производительный и минималистичный интерфейс.

---

## 📥 Скачать / Download

Готовая сборка для Windows:

👉 **[Скачать последнюю версию MacrosApp](https://github.com/nnnegrvpeni-lang/MacrosApp/releases/latest)**

---

## 🛠️ Сборка из исходного кода / Building from Source

### Необходимые инструменты:
- **Node.js** (v20+)
- **pnpm** (`npm install -g pnpm`)
- **Rust** (stable toolchain)

### Порядок сборки:
```bash
# 1. Клонирование репозитория
git clone https://github.com/nnnegrvpeni-lang/MacrosApp.git
cd MacrosApp

# 2. Установка зависимостей
pnpm install

# 3. Сборка фронтенда
pnpm --filter app-frontend build

# 4. Сборка приложения
cargo build --release --manifest-path apps/app/Cargo.toml
```

Готовый исполняемый файл будет находиться в директории `target/release/theseus_gui.exe` (или `MacrosApp.exe`).

---

## 📜 Лицензия / License

Проект распространяется под свободной лицензией **GNU General Public License v3.0 (GPLv3)**. Подробная информация доступна в файле [COPYING.md](COPYING.md).
