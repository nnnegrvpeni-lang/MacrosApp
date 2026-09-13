import Fastify from 'fastify'
import cors from '@fastify/cors'
import formbody from '@fastify/formbody'
import fastifyStatic from '@fastify/static'
import fastifyWebsocket from '@fastify/websocket'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

import { db, initDatabase } from './db.js'
import {
	createSession,
	formatPublicUser,
	generateToken,
	getSessionUser,
	hashPassword,
	type UserRow,
	verifyPassword
} from './auth.js'
import { handleSocketConnection, notifyUser, isUserOnline } from './socket.js'
import { renderAccountHtml, renderAuthHtml, renderCatalogHtml, renderDashboardProjectsHtml, renderDownloadHtml,
	renderPublicUserProfileHtml, renderLandingHtml, renderModPageHtml, renderSettingsHtml, renderShareHtml } from './web.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = process.env.DATA_DIR || path.join(__dirname, '../data')
const publicDir = path.join(__dirname, '../public')
const uploadsDir = path.join(dataDir, 'uploads')

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })
const downloadsDir = path.join(publicDir, 'downloads')
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true })

initDatabase()

const server = Fastify({
	logger: true,
	bodyLimit: 64 * 1024 * 1024 // 64 MB
})

server.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body: string, done) => {
	if (!body || body.trim() === '') {
		return done(null, {})
	}
	try {
		done(null, JSON.parse(body))
	} catch (err) {
		done(err as Error)
	}
})

// Enable raw octet-stream body parsing for file uploads
server.addContentTypeParser(
	['application/octet-stream', 'image/png', 'image/jpeg', 'application/zip'],
	{ parseAs: 'buffer' },
	(req, body, done) => {
		done(null, body)
	}
)

await server.register(cors, {
	origin: true,
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
})

await server.register(formbody)
await server.register(fastifyWebsocket)

await server.register(fastifyStatic, {
	root: publicDir,
	prefix: '/assets/'
})

server.get('/favicon.ico', async (req, reply) => {
	const faviconPath = path.join(publicDir, 'favicon.png')
	if (fs.existsSync(faviconPath)) {
		reply.type('image/png')
		return reply.send(fs.readFileSync(faviconPath))
	}
	return reply.status(404).send()
})

server.get('/assets/icons/:filename', async (req, reply) => {
	const { filename } = req.params as { filename: string }
	const iconPath = path.join(uploadsDir, filename)
	if (fs.existsSync(iconPath)) {
		reply.type('image/png')
		return reply.send(fs.createReadStream(iconPath))
	}
	return reply.status(404).send()
})

// Helper to extract authenticated user
function authUser(req: any): UserRow | null {
	const authHeader = (req.headers.authorization as string) || (req.headers['x-modrinth-session'] as string)
	if (authHeader) {
		const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader
		const user = getSessionUser(token)
		if (user) return user
	}
	const cookieHeader = req.headers.cookie as string | undefined
	if (cookieHeader) {
		const match = cookieHeader.match(/macros_session=([^;]+)/)
		if (match) {
			const token = decodeURIComponent(match[1].trim())
			const user = getSessionUser(token)
			if (user) return user
		}
	}
	return null
}

// ----------------------------------------------------------------------
// WebSocket Endpoint
// ----------------------------------------------------------------------
server.get('/_internal/launcher_socket', { websocket: true }, (socket, req) => {
	const query = req.query as { code?: string }
	const token = query.code || ''
	handleSocketConnection(socket, token)
})

server.get('/ws', { websocket: true }, (socket, req) => {
	const query = req.query as { token?: string; code?: string }
	const token = query.token || query.code || ''
	handleSocketConnection(socket, token)
})

// ----------------------------------------------------------------------
// Rate Limiter for Authentication (Brute-Force Protection)
// ----------------------------------------------------------------------
interface RateLimitRecord {
	count: number
	resetAt: number
}
const authRateLimits = new Map<string, RateLimitRecord>()

function checkRateLimit(ip: string, maxAttempts = 15, windowMs = 60 * 1000): boolean {
	const now = Date.now()
	const record = authRateLimits.get(ip)
	if (!record || now > record.resetAt) {
		authRateLimits.set(ip, { count: 1, resetAt: now + windowMs })
		return true
	}
	if (record.count >= maxAttempts) {
		return false
	}
	record.count++
	return true
}

setInterval(() => {
	const now = Date.now()
	for (const [ip, record] of authRateLimits.entries()) {
		if (now > record.resetAt) authRateLimits.delete(ip)
	}
}, 5 * 60 * 1000)

// ----------------------------------------------------------------------
// Auth & User API
// ----------------------------------------------------------------------
server.post('/api/v1/auth/register', async (req, reply) => {
	if (!checkRateLimit(req.ip)) {
		return reply.status(429).send({ error: 'Слишком много попыток. Подождите минуту и повторите.' })
	}
	const { username, email, password } = req.body as any
	if (!username || !password) {
		return reply.status(400).send({ error: 'Username and password required' })
	}

	const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email || '')
	if (existing) {
		return reply.status(400).send({ error: 'Username or email already in use' })
	}

	const userId = crypto.randomUUID()
	const hash = hashPassword(password)

	db.prepare(
		'INSERT INTO users (id, username, email, password_hash, badges) VALUES (?, ?, ?, ?, ?)'
	).run(userId, username, email || null, hash, 1) // 1 = Early Adopter badge

	const token = createSession(userId)
	const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as unknown as UserRow

	reply.header('Set-Cookie', `macros_session=${token}; Path=/; SameSite=Lax; Max-Age=2592000`)
	return reply.send({
		token,
		session: token,
		user: formatPublicUser(user)
	})
})

server.post('/api/v1/auth/login', async (req, reply) => {
	if (!checkRateLimit(req.ip)) {
		return reply.status(429).send({ error: 'Слишком много попыток. Подождите минуту и повторите.' })
	}
	const { login, password } = req.body as any
	if (!login || !password) {
		return reply.status(400).send({ error: 'Login and password required' })
	}

	const user = db
		.prepare('SELECT * FROM users WHERE username = ? OR email = ?')
		.get(login, login) as UserRow | undefined

	if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
		return reply.status(401).send({ error: 'Invalid username/email or password' })
	}

	const token = createSession(user.id)
	reply.header('Set-Cookie', `macros_session=${token}; Path=/; SameSite=Lax; Max-Age=2592000`)
	return reply.send({
		token,
		session: token,
		user: formatPublicUser(user)
	})
})

server.post('/api/v1/auth/google', async (req, reply) => {
	const { credential, email, name, google_id } = req.body as any
	let userEmail = email
	let userName = name || 'GoogleUser'
	let gId = google_id

	// If a credential JWT was passed from Google Identity Services
	if (credential) {
		try {
			// Decode JWT payload without external library
			const parts = credential.split('.')
			if (parts.length === 3) {
				const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'))
				userEmail = payload.email
				userName = payload.name || payload.email.split('@')[0]
				gId = payload.sub
			}
		} catch (e) {
			return reply.status(400).send({ error: 'Invalid Google credential' })
		}
	}

	if (!gId && !userEmail) {
		return reply.status(400).send({ error: 'Google authentication data missing' })
	}

	let user = db.prepare('SELECT * FROM users WHERE google_id = ? OR email = ?').get(gId, userEmail) as
		| UserRow
		| undefined

	if (!user) {
		const userId = crypto.randomUUID()
		let baseUsername = userName.replace(/[^a-zA-Z0-9_-]/g, '') || 'User'
		let username = baseUsername
		let counter = 1
		while (db.prepare('SELECT id FROM users WHERE username = ?').get(username)) {
			username = `${baseUsername}${counter++}`
		}

		db.prepare(
			'INSERT INTO users (id, username, email, google_id, badges) VALUES (?, ?, ?, ?, ?)'
		).run(userId, username, userEmail || null, gId, 1)

		user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as unknown as UserRow
	}

	const token = createSession(user.id)
	reply.header('Set-Cookie', `macros_session=${token}; Path=/; SameSite=Lax; Max-Age=2592000`)
	return reply.send({
		token,
		session: token,
		user: formatPublicUser(user)
	})
})

function getGoogleCredentials() {
	const dbClientId = db.prepare('SELECT value FROM settings WHERE key = ?').get('google_client_id') as
		| { value: string }
		| undefined
	const dbClientSecret = db.prepare('SELECT value FROM settings WHERE key = ?').get('google_client_secret') as
		| { value: string }
		| undefined
	return {
		clientId: dbClientId?.value || process.env.GOOGLE_CLIENT_ID || '',
		clientSecret: dbClientSecret?.value || process.env.GOOGLE_CLIENT_SECRET || ''
	}
}

