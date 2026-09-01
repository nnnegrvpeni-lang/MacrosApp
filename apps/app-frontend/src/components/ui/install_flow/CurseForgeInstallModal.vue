<script setup lang="ts">
import {
	ContentInstallModal,
	type ContentInstallInstance,
	type ContentInstallProjectInfo,
	injectNotificationManager,
} from '@modrinth/ui'
import { useQueryClient } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import {
	CF_LOADER_NAMES,
	type CurseForgeMod,
	getCurseForgeModFiles,
	installCurseForgeMod,
} from '@/helpers/curseforge'
import { install_create_instance, installJobInstanceId } from '@/helpers/install'
import {
	get_installed_project_ids as getInstalledProjectIds,
	getInstanceIconUrl,
	list,
} from '@/helpers/instance'
import { get_game_versions } from '@/helpers/tags'
import type { GameInstance } from '@/helpers/types'
import { instanceKeys } from '@/pages/instance/query-options'

const { handleError, addNotification } = injectNotificationManager()
const queryClient = useQueryClient()
const router = useRouter()

const modal = ref<InstanceType<typeof ContentInstallModal> | null>(null)
const currentMod = ref<CurseForgeMod | null>(null)
const currentProjectType = ref('mod')
const loading = ref(false)
const rawInstances = ref<GameInstance[]>([])
const installedSet = ref<Set<string>>(new Set())
const gameVersions = ref<string[]>([])
const releaseGameVersions = ref<Set<string>>(new Set())

const compatibleLoaders = computed(() => {
	if (!currentMod.value) return ['fabric', 'forge', 'neoforge', 'quilt']
	const recognized = ['fabric', 'forge', 'neoforge', 'quilt']
	const list = new Set<string>()
	for (const file of currentMod.value.latestFiles || []) {
		for (const gv of file.gameVersions || []) {
			const l = gv.toLowerCase().trim()
			if (recognized.includes(l)) list.add(l)
		}
	}
	for (const idx of currentMod.value.latestFilesIndexes || []) {
		if (idx.modLoader && CF_LOADER_NAMES[idx.modLoader]) {
			const name = CF_LOADER_NAMES[idx.modLoader]
			if (recognized.includes(name)) list.add(name)
		}
	}
	return list.size > 0 ? Array.from(list) : recognized
})

const projectInfo = computed<ContentInstallProjectInfo | null>(() => {
	if (!currentMod.value) return null
	const mod = currentMod.value
	const authorName = mod.authors?.map((a) => a.name).join(', ') || 'CurseForge'
	return {
		title: mod.name,
		iconUrl: mod.logo?.thumbnailUrl || mod.logo?.url || null,
		link: mod.links?.websiteUrl || `https://www.curseforge.com/minecraft/mc-mods/${mod.slug}`,
		owner: mod.authors?.[0]
			? {
					name: authorName,
					iconUrl: mod.authors[0].avatarUrl,
					circle: true,
					link: mod.authors[0].url || '',
				}
			: null,
	}
})

function checkCompatibility(mod: CurseForgeMod, inst: GameInstance): boolean {
	const gv = (inst.game_version || '').trim().toLowerCase()
	const loader = (inst.loader || '').trim().toLowerCase()

	if (mod.latestFilesIndexes?.length) {
		const match = mod.latestFilesIndexes.some((idx) => {
			const idxGv = (idx.gameVersion || '').trim().toLowerCase()
			const matchGv = !gv || idxGv === gv
			let matchL = !loader
			if (loader && idx.modLoader !== undefined) {
				const name = CF_LOADER_NAMES[idx.modLoader]
				matchL =
					idx.modLoader === 0 ||
					name === loader ||
					(loader === 'quilt' && name === 'fabric') ||
					(loader === 'fabric' && name === 'quilt') ||
					(loader === 'neoforge' && name === 'forge') ||
					(loader === 'forge' && name === 'neoforge')
			}
			return matchGv && matchL
		})
		if (match) return true
	}

	const files = mod.latestFiles || []
	if (files.length) {
		const match = files.some((f) => {
			const vLower = (f.gameVersions || []).map((v) => v.toLowerCase().trim())
			const matchGv = !gv || vLower.includes(gv)
			const matchL =
				!loader ||
				vLower.includes(loader) ||
				(loader === 'quilt' && vLower.includes('fabric')) ||
				(loader === 'fabric' && vLower.includes('quilt')) ||
				(loader === 'neoforge' && vLower.includes('forge')) ||
				(loader === 'forge' && vLower.includes('neoforge'))
			return matchGv && matchL
		})
		if (match) return true
	}

	return false
}

