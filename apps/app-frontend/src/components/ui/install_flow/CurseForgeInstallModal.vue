<script setup lang="ts">
import { CheckIcon, PlusIcon, SearchIcon, SpinnerIcon } from '@modrinth/assets'
import {
	Avatar,
	Button,
	defineMessages,
	injectNotificationManager,
	StyledInput,
	useVIntl,
} from '@modrinth/ui'
import { useQueryClient } from '@tanstack/vue-query'
import { computed, ref } from 'vue'

import ModalWrapper from '@/components/ui/modal/ModalWrapper.vue'
import {
	type CurseForgeMod,
	installCurseForgeMod,
} from '@/helpers/curseforge'
import { getInstanceIconUrl, list } from '@/helpers/instance'
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

const modal = ref<InstanceType<typeof ModalWrapper> | null>(null)
const searchFilter = ref('')
const instances = ref<InstanceEntry[]>([])
const currentMod = ref<CurseForgeMod | null>(null)
const currentProjectType = ref('mod')

const messages = defineMessages({
	title: { id: 'app.curseforge.install.title', defaultMessage: 'Install from CurseForge' },
	selectInstance: {
		id: 'app.curseforge.install.select-instance',
		defaultMessage: 'Select an instance to install {modName}:',
	},
	searchPlaceholder: {
		id: 'app.curseforge.install.search-placeholder',
		defaultMessage: 'Search instances...',
	},
	install: { id: 'app.curseforge.install.button', defaultMessage: 'Install' },
	installing: { id: 'app.curseforge.install.installing', defaultMessage: 'Installing...' },
	installed: { id: 'app.curseforge.install.installed', defaultMessage: 'Installed' },
	noInstances: {
		id: 'app.curseforge.install.no-instances',
		defaultMessage: 'No instances found. Please create an instance first.',
	},
	close: { id: 'app.curseforge.install.close', defaultMessage: 'Close' },
})

const shownInstances = computed(() => {
	const filter = searchFilter.value.toLowerCase().trim()
	if (!filter) return instances.value
	return instances.value.filter(
		(inst) =>
			inst.name.toLowerCase().includes(filter) ||
			inst.game_version.toLowerCase().includes(filter) ||
			inst.loader.toLowerCase().includes(filter),
	)
})

function checkModCompatibility(mod: CurseForgeMod, instance: GameInstance): boolean {
	const files = mod.latestFiles || []
	if (!files.length) return true
	const loaderLower = instance.loader?.toLowerCase()
	const gvLower = instance.game_version?.toLowerCase()

	return files.some((f) => {
		const vLower = (f.gameVersions || []).map((v) => v.toLowerCase())
		const matchesGv = !gvLower || vLower.includes(gvLower)
		const matchesLoader =
			!loaderLower ||
			vLower.includes(loaderLower) ||
			(loaderLower === 'quilt' && vLower.includes('fabric'))
		return matchesGv && matchesLoader
	})
}

defineExpose({
	show: async (mod: CurseForgeMod, projectType = 'mod') => {
		currentMod.value = mod
		currentProjectType.value = projectType
		searchFilter.value = ''

		try {
			const listData = await list()
			instances.value = listData.map((inst) => ({
				...inst,
				installing: false,
				installed: false,
				isCompatible: checkModCompatibility(mod, inst),
			}))
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
			queryKey: instanceKeys.projects(inst.id),
		})

		addNotification({
			type: 'success',
			title: 'Installed successfully',
			text: `${currentMod.value.name} has been added to ${inst.name}`,
		})
	} catch (e) {
		handleError(e)
	} finally {
		inst.installing = false
	}
}
</script>

<template>
	<ModalWrapper ref="modal" :header="formatMessage(messages.title)">
		<div class="flex flex-col gap-4 min-w-[360px] max-w-[500px]">
			<div v-if="currentMod" class="flex items-center gap-3 p-3 bg-bg-raised rounded-xl">
				<img
					v-if="currentMod.logo?.thumbnailUrl || currentMod.logo?.url"
					:src="currentMod.logo.thumbnailUrl || currentMod.logo.url"
					alt=""
					class="size-12 rounded-lg object-cover bg-surface-4"
				/>
				<div class="flex flex-col overflow-hidden">
					<span class="font-bold text-base text-contrast truncate">{{ currentMod.name }}</span>
					<span class="text-xs text-secondary line-clamp-2">{{ currentMod.summary }}</span>
				</div>
			</div>

			<p class="text-sm text-secondary font-medium">
				{{ formatMessage(messages.selectInstance, { modName: currentMod?.name || '' }) }}
			</p>

			<StyledInput
				v-model="searchFilter"
				:icon="SearchIcon"
				type="search"
				:placeholder="formatMessage(messages.searchPlaceholder)"
				autocomplete="off"
			/>

			<div class="flex flex-col gap-2 max-h-[22rem] overflow-y-auto pr-1">
				<div
					v-if="!instances.length"
					class="p-4 text-center text-sm text-secondary bg-bg-raised rounded-lg"
				>
					{{ formatMessage(messages.noInstances) }}
				</div>

				<div
					v-for="inst in shownInstances"
					:key="inst.id"
					class="flex items-center justify-between gap-3 p-2.5 bg-bg-raised hover:bg-bg-raised-hover transition-colors rounded-xl border border-solid border-surface-4"
				>
					<div class="flex items-center gap-3 overflow-hidden">
						<Avatar :src="getInstanceIconUrl(inst.icon_path)" class="size-9 shrink-0" />
						<div class="flex flex-col overflow-hidden">
							<span class="font-semibold text-sm text-contrast truncate">{{ inst.name }}</span>
							<div class="flex items-center gap-1.5 text-xs text-secondary">
								<span class="capitalize">{{ inst.loader }}</span>
								<span>•</span>
								<span>{{ inst.game_version }}</span>
							</div>
						</div>
					</div>

					<Button
						:disabled="inst.installed || inst.installing"
						:color="inst.installed ? 'green' : 'brand'"
						type="outlined"
						class="shrink-0"
						@click="installToInstance(inst)"
					>
						<SpinnerIcon v-if="inst.installing" class="animate-spin size-4" />
						<CheckIcon v-else-if="inst.installed" class="size-4" />
						<PlusIcon v-else class="size-4" />
						<span>
							{{
								formatMessage(
									inst.installing
										? messages.installing
										: inst.installed
											? messages.installed
											: messages.install,
								)
							}}
						</span>
					</Button>
				</div>
			</div>

			<div class="flex justify-end pt-2">
				<Button type="transparent" @click="modal?.hide()">
					{{ formatMessage(messages.close) }}
				</Button>
			</div>
		</div>
	</ModalWrapper>
</template>