server.get('/api/v1/auth/google/login', async (req, reply) => {
	const query = (req.query as any) || {}
	const { clientId } = getGoogleCredentials()

	const scheme = (req.headers['x-forwarded-proto'] as string) || 'https'
	const host = (req.headers['x-forwarded-host'] as string) || (req.headers.host as string) || 'macrosapp.1337.cx'
	const redirectUri = `${scheme}://${host}/api/v1/auth/google/callback`

	if (!clientId) {
		reply.type('text/html; charset=utf-8')
		return reply.send(`<!DOCTYPE html>
<html lang="ru" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Вход через Google — MacrosApp</title>
	<script src="https://cdn.tailwindcss.com"></script>
	<style>
		body { background-color: #000000; color: #ffffff; font-family: system-ui, -apple-system, sans-serif; }
		.oled-card { background-color: #080808; border: 1px solid #1c1c1e; }
	</style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md oled-card rounded-2xl p-8 text-center">
		<div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-emerald-400">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
		</div>
		<h1 class="text-base font-bold text-white mb-2">Google OAuth в процессе настройки</h1>
		<p class="text-xs text-zinc-400 leading-relaxed mb-6">
			Для работы входа через Google настройте <code class="text-emerald-400 font-mono">GOOGLE_CLIENT_ID</code> на сервере. Регистрация и вход через логин и пароль работают мгновенно.
		</p>
		<a href="/auth/sign-in?${new URLSearchParams(query).toString()}" class="inline-block w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition">
			Вернуться к обычному входу
		</a>
	</div>
</body>
</html>`)
	}

	const stateObj = {
		flow: query.flow || 'web',
		port: query.port || '',
		rand: crypto.randomBytes(8).toString('hex')
	}
	const state = Buffer.from(JSON.stringify(stateObj)).toString('base64url')

	const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
	googleAuthUrl.searchParams.set('client_id', clientId)
	googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
	googleAuthUrl.searchParams.set('response_type', 'code')
	googleAuthUrl.searchParams.set('scope', 'openid email profile')
	googleAuthUrl.searchParams.set('access_type', 'offline')
	googleAuthUrl.searchParams.set('prompt', 'select_account')
	googleAuthUrl.searchParams.set('state', state)

	return reply.redirect(googleAuthUrl.toString())
})

server.get('/api/v1/auth/google/callback', async (req, reply) => {
	const query = (req.query as any) || {}
	const { code, state, error } = query

	let stateObj: { flow?: string; port?: string } = {}
	if (state) {
		try {
			stateObj = JSON.parse(Buffer.from(state, 'base64url').toString('utf-8'))
		} catch {}
	}

	if (error || !code) {
		return reply.redirect(`/auth/sign-in?error=${encodeURIComponent(error || 'Google auth cancelled')}`)
	}

	const { clientId, clientSecret } = getGoogleCredentials()
	const scheme = (req.headers['x-forwarded-proto'] as string) || 'https'
	const host = (req.headers['x-forwarded-host'] as string) || (req.headers.host as string) || 'macrosapp.1337.cx'
	const redirectUri = `${scheme}://${host}/api/v1/auth/google/callback`

	try {
		// Exchange authorization code for tokens
		const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				code,
				client_id: clientId,
				client_secret: clientSecret,
				redirect_uri: redirectUri,
				grant_type: 'authorization_code'
			})
		})

		const tokenData = (await tokenRes.json()) as any
		if (!tokenRes.ok || !tokenData.access_token) {
			req.log.error(tokenData, 'Failed to exchange Google OAuth code')
			return reply.redirect(
				`/auth/sign-in?error=${encodeURIComponent(tokenData.error_description || 'OAuth token exchange failed')}`
			)
		}

		// Fetch userinfo from Google endpoint
		const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
			headers: { Authorization: `Bearer ${tokenData.access_token}` }
		})
		const profile = (await userRes.json()) as any
		if (!userRes.ok || (!profile.sub && !profile.email)) {
			return reply.redirect('/auth/sign-in?error=Failed to retrieve Google profile')
		}

		const gId = profile.sub
		const email = profile.email
		const name = profile.name || profile.given_name || (email ? email.split('@')[0] : 'GoogleUser')
		const picture = profile.picture || null

		let user = db.prepare('SELECT * FROM users WHERE google_id = ? OR email = ?').get(gId, email) as
			| UserRow
			| undefined

		if (!user) {
			const userId = crypto.randomUUID()
			let baseUsername = name.replace(/[^a-zA-Z0-9_-]/g, '') || 'User'
			let username = baseUsername
			let counter = 1
			while (db.prepare('SELECT id FROM users WHERE username = ?').get(username)) {
				username = `${baseUsername}${counter++}`
			}

			db.prepare(
				'INSERT INTO users (id, username, email, google_id, avatar_url, badges) VALUES (?, ?, ?, ?, ?, ?)'
			).run(userId, username, email || null, gId, picture, 1)

			user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as unknown as UserRow
		} else if (picture && !user.avatar_url) {
			db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(picture, user.id)
			user.avatar_url = picture
		}

		if (stateObj.port) {
			const launcherToken = createSession(user.id, 'launcher', 180)
			const webToken = createSession(user.id, 'web', 30)
			reply.header('Set-Cookie', `macros_session=${webToken}; Path=/; SameSite=Lax; Max-Age=2592000`)
			reply.type('text/html; charset=utf-8')
			return reply.send(`<!doctype html><html><head><meta charset="utf-8"></head><body>
<script>
window.location.href = 'http://127.0.0.1:${stateObj.port}/?code=' + encodeURIComponent(${JSON.stringify(launcherToken)});
</script>
</body></html>`)
		}

		const sessionToken = createSession(user.id, 'web', 30)
		reply.header('Set-Cookie', `macros_session=${sessionToken}; Path=/; SameSite=Lax; Max-Age=2592000`)

		return reply.redirect('/account')
	} catch (err: any) {
		req.log.error(err, 'Google OAuth callback exception')
		return reply.redirect(`/auth/sign-in?error=${encodeURIComponent('Ошибка обработки Google OAuth')}`)
	}
})

server.post('/api/v1/auth/logout', async (req, reply) => {
	const cookieHeader = req.headers.cookie as string | undefined
	if (cookieHeader) {
		const match = cookieHeader.match(/macros_session=([^;]+)/)
		if (match) {
			const token = decodeURIComponent(match[1].trim())
			db.prepare("DELETE FROM sessions WHERE id = ? AND client_type != 'launcher'").run(token)
		}
	}
	const authHeader = req.headers.authorization as string | undefined
	if (authHeader) {
		const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader
		db.prepare("DELETE FROM sessions WHERE id = ?").run(token)
	}
	reply.header('Set-Cookie', 'macros_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax')
	return reply.send({ success: true })
})

server.get('/api/v1/config', async (req, reply) => {
	const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('google_client_id') as
		| { value: string }
		| undefined
	return reply.send({
		google_client_id: row?.value || process.env.GOOGLE_CLIENT_ID || ''
	})
})

server.post('/api/v1/config', async (req, reply) => {
	const { google_client_id, google_client_secret } = (req.body as any) || {}
	if (typeof google_client_id === 'string') {
		db.prepare(
			'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
		).run('google_client_id', google_client_id.trim())
	}
	if (typeof google_client_secret === 'string') {
		db.prepare(
			'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
		).run('google_client_secret', google_client_secret.trim())
	}
	return reply.send({ success: true })
})

async function handleUserProfileUpdate(req: any, reply: any, targetUserId?: string) {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'Unauthorized' })
	if (targetUserId && targetUserId !== user.id && targetUserId !== user.username && user.role !== 'admin') {
		return reply.status(403).send({ error: 'Forbidden' })
	}

	const { username, bio, minecraft_username, avatar_url, password, old_password } = (req.body as any) || {}

	// Update username if requested
	if (username !== undefined && typeof username === 'string') {
		const cleanUsername = username.trim()
		if (cleanUsername.length < 3 || cleanUsername.length > 25) {
			return reply.status(400).send({ error: 'Username must be between 3 and 25 characters' })
		}
		if (!/^[a-zA-Z0-9_\-\.а-яА-ЯёЁ]+$/u.test(cleanUsername)) {
			return reply.status(400).send({ error: 'Username can only contain letters, numbers, underscores, dashes and dots' })
		}
		const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?) AND id != ?').get(cleanUsername, user.id)
		if (existing) {
			return reply.status(400).send({ error: 'Username is already taken' })
		}
		db.prepare("UPDATE users SET username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(cleanUsername, user.id)
	}

	// Update password if requested
	if (password !== undefined && typeof password === 'string' && password.trim() !== '') {
		const cleanPass = password.trim()
		if (cleanPass.length < 6) {
			return reply.status(400).send({ error: 'Password must be at least 6 characters' })
		}
		if (user.password_hash) {
			if (!old_password || !verifyPassword(old_password, user.password_hash)) {
				return reply.status(400).send({ error: 'Incorrect current password' })
			}
		}
		const newHash = hashPassword(cleanPass)
		db.prepare("UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(newHash, user.id)
	}

	if (bio !== undefined) {
		db.prepare("UPDATE users SET bio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(String(bio).slice(0, 500), user.id)
	}
	if (minecraft_username !== undefined) {
		db.prepare("UPDATE users SET minecraft_username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(String(minecraft_username).trim(), user.id)
	}
	if (avatar_url !== undefined) {
		let finalAvatarUrl = String(avatar_url).trim()
		if (finalAvatarUrl.startsWith('data:image/')) {
			try {
				const avatarsDir = path.join(publicDir, 'avatars')
				if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true })
				const base64Data = finalAvatarUrl.replace(/^data:image\/\w+;base64,/, '')
				const buffer = Buffer.from(base64Data, 'base64')
				const filename = `${user.id}.png`
				fs.writeFileSync(path.join(avatarsDir, filename), buffer)
				finalAvatarUrl = `/assets/avatars/${filename}?v=${Date.now()}`
			} catch (err) {
				req.log.error(err, 'Failed to save base64 avatar to file')
			}
		}
		db.prepare("UPDATE users SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(finalAvatarUrl, user.id)
	}

	const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id) as unknown as UserRow
	return reply.send(formatPublicUser(updated))
}

