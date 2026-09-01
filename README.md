# MacrosApp 🎮

[![GitHub Release](https://img.shields.io/github/v/release/nnnegrvpeni-lang/MacrosApp?style=for-the-badge&color=00AF5C)](https://github.com/nnnegrvpeni-lang/MacrosApp/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](COPYING.md)
[![Platform](https://img.shields.io/badge/Platform-Windows-0078D6?style=for-the-badge&logo=windows)](https://github.com/nnnegrvpeni-lang/MacrosApp/releases)

**MacrosApp** — модифицированный форк официального Modrinth App с поддержкой **Ely.by аккаунтов**, **оффлайн-режима (пиратка / No-Auth)**, **каталога CurseForge**, **полным отключением рекламы** и улучшенным интерфейсом.

---

## 🌟 Основные особенности / Features

### 1. 🦊 Интеграция Ely.by аккаунтов
- Полноценная авторизация через сервис **Ely.by** (логин/почта + пароль).
- Запуск Minecraft с официальным скином и плащом из скиносистемы Ely.by (через `authlib-injector`).
- Отображение скинов и плащей во вкладке «Скины» лаунчера.
- Отображение 2D/3D головы скина в меню профилей и сайдбаре лаунчера.

### 2. 🎮 Оффлайн-аккаунты (Offline / No-Auth)
- Возможность играть под любым ником без учётной записи Microsoft.
- Корректная генерация Java UUID (`MD5("OfflinePlayer:" + username)` RFC 4122 v3).
- Отображение типа аккаунта (`Offline Account`, `Ely.by Account`, `Microsoft Account`).
- Дефолтный скин Стива во вкладке скинов при выборе оффлайн-аккаунта.

### 3. 📦 Интеграция каталога CurseForge
- Удобный переключатель **Modrinth / CurseForge** в правом верхнем углу каталога на одной высоте с вкладками (моды, модпаки, ресурспаки, датапаки, шейдеры).
- Поиск, просмотр описаний, авторов, иконок и установка файлов прямо из CurseForge API.

### 4. 🚫 Полное отключение рекламы (Ad-Free)
- Полностью вырезан рекламный видеоплеер в нижнем углу правого сайдбара.
- Удалены навязчивые баннеры и кнопки подписки `Modrinth+`.
- Чистый, аккуратный и быстрый интерфейс.

---

## 🔐 Авторизация в аккаунт Modrinth (Временные нюансы)

Из-за обязательной защиты **Cloudflare Turnstile** и поддержки сторонних способов входа (Google, Discord, GitHub, Steam), авторизация в аккаунт Modrinth осуществляется через браузер:

1. В лаунчере нажмите **«Войти»** — в браузере откроется страница входа Modrinth.
2. Войдите в свой аккаунт любым удобным способом (Google, Discord, пароль и др.).
3. **Если лаунчер не подхватил вход автоматически:**
   - На странице входа на сайте нажмите **правой кнопкой мыши прямо по кнопке «Open Modrinth App →»** и выберите **«Посмотреть код»** (или нажмите <kbd>F12</kbd>).
   - В коде страницы прямо над кнопкой найдите скрытую строку с адресом вида `<iframe src="http://127.0.0.1:PORT/?code=mra_...">`.
   - Скопируйте ссылку или токен `mra_...`, вернитесь в лаунчер и нажмите **«📋 Вставить из буфера»** (или просто переключитесь в окно лаунчера — он автоматически перехватит токен из буфера обмена).

---

## 📥 Скачать / Download

Готовый официальный установщик Windows (`.exe Setup`):

👉 **[Скачать MacrosApp Setup](https://github.com/nnnegrvpeni-lang/MacrosApp/releases/latest)**

---

## 🛠️ Сборка из исходного кода / Building from Source

### Требования:
- **Node.js** (v22+)
- **pnpm** (`npm install -g pnpm`)
- **Rust** (stable toolchain)

### Сборка:
```bash
# 1. Клонирование репозитория
git clone https://github.com/nnnegrvpeni-lang/MacrosApp.git
cd MacrosApp

# 2. Установка зависимостей
pnpm install

# 3. Сборка фронтенда
pnpm --filter app-frontend build

# 4. Запуск в режиме разработки
pnpm app:dev

# 5. Сборка готового установщика Windows (.exe Setup)
pnpm --filter @modrinth/app build
```

---

## 📜 Лицензия / License

Этот проект основан на открытом исходном коде [Modrinth App](https://github.com/modrinth/code) и распространяется под свободной лицензией **GNU General Public License v3.0 (GPLv3)**. Подробности в файле [COPYING.md](COPYING.md).
