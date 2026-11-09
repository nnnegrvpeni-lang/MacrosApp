import type { Labrinth } from '@modrinth/api-client'
import { invoke } from '@tauri-apps/api/core'

export interface HorizonProjectVersionFile {
	name: string
	url: string
	size: number
	sha256: string
}

export interface HorizonProjectVersion {
	version: string
	published: string
	changelog?: string
	api?: string
	game: string
	file: HorizonProjectVersionFile
}

export interface HorizonProject {
	id: string
	kind: string
	name: string
	summary: string
	description?: string
	authors: string[]
	owners?: string[]
	license?: string
	source?: string
	icon?: string
	categories?: string[]
	tags?: string[]
	versions: HorizonProjectVersion[]
	downloads?: number
}

export interface HorizonRegistryResponse {
	schema: number
	generated?: string
	projects: HorizonProject[]
	revoked?: string[]
}

const REGISTRY_URL = 'https://horizon-rust.github.io/horizon-mods/index.json'

let cachedRegistry: HorizonProject[] | null = null
let registryFetchPromise: Promise<HorizonProject[]> | null = null

export async function fetchHorizonRegistry(): Promise<HorizonProject[]> {
	if (cachedRegistry && cachedRegistry.length > 0) return cachedRegistry
	if (registryFetchPromise) return registryFetchPromise

	registryFetchPromise = (async () => {
		try {
			// Try Tauri backend command first (bypasses CSP & CORS)
			try {
				const jsonStr = await invoke<string>('plugin:instance|instance_fetch_horizon_mods')
				if (jsonStr && jsonStr.trim()) {
					const data: HorizonRegistryResponse = JSON.parse(jsonStr)
					if (data.projects && data.projects.length > 0) {
						cachedRegistry = data.projects
						return cachedRegistry
					}
				}
			} catch (backendErr) {
				console.warn('Backend fetch for horizon mods failed, falling back to fetch():', backendErr)
			}

			// Fallback to fetch()
			const res = await fetch(REGISTRY_URL)
			if (!res.ok) throw new Error(`Failed to fetch Horizon Registry: ${res.statusText}`)
			const data: HorizonRegistryResponse = await res.json()
			cachedRegistry = data.projects ?? []
			return cachedRegistry
		} catch (e) {
			console.error('Error loading Horizon registry:', e)
			return []
		} finally {
			registryFetchPromise = null
		}
	})()

	return registryFetchPromise
}

export function toLabrinthSearchProject(
	project: HorizonProject,
): Labrinth.Search.v3.ResultSearchProject {
	return {
		project_id: project.id,
		project_type: 'mod',
		project_types: ['mod'],
		slug: project.id,
		author: project.authors?.[0] ?? 'Horizon Dev',
		name: project.name,
		title: project.name,
		description: project.summary,
		summary: project.summary,
		categories: project.categories ?? [],
		display_categories: project.categories ?? [],
		versions: ['26.3'],
		loaders: ['rust'],
		downloads: project.downloads ?? 0,
		follows: 0,
		icon_url: project.icon ?? null,
		date_created: project.versions?.[0]?.published ?? new Date().toISOString(),
		date_modified: project.versions?.[0]?.published ?? new Date().toISOString(),
		latest_version: project.versions?.[0]?.version ?? '1.0.0',
		license: project.license ?? 'MIT',
		client_side: 'required',
		server_side: 'optional',
		gallery: [],
		featured_gallery: null,
		color: null,
		project_loader_fields: {
			environment: ['client'],
		},
	} as unknown as Labrinth.Search.v3.ResultSearchProject
}