server.patch('/api/v1/user/profile', (req, reply) => handleUserProfileUpdate(req, reply))
server.post('/api/v1/user/profile', (req, reply) => handleUserProfileUpdate(req, reply))
server.patch('/v2/user/:id', (req, reply) => {
	const { id } = req.params as { id: string }
	return handleUserProfileUpdate(req, reply, id)
})
server.patch('/v2/user', (req, reply) => handleUserProfileUpdate(req, reply))

async function handleUserIconUpload(req: any, reply: any) {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	const { id } = req.params as { id: string }
	if (id && id !== user.id && id !== user.username && user.role !== 'admin') {
		return reply.status(403).send({ error: 'forbidden' })
	}

	const buffer = req.body as Buffer
	if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
		return reply.status(400).send({ error: 'bad_request', description: 'No image data provided' })
	}

	const query = (req.query as any) || {}
	const ext = (query.ext || 'png').replace(/[^a-zA-Z0-9]/g, '') || 'png'
	const filename = `${user.id}.${ext}`
	const avatarsDir = path.join(publicDir, 'avatars')
	if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true })
	fs.writeFileSync(path.join(avatarsDir, filename), buffer)

	const finalAvatarUrl = `/assets/avatars/${filename}?v=${Date.now()}`
	db.prepare('UPDATE users SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(finalAvatarUrl, user.id)

	return reply.send({ success: true, avatar_url: `https://macrosapp.1337.cx${finalAvatarUrl}` })
}

async function handleUserIconDelete(req: any, reply: any) {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	const { id } = req.params as { id: string }
	if (id && id !== user.id && id !== user.username && user.role !== 'admin') {
		return reply.status(403).send({ error: 'forbidden' })
	}

	db.prepare('UPDATE users SET avatar_url = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id)
	return reply.send({ success: true })
}

server.patch('/v2/user/:id/icon', (req, reply) => handleUserIconUpload(req, reply))
server.post('/v2/user/:id/icon', (req, reply) => handleUserIconUpload(req, reply))
server.delete('/v2/user/:id/icon', (req, reply) => handleUserIconDelete(req, reply))

const defaultUserPreferences = {
	appearance: { auto: false, theme: 'dark' },
	behavior: {
		minimize_app: false,
		hide_right_sidebar: false,
		show_jump_in: true,
		compact_instance_cards: false,
		show_play_time: true,
		hide_nametag: false,
		warn_on_unknown_modpacks: true,
		skip_non_essential_warnings: false
	},
	localization: { locale: 'ru-RU' },
	layouts: {
		mods: 'rows',
		plugins: 'rows',
		datapacks: 'rows',
		shaders: 'grid',
		resourcepacks: 'grid',
		modpacks: 'rows',
		servers: 'rows',
		users: 'rows'
	},
	sidebars: {
		right_aligned_search: false,
		left_aligned_content: false
	},
	social: {
		friend_privacy: 'everyone',
		shared_instances_privacy: 'everyone',
		hosting_access_privacy: 'everyone'
	}
}

// Current user profile (v2)
server.get('/v2/user', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'Unauthorized' })
	return reply.send(formatPublicUser(user))
})

// Current user profile (v3)
server.get('/v3/user', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'Unauthorized' })
	return reply.send(formatPublicUser(user))
})

// Single user profile by ID or username (v2)
server.get('/v2/user/:id', async (req, reply) => {
	const { id } = req.params as { id: string }
	const user = db.prepare('SELECT * FROM users WHERE id = ? OR username = ?').get(id, id) as
		| UserRow
		| undefined
	if (user) {
		return reply.send(formatPublicUser(user))
	}
	return proxyToModrinth(req, reply)
})

// Single user profile by ID or username (v3)
server.get('/v3/user/:id', async (req, reply) => {
	const { id } = req.params as { id: string }
	const user = db.prepare('SELECT * FROM users WHERE id = ? OR username = ?').get(id, id) as
		| UserRow
		| undefined
	if (user) {
		return reply.send(formatPublicUser(user))
	}
	return proxyToModrinth(req, reply)
})

// Fetch multiple users by ID or username (v2)
server.get('/v2/users', async (req, reply) => {
	const query = req.query as { ids?: string }
	if (!query.ids) return reply.send([])

	let ids: string[] = []
	try {
		ids = JSON.parse(query.ids)
	} catch {
		ids = query.ids.split(',').map((s) => s.trim())
	}

	if (ids.length === 0) return reply.send([])

	const placeholders = ids.map(() => '?').join(',')
	const rows = db
		.prepare(`SELECT * FROM users WHERE id IN (${placeholders}) OR username IN (${placeholders})`)
		.all(...ids, ...ids) as unknown as UserRow[]

	const localUsers = rows.map(formatPublicUser)
	const foundIds = new Set(localUsers.map((u) => u.id).concat(localUsers.map((u) => u.username)))
	const missingIds = ids.filter((id) => !foundIds.has(id))

	if (missingIds.length > 0) {
		try {
			const mrRes = await fetch(
				`https://api.modrinth.com/v2/users?ids=${encodeURIComponent(JSON.stringify(missingIds))}`,
				{
					headers: { 'User-Agent': (req.headers['user-agent'] as string) || 'MacrosApp/1.0' }
				}
			)
			if (mrRes.ok) {
				const mrUsers = (await mrRes.json()) as any[]
				if (Array.isArray(mrUsers)) {
					return reply.send([...localUsers, ...mrUsers])
				}
			}
		} catch (err) {
			req.log.error(err, 'Failed to fetch upstream users')
		}
	}

	return reply.send(localUsers)
})

// User preferences (v3)
server.get('/v3/user/:id/preferences', async (req, reply) => {
	const { id } = req.params as { id: string }
	const user = db.prepare('SELECT id FROM users WHERE id = ? OR username = ?').get(id, id) as
		| { id: string }
		| undefined
	if (!user) {
		return proxyToModrinth(req, reply)
	}

	const prefRow = db.prepare('SELECT preferences_json FROM user_preferences WHERE user_id = ?').get(user.id) as
		| { preferences_json: string }
		| undefined
	if (prefRow) {
		try {
			const saved = JSON.parse(prefRow.preferences_json)
			return reply.send({
				...defaultUserPreferences,
				...saved,
				appearance: { ...defaultUserPreferences.appearance, ...(saved.appearance || {}) },
				behavior: { ...defaultUserPreferences.behavior, ...(saved.behavior || {}) },
				localization: { ...defaultUserPreferences.localization, ...(saved.localization || {}) },
				layouts: { ...defaultUserPreferences.layouts, ...(saved.layouts || {}) },
				sidebars: { ...defaultUserPreferences.sidebars, ...(saved.sidebars || {}) },
				social: { ...defaultUserPreferences.social, ...(saved.social || {}) }
			})
		} catch {}
	}
	return reply.send(defaultUserPreferences)
})

server.patch('/v3/user/:id/preferences', async (req, reply) => {
	const { id } = req.params as { id: string }
	const auth = authUser(req)
	const user = db.prepare('SELECT id FROM users WHERE id = ? OR username = ?').get(id, id) as
		| { id: string }
		| undefined
	if (!user) {
		return proxyToModrinth(req, reply)
	}
	if (auth && auth.id !== user.id && auth.role !== 'admin') {
		return reply.status(403).send({ error: 'Forbidden' })
	}

	const patch = (req.body as any) || {}
	const prefRow = db.prepare('SELECT preferences_json FROM user_preferences WHERE user_id = ?').get(user.id) as
		| { preferences_json: string }
		| undefined
	let current = defaultUserPreferences
	if (prefRow) {
		try {
			current = { ...defaultUserPreferences, ...JSON.parse(prefRow.preferences_json) }
		} catch {}
	}

	const updated = {
		...current,
		...patch,
		appearance: { ...current.appearance, ...(patch.appearance || {}) },
		behavior: { ...current.behavior, ...(patch.behavior || {}) },
		localization: { ...current.localization, ...(patch.localization || {}) },
		layouts: { ...current.layouts, ...(patch.layouts || {}) },
		sidebars: { ...current.sidebars, ...(patch.sidebars || {}) },
		social: { ...current.social, ...(patch.social || {}) }
	}

	db.prepare(
		`INSERT INTO user_preferences (user_id, preferences_json, updated_at)
		VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
		ON CONFLICT(user_id) DO UPDATE SET
			preferences_json = excluded.preferences_json,
			updated_at = excluded.updated_at`
	).run(user.id, JSON.stringify(updated))

	return reply.send(updated)
})

