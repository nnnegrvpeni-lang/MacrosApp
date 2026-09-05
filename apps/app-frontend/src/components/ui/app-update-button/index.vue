<template>
	<Button
		v-if="showAnyUpdatePill"
		type="outlined"
		native-type="button"
		class="!h-[34px] text-sm !transition-[opacity,transform,background-color,color,filter] !duration-200 ease-out !text-brand [&>svg]:!text-inherit !shadow-[inset_0_0_0_1px_var(--color-brand)] hover:!bg-brand focus-visible:!bg-brand hover:!text-[var(--color-accent-contrast)] focus-visible:!text-[var(--color-accent-contrast)]"
		:class="{
			'opacity-0 scale-[0.96]': finishedDownloading && !animateReadyPill,
			'opacity-100 scale-100': (finishedDownloading && animateReadyPill) || !!macrosAppUpdate,
		}"
		:disabled="isUpdateDownloading"
		:aria-busy="isUpdateDownloading"
		@click="handleUpdateClick"
	>
		<RefreshCwIcon v-if="finishedDownloading" :class="{ 'animate-spin': restarting }" />
		<DownloadIcon v-else />
		<span v-if="macrosAppUpdate">
			Доступно {{ macrosAppUpdate.version }}
		</span>
		<span v-else-if="isUpdateDownloading">
			{{ formatMessage(messages.downloadingUpdate) }}
			<span class="inline-block w-[3ch] text-right tabular-nums">{{ downloadPercent }}%</span>
		</span>
		<span v-else>{{ updateLabel }}</span>
	</Button>
</template>

<script setup lang="ts">
import { DownloadIcon, RefreshCwIcon } from '@modrinth/assets'
import { Button, defineMessages, useVIntl } from '@modrinth/ui'
import { openUrl } from '@tauri-apps/plugin-opener'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

import { macrosAppUpdate } from '@/composables/use-macros-update'
import {
	appUpdateState,
	downloadAvailableAppUpdate,
	installAvailableAppUpdate,
} from '@/providers/app-update'

const { formatMessage } = useVIntl()

const messages = defineMessages({
	update: {
		id: 'app.action-bar.update',
		defaultMessage: 'Update',
	},
	downloadingUpdate: {
		id: 'app.action-bar.downloading-update',
		defaultMessage: 'Downloading update',
	},
	reloadToUpdate: {
		id: 'app.action-bar.reload-to-update',
		defaultMessage: 'Reload to update',
	},
})

const {
	downloading,
	downloadPercent,
	downloadProgress,
	finishedDownloading,
	isVisible: isUpdateVisible,
	metered,
	restarting,
} = appUpdateState

const isUpdateDownloading = computed(
	() =>
		downloading.value ||
		(downloadProgress.value > 0 && downloadProgress.value < 1 && !finishedDownloading.value),
)
const showUpdatePill = computed(
	() => isUpdateVisible.value && (finishedDownloading.value || metered.value),
)
const showAnyUpdatePill = computed(() => !!macrosAppUpdate.value || showUpdatePill.value)
const animateReadyPill = ref(false)
const updateLabel = computed(() => {
	if (isUpdateDownloading.value) {
		return formatMessage(messages.downloadingUpdate)
	}

	if (finishedDownloading.value) {
		return formatMessage(messages.reloadToUpdate)
	}

	return formatMessage(messages.update)
})
let readyPillAnimationFrame: number | null = null
watch([showUpdatePill, finishedDownloading], async ([show, ready], [wasShown, wasReady]) => {
	if (readyPillAnimationFrame !== null) {
		cancelAnimationFrame(readyPillAnimationFrame)
		readyPillAnimationFrame = null
	}

	if (!show || !ready) {
		animateReadyPill.value = false
		return
	}

	if (wasShown && wasReady) {
		return
	}

	animateReadyPill.value = false
	await nextTick()
	readyPillAnimationFrame = requestAnimationFrame(() => {
		animateReadyPill.value = true
		readyPillAnimationFrame = null
	})
})
async function handleUpdateClick() {
	if (macrosAppUpdate.value) {
		void openUrl(macrosAppUpdate.value.downloadUrl)
		return
	}

	if (isUpdateDownloading.value) {
		return
	}

	if (finishedDownloading.value) {
		await installAvailableAppUpdate()
	} else {
		await downloadAvailableAppUpdate()
	}
}

onBeforeUnmount(() => {
	if (readyPillAnimationFrame !== null) {
		cancelAnimationFrame(readyPillAnimationFrame)
	}
})
</script>
