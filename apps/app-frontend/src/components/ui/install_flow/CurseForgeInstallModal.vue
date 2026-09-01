<script setup lang="ts">
import {
	ContentInstallModal,
	type ContentInstallInstance,
	injectNotificationManager,
} from '@modrinth/ui'
import { useQueryClient } from '@tanstack/vue-query'
import { convertFileSrc } from '@tauri-apps/api/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import IconEditorModal from '@/components/ui/instance_settings/icon-editor-modal/index.vue'
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
const iconEditorModal = ref<InstanceType<typeof IconEditorModal> | null>(null)
const generatedIconConfig = ref<any>(null)

const currentMod = ref<CurseForgeMod | null>(null)
const currentProjectType = ref('mod')
const loading = ref(false)
const rawInstances = ref<GameInstance[]>([])
const installedSet = ref<Set<string>>(new Set())

const compatibleLoaders = ref<string[]>([])
const gameVersions = ref<string[]>([])
const releaseGameVersions = ref<Set<string>>(new Set())
const preferredLoader = ref<string | null>(null)
const preferredGameVersion = ref<string | null>(null)
const defaultTab = ref<'existing' | 'new'>('existing')

function extractLoadersAndVersions(mod: CurseForgeMod, allGameVersions: any[]) {
	const recognizedLoaders = ['fabric', 'forge', 'neoforge', 'quilt']
	const loaderSet = new Set<string>()
	const versionSet = new Set<string>()

	for (const file of mod.latestFiles || []) {
		for (const gv of file.gameVersions || []) {
			const lower = gv.toLowerCase().trim()
			if (recognizedLoaders.includes(lower)) {
				loaderSet.add(lower)
			} else if (/^\d+\.\d+(\.\d+)?$/.test(lower) || /^\d{2}w\d{2}[a-z]$/.test(lower)) {
				versionSet.add(lower)
			}
		}
	}

	for (const idx of mod.latestFilesIndexes || []) {
		if (idx.modLoader && CF_LOADER_NAMES[idx.modLoader]) {
			const name = CF_LOADER_NAMES[idx.modLoader]
			if (recognizedLoaders.includes(name)) {
				loaderSet.add(name)
			}
		}
		if (idx.gameVersion) {
			const gvLower = idx.gameVersion.toLowerCase().trim()
			if (/^\d+\.\d+(\.\d+)?$/.test(gvLower) || /^\d{2}w\d{2}[a-z]$/.test(gvLower)) {
				versionSet.add(gvLower)
			}
		}
	}

	const sortedLoaders = Array.from(loaderSet).sort((a, b) => {
		const order = ['fabric', 'neoforge', 'forge', 'quilt']
		const ia = order.indexOf(a)
		const ib = order.indexOf(b)
		return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
	})
	compatibleLoaders.value = sortedLoaders.length > 0 ? sortedLoaders : recognizedLoaders
	preferredLoader.value = compatibleLoaders.value[0] ?? 'fabric'

	const orderedVersions: string[] = []
	const releases = new Set<string>()
	for (const gv of allGameVersions) {
		const vName = (gv.id || gv.version || '').toLowerCase().trim()
		if (versionSet.size === 0 || versionSet.has(vName)) {
			orderedVersions.push(gv.id || gv.version)
			if (gv.version_type === 'release') {
				releases.add(gv.id || gv.version)
			}
		}
	}

	gameVersions.value = orderedVersions.length > 0 ? orderedVersions : ['1.21.11', '1.21.1', '1.20.1']
	releaseGameVersions.value = releases
	preferredGameVersion.value =
		orderedVersions.find((v) => releases.has(v)) ?? orderedVersions[0] ?? null
}

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

async function randomizeIcon() {
	const gen = await iconEditorModal.value?.randomizeAndSave()
	if (!gen) return null
	generatedIconConfig.value = gen.config
	return {
		path: gen.iconPath,
		previewUrl: convertFileSrc(gen.iconPath),
	}
}

function customizeIcon() {
	iconEditorModal.value?.show()
}

function onIconSaved(iconPath: string, config: any) {
	generatedIconConfig.value = config
	modal.value?.setIcon(iconPath, convertFileSrc(iconPath))
}

defineExpose({
	show: async (mod: CurseForgeMod, projectType = 'mod') => {
		currentMod.value = mod
		currentProjectType.value = projectType
		loading.value = true

		try {
			let allGv: any[] = []
			try {
				allGv = (await get_game_versions()) as any[]
			} catch {
				allGv = []
			}
			extractLoadersAndVersions(mod, allGv)

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

			const compatibleAvailable = listData.some(
				(inst) => checkCompatibility(mod, inst) && !installed.has(inst.id),
			)
			defaultTab.value = compatibleAvailable ? 'existing' : 'new'

			if (!mod.latestFilesIndexes?.length) {
				getCurseForgeModFiles(mod.id).then((files) => {
					if (files.length) {
						currentMod.value = { ...mod, latestFiles: files }
						extractLoadersAndVersions({ ...mod, latestFiles: files }, allGv)
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
			icon_config: generatedIconConfig.value,
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
		:default-tab="defaultTab"
		:preferred-loader="preferredLoader"
		:preferred-game-version="preferredGameVersion"
		:project-info="null"
		:randomize-icon="randomizeIcon"
		:customize-icon="customizeIcon"
		@install="handleInstallToInstance"
		@create-and-install="handleCreateAndInstall"
		@navigate="handleNavigate"
		@cancel="handleCancel"
	/>
	<IconEditorModal
		ref="iconEditorModal"
		:config="generatedIconConfig"
		@saved="onIconSaved"
	/>
</template>