// User projects, notifications, organizations, collections, follows stubs for local users
server.get('/v2/user/:id/projects', async (req, reply) => {
	const { id } = req.params as { id: string }
	const targetUser = db.prepare('SELECT id FROM users WHERE id = ? OR username = ?').get(id, id) as any
	if (targetUser) {
		const rows = db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC').all(targetUser.id)
		return reply.send(rows)
	}
	return proxyToModrinth(req, reply)
})

server.get('/v3/user/:id/projects', async (req, reply) => {
	const { id } = req.params as { id: string }
	const targetUser = db.prepare('SELECT id FROM users WHERE id = ? OR username = ?').get(id, id) as any
	if (targetUser) {
		const rows = db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC').all(targetUser.id)
		return reply.send(rows)
	}
	return proxyToModrinth(req, reply)
})

server.get('/v2/user/:id/notifications', async (req, reply) => {
	const { id } = req.params as { id: string }
	const user = db.prepare('SELECT id FROM users WHERE id = ? OR username = ?').get(id, id)
	if (user) return reply.send([])
	return proxyToModrinth(req, reply)
})

server.get('/v3/user/:id/notifications', async (req, reply) => {
	const { id } = req.params as { id: string }
	const user = db.prepare('SELECT id FROM users WHERE id = ? OR username = ?').get(id, id)
	if (user) return reply.send([])
	return proxyToModrinth(req, reply)
})

server.get('/v2/user/:id/follows', async (req, reply) => {
	const { id } = req.params as { id: string }
	const user = db.prepare('SELECT id FROM users WHERE id = ? OR username = ?').get(id, id)
	if (user) return reply.send([])
	return proxyToModrinth(req, reply)
})

server.get('/v3/user/:id/follows', async (req, reply) => {
	const { id } = req.params as { id: string }
	const user = db.prepare('SELECT id FROM users WHERE id = ? OR username = ?').get(id, id)
	if (user) return reply.send([])
	return proxyToModrinth(req, reply)
})

server.get('/v2/user/:id/payouts', async (req, reply) => {
	const { id } = req.params as { id: string }
	const user = db.prepare('SELECT id FROM users WHERE id = ? OR username = ?').get(id, id)
	if (user) return reply.send({ balance: 0, payouts: [] })
	return proxyToModrinth(req, reply)
})

server.get('/v3/user/:id/organizations', async (req, reply) => {
	const { id } = req.params as { id: string }
	const user = db.prepare('SELECT id FROM users WHERE id = ? OR username = ?').get(id, id)
	if (user) return reply.send([])
	return proxyToModrinth(req, reply)
})

server.get('/v3/user/:id/collections', async (req, reply) => {
	const { id } = req.params as { id: string }
	const user = db.prepare('SELECT id FROM users WHERE id = ? OR username = ?').get(id, id)
	if (user) return reply.send([])
	return proxyToModrinth(req, reply)
})

server.get('/v3/user/:id/all-projects', async (req, reply) => {
	const { id } = req.params as { id: string }
	const user = db.prepare('SELECT id FROM users WHERE id = ? OR username = ?').get(id, id)
	if (user) return reply.send({ projects: [], total_count: 0 })
	return proxyToModrinth(req, reply)
})