const contentInstallInstances = computed<ContentInstallInstance[]>(() => {
	if (!currentMod.value) return []
	const mod = currentMod.value
	return rawInstances.value.map((inst) => {
		return {
			id: inst.id,
			name: inst.name,
			iconUrl: getInstanceIconUrl(inst.icon_path),
			installed: installedSet.value.has(inst.id),
			compatible: checkCompatibility(mod, inst),
			installing: false,
		}
	})
})

defineExpose({
	show: async (mod: CurseForgeMod, projectType = 'mod') => {
		currentMod.value = mod
		currentProjectType.value = projectType
		loading.value = true

		try {
			if (!gameVersions.value.length) {
				try {
					const gvData = (await get_game_versions()) as any[]
					gameVersions.value = gvData.map((v) => v.id || v.version)
					releaseGameVersions.value = new Set(
						gvData.filter((v) => v.version_type === 'release').map((v) => v.id || v.version),
					)
				} catch {
					gameVersions.value = ['1.21.11', '1.21.1', '1.20.1']
				}
			}

			const listData = await list()
			rawInstances.value = listData

			const installed = new Set<string>()
			await Promise.all(
				listData.map(async (inst) => {
					try {
						const installedIds = await getInstalledProjectIds(inst.id)
						if (
							installedIds.includes(`cf-${mod.id}`) ||
							installedIds.includes(String(mod.id))
						) {
							installed.add(inst.id)
						}
					} catch {
						// ignore
					}
				}),
			)
			installedSet.value = installed

			if (!mod.latestFilesIndexes?.length) {
				getCurseForgeModFiles(mod.id).then((files) => {
					if (files.length) {
						currentMod.value = { ...mod, latestFiles: files }
					}
				}).catch(() => {})
			}
		} catch (e) {
			handleError(e)
		} finally {
			loading.value = false
		}

		modal.value?.show()
	},
	hide: () => {
		modal.value?.hide()
	},
})

async function handleInstallToInstance(inst: ContentInstallInstance) {
	if (!currentMod.value) return
	const raw = rawInstances.value.find((r) => r.id === inst.id)
	inst.installing = true

	try {
		await installCurseForgeMod(
			inst.id,
			currentMod.value,
			raw?.game_version,
			raw?.loader,
			currentProjectType.value,
		)
		installedSet.value.add(inst.id)

		await queryClient.invalidateQueries({
			queryKey: instanceKeys.content(inst.id),
		})
		await queryClient.invalidateQueries({
			queryKey: instanceKeys.installedProjectIds(inst.id, 'content'),
		})

		addNotification({
			type: 'success',
			title: 'Успешно установлено',
			text: `Проект «${currentMod.value.name}» установлен в «${inst.name}»`,
		})
	} catch (e) {
		handleError(e)
	} finally {
		inst.installing = false
	}
}

async function handleCreateAndInstall(data: {
	name: string
	iconPath: string | null
	iconPreviewUrl: string | null
	loader: string
	gameVersion: string
}) {
	if (!currentMod.value) return
	try {
		const job = await install_create_instance({
			name: data.name,
			game_version: data.gameVersion,
			loader: data.loader,
			loader_version: null,
			icon_path: data.iconPath,
			icon_config: null,
			link: null,
		})
		const instanceId = installJobInstanceId(job)
		if (instanceId) {
			await installCurseForgeMod(
				instanceId,
				currentMod.value,
				data.gameVersion,
				data.loader,
				currentProjectType.value,
			)
			addNotification({
				type: 'success',
				title: 'Сборка создана',
				text: `Сборка «${data.name}» создана с установленным модом «${currentMod.value.name}»`,
			})
			router.push(`/instance/${encodeURIComponent(instanceId)}`)
		}
	} catch (e) {
		handleError(e)
	}
}

function handleNavigate(inst: ContentInstallInstance) {
	modal.value?.hide()
	router.push(`/instance/${encodeURIComponent(inst.id)}`)
}

function handleCancel() {
	// cancelled
}
</script>

<template>
	<ContentInstallModal
		ref="modal"
		:instances="contentInstallInstances"
		:compatible-loaders="compatibleLoaders"
		:game-versions="gameVersions"
		:release-game-versions="releaseGameVersions"
		:loading="loading"
		:project-info="projectInfo"
		@install="handleInstallToInstance"
		@create-and-install="handleCreateAndInstall"
		@navigate="handleNavigate"
		@cancel="handleCancel"
	/>
</template>
