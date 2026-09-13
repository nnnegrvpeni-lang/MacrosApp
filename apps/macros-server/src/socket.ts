import type { WebSocket } from 'ws'
import { db } from './db.js'
import { getSessionUser, type UserRow } from './auth.js'

interface ConnectedClient {
	ws: WebSocket
	user: UserRow
	status: {
		profile_name: string | null
		last_update: string
	}
	listeningSockets: Set<string>
}

// Map of userId -> Set<ConnectedClient> (user may have multiple connections)
const clients = new Map<string, Set<ConnectedClient>>()

// Map of tunnelSocketId -> ConnectedClient
const tunnelListeners = new Map<string, ConnectedClient>()

export function getFriendIds(userId: string): string[] {
	const rows = db
		.prepare(
			`
			SELECT friend_id as fid FROM friends WHERE user_id = ? AND accepted = 1
			UNION
			SELECT user_id as fid FROM friends WHERE friend_id = ? AND accepted = 1
		`
		)
		.all(userId, userId) as { fid: string }[]

	return rows.map((r) => r.fid)
}

export function isUserOnline(userId: string): boolean {
	const userConns = clients.get(userId)
	return !!(userConns && userConns.size > 0)
}

export function getUserStatus(userId: string) {
	const userConns = clients.get(userId)
	if (!userConns || userConns.size === 0) return null
	const client = Array.from(userConns)[0]
	return {
		user_id: userId,
		profile_name: client.status.profile_name,
		last_update: client.status.last_update
	}
}

export function sendJson(ws: WebSocket, data: any) {
	if (ws.readyState === ws.OPEN) {
		ws.send(JSON.stringify(data))
	}
}

export function notifyUser(userId: string, data: any) {
	const userConns = clients.get(userId)
	if (userConns) {
		for (const client of userConns) {
			sendJson(client.ws, data)
		}
	}
}

export function handleSocketConnection(ws: WebSocket, token: string) {
	const user = getSessionUser(token)
	if (!user) {
		ws.close(4001, 'Unauthorized')
		return
	}

	const client: ConnectedClient = {
		ws,
		user,
		status: {
			profile_name: null,
			last_update: new Date().toISOString()
		},
		listeningSockets: new Set()
	}

	if (!clients.has(user.id)) {
		clients.set(user.id, new Set())
	}
	clients.get(user.id)!.add(client)

	// Send initial friend statuses to newly connected client
	const friendIds = getFriendIds(user.id)
	const friendStatuses: any[] = []
	for (const fid of friendIds) {
		const st = getUserStatus(fid)
		if (st) friendStatuses.push(st)
	}

	sendJson(ws, {
		type: 'friend_statuses',
		statuses: friendStatuses
	})

	// Broadcast online status to friends
	broadcastToFriends(user.id, {
		type: 'status_update',
		status: {
			user_id: user.id,
			profile_name: client.status.profile_name,
			last_update: client.status.last_update
		}
	})

	ws.on('message', (raw) => {
		try {
			const text = raw.toString()
			const msg = JSON.parse(text)

			if (msg.type === 'status_update') {
				client.status.profile_name = msg.profile_name ?? null
				client.status.last_update = new Date().toISOString()

				broadcastToFriends(user.id, {
					type: 'status_update',
					status: {
						user_id: user.id,
						profile_name: client.status.profile_name,
						last_update: client.status.last_update
					}
				})
			} else if (msg.type === 'socket_listen' && msg.socket) {
				client.listeningSockets.add(msg.socket)
				tunnelListeners.set(msg.socket, client)
			} else if (msg.type === 'socket_close' && msg.socket) {
				client.listeningSockets.delete(msg.socket)
				tunnelListeners.delete(msg.socket)
			} else if (msg.type === 'socket_send' && msg.socket && msg.data) {
				const listener = tunnelListeners.get(msg.socket)
				if (listener && listener.ws !== ws) {
					sendJson(listener.ws, {
						type: 'socket_data',
						socket: msg.socket,
						data: msg.data
					})
				}
			}
		} catch (err) {
			console.error('Socket message parse error:', err)
		}
	})

	ws.on('close', () => {
		const userConns = clients.get(user.id)
		if (userConns) {
			userConns.delete(client)
			if (userConns.size === 0) {
				clients.delete(user.id)
				// Broadcast offline to friends
				broadcastToFriends(user.id, {
					type: 'user_offline',
					id: user.id
				})
			}
		}

		for (const socketId of client.listeningSockets) {
			tunnelListeners.delete(socketId)
		}
	})
}

function broadcastToFriends(userId: string, data: any) {
	const friendIds = getFriendIds(userId)
	for (const fid of friendIds) {
		notifyUser(fid, data)
	}
}