server.get('/v3/users/search', async (req, reply) => {
	const { query } = (req.query as { query?: string }) || {}
	if (!query) return reply.send([])
	const rows = db
		.prepare('SELECT id, username, avatar_url FROM users WHERE username LIKE ? LIMIT 20')
		.all(`%${query}%`) as any[]
	return reply.send(
		rows.map((r) => {
			let avatar = r.avatar_url
			if (avatar && avatar.startsWith('/')) {
				avatar = `https://macrosapp.1337.cx${avatar}`
			}
			return {
				id: r.id,
				username: r.username,
				avatar_url: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(r.username)}`
			}
		})
	)
})

// Session refresh
server.post('/v2/session/refresh', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'Unauthorized' })
	const token = createSession(user.id)
	return reply.send({ session: token })
})


// General notifications stubs
server.get('/v2/notifications', async (req, reply) => {
	return reply.send([])
})

server.get('/v3/notifications', async (req, reply) => {
	return reply.send([])
})

server.patch('/v2/notifications', async (req, reply) => {
	return reply.send({ success: true })
})

server.patch('/v3/notifications', async (req, reply) => {
	return reply.send({ success: true })
})

server.patch('/v2/notification/:id', async (req, reply) => {
	return reply.send({ success: true })
})

server.patch('/v3/notification/:id', async (req, reply) => {
	return reply.send({ success: true })
})

// ----------------------------------------------------------------------
// Friends API
// ----------------------------------------------------------------------
server.get('/v3/friends', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	const rows = db
		.prepare(
			`
			SELECT f.id as request_id, f.user_id, f.friend_id, f.accepted, f.created_at,
			       u_sender.username as sender_username, u_sender.avatar_url as sender_avatar,
			       u_recipient.username as recipient_username, u_recipient.avatar_url as recipient_avatar
			FROM friends f
			LEFT JOIN users u_sender ON u_sender.id = f.user_id
			LEFT JOIN users u_recipient ON u_recipient.id = f.friend_id
			WHERE f.user_id = ? OR f.friend_id = ?
		`
		)
		.all(user.id, user.id) as any[]

	return reply.send(
		rows.map((r) => {
			const isIncoming = !r.accepted && r.friend_id === user.id
			const isOutgoing = !r.accepted && r.user_id === user.id
			const otherUser = r.user_id === user.id
				? { id: r.friend_id, username: r.recipient_username, avatar_url: r.recipient_avatar }
				: { id: r.user_id, username: r.sender_username, avatar_url: r.sender_avatar }

			let avatar = otherUser.avatar_url
			if (avatar && avatar.startsWith('/')) {
				avatar = `https://macrosapp.1337.cx${avatar}`
			}
			if (!avatar) {
				avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(otherUser.username || otherUser.id)}`
			}

			return {
				id: r.friend_id,
				friend_id: r.user_id,
				accepted: Boolean(r.accepted),
				created: new Date(r.created_at || Date.now()).toISOString(),
				is_incoming: isIncoming,
				is_outgoing: isOutgoing,
				other_id: otherUser.id,
				username: otherUser.username || otherUser.id,
				avatar_url: avatar
			}
		})
	)
})

server.post('/v3/friend/:friend_id', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	let { friend_id } = req.params as { friend_id: string }
	try {
		friend_id = decodeURIComponent(friend_id).trim()
	} catch {}

	const target = db
		.prepare('SELECT * FROM users WHERE id = ? OR LOWER(username) = LOWER(?) OR LOWER(minecraft_username) = LOWER(?)')
		.get(friend_id, friend_id, friend_id) as UserRow | undefined

	if (!target) {
		return reply.status(404).send({
			error: 'not_found',
			description: `Пользователь "${friend_id}" не найден`
		})
	}
	if (target.id === user.id) {
		return reply.status(400).send({
			error: 'bad_request',
			description: 'Нельзя добавить самого себя в друзья'
		})
	}

	const existing = db
		.prepare(
			'SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)'
		)
		.get(user.id, target.id, target.id, user.id) as any

	if (existing) {
		if (existing.user_id === target.id && !existing.accepted) {
			// Accept incoming request
			db.prepare('UPDATE friends SET accepted = 1 WHERE id = ?').run(existing.id)
			notifyUser(target.id, {
				type: 'friend_request_accepted',
				from: user.id,
				body: { type: 'friend_request_accepted', from: user.id }
			})
		}
		return reply.status(204).send()
	}

	// Create new friend request
	const id = crypto.randomUUID()
	db.prepare('INSERT INTO friends (id, user_id, friend_id, accepted) VALUES (?, ?, ?, 0)').run(
		id,
		user.id,
		target.id
	)

	// Send real-time websocket alert
	notifyUser(target.id, {
		type: 'friend_request',
		from: user.id,
		body: { type: 'friend_request', from: user.id }
	})

	return reply.status(204).send()
})

server.delete('/v3/friend/:friend_id', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	let { friend_id } = req.params as { friend_id: string }
	try {
		friend_id = decodeURIComponent(friend_id).trim()
	} catch {}

	const target = db
		.prepare('SELECT id FROM users WHERE id = ? OR LOWER(username) = LOWER(?) OR LOWER(minecraft_username) = LOWER(?)')
		.get(friend_id, friend_id, friend_id) as { id: string } | undefined
	const targetId = target ? target.id : friend_id

	db.prepare(
		'DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)'
	).run(user.id, targetId, targetId, user.id)

	notifyUser(targetId, {
		type: 'friend_removed',
		from: user.id,
		body: { type: 'friend_removed', from: user.id }
	})
	return reply.status(204).send()
})

server.get('/v3/blocks', async () => [])
server.post('/v3/block/:target_id', async (req, reply) => reply.status(204).send())
server.delete('/v3/block/:target_id', async (req, reply) => reply.status(204).send())

// ----------------------------------------------------------------------
// Shared Instances & Blacklist API (supports both /v1/... and /...)
// ----------------------------------------------------------------------
const registerInstanceRoute = (
	method: 'get' | 'post' | 'patch' | 'delete' | 'put',
	routePath: string,
	handler: (req: any, reply: any) => any
) => {
	server[method](routePath, handler)
	server[method]('/v1' + routePath, handler)
}

// User Blacklist Status
registerInstanceRoute('get', '/blacklist/:user_id', async (req, reply) => {
	return reply.send({ blacklisted: false })
})

// Create Instance
registerInstanceRoute('post', '/instances', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	const { name } = (req.body as { name: string }) || {}
	const id = crypto.randomUUID()

	db.prepare('INSERT INTO shared_instances (id, name, owner_id) VALUES (?, ?, ?)').run(
		id,
		name || 'Instance',
		user.id
	)
	db.prepare('INSERT INTO shared_instance_users (id, instance_id, user_id, role) VALUES (?, ?, ?, ?)').run(
		crypto.randomUUID(),
		id,
		user.id,
		'owner'
	)

	return reply.send({ id })
})

// Get Instance
registerInstanceRoute('get', '/instances/:id', async (req, reply) => {
	const { id } = req.params as { id: string }
	const instance = db.prepare('SELECT * FROM shared_instances WHERE id = ?').get(id) as any
	if (!instance) return reply.status(404).send({ error: 'not_found', description: 'Instance not found' })

	return reply.send({
		id: instance.id,
		name: instance.name,
		quarantine: Boolean(instance.quarantine)
	})
})

// Update Instance
registerInstanceRoute('patch', '/instances/:id', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	const { id } = req.params as { id: string }
	const { name } = (req.body as { name: string }) || {}

	db.prepare('UPDATE shared_instances SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name, id)
	return reply.send({ success: true })
})

// Delete Instance
registerInstanceRoute('delete', '/instances/:id', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	const { id } = req.params as { id: string }
	db.prepare('DELETE FROM shared_instances WHERE id = ?').run(id)
	return reply.send({ success: true })
})

// Put Icon
registerInstanceRoute('put', '/instances/:id/icon', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	const { id } = req.params as { id: string }
	const buffer = req.body as Buffer
	const iconFilename = `${id}_icon.png`
	const iconPath = path.join(uploadsDir, iconFilename)

	fs.writeFileSync(iconPath, buffer)
	db.prepare('UPDATE shared_instances SET icon_path = ? WHERE id = ?').run(`/assets/icons/${iconFilename}`, id)

	return reply.send({ success: true })
})

// Delete Icon
registerInstanceRoute('delete', '/instances/:id/icon', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	const { id } = req.params as { id: string }
	db.prepare('UPDATE shared_instances SET icon_path = NULL WHERE id = ?').run(id)
	return reply.send({ success: true })
})

// Get Latest Version
registerInstanceRoute('get', '/instances/:id/versions', async (req, reply) => {
	const { id } = req.params as { id: string }
	const version = db
		.prepare('SELECT * FROM shared_instance_versions WHERE instance_id = ? ORDER BY version DESC LIMIT 1')
		.get(id) as any

	if (!version) {
		return reply.status(404).send({ error: 'not_found', description: 'No version found' })
	}

	return reply.send({
		version: version.version,
		modrinth_ids: JSON.parse(version.modrinth_ids_json || '[]'),
		ready: Boolean(version.ready),
		external_files: JSON.parse(version.external_files_json || '[]'),
		modpack_id: version.modpack_id,
		game_version: version.game_version,
		loader: version.loader,
		loader_version: version.loader_version
	})
})

// Post Version
registerInstanceRoute('post', '/instances/:id/versions', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	const { id } = req.params as { id: string }
	const { modrinth_ids, external_files, modpack_id, game_version, loader, loader_version } =
		(req.body as any) || {}

	const latest = db
		.prepare('SELECT MAX(version) as max_v FROM shared_instance_versions WHERE instance_id = ?')
		.get(id) as { max_v: number | null }
	const newVersion = (latest.max_v || 0) + 1

	const host = req.headers.host || 'macrosapp.1337.cx'
	const scheme = req.headers['x-forwarded-proto'] || 'https'

	// Generate external files with upload URLs
	const uploadFiles = (external_files || []).map((f: any) => ({
		file_name: f.file_name,
		file_type: f.file_type,
		url: `${scheme}://${host}/v1/instances/${id}/files/${newVersion}/${encodeURIComponent(f.file_name)}`
	}))

	db.prepare(
		`INSERT INTO shared_instance_versions 
		(instance_id, version, game_version, loader, loader_version, modpack_id, modrinth_ids_json, external_files_json, ready)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	).run(
		id,
		newVersion,
		game_version || '1.20.1',
		loader || 'fabric',
		loader_version || '',
		modpack_id || null,
		JSON.stringify(modrinth_ids || []),
		JSON.stringify(uploadFiles),
		uploadFiles.length === 0 ? 1 : 0
	)

	return reply.send({
		version: newVersion,
		modrinth_ids: modrinth_ids || [],
		ready: uploadFiles.length === 0,
		external_files: uploadFiles,
		modpack_id: modpack_id || null,
		game_version: game_version || '1.20.1',
		loader: loader || 'fabric',
		loader_version: loader_version || ''
	})
})

// Put File
registerInstanceRoute('put', '/instances/:id/files/:version/:file_name', async (req, reply) => {
	const { id, version, file_name } = req.params as { id: string; version: string; file_name: string }
	const instanceDir = path.join(uploadsDir, id, version)
	if (!fs.existsSync(instanceDir)) fs.mkdirSync(instanceDir, { recursive: true })

	const filePath = path.join(instanceDir, file_name)
	fs.writeFileSync(filePath, req.body as Buffer)

	// Mark version ready
	db.prepare('UPDATE shared_instance_versions SET ready = 1 WHERE instance_id = ? AND version = ?').run(
		id,
		version
	)

	return reply.send({ success: true })
})

// Get File
registerInstanceRoute('get', '/instances/:id/files/:version/:file_name', async (req, reply) => {
	const { id, version, file_name } = req.params as { id: string; version: string; file_name: string }
	const filePath = path.join(uploadsDir, id, version, file_name)
	if (!fs.existsSync(filePath)) {
		return reply.status(404).send({ error: 'not_found', description: 'File not found' })
	}

	const stream = fs.createReadStream(filePath)
	reply.header('Content-Type', 'application/octet-stream')
	reply.header('Content-Disposition', `attachment; filename="${file_name}"`)
	return reply.send(stream)
})

// Get Users
registerInstanceRoute('get', '/instances/:id/users', async (req, reply) => {
	const { id } = req.params as { id: string }
	const rows = db
		.prepare('SELECT user_id, role FROM shared_instance_users WHERE instance_id = ?')
		.all(id) as { user_id: string; role: string }[]

	return reply.send({
		users: rows.map((r) => ({
			id: r.user_id,
			join_type: r.role === 'owner' ? 'owner' : 'invite'
		})),
		tokens: 0
	})
})

// Add Users
registerInstanceRoute('post', '/instances/:id/users', async (req, reply) => {
	const { id } = req.params as { id: string }
	const { user_ids } = (req.body as { user_ids: string[] }) || {}
	for (const uid of user_ids || []) {
		db.prepare(
			'INSERT OR IGNORE INTO shared_instance_users (id, instance_id, user_id, role) VALUES (?, ?, ?, "member")'
		).run(crypto.randomUUID(), id, uid)
	}
	return reply.send({ success: true })
})

// Remove Users
registerInstanceRoute('delete', '/instances/:id/users', async (req, reply) => {
	const { id } = req.params as { id: string }
	const { user_ids } = (req.body as { user_ids: string[] }) || {}
	for (const uid of user_ids || []) {
		db.prepare('DELETE FROM shared_instance_users WHERE instance_id = ? AND user_id = ?').run(id, uid)
	}
	return reply.send({ success: true })
})

// Post Invite
registerInstanceRoute('post', '/instances/:id/invites', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	const { id } = req.params as { id: string }
	const inviteCode = crypto.randomBytes(6).toString('hex')

	db.prepare(
		'INSERT INTO shared_instance_invites (id, instance_id, created_by, max_uses, uses) VALUES (?, ?, ?, 0, 0)'
	).run(inviteCode, id, user.id)

	return reply.send({ id: inviteCode })
})

// Get Invites
registerInstanceRoute('get', '/instances/:id/invites', async (req, reply) => {
	const { id } = req.params as { id: string }
	const invites = db
		.prepare('SELECT id, max_uses, uses, created_at FROM shared_instance_invites WHERE instance_id = ?')
		.all(id) as any[]

	return reply.send(
		invites.map((i) => ({
			id: i.id,
			expiration: new Date(Date.now() + 86400000 * 30).toISOString(),
			max_uses: i.max_uses || 0,
			uses: i.uses || 0
		}))
	)
})

// Pending Invites
registerInstanceRoute('post', '/instances/:id/invites/pending', async (req, reply) => {
	return reply.status(404).send({ error: 'not_found', description: 'No pending invite' })
})
registerInstanceRoute('delete', '/instances/:id/invites/pending', async (req, reply) => {
	return reply.send({ success: true })
})

// Accept Invite
registerInstanceRoute('post', '/instances/:id/invites/:invite_id', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	const { id, invite_id } = req.params as { id: string; invite_id: string }
	const invite = db
		.prepare('SELECT * FROM shared_instance_invites WHERE id = ? AND instance_id = ?')
		.get(invite_id, id) as any
	if (!invite) return reply.status(404).send({ error: 'not_found', description: 'Invite not found' })

	db.prepare(
		'INSERT OR IGNORE INTO shared_instance_users (id, instance_id, user_id, role) VALUES (?, ?, ?, ?)'
	).run(crypto.randomUUID(), id, user.id, 'member')

	db.prepare('UPDATE shared_instance_invites SET uses = uses + 1 WHERE id = ?').run(invite_id)

	return reply.send({ success: true })
})

// Delete Invite
registerInstanceRoute('delete', '/instances/:id/invites/:invite_id', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'unauthorized', description: 'Unauthorized' })

	const { id, invite_id } = req.params as { id: string; invite_id: string }
	db.prepare('DELETE FROM shared_instance_invites WHERE id = ? AND instance_id = ?').run(invite_id, id)
	return reply.send({ success: true })
})

// Get Invite Info
registerInstanceRoute('get', '/invites/:invite_id', async (req, reply) => {
	const { invite_id } = req.params as { invite_id: string }
	const invite = db.prepare('SELECT * FROM shared_instance_invites WHERE id = ?').get(invite_id) as any
	if (!invite) return reply.status(404).send({ error: 'not_found', description: 'Invite not found' })

	const instance = db.prepare('SELECT * FROM shared_instances WHERE id = ?').get(invite.instance_id) as any
	if (!instance) return reply.status(404).send({ error: 'not_found', description: 'Instance not found' })

	return reply.send({
		instance_id: instance.id,
		instance_name: instance.name,
		instance_icon: instance.icon_path,
		managers: [{ type: 'user', id: invite.created_by }]
	})
})

// ----------------------------------------------------------------------
// Playtime Analytics
// ----------------------------------------------------------------------
server.post('/analytics/playtime', async (req, reply) => {
	const user = authUser(req)
	const { instance_name, duration_seconds } = (req.body as any) || {}
	if (user && instance_name && duration_seconds) {
		db.prepare(
			'INSERT INTO playtime_records (id, user_id, instance_name, duration_seconds) VALUES (?, ?, ?, ?)'
		).run(crypto.randomUUID(), user.id, instance_name, Math.round(Number(duration_seconds)))
	}
	return reply.send({ success: true })
})

// ----------------------------------------------------------------------
// Web Pages (Landing, Auth, Account, Share)
// ----------------------------------------------------------------------
server.get('/', async (req, reply) => {
	const user = authUser(req)
	const html = renderLandingHtml(user ? formatPublicUser(user) : null)
	reply.type('text/html; charset=utf-8')
	return reply.send(html)
})

server.get('/auth/sign-in', async (req, reply) => {
	const user = authUser(req)
	const query = (req.query as any) || {}
	if (user && query.port) {
		const cookieHeader = req.headers.cookie as string | undefined
		let token = ''
		if (cookieHeader) {
			const match = cookieHeader.match(/macros_session=([^;]+)/)
			if (match) token = decodeURIComponent(match[1].trim())
		}
		if (!token) {
			token = createSession(user.id, 'launcher', 30)
		}
		return reply.redirect(`http://127.0.0.1:${query.port}/?code=${encodeURIComponent(token)}`)
	}
	if (user && query.flow !== 'launcher') {
		return reply.redirect('/account')
	}
	const html = renderAuthHtml('sign-in', query)
	reply.type('text/html; charset=utf-8')
	return reply.send(html)
})