export async function searchHorizonMods(
	query = '',
	categories: string[] = [],
): Promise<Labrinth.Search.v3.ResponseSearchProject> {
	const projects = await fetchHorizonRegistry()
	const normalizedQuery = query.trim().toLowerCase()

	const filtered = projects.filter((p) => {
		if (normalizedQuery) {
			const matchesName = p.name.toLowerCase().includes(normalizedQuery)
			const matchesSummary = p.summary.toLowerCase().includes(normalizedQuery)
			const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(normalizedQuery))
			if (!matchesName && !matchesSummary && !matchesTags) return false
		}

		if (categories.length > 0) {
			const hasCategory = categories.some((c) => p.categories?.includes(c))
			if (!hasCategory) return false
		}

		return true
	})

	const hits = filtered.map(toLabrinthSearchProject)

	return {
		hits,
		offset: 0,
		limit: hits.length,
		total_hits: hits.length,
	}
}

export async function installHorizonMod(
	instanceId: string,
	projectId: string,
	versionId?: string,
): Promise<string> {
	const projects = await fetchHorizonRegistry()
	const p = projects.find((x) => x.id === projectId)
	if (!p) {
		throw new Error(`Horizon mod ${projectId} not found in registry`)
	}
	let v = p.versions[0]
	if (versionId) {
		const found = p.versions.find(
			(x) => x.version === versionId || `${p.id}-${x.version}` === versionId,
		)
		if (found) v = found
	}
	if (!v || !v.file || !v.file.url) {
		throw new Error(`Horizon mod ${projectId} has no valid files to download`)
	}
	return await invoke('plugin:instance|instance_install_horizon_mod', {
		instanceId,
		projectId: p.id,
		downloadUrl: v.file.url,
		fileName: v.file.name,
		versionId: v.version,
		iconUrl: p.icon ?? null,
		title: p.name,
	})
}

export function horizonProjectToModrinthProject(hp: HorizonProject): Labrinth.Projects.v2.Project {
	return {
		id: hp.id,
		slug: hp.id,
		project_type: 'mod',
		team: hp.authors?.[0] ?? 'Horizon',
		title: hp.name,
		description: hp.summary,
		body: hp.description || hp.summary,
		body_url: null,
		published: hp.versions?.[0]?.published ?? new Date().toISOString(),
		updated: hp.versions?.[0]?.published ?? new Date().toISOString(),
		approved: null,
		queued: null,
		status: 'approved',
		requested_status: null,
		moderator_message: null,
		license: {
			id: hp.license ?? 'MIT',
			name: hp.license ?? 'MIT',
			url: null,
		},
		client_side: 'required',
		server_side: 'optional',
		downloads: hp.downloads ?? 0,
		followers: 0,
		categories: hp.categories ?? [],
		additional_categories: [],
		game_versions: ['26.3'],
		loaders: ['rust'],
		versions: (hp.versions ?? []).map((v) => `${hp.id}-${v.version}`),
		icon_url: hp.icon ?? null,
		issues_url: null,
		source_url: hp.source ?? null,
		wiki_url: null,
		discord_url: null,
		donation_urls: [],
		gallery: [],
		color: null,
		thread_id: null,
		monetization_status: null,
	} as unknown as Labrinth.Projects.v2.Project
}

export function horizonVersionsToModrinthVersions(hp: HorizonProject): Labrinth.Versions.v2.Version[] {
	return (hp.versions ?? []).map((v) => ({
		id: `${hp.id}-${v.version}`,
		project_id: hp.id,
		author_id: hp.authors?.[0] ?? 'Horizon',
		featured: false,
		name: `${hp.name} ${v.version}`,
		version_number: v.version,
		changelog: v.changelog ?? null,
		changelog_url: null,
		date_published: v.published,
		downloads: hp.downloads ?? 0,
		version_type: 'release',
		status: 'listed',
		requested_status: null,
		files: [
			{
				hashes: {
					sha1: '',
					sha512: '',
				},
				url: v.file.url,
				filename: v.file.name,
				primary: true,
				size: v.file.size,
				file_type: null,
			},
		],
		dependencies: [],
		game_versions: [v.game || '26.3'],
		loaders: ['rust'],
	})) as unknown as Labrinth.Versions.v2.Version[]
}
