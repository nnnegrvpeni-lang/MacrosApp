import type { Labrinth } from '@modrinth/api-client'
import { invoke } from '@tauri-apps/api/core'
import { install_curseforge_file } from './instance'

export interface CurseForgeFile {
	id: number
	gameId: number
	modId: number
	isAvailable: boolean
	displayName: string
	fileName: string
	releaseType: number
	downloadUrl: string | null
	gameVersions: string[]
	downloadCount: number
	fileDate: string
	fileLength: number
}

export interface CurseForgeFileIndex {
	gameVersion: string
	fileId: number
	filename: string
	releaseType: number
	gameVersionTypeId?: number
	modLoader?: number
}

export interface CurseForgeMod {
	id: number
	gameId: number
	name: string
	slug: string
	summary: string
	downloadCount: number
	classId: number
	categories: { id: number; name: string; slug: string }[]
	authors: { id: number; name: string; url: string; avatarUrl?: string }[]
	logo?: { thumbnailUrl?: string; url?: string }
	latestFiles: CurseForgeFile[]
	latestFilesIndexes?: CurseForgeFileIndex[]
	dateCreated: string
	dateModified: string
	dateReleased: string
	thumbsUpCount?: number
	links?: { websiteUrl?: string; wikiUrl?: string; issuesUrl?: string; sourceUrl?: string }
}

export interface CurseForgeSearchResult {
	hits: (Labrinth.Search.v3.ResultSearchProject & {
		cf_raw: CurseForgeMod
		curseforge_id: number
		installed?: boolean
	})[]
	total_hits: number
	hits_per_page: number
}

export const CF_CLASS_IDS: Record<string, number> = {
	mod: 6,
	modpack: 4471,
	resourcepack: 12,
	shader: 6552,
	datapack: 17,
}

export const CF_LOADER_IDS: Record<string, number> = {
	any: 0,
	forge: 1,
	cauldron: 2,
	liteloader: 3,
	fabric: 4,
	quilt: 5,
	neoforge: 6,
}

export const CF_LOADER_NAMES: Record<number, string> = {
	0: 'any',
	1: 'forge',
	2: 'cauldron',
	3: 'liteloader',
	4: 'fabric',
	5: 'quilt',
	6: 'neoforge',
}

export async function searchCurseForge(options: {
	query?: string
	projectType?: string
	gameVersion?: string
	loader?: string
	page?: number
	pageSize?: number
	sortField?: number
	sortOrder?: 'asc' | 'desc'
}): Promise<CurseForgeSearchResult> {
	const projectType = options.projectType || 'mod'
	const classId = CF_CLASS_IDS[projectType] ?? 6
	const pageSize = options.pageSize || 20
	const index = ((options.page || 1) - 1) * pageSize

	let modLoaderType: number | undefined
	if (options.loader) {
		const loaderLower = options.loader.toLowerCase()
		const loaderId = CF_LOADER_IDS[loaderLower]
		if (loaderId !== undefined && loaderId !== 0) {
			modLoaderType = loaderId
		}
	}

	const sortField =
		options.sortField !== undefined ? options.sortField : options.query?.trim() ? 1 : 2

	const data = (await invoke('plugin:curseforge|search', {
		params: {
			gameId: 432,
			classId,
			pageSize,
			index,
			searchFilter: options.query?.trim() || null,
			gameVersion: options.gameVersion || null,
			modLoaderType: modLoaderType || null,
			sortField,
			sortOrder: options.sortOrder || 'desc',
		},
	})) as {
		data: CurseForgeMod[]
		pagination: { index: number; pageSize: number; resultCount: number; totalCount: number }
	}

	const hits = (data.data || []).map((mod) => {
		const loaders = extractLoaders(mod)
		const gameVersions = extractGameVersions(mod)
		const authorName = mod.authors?.[0]?.name || 'Unknown'
		const iconUrl = mod.logo?.thumbnailUrl || mod.logo?.url || null

		const hit: Labrinth.Search.v3.ResultSearchProject & {
			cf_raw: CurseForgeMod
			curseforge_id: number
			installed?: boolean
		} = {
			project_id: `cf-${mod.id}`,
			project_type: projectType as any,
			slug: mod.slug,
			author: authorName,
			title: mod.name,
			description: mod.summary,
			categories: mod.categories?.map((c) => c.name) || [],
			display_categories: mod.categories?.map((c) => c.name) || [],
			versions: (mod.latestFiles || []).map((f) => String(f.id)),
			downloads: mod.downloadCount || 0,
			follows: mod.thumbsUpCount || 0,
			icon_url: iconUrl,
			date_created: mod.dateCreated,
			date_modified: mod.dateModified,
			latest_version: mod.latestFiles?.[0]?.displayName || '',
			license: 'CurseForge',
			client_side: 'optional',
			server_side: 'optional',
			gallery: [],
			color: 0,
			loaders,
			game_versions: gameVersions,
			featured_gallery: null,
			curseforge_id: mod.id,
			cf_raw: mod,
		}

		return hit
	})

	return {
		hits,
		total_hits: data.pagination?.totalCount || hits.length,
		hits_per_page: data.pagination?.pageSize || pageSize,
	}
}