server.get('/auth/sign-up', async (req, reply) => {
	const user = authUser(req)
	const query = (req.query as any) || {}
	if (user && query.port) {
		const cookieHeader = req.headers.cookie as string | undefined
		let token = ''
		if (cookieHeader) {
			const match = cookieHeader.match(/macros_session=([^;]+)/)
			if (match) token = decodeURIComponent(match[1].trim())
		}
		if (!token) {
			token = createSession(user.id, 'launcher', 30)
		}
		return reply.redirect(`http://127.0.0.1:${query.port}/?code=${encodeURIComponent(token)}`)
	}
	if (user && query.flow !== 'launcher') {
		return reply.redirect('/account')
	}
	const html = renderAuthHtml('sign-up', query)
	reply.type('text/html; charset=utf-8')
	return reply.send(html)
})

server.get('/account', async (req, reply) => {
	const user = authUser(req)
	const html = renderAccountHtml(user ? formatPublicUser(user) : null)
	reply.type('text/html; charset=utf-8')
	return reply.send(html)
})

server.get('/dashboard', async (req, reply) => {
	return reply.redirect('/dashboard/projects')
})

server.get('/dashboard/projects', async (req, reply) => {
	const user = authUser(req)
	const html = renderDashboardProjectsHtml(user ? formatPublicUser(user) : null)
	reply.type('text/html; charset=utf-8')
	return reply.send(html)
})

server.get('/settings', async (req, reply) => {
	const user = authUser(req)
	const html = renderSettingsHtml(user ? formatPublicUser(user) : null, 'appearance')
	reply.type('text/html; charset=utf-8')
	return reply.send(html)
})

server.get('/settings/:section', async (req, reply) => {
	const { section } = req.params as { section: string }
	const user = authUser(req)
	const html = renderSettingsHtml(user ? formatPublicUser(user) : null, section)
	reply.type('text/html; charset=utf-8')
	return reply.send(html)
})

server.post('/api/v1/projects', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'Unauthorized' })
	const { title, slug, project_type, description } = (req.body as any) || {}
	if (!title || !slug) return reply.status(400).send({ error: 'Title and slug are required' })

	const cleanSlug = String(slug).toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
	if (cleanSlug.length < 2) return reply.status(400).send({ error: 'Slug must be at least 2 characters' })

	const existing = db.prepare('SELECT id FROM projects WHERE slug = ?').get(cleanSlug)
	if (existing) return reply.status(400).send({ error: 'A project with this slug already exists' })

	const id = crypto.randomBytes(4).toString('hex')
	db.prepare(`
		INSERT INTO projects (id, slug, title, description, project_type, user_id, status)
		VALUES (?, ?, ?, ?, ?, ?, 'approved')
	`).run(id, cleanSlug, String(title).trim(), String(description || '').trim(), project_type || 'mod', user.id)

	return reply.send({
		id,
		slug: cleanSlug,
		title: String(title).trim(),
		project_type: project_type || 'mod',
		status: 'approved'
	})
})

server.post('/v2/project', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.status(401).send({ error: 'Unauthorized' })
	const { title, slug, project_type, description } = (req.body as any) || {}
	if (!title || !slug) return reply.status(400).send({ error: 'Title and slug are required' })

	const cleanSlug = String(slug).toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
	if (cleanSlug.length < 2) return reply.status(400).send({ error: 'Slug must be at least 2 characters' })

	const existing = db.prepare('SELECT id FROM projects WHERE slug = ?').get(cleanSlug)
	if (existing) return reply.status(400).send({ error: 'A project with this slug already exists' })

	const id = crypto.randomBytes(4).toString('hex')
	db.prepare(`
		INSERT INTO projects (id, slug, title, description, project_type, user_id, status)
		VALUES (?, ?, ?, ?, ?, ?, 'approved')
	`).run(id, cleanSlug, String(title).trim(), String(description || '').trim(), project_type || 'mod', user.id)

	return reply.send({
		id,
		slug: cleanSlug,
		title: String(title).trim(),
		project_type: project_type || 'mod',
		status: 'approved'
	})
})

server.get('/api/v1/projects/my', async (req, reply) => {
	const user = authUser(req)
	if (!user) return reply.send([])
	const rows = db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC').all(user.id)
	return reply.send(rows)
})

server.get('/v2/project/:id', async (req, reply) => {
	const { id } = req.params as { id: string }
	const localProject = db.prepare('SELECT * FROM projects WHERE id = ? OR slug = ?').get(id, id) as any
	if (localProject) {
		const author = db.prepare('SELECT username FROM users WHERE id = ?').get(localProject.user_id) as any
		return reply.send({
			id: localProject.id,
			slug: localProject.slug,
			title: localProject.title,
			description: localProject.description,
			body: localProject.description || 'Welcome to ' + localProject.title + '!',
			project_type: localProject.project_type || 'mod',
			status: localProject.status || 'approved',
			downloads: 0,
			followers: 0,
			categories: [localProject.project_type || 'mod'],
			loaders: ['fabric', 'forge', 'neoforge'],
			game_versions: ['1.21.1', '1.21', '1.20.4', '1.20.1'],
			client_side: 'optional',
			server_side: 'optional',
			team: null,
			published: localProject.created_at,
			updated: localProject.updated_at,
			author: author?.username || 'User'
		})
	}
	return proxyToModrinth(req, reply)
})

server.get('/v2/project/:id/version', async (req, reply) => {
	const { id } = req.params as { id: string }
	const localProject = db.prepare('SELECT * FROM projects WHERE id = ? OR slug = ?').get(id, id) as any
	if (localProject) {
		return reply.send([])
	}
	return proxyToModrinth(req, reply)
})

server.get('/catalog', async (req, reply) => {
	const user = authUser(req)
	const html = renderCatalogHtml(user ? formatPublicUser(user) : null)
	reply.type('text/html; charset=utf-8')
	return reply.send(html)
})

