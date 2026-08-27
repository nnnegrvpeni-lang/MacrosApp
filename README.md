# Modrinth App (Offline & Ad-Free Edition) 🎮

[![GitHub Release](https://img.shields.io/github/v/release/nnnegrvpeni-lang/modrinth-offline?style=for-the-badge&color=00AF5C)](https://github.com/nnnegrvpeni-lang/modrinth-offline/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](COPYING.md)
[![Platform](https://img.shields.io/badge/Platform-Windows-0078D6?style=for-the-badge&logo=windows)](https://github.com/nnnegrvpeni-lang/modrinth-offline/releases)

Неофициальный форк официального **Modrinth App** с полной поддержкой **оффлайн-аккаунтов** (игра без обязательной авторизации в Microsoft) и **полным отключением рекламы**.

---

## 🌟 Основные особенности / Features

### 1. 🎮 Поддержка оффлайн-аккаунтов (Offline / No-Auth Mode)
- Возможность добавлять оффлайн-аккаунты (пиратские / No-Auth) по любому никнейму.
- Корректная генерация стандартных Minecraft Java UUID (`MD5("OfflinePlayer:" + username)` RFC 4122 v3).
- Отключены фоновые онлайн-запросы Mojang/OAuth для оффлайн-профилей (аккаунты не «слетают» и не требуют повторного входа).
- Оффлайн-аккаунты наглядно помечены плашкой `Offline` в списке профилей.
- Авторизация через Microsoft также полностью сохранена и работает при желании.

### 2. 🚫 Полное отсутствие рекламы (Ad-Free & Clean UI)
- Вырезан рекламный видеоплеер в нижнем углу правого сайдбара.
- Удалены навязчивые кнопки и баннеры перехода на подписку `Modrinth+`.
- Фоновый градиент сайдбара опущен до самого низа для чистого и аккуратного интерфейса.

### 3. ⚡ Все оригинальные возможности Modrinth сохранены
- Установка любых модов, модпаков, шейдеров и ресурс-паков в 1 клик прямо из каталога Modrinth.
- Удобное управление экземплярами (инстансами), версиями Fabric / Forge / NeoForge / Quilt.
- Мгновенный импорт сборок из других лаунчеров и поддержка файлов `.mrpack`.

---

## 📥 Скачать / Download

Готовый официальный установщик Windows (`.exe Setup`) доступен на странице релизов:

👉 **[Скачать Modrinth App (Offline Edition) v1.0.0](https://github.com/nnnegrvpeni-lang/modrinth-offline/releases/latest)**

---

## 🛠️ Сборка из исходного кода / Building from Source

### Требования:
- **Node.js** (v22+)
- **pnpm** (`npm install -g pnpm`)
- **Rust** (stable toolchain с `rustup`)

### Сборка:
```bash
# 1. Клонирование репозитория
git clone https://github.com/nnnegrvpeni-lang/modrinth-offline.git
cd modrinth-offline

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

