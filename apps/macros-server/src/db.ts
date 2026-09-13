// @ts-ignore
import { DatabaseSync } from 'node:sqlite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = process.env.DATA_DIR || path.join(__dirname, '../data')

if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'macros.db')
export const db = new DatabaseSync(dbPath)

// Optimize SQLite for high performance
db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA synchronous = NORMAL;')
db.exec('PRAGMA foreign_keys = ON;')

export function initDatabase() {
	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			username TEXT UNIQUE NOT NULL COLLATE NOCASE,
			email TEXT UNIQUE COLLATE NOCASE,
			password_hash TEXT,
			avatar_url TEXT,
			bio TEXT DEFAULT '',
			role TEXT DEFAULT 'user',
			badges INTEGER DEFAULT 0,
			minecraft_uuid TEXT,
			minecraft_username TEXT,
			google_id TEXT UNIQUE,
			created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
			updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
		);

		CREATE TABLE IF NOT EXISTS sessions (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			client_type TEXT DEFAULT 'launcher',
			expires_at TEXT NOT NULL,
			created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
		);

		CREATE TABLE IF NOT EXISTS friends (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			friend_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			accepted INTEGER NOT NULL DEFAULT 0,
			created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
			UNIQUE(user_id, friend_id)
		);

		CREATE TABLE IF NOT EXISTS shared_instances (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			icon_path TEXT,
			quarantine INTEGER DEFAULT 0,
			created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
			updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
		);

		CREATE TABLE IF NOT EXISTS shared_instance_versions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			instance_id TEXT NOT NULL REFERENCES shared_instances(id) ON DELETE CASCADE,
			version INTEGER NOT NULL,
			game_version TEXT NOT NULL,
			loader TEXT NOT NULL,
			loader_version TEXT NOT NULL,
			modpack_id TEXT,
			modrinth_ids_json TEXT DEFAULT '[]',
			external_files_json TEXT DEFAULT '[]',
			ready INTEGER DEFAULT 1,
			created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
			UNIQUE(instance_id, version)
		);

		CREATE TABLE IF NOT EXISTS shared_instance_users (
			id TEXT PRIMARY KEY,
			instance_id TEXT NOT NULL REFERENCES shared_instances(id) ON DELETE CASCADE,
			user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			role TEXT DEFAULT 'member',
			created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
			UNIQUE(instance_id, user_id)
		);

		CREATE TABLE IF NOT EXISTS shared_instance_invites (
			id TEXT PRIMARY KEY,
			instance_id TEXT NOT NULL REFERENCES shared_instances(id) ON DELETE CASCADE,
			created_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			max_uses INTEGER DEFAULT 0,
			uses INTEGER DEFAULT 0,
			expires_at TEXT,
			created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
		);

		CREATE TABLE IF NOT EXISTS playtime_records (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			instance_name TEXT NOT NULL,
			duration_seconds INTEGER NOT NULL,
			recorded_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
		);

		CREATE TABLE IF NOT EXISTS notifications (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			type TEXT NOT NULL,
			title TEXT NOT NULL,
			body TEXT NOT NULL,
			data_json TEXT DEFAULT '{}',
			read INTEGER DEFAULT 0,
			created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
		);

		CREATE TABLE IF NOT EXISTS user_preferences (
			user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
			preferences_json TEXT NOT NULL,
			updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
		);

		CREATE TABLE IF NOT EXISTS settings (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS projects (
			id TEXT PRIMARY KEY,
			slug TEXT UNIQUE NOT NULL COLLATE NOCASE,
			title TEXT NOT NULL,
			description TEXT DEFAULT '',
			body TEXT DEFAULT '',
			project_type TEXT NOT NULL DEFAULT 'mod',
			user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			status TEXT NOT NULL DEFAULT 'approved',
			icon_url TEXT,
			downloads INTEGER DEFAULT 0,
			followers INTEGER DEFAULT 0,
			created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
			updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
		);
	`)
}