server.get('/mods', async (req, reply) => {
	return reply.redirect('/catalog')
})

server.get('/mod/:id', async (req, reply) => {
	const user = authUser(req)
	const { id } = req.params as { id: string }
	const query = (req.query as any) || {}
	const provider = (query.provider || 'modrinth') as 'modrinth' | 'curseforge'
	const html = renderModPageHtml(id, provider, user ? formatPublicUser(user) : null)
	reply.type('text/html; charset=utf-8')
	return reply.send(html)
})

server.get('/project/:id', async (req, reply) => {
	const { id } = req.params as { id: string }
	const query = (req.query as any) || {}
	const provider = query.provider ? `?provider=${query.provider}` : ''
	return reply.redirect(`/mod/${encodeURIComponent(id)}${provider}`)
})

server.get('/user/:username', async (req, reply) => {
	let { username } = req.params as { username: string }
	try {
		username = decodeURIComponent(username).trim()
	} catch {}

	const targetUser = db
		.prepare('SELECT id, username, email, avatar_url, bio, role, badges, minecraft_username, created_at FROM users WHERE LOWER(username) = LOWER(?) OR id = ?')
		.get(username, username) as any

	if (!targetUser) {
		return reply.redirect('/account')
	}

	const viewer = authUser(req)
	if (viewer && viewer.id === targetUser.id) {
		return reply.redirect('/account')
	}

	let relation: any = { accepted: false, is_outgoing: false, is_incoming: false }
	if (viewer) {
		const friendRow = db
			.prepare('SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)')
			.get(viewer.id, targetUser.id, targetUser.id, viewer.id) as any

		if (friendRow) {
			if (friendRow.accepted === 1) {
				relation.accepted = true
			} else if (friendRow.user_id === viewer.id) {
				relation.is_outgoing = true
			} else {
				relation.is_incoming = true
			}
		}
	}

	const projects = db
		.prepare('SELECT id, slug, title, description, project_type, icon_url, downloads FROM projects WHERE user_id = ?')
		.all(targetUser.id) as any[]

	const sharedInstances = db
		.prepare(`
			SELECT si.id, si.name, si.icon_path, siv.game_version, siv.loader,
				(SELECT id FROM shared_instance_invites WHERE instance_id = si.id ORDER BY created_at DESC LIMIT 1) as invite_id
			FROM shared_instances si
			LEFT JOIN shared_instance_versions siv ON siv.instance_id = si.id
			WHERE si.owner_id = ?
			ORDER BY si.created_at DESC
		`)
		.all(targetUser.id) as any[]

	const targetOnline = isUserOnline(targetUser.id)

	const html = renderPublicUserProfileHtml({
		targetUser,
		viewerUser: viewer ? formatPublicUser(viewer) : null,
		relation,
		projects,
		sharedInstances,
		isOnline: targetOnline
	})

	reply.type('text/html; charset=utf-8')
	return reply.send(html)
})

server.get('/u/:username', async (req, reply) => {
	const { username } = req.params as { username: string }
	return reply.redirect('/user/' + encodeURIComponent(username))
})

server.get('/download', async (req, reply) => {
	const user = authUser(req)
	const html = renderDownloadHtml(user ? formatPublicUser(user) : null)
	reply.type('text/html; charset=utf-8')
	return reply.send(html)
})

server.get('/downloads/:filename', async (req, reply) => {
	const { filename } = req.params as { filename: string }
	const safeName = path.basename(filename)
	const p1 = path.join(publicDir, 'downloads', safeName)
	const p2 = path.join(dataDir, 'downloads', safeName)
	const filePath = fs.existsSync(p1) ? p1 : (fs.existsSync(p2) ? p2 : null)
	if (!filePath) {
		return reply.status(404).send({ error: 'File not found' })
	}
	const stat = fs.statSync(filePath)
	reply.header('Content-Length', stat.size)
	reply.header('Content-Disposition', `attachment; filename="${safeName}"`)
	reply.type('application/octet-stream')
	return reply.send(fs.createReadStream(filePath))
})

const modDetailsCache = new Map<string, any>()

async function resolveModsList(versionIds: string[], externalFiles: any[]): Promise<any[]> {
	const result: any[] = []

	// 1. External custom files
	for (const f of externalFiles) {
		const rawName = f.file_name || 'custom-file.jar'
		const cleanTitle = rawName
			.replace(/\.jar$/i, '')
			.replace(/[-_]/g, ' ')
			.replace(/\b\w/g, (c: string) => c.toUpperCase())

		result.push({
			id: rawName,
			title: cleanTitle,
			description: 'Кастомный файл сборки (синхронизируется лаунчером)',
			icon_url: '/assets/logo.png',
			is_custom: true,
			file_name: rawName,
			file_type: f.file_type || 'mod'
		})
	}

	if (versionIds.length === 0) return result

	// 2. Fetch versions from Modrinth API
	const missingVersionIds = versionIds.filter((id) => !modDetailsCache.has(`v_${id}`))
	if (missingVersionIds.length > 0) {
		try {
			const versionsRes = await fetch(
				`https://api.modrinth.com/v2/versions?ids=${encodeURIComponent(JSON.stringify(missingVersionIds))}`,
				{ headers: { 'User-Agent': 'MacrosApp/1.2' } }
			)
			if (versionsRes.ok) {
				const versionsData = (await versionsRes.json()) as any[]
				const projectIdsToFetch: string[] = []
				for (const v of versionsData) {
					modDetailsCache.set(`v_${v.id}`, v)
					if (!modDetailsCache.has(`p_${v.project_id}`) && !projectIdsToFetch.includes(v.project_id)) {
						projectIdsToFetch.push(v.project_id)
					}
				}
				if (projectIdsToFetch.length > 0) {
					const projectsRes = await fetch(
						`https://api.modrinth.com/v2/projects?ids=${encodeURIComponent(JSON.stringify(projectIdsToFetch))}`,
						{ headers: { 'User-Agent': 'MacrosApp/1.2' } }
					)
					if (projectsRes.ok) {
						const projectsData = (await projectsRes.json()) as any[]
						for (const p of projectsData) {
							modDetailsCache.set(`p_${p.id}`, p)
						}
					}
				}
			}
		} catch (err) {
			console.error('Error fetching mod details:', err)
		}
	}

	// 3. Assemble mods list in order
	for (const vid of versionIds) {
		const v = modDetailsCache.get(`v_${vid}`)
		if (v) {
			const p = modDetailsCache.get(`p_${v.project_id}`)
			result.push({
				id: p?.id || v.project_id,
				slug: p?.slug || '',
				title: p?.title || v.name || `Мод (${vid})`,
				description: p?.description || '',
				icon_url: p?.icon_url || '/assets/logo.png',
				version_name: v.name,
				is_custom: false
			})
		} else {
			result.push({
				id: vid,
				title: `Мод (${vid})`,
				description: '',
				icon_url: '/assets/logo.png',
				is_custom: false
			})
		}
	}

	return result
}

server.get('/share/:invite_id', async (req, reply) => {
	const { invite_id } = req.params as { invite_id: string }
	const invite = db.prepare('SELECT * FROM shared_instance_invites WHERE id = ?').get(invite_id) as any
	if (!invite) {
		reply.type('text/html; charset=utf-8')
		return reply.status(404).send('<h1>404: Сборка не найдена или срок действия ссылки истек</h1>')
	}

	const instance = db.prepare('SELECT * FROM shared_instances WHERE id = ?').get(invite.instance_id) as any
	if (!instance) {
		reply.type('text/html; charset=utf-8')
		return reply.status(404).send('<h1>404: Сборка не найдена</h1>')
	}

	const version = db
		.prepare('SELECT * FROM shared_instance_versions WHERE instance_id = ? ORDER BY version DESC LIMIT 1')
		.get(instance.id) as any

	const creator = instance.owner_id
		? (db.prepare('SELECT id, username, avatar_url FROM users WHERE id = ?').get(instance.owner_id) as any)
		: null

	const modVersionIds: string[] = version ? JSON.parse(version.modrinth_ids_json || '[]') : []
	const externalFiles: any[] = version ? JSON.parse(version.external_files_json || '[]') : []
	const modsList = await resolveModsList(modVersionIds, externalFiles)

	const html = renderShareHtml(instance, version, invite_id, modsList, creator)
	reply.type('text/html; charset=utf-8')
	return reply.send(html)
})

