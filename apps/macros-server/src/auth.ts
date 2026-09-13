import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { db } from './db.js'

export interface UserRow {
	id: string
	username: string
	email: string | null
	password_hash: string | null
	avatar_url: string | null
	bio: string
	role: string
	badges: number
	minecraft_uuid: string | null
	minecraft_username: string | null
	google_id: string | null
	created_at: string
	updated_at: string
}

export function generateToken(prefix = 'mra_'): string {
	return prefix + crypto.randomBytes(24).toString('hex')
}

export function hashPassword(password: string): string {
	return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hash: string): boolean {
	return bcrypt.compareSync(password, hash)
}

export function createSession(userId: string, clientType = 'launcher', daysValid = 30): string {
	const token = generateToken()
	const expires = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000).toISOString()
	db.prepare('INSERT INTO sessions (id, user_id, client_type, expires_at) VALUES (?, ?, ?, ?)').run(
		token,
		userId,
		clientType,
		expires
	)
	return token
}

export function getSessionUser(token: string): UserRow | null {
	if (!token) return null
	const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim()
	const session = db
		.prepare('SELECT user_id, expires_at FROM sessions WHERE id = ?')
		.get(cleanToken) as { user_id: string; expires_at: string } | undefined

	if (!session) return null

	if (new Date(session.expires_at).getTime() < Date.now()) {
		db.prepare('DELETE FROM sessions WHERE id = ?').run(cleanToken)
		return null
	}

	const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id) as UserRow | undefined
	return user || null
}

export function formatPublicUser(user: UserRow) {
	let avatar = user.avatar_url
	if (avatar && avatar.startsWith('/')) {
		avatar = `https://macrosapp.1337.cx${avatar}`
	}
	return {
		id: user.id,
		username: user.username,
		name: user.username,
		email: user.email,
		avatar_url: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username)}`,
		bio: user.bio || '',
		created: user.created_at ? new Date(user.created_at).toISOString() : new Date().toISOString(),
		role: user.role || 'user',
		badges: user.badges || 0,
		minecraft_uuid: user.minecraft_uuid,
		minecraft_username: user.minecraft_username
	}
}