export async function getCurseForgeModFiles(modId: number): Promise<CurseForgeFile[]> {
	const data = (await invoke('plugin:curseforge|get_files', { modId })) as {
		data: CurseForgeFile[]
	}
	return data.data || []
}

export function resolveCurseForgeDownloadUrl(file: CurseForgeFile): string {
	if (file.downloadUrl) {
		return file.downloadUrl
	}
	const fileIdStr = String(file.id)
	const part1 = fileIdStr.slice(0, 4)
	const part2 = String(parseInt(fileIdStr.slice(4), 10))
	const fileNameEncoded = encodeURIComponent(file.fileName)
	return `https://edge.forgecdn.net/files/${part1}/${part2}/${fileNameEncoded}`
}

export async function findBestCurseForgeFileForInstance(
	mod: CurseForgeMod,
	gameVersion?: string,
	loader?: string,
): Promise<{ file: CurseForgeFile; downloadUrl: string } | null> {
	const files = mod.latestFiles || []
	const loaderLower = (loader || '').toLowerCase().trim()
	const gvLower = (gameVersion || '').toLowerCase().trim()

	const findMatch = (fileList: CurseForgeFile[]) => {
		if (gvLower && loaderLower) {
			const match = fileList.find((f) => {
				const versions = (f.gameVersions || []).map((v) => v.toLowerCase().trim())
				const matchesGv = versions.includes(gvLower)
				const matchesLoader =
					versions.includes(loaderLower) ||
					(loaderLower === 'quilt' && versions.includes('fabric')) ||
					(loaderLower === 'fabric' && versions.includes('quilt')) ||
					(loaderLower === 'neoforge' && versions.includes('forge')) ||
					(loaderLower === 'forge' && versions.includes('neoforge'))
				return matchesGv && matchesLoader
			})
			if (match) return match
		}
		if (gvLower) {
			const match = fileList.find((f) =>
				(f.gameVersions || []).some((v) => v.toLowerCase().trim() === gvLower),
			)
			if (match) return match
		}
		return null
	}

	let bestMatch = findMatch(files)
	if (!bestMatch) {
		const allFiles = await getCurseForgeModFiles(mod.id)
		bestMatch = findMatch(allFiles)
		if (!bestMatch && allFiles.length > 0) {
			bestMatch = allFiles[0]
		}
	}

	if (!bestMatch && files.length > 0) {
		bestMatch = files[0]
	}

	if (bestMatch) {
		return { file: bestMatch, downloadUrl: resolveCurseForgeDownloadUrl(bestMatch) }
	}

	return null
}

export async function installCurseForgeMod(
	instanceId: string,
	mod: CurseForgeMod,
	gameVersion?: string,
	loader?: string,
	projectType?: string,
): Promise<string> {
	const best = await findBestCurseForgeFileForInstance(mod, gameVersion, loader)
	if (!best) {
		throw new Error(`No compatible CurseForge file found for ${mod.name}`)
	}
	return await install_curseforge_file(
		instanceId,
		best.downloadUrl,
		best.file.fileName,
		projectType || 'mod',
	)
}

export function extractLoaders(mod: CurseForgeMod): string[] {
	const loaders = new Set<string>()
	const recognized = ['fabric', 'forge', 'neoforge', 'quilt']
	for (const file of mod.latestFiles || []) {
		for (const gv of file.gameVersions || []) {
			const gvLower = gv.toLowerCase().trim()
			if (recognized.includes(gvLower)) {
				loaders.add(gvLower)
			}
		}
	}
	if (mod.latestFilesIndexes?.length) {
		for (const idx of mod.latestFilesIndexes) {
			if (idx.modLoader !== undefined && CF_LOADER_NAMES[idx.modLoader]) {
				const name = CF_LOADER_NAMES[idx.modLoader]
				if (recognized.includes(name)) {
					loaders.add(name)
				}
			}
		}
	}
	return Array.from(loaders)
}

export function extractGameVersions(mod: CurseForgeMod): string[] {
	const gvs = new Set<string>()
	for (const file of mod.latestFiles || []) {
		for (const gv of file.gameVersions || []) {
			const trimmed = gv.trim()
			if (/^\d+(\.\d+)+$/.test(trimmed)) {
				gvs.add(trimmed)
			}
		}
	}
	if (mod.latestFilesIndexes?.length) {
		for (const idx of mod.latestFilesIndexes) {
			const trimmed = (idx.gameVersion || '').trim()
			if (/^\d+(\.\d+)+$/.test(trimmed)) {
				gvs.add(trimmed)
			}
		}
	}
	return Array.from(gvs)
}