// ----------------------------------------------------------------------
// Fallback Proxy for Modrinth Public Catalog (mods, versions, tags, etc.)
// ----------------------------------------------------------------------
async function proxyToModrinth(req: any, reply: any) {
	try {
		const targetUrl = `https://api.modrinth.com${req.url}`
		const headers: Record<string, string> = {
			'User-Agent': (req.headers['user-agent'] as string) || 'MacrosApp/1.0'
		}
		if (req.headers['content-type']) {
			headers['Content-Type'] = req.headers['content-type']
		}
		const res = await fetch(targetUrl, {
			method: req.method,
			headers,
			body: ['GET', 'HEAD'].includes(req.method) ? undefined : (req.body as any)
		})
		const buffer = Buffer.from(await res.arrayBuffer())
		const text = buffer.toString('utf-8')

		if (text.includes('flattening v2 not-found response')) {
			req.log.warn({ url: req.url }, 'Intercepted upstream flattening v2 not-found response')
			if (
				req.url.includes('/notifications') ||
				req.url.includes('/projects') ||
				req.url.includes('/follows') ||
				req.url.includes('/users')
			) {
				return reply.status(200).send([])
			}
			return reply.status(404).send({ error: 'not_found', description: 'Item not found' })
		}

		reply.status(res.status)
		res.headers.forEach((v, k) => {
			if (!['content-encoding', 'transfer-encoding', 'content-length'].includes(k.toLowerCase())) {
				reply.header(k, v)
			}
		})
		return reply.send(buffer)
	} catch (err) {
		req.log.error(err, 'Proxy request failed')
		return reply.status(502).send({ error: 'Failed to proxy request' })
	}
}

const CF_API_KEY = '$2a$10$bL4bIL5pUWqfcO7KQtnMReakwtfHbNKh6v1uTpKlzhwoueEJQnPnm'
const CF_API_BASE = 'https://api.curseforge.com/v1'

function resolveCurseForgeDownloadUrl(file: any): string {
	if (file?.downloadUrl) {
		return file.downloadUrl
	}
	if (!file?.id || !file?.fileName) return ''
	const fileIdStr = String(file.id)
	const part1 = fileIdStr.slice(0, 4)
	const part2 = String(parseInt(fileIdStr.slice(4), 10))
	const fileNameEncoded = encodeURIComponent(file.fileName)
	return `https://edge.forgecdn.net/files/${part1}/${part2}/${fileNameEncoded}`
}

server.get('/api/v1/curseforge/search', async (req, reply) => {
	try {
		const query = req.query as any
		const params = new URLSearchParams()
		params.set('gameId', '432')
		params.set('classId', String(query.classId || 6))
		params.set('pageSize', String(query.pageSize || 20))
		params.set('index', String(query.index || 0))
		if (query.query && String(query.query).trim()) {
			params.set('searchFilter', String(query.query).trim())
		}
		if (query.gameVersion && String(query.gameVersion).trim()) {
			params.set('gameVersion', String(query.gameVersion).trim())
		}
		if (query.modLoaderType && Number(query.modLoaderType) !== 0) {
			params.set('modLoaderType', String(query.modLoaderType))
		}
		if (query.sortField !== undefined) {
			params.set('sortField', String(query.sortField))
		}
		if (query.sortOrder) {
			params.set('sortOrder', String(query.sortOrder))
		}

		const cfRes = await fetch(`${CF_API_BASE}/mods/search?${params.toString()}`, {
			headers: {
				'x-api-key': CF_API_KEY,
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
			}
		})
		if (!cfRes.ok) {
			return reply.status(cfRes.status).send({ error: 'CurseForge search error' })
		}
		const data = await cfRes.json()
		return reply.send(data)
	} catch (err: any) {
		req.log.error(err, 'CurseForge search exception')
		return reply.status(500).send({ error: 'CurseForge search failed' })
	}
})

server.get('/api/v1/curseforge/mod/:id', async (req, reply) => {
	try {
		const { id } = req.params as any
		const cfRes = await fetch(`${CF_API_BASE}/mods/${encodeURIComponent(id)}`, {
			headers: {
				'x-api-key': CF_API_KEY,
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
			}
		})
		if (!cfRes.ok) {
			return reply.status(cfRes.status).send({ error: 'CurseForge mod error' })
		}
		const data = await cfRes.json()
		return reply.send(data)
	} catch (err: any) {
		req.log.error(err, 'CurseForge mod exception')
		return reply.status(500).send({ error: 'CurseForge mod failed' })
	}
})

server.get('/api/v1/curseforge/mod/:id/description', async (req, reply) => {
	try {
		const { id } = req.params as any
		const cfRes = await fetch(`${CF_API_BASE}/mods/${encodeURIComponent(id)}/description`, {
			headers: {
				'x-api-key': CF_API_KEY,
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
			}
		})
		if (!cfRes.ok) {
			return reply.status(cfRes.status).send({ error: 'CurseForge description error' })
		}
		const data = await cfRes.json()
		return reply.send(data)
	} catch (err: any) {
		req.log.error(err, 'CurseForge description exception')
		return reply.status(500).send({ error: 'CurseForge description failed' })
	}
})

server.get('/api/v1/curseforge/mod/:id/files', async (req, reply) => {
	try {
		const { id } = req.params as any
		const cfRes = await fetch(`${CF_API_BASE}/mods/${encodeURIComponent(id)}/files`, {
			headers: {
				'x-api-key': CF_API_KEY,
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
			}
		})
		if (!cfRes.ok) {
			return reply.status(cfRes.status).send({ error: 'CurseForge files error' })
		}
		const data = await cfRes.json()
		return reply.send(data)
	} catch (err: any) {
		req.log.error(err, 'CurseForge files exception')
		return reply.status(500).send({ error: 'CurseForge files failed' })
	}
})

server.get('/api/v1/curseforge/download/:modId', async (req, reply) => {
	try {
		const { modId } = req.params as any
		const query = req.query as any
		const fileId = query.fileId

		if (fileId) {
			const cfRes = await fetch(`${CF_API_BASE}/mods/${encodeURIComponent(modId)}/files/${encodeURIComponent(fileId)}`, {
				headers: {
					'x-api-key': CF_API_KEY,
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
				}
			})
			if (cfRes.ok) {
				const fileData = (await cfRes.json()) as any
				const file = fileData.data
				const url = resolveCurseForgeDownloadUrl(file)
				if (url) return reply.redirect(url)
			}
		}

		const filesRes = await fetch(`${CF_API_BASE}/mods/${encodeURIComponent(modId)}/files`, {
			headers: {
				'x-api-key': CF_API_KEY,
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
			}
		})
		if (!filesRes.ok) return reply.status(404).send({ error: 'CurseForge files not found' })
		const filesData = (await filesRes.json()) as any
		const files = (filesData.data || []) as any[]

		const gvLower = (query.gameVersion || '').toLowerCase().trim()
		const loaderLower = (query.loader || '').toLowerCase().trim()

		let match = files.find((f: any) => {
			const versions = (f.gameVersions || []).map((v: string) => v.toLowerCase().trim())
			const gvMatch = !gvLower || versions.includes(gvLower)
			const lMatch = !loaderLower || versions.includes(loaderLower) || (loaderLower === 'fabric' && versions.includes('quilt')) || (loaderLower === 'forge' && versions.includes('neoforge'))
			return gvMatch && lMatch
		})

		if (!match && gvLower) {
			match = files.find((f: any) => (f.gameVersions || []).some((v: string) => v.toLowerCase().trim() === gvLower))
		}
		if (!match && files.length > 0) {
			match = files[0]
		}

		if (match) {
			const url = resolveCurseForgeDownloadUrl(match)
			if (url) return reply.redirect(url)
		}

		return reply.status(404).send({ error: 'No downloadable file found' })
	} catch (err: any) {
		req.log.error(err, 'CurseForge download exception')
		return reply.status(500).send({ error: 'Download failed' })
	}
})

server.get('/api/v1/modrinth/download/:id', async (req, reply) => {
	try {
		const { id } = req.params as any
		const query = req.query as any
		const gv = (query.game_version || query.gameVersion || '').toLowerCase().trim()
		const loader = (query.loader || '').toLowerCase().trim()

		const mrRes = await fetch(`https://api.modrinth.com/v2/project/${encodeURIComponent(id)}/version`, {
			headers: { 'User-Agent': 'MacrosApp/1.0 (https://macrosapp.1337.cx)' }
		})
		if (!mrRes.ok) return reply.status(404).send({ error: 'Modrinth project versions not found' })
		const versions = (await mrRes.json()) as any[]

		let match = versions.find((v: any) => {
			const gvMatch = !gv || (v.game_versions || []).map((s: string) => s.toLowerCase()).includes(gv)
			const lMatch = !loader || (v.loaders || []).map((s: string) => s.toLowerCase()).includes(loader)
			return gvMatch && lMatch
		})

		if (!match && gv) {
			match = versions.find((v: any) => (v.game_versions || []).map((s: string) => s.toLowerCase()).includes(gv))
		}
		if (!match && versions.length > 0) {
			match = versions[0]
		}

		if (match && match.files && match.files.length > 0) {
			const file = match.files.find((f: any) => f.primary) || match.files[0]
			if (file && file.url) {
				return reply.redirect(file.url)
			}
		}

		return reply.status(404).send({ error: 'No downloadable file found for Modrinth project' })
	} catch (err: any) {
		req.log.error(err, 'Modrinth download exception')
		return reply.status(500).send({ error: 'Download failed' })
	}
})

server.all('/v2/*', proxyToModrinth)
server.all('/v3/*', proxyToModrinth)

const PORT = Number(process.env.PORT || 4000)
const HOST = process.env.HOST || '0.0.0.0'

try {
	await server.listen({ port: PORT, host: HOST })
	console.log(`[Macros Server] Running on http://${HOST}:${PORT}`)
} catch (err) {
	server.log.error(err)
	process.exit(1)
}
