<script setup lang="ts">
import {
	CheckIcon,
	EyeIcon,
	EyeOffIcon,
	PlusIcon,
	SearchIcon,
	SpinnerIcon,
	TriangleAlertIcon,
} from '@modrinth/assets'
import {
	Avatar,
	Button,
	Chips,
	defineMessages,
	IconButton,
	injectNotificationManager,
	NewModal,
	StyledInput,
	useVIntl,
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
import type { GameInstance } from '@/helpers/types'
import { instanceKeys } from '@/pages/instance/query-options'

interface InstanceEntry extends GameInstance {
	installing?: boolean
	installed?: boolean
	isCompatible?: boolean
}

const { handleError, addNotification } = injectNotificationManager()
const { formatMessage } = useVIntl()
const queryClient = useQueryClient()
const router = useRouter()

const modal = ref<InstanceType<typeof NewModal> | null>(null)
const searchFilter = ref('')
const hideUninstallable = ref(false)
type Tab = 'existing' | 'new'
const tabs: Tab[] = ['existing', 'new']
const tab = ref<Tab>('existing')
const instances = ref<InstanceEntry[]>([])
const currentMod = ref<CurseForgeMod | null>(null)
const currentProjectType = ref('mod')

// New instance fields
const newInstanceName = ref('')
const newInstanceGameVersion = ref('1.21.11')
const newInstanceLoader = ref('fabric')
const creatingNewInstance = ref(false)

const messages = defineMessages({
	header: { id: 'app.curseforge.install.header', defaultMessage: 'Установка проекта' },
	instanceType: { id: 'app.curseforge.install.instance_type', defaultMessage: 'Тип сборки' },
	existingInstanceTab: {
		id: 'app.curseforge.install.existing_tab',
		defaultMessage: 'Существующая сборка',
	},
	newInstanceTab: { id: 'app.curseforge.install.new_tab', defaultMessage: 'Новая сборка' },
	searchPlaceholder: {
		id: 'app.curseforge.install.search_placeholder',
		defaultMessage: 'Поиск сборки',
	},
	showUnavailable: {
		id: 'app.curseforge.install.show_unavailable',
		defaultMessage: 'Показать несовместимые сборки',
	},
	hideUnavailable: {
		id: 'app.curseforge.install.hide_unavailable',
		defaultMessage: 'Скрыть несовместимые сборки',
	},
	noInstances: {
		id: 'app.curseforge.install.no_instances',
		defaultMessage: 'Сборки не найдены',
	},
	installedBadge: {
		id: 'app.curseforge.install.installed_badge',
		defaultMessage: 'Установлено',
	},
	installButton: { id: 'app.curseforge.install.install_button', defaultMessage: 'Установить' },
	installingButton: {
		id: 'app.curseforge.install.installing_button',
		defaultMessage: 'Установка...',
	},
	createAndInstall: {
		id: 'app.curseforge.install.create_and_install',
		defaultMessage: 'Создать и установить',
	},
	incompatibleTooltip: {
		id: 'app.curseforge.install.incompatible_tooltip',
		defaultMessage: 'Версия игры или лоадер не совпадают, но можно попробовать установить',
	},
	compatibleCount: {
		id: 'app.curseforge.install.compatible_count',
		defaultMessage: '{count} совместимых сборок',
	},
	cancel: { id: 'app.curseforge.install.cancel', defaultMessage: 'Отмена' },
	newInstanceNameLabel: {
		id: 'app.curseforge.install.new_name_label',
		defaultMessage: 'Название сборки',
	},
	newInstanceVersionLabel: {
		id: 'app.curseforge.install.new_version_label',
		defaultMessage: 'Версия игры',
	},
	newInstanceLoaderLabel: {
		id: 'app.curseforge.install.new_loader_label',
		defaultMessage: 'Модлоадер',
	},
})

function formatTabLabel(item: string) {
	if (item === 'existing') {
		return formatMessage(messages.existingInstanceTab)
	}
	if (item === 'new') {
		return formatMessage(messages.newInstanceTab)
	}
	return item
}

function checkModCompatibility(mod: CurseForgeMod, instance: GameInstance): boolean {
	const loaderLower = (instance.loader || '').toLowerCase().trim()
	const gvLower = (instance.game_version || '').toLowerCase().trim()

	// 1. Check latestFilesIndexes
	if (mod.latestFilesIndexes?.length) {
		const match = mod.latestFilesIndexes.some((idx) => {
			const indexGv = (idx.gameVersion || '').toLowerCase().trim()
			const matchesGv = !gvLower || indexGv === gvLower
			let matchesLoader = !loaderLower
			if (loaderLower && idx.modLoader !== undefined) {
				const name = CF_LOADER_NAMES[idx.modLoader]
				matchesLoader =
					idx.modLoader === 0 ||
					name === loaderLower ||
					(loaderLower === 'quilt' && name === 'fabric') ||
					(loaderLower === 'fabric' && name === 'quilt') ||
					(loaderLower === 'neoforge' && name === 'forge') ||
					(loaderLower === 'forge' && name === 'neoforge')
			}
			return matchesGv && matchesLoader
		})
		if (match) return true
	}

	// 2. Check latestFiles
	const files = mod.latestFiles || []
	if (files.length) {
		const match = files.some((f) => {
			const vLower = (f.gameVersions || []).map((v) => v.toLowerCase().trim())
			const matchesGv = !gvLower || vLower.includes(gvLower)
			const matchesLoader =
				!loaderLower ||
				vLower.includes(loaderLower) ||
				(loaderLower === 'quilt' && vLower.includes('fabric')) ||
				(loaderLower === 'fabric' && vLower.includes('quilt')) ||
				(loaderLower === 'neoforge' && vLower.includes('forge')) ||
				(loaderLower === 'forge' && vLower.includes('neoforge'))
			return matchesGv && matchesLoader
		})
		if (match) return true
	}

	return false
}

const filteredInstances = computed(() => {
	let list = instances.value
	if (hideUninstallable.value) {
		list = list.filter((inst) => inst.isCompatible)
	}
	const filter = searchFilter.value.toLowerCase().trim()
	if (filter) {
		list = list.filter(
			(inst) =>
				inst.name.toLowerCase().includes(filter) ||
				inst.game_version.toLowerCase().includes(filter) ||
				inst.loader.toLowerCase().includes(filter),
		)
	}
	return list
})

const compatibleCount = computed(() => {
	return instances.value.filter((i) => i.isCompatible).length
})

defineExpose({
	show: async (mod: CurseForgeMod, projectType = 'mod') => {
		currentMod.value = mod
		currentProjectType.value = projectType
		searchFilter.value = ''
		tab.value = 'existing'
		newInstanceName.value = mod.name || 'My Modpack'

		try {
			const listData = await list()
			instances.value = await Promise.all(
				listData.map(async (inst) => {
					let installed = false
					try {
						const installedIds = await getInstalledProjectIds(inst.id)
						installed =
							installedIds.includes(`cf-${mod.id}`) ||
							installedIds.includes(String(mod.id))
					} catch {
						// ignore
					}
					return {
						...inst,
						installing: false,
						installed,
						isCompatible: checkModCompatibility(mod, inst),
					}
				}),
			)

			// If any instance is marked incompatible and mod didn't have latestFilesIndexes, fetch files in background to re-check
			if (!mod.latestFilesIndexes?.length && instances.value.some((i) => !i.isCompatible)) {
				getCurseForgeModFiles(mod.id).then((files) => {
					if (files.length) {
						const enrichedMod = { ...mod, latestFiles: files }
						instances.value = instances.value.map((i) => ({
							...i,
							isCompatible: checkModCompatibility(enrichedMod, i),
						}))
					}
				}).catch(() => {})
			}
		} catch (e) {
			handleError(e)
			instances.value = []
		}

		modal.value?.show()
	},
	hide: () => {
		modal.value?.hide()
	},
})

async function installToInstance(inst: InstanceEntry) {
	if (!currentMod.value || inst.installing || inst.installed) return
	inst.installing = true

	try {
		await installCurseForgeMod(
			inst.id,
			currentMod.value,
			inst.game_version,
			inst.loader,
			currentProjectType.value,
		)
		inst.installed = true

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

async function handleCreateAndInstallNew() {
	if (!currentMod.value || creatingNewInstance.value) return
	creatingNewInstance.value = true
	try {
		const job = await install_create_instance({
			name: newInstanceName.value.trim() || currentMod.value.name,
			game_version: newInstanceGameVersion.value,
			loader: newInstanceLoader.value,
			loader_version: null,
			icon_path: null,
			icon_config: null,
			link: null,
		})
		const instanceId = installJobInstanceId(job)
		if (instanceId) {
			await installCurseForgeMod(
				instanceId,
				currentMod.value,
				newInstanceGameVersion.value,
				newInstanceLoader.value,
				currentProjectType.value,
			)
			addNotification({
				type: 'success',
				title: 'Сборка создана',
				text: `Сборка создана с установленным модом «${currentMod.value.name}»`,
			})
			modal.value?.hide()
			router.push(`/instance/${encodeURIComponent(instanceId)}`)
		}
	} catch (e) {
		handleError(e)
	} finally {
		creatingNewInstance.value = false
	}
}
</script>

<template>
	<NewModal
		ref="modal"
		no-padding
		scrollable
		max-width="560px"
		width="560px"
	>
		<template #title>
			<span class="text-2xl font-semibold text-contrast">
				{{ formatMessage(messages.header) }}
			</span>
		</template>

		<!-- Project banner (matching Modrinth native modal) -->
		<div
			v-if="currentMod"
			class="flex items-center gap-3 rounded-[20px] bg-surface-2 mx-6 mt-6 p-3"
		>
			<div class="size-14 shrink-0 overflow-hidden rounded-2xl border border-solid border-surface-5">
				<Avatar
					:src="currentMod.logo?.thumbnailUrl || currentMod.logo?.url"
					:alt="currentMod.name"
					size="100%"
					no-shadow
				/>
			</div>
			<div class="flex flex-col gap-1 overflow-hidden">
				<span class="font-semibold text-contrast truncate">{{ currentMod.name }}</span>
				<div v-if="currentMod.authors?.length" class="flex items-center gap-2 text-sm text-secondary truncate">
					<span class="font-medium">{{ currentMod.authors.map((a) => a.name).join(', ') }}</span>
				</div>
			</div>
		</div>

		<!-- Tab Chips (Existing vs New Instance) -->
		<div class="flex flex-col gap-2.5 p-6">
			<span class="font-semibold text-contrast">
				{{ formatMessage(messages.instanceType) }}
			</span>
			<Chips
				v-model="tab"
				:items="tabs"
				:format-label="formatTabLabel"
				:never-empty="true"
				:capitalize="false"
			/>
		</div>

		<div class="h-px bg-divider" />

		<!-- Existing instance tab -->
		<div
			v-if="tab === 'existing'"
			class="flex flex-col gap-3 bg-surface-2 py-4"
			style="height: 360px; overflow-y: auto"
		>
			<div class="flex items-start gap-3 px-6">
				<StyledInput
					v-model="searchFilter"
					:icon="SearchIcon"
					:placeholder="formatMessage(messages.searchPlaceholder)"
					class="flex-1"
				/>
				<IconButton
					v-tooltip="
						formatMessage(hideUninstallable ? messages.showUnavailable : messages.hideUnavailable)
					"
					type="outlined"
					:label="
						formatMessage(hideUninstallable ? messages.showUnavailable : messages.hideUnavailable)
					"
					@click="hideUninstallable = !hideUninstallable"
				>
					<EyeOffIcon v-if="hideUninstallable" />
					<EyeIcon v-else />
				</IconButton>
			</div>

			<div
				v-if="!filteredInstances.length"
				class="flex items-center justify-center py-12 text-secondary"
			>
				{{ formatMessage(messages.noInstances) }}
			</div>

			<div v-else class="flex flex-col gap-1">
				<div
					v-for="inst in filteredInstances"
					:key="inst.id"
					class="flex items-center justify-between px-6 py-2 transition-colors"
					:class="inst.installed ? 'opacity-60' : 'hover:bg-surface-3'"
				>
					<div class="flex min-w-0 items-center gap-3 overflow-hidden text-left">
						<Avatar :src="getInstanceIconUrl(inst.icon_path)" size="2rem" rounded="md" />
						<div class="flex flex-col overflow-hidden">
							<span class="truncate font-semibold text-contrast">{{ inst.name }}</span>
							<div class="flex items-center gap-1.5 text-xs text-secondary">
								<span class="capitalize">{{ inst.loader }}</span>
								<span>•</span>
								<span>{{ inst.game_version }}</span>
							</div>
						</div>
					</div>

					<Button v-if="inst.installed" disabled>
						<CheckIcon />
						{{ formatMessage(messages.installedBadge) }}
					</Button>
					<Button
						v-else
						v-tooltip="!inst.isCompatible ? formatMessage(messages.incompatibleTooltip) : undefined"
						:type="inst.isCompatible ? 'base' : 'outlined'"
						:class="
							inst.isCompatible
								? undefined
								: '!text-orange [&>svg]:!text-orange !shadow-[inset_0_0_0_1px_var(--color-orange)]'
						"
						:disabled="inst.installing"
						@click="installToInstance(inst)"
					>
						<SpinnerIcon v-if="inst.installing" class="animate-spin" />
						<TriangleAlertIcon v-else-if="!inst.isCompatible" />
						<PlusIcon v-else />
						<span>
							{{
								inst.installing
									? formatMessage(messages.installingButton)
									: formatMessage(messages.installButton)
							}}
						</span>
					</Button>
				</div>
			</div>
		</div>

		<!-- New instance tab -->
		<div v-else class="flex flex-col gap-4 bg-surface-2 p-6" style="height: 360px; overflow-y: auto">
			<div class="flex flex-col gap-2">
				<label class="text-sm font-semibold text-contrast">
					{{ formatMessage(messages.newInstanceNameLabel) }}
				</label>
				<StyledInput v-model="newInstanceName" placeholder="Название сборки" />
			</div>

			<div class="flex flex-col gap-2">
				<label class="text-sm font-semibold text-contrast">
					{{ formatMessage(messages.newInstanceVersionLabel) }}
				</label>
				<StyledInput v-model="newInstanceGameVersion" placeholder="1.21.11" />
			</div>

			<div class="flex flex-col gap-2">
				<label class="text-sm font-semibold text-contrast">
					{{ formatMessage(messages.newInstanceLoaderLabel) }}
				</label>
				<StyledInput v-model="newInstanceLoader" placeholder="fabric / forge / neoforge / quilt" />
			</div>

			<div class="pt-4">
				<Button
					type="base"
					class="w-full justify-center"
					:disabled="creatingNewInstance"
					@click="handleCreateAndInstallNew"
				>
					<SpinnerIcon v-if="creatingNewInstance" class="animate-spin" />
					<PlusIcon v-else />
					<span>{{ formatMessage(messages.createAndInstall) }}</span>
				</Button>
			</div>
		</div>

		<!-- Modal footer -->
		<div class="flex items-center justify-between p-6 border-t border-solid border-divider bg-surface-1">
			<span class="text-sm text-secondary">
				{{ formatMessage(messages.compatibleCount, { count: compatibleCount }) }}
			</span>
			<Button type="outlined" @click="modal?.hide()">
				{{ formatMessage(messages.cancel) }}
			</Button>
		</div>
	</NewModal>
</template>
