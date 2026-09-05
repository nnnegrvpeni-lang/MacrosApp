<script setup lang="ts">
import { ArrowBigUpDashIcon, RefreshCwIcon } from '@modrinth/assets'
import {
	Button,
	defineMessages,
	injectAuth,
	injectPopupNotificationManager,
	injectUserPreferences,
	Toggle,
	useSavable,
	useVIntl,
} from '@modrinth/ui'
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'

import {
	DEFAULT_FEATURE_FLAGS,
	type FeatureFlag,
	useAppSettings,
} from '@/composables/use-app-settings.ts'
import {
	checkForMacrosUpdate,
	checkingUpdate,
	macrosAppUpdate,
} from '@/composables/use-macros-update'
import { type AppSettings, get, set } from '@/helpers/settings.ts'
import { appSettingsModalContextKey } from '@/providers/app-settings-modal'

const appSettings = useAppSettings()
const { formatMessage } = useVIntl()
const auth = injectAuth()
const { updatePreferences } = injectUserPreferences()
const settingsModal = inject(appSettingsModalContextKey, null)

const worldsInHomeFlag: FeatureFlag = 'worlds_in_home'
const compactInstanceCardsFlag: FeatureFlag = 'compact_instance_cards'
const skipNonEssentialWarningsFlag: FeatureFlag = 'skip_non_essential_warnings'
const skipUnknownPackWarningFlag: FeatureFlag = 'skip_unknown_pack_warning'
const showPlayTimeFlag: FeatureFlag = 'show_instance_play_time'
const showSidebarNewsFlag: FeatureFlag = 'show_sidebar_news'
const checkLauncherUpdatesFlag: FeatureFlag = 'check_launcher_updates'

const messages = defineMessages({
	syncAcrossDevicesTitle: {
		id: 'app.behavior-settings.sync-across-devices.title',
		defaultMessage: 'Sync behavior across devices',
	},
	syncAcrossDevicesDescription: {
		id: 'app.behavior-settings.sync-across-devices.description',
		defaultMessage:
			"Use these behavior settings everywhere you're signed in. Turn this off to keep separate settings on this device.",
	},
	syncAcrossDevicesSignedOutTooltip: {
		id: 'app.behavior-settings.sync-across-devices.signed-out-tooltip',
		defaultMessage: 'Sign into a Modrinth account to sync settings.',
	},
	startupAndNavigationTitle: {
		id: 'app.behavior-settings.startup-and-navigation.title',
		defaultMessage: 'Startup and navigation',
	},
	contentTitle: {
		id: 'app.behavior-settings.content.title',
		defaultMessage: 'Home and content',
	},
	confirmationsTitle: {
		id: 'app.behavior-settings.confirmations.title',
		defaultMessage: 'Confirmations',
	},
	minimizeLauncherTitle: {
		id: 'app.appearance-settings.minimize-launcher.title',
		defaultMessage: 'Minimize app',
	},
	minimizeLauncherDescription: {
		id: 'app.appearance-settings.minimize-launcher.description',
		defaultMessage: 'Minimize Modrinth App when Minecraft starts.',
	},
	defaultLandingPageHome: {
		id: 'app.appearance-settings.default-landing-page.home',
		defaultMessage: 'Home',
	},
	defaultLandingPageLibrary: {
		id: 'app.appearance-settings.default-landing-page.library',
		defaultMessage: 'Library',
	},
	toggleSidebarTitle: {
		id: 'app.appearance-settings.toggle-sidebar.title',
		defaultMessage: 'Hide right sidebar',
	},
	toggleSidebarDescription: {
		id: 'app.appearance-settings.toggle-sidebar.description',
		defaultMessage: 'Hide the right sidebar by default and add a button to show or hide it.',
	},
	jumpBackIntoWorldsTitle: {
		id: 'app.appearance-settings.jump-back-into-worlds.title',
		defaultMessage: 'Jump into worlds or instances',
	},
	jumpBackIntoWorldsDescription: {
		id: 'app.appearance-settings.jump-back-into-worlds.description',
		defaultMessage:
			'Show recently played worlds or instances in the "Jump in" section on the Home page.',
	},
	compactModeTitle: {
		id: 'app.appearance-settings.compact-mode.title',
		defaultMessage: 'Compact mode',
	},
	compactModeDescription: {
		id: 'app.appearance-settings.compact-mode.description',
		defaultMessage: 'Display library instances in a compact row layout.',
	},
	showPlayTimeTitle: {
		id: 'app.appearance-settings.show-play-time.title',
		defaultMessage: 'Show play time',
	},
	showPlayTimeDescription: {
		id: 'app.appearance-settings.show-play-time.description',
		defaultMessage: `Show how long you've played each instance.`,
	},
	hideNametagTitle: {
		id: 'app.appearance-settings.hide-nametag.title',
		defaultMessage: 'Hide nametag',
	},
	hideNametagDescription: {
		id: 'app.appearance-settings.hide-nametag.description',
		defaultMessage: 'Hide your username above the player preview on the Skin selector page.',
	},
	unknownPackWarningTitle: {
		id: 'app.appearance-settings.unknown-pack-warning.title',
		defaultMessage: 'Warn me before installing unknown modpacks',
	},
	unknownPackWarningDescription: {
		id: 'app.appearance-settings.unknown-pack-warning.description',
		defaultMessage:
			"Show a safety warning before installing a Modrinth Pack (.mrpack) that isn't hosted on Modrinth.",
	},
	skipNonEssentialWarningsTitle: {
		id: 'app.appearance-settings.skip-non-essential-warnings.title',
		defaultMessage: 'Skip non-essential warnings',
	},
	skipNonEssentialWarningsDescription: {
		id: 'app.appearance-settings.skip-non-essential-warnings.description',
		defaultMessage:
			'Skip confirmations for low-risk actions such as duplicate installs, normal content deletion, bulk updates, unlinking, and repairs. Warnings for dangerous actions are always shown.',
	},
	showSidebarNewsTitle: {
		id: 'app.behavior-settings.show-sidebar-news.title',
		defaultMessage: 'Show news in sidebar',
	},
	showSidebarNewsDescription: {
		id: 'app.behavior-settings.show-sidebar-news.description',
		defaultMessage: 'Display news and release updates in the right sidebar.',
	},
})

type BehaviorSettingsState = {
	syncBehaviorAcrossDevices: boolean
	minimizeApp: boolean
	hideRightSidebar: boolean
	showJumpIn: boolean
	compactInstanceCards: boolean
	showPlayTime: boolean
	hideNametag: boolean
	warnOnUnknownModpacks: boolean
	skipNonEssentialWarnings: boolean
	showSidebarNews: boolean
	checkLauncherUpdates: boolean
}

const persistedSettings = ref(await get())

function getBehaviorSettingsState(settings: AppSettings): BehaviorSettingsState {
	return {
		syncBehaviorAcrossDevices: settings.sync_behavior_across_devices,
		minimizeApp: settings.hide_on_process_start,
		hideRightSidebar: settings.toggle_sidebar,
		showJumpIn: settings.feature_flags[worldsInHomeFlag] ?? DEFAULT_FEATURE_FLAGS[worldsInHomeFlag],
		compactInstanceCards:
			settings.feature_flags[compactInstanceCardsFlag] ??
			DEFAULT_FEATURE_FLAGS[compactInstanceCardsFlag],
		showPlayTime:
			settings.feature_flags[showPlayTimeFlag] ?? DEFAULT_FEATURE_FLAGS[showPlayTimeFlag],
		hideNametag: settings.hide_nametag_skins_page,
		warnOnUnknownModpacks: !(
			settings.feature_flags[skipUnknownPackWarningFlag] ??
			DEFAULT_FEATURE_FLAGS[skipUnknownPackWarningFlag]
		),
		skipNonEssentialWarnings:
			settings.feature_flags[skipNonEssentialWarningsFlag] ??
			DEFAULT_FEATURE_FLAGS[skipNonEssentialWarningsFlag],
		showSidebarNews:
			settings.feature_flags[showSidebarNewsFlag] ??
			DEFAULT_FEATURE_FLAGS[showSidebarNewsFlag],
		checkLauncherUpdates:
			settings.feature_flags[checkLauncherUpdatesFlag] ??
			DEFAULT_FEATURE_FLAGS[checkLauncherUpdatesFlag],
	}
}

const { saved, current, changes, saving, hasChanges, reset, save } = useSavable(
	() => getBehaviorSettingsState(persistedSettings.value),
	async () => {
		const value = current.value

		if (value.syncBehaviorAcrossDevices && auth.user.value) {
			await updatePreferences({
				behavior: {
					minimize_app: value.minimizeApp,
					hide_right_sidebar: value.hideRightSidebar,
					show_jump_in: value.showJumpIn,
					compact_instance_cards: value.compactInstanceCards,
					show_play_time: value.showPlayTime,
					hide_nametag: value.hideNametag,
					warn_on_unknown_modpacks: value.warnOnUnknownModpacks,
					skip_non_essential_warnings: value.skipNonEssentialWarnings,
				},
			})
		}

		const nextSettings: AppSettings = {
			...persistedSettings.value,
			sync_behavior_across_devices: value.syncBehaviorAcrossDevices,
			hide_on_process_start: value.minimizeApp,
			toggle_sidebar: value.hideRightSidebar,
			hide_nametag_skins_page: value.hideNametag,
			feature_flags: {
				...persistedSettings.value.feature_flags,
				[worldsInHomeFlag]: value.showJumpIn,
				[compactInstanceCardsFlag]: value.compactInstanceCards,
				[showPlayTimeFlag]: value.showPlayTime,
				[skipUnknownPackWarningFlag]: !value.warnOnUnknownModpacks,
				[skipNonEssentialWarningsFlag]: value.skipNonEssentialWarnings,
				[showSidebarNewsFlag]: value.showSidebarNews,
				[checkLauncherUpdatesFlag]: value.checkLauncherUpdates,
			},
		}

		await set(nextSettings)
		persistedSettings.value = nextSettings
		appSettings.setBehaviorSyncAcrossDevices(value.syncBehaviorAcrossDevices)
		appSettings.toggleSidebar = value.hideRightSidebar
		appSettings.hideNametagSkinsPage = value.hideNametag
		appSettings.featureFlags[worldsInHomeFlag] = value.showJumpIn
		appSettings.featureFlags[compactInstanceCardsFlag] = value.compactInstanceCards
		appSettings.featureFlags[showPlayTimeFlag] = value.showPlayTime
		appSettings.featureFlags[skipUnknownPackWarningFlag] = !value.warnOnUnknownModpacks
		appSettings.featureFlags[skipNonEssentialWarningsFlag] = value.skipNonEssentialWarnings
		appSettings.featureFlags[showSidebarNewsFlag] = value.showSidebarNews
		appSettings.featureFlags[checkLauncherUpdatesFlag] = value.checkLauncherUpdates
	},
)

async function saveBehaviorSettings(): Promise<void> {
	try {
		await save()
	} catch {
		return
	}
}

onMounted(() => {
	settingsModal?.registerUnsavedChangesController({
		hasChanges: () => hasChanges.value,
		getOriginal: () => saved.value,
		getModified: () => changes.value,
		isSaving: () => saving.value,
		reset,
		save: saveBehaviorSettings,
	})
})

onBeforeUnmount(() => {
	settingsModal?.registerUnsavedChangesController(null)
})

const popupNotificationManager = injectPopupNotificationManager()

function manualCheckUpdate() {
	void checkForMacrosUpdate(popupNotificationManager, { notifyIfLatest: true })
}
</script>
<template>
	<section class="border-0 border-b border-solid border-divider pb-6">
		<div class="flex items-center justify-between gap-4">
			<div>
				<h2 id="sync-behavior-across-devices-label" class="m-0 text-lg font-semibold text-contrast">
					{{ formatMessage(messages.syncAcrossDevicesTitle) }}
				</h2>
				<p class="m-0 mt-1 text-secondary">
					{{ formatMessage(messages.syncAcrossDevicesDescription) }}
				</p>
			</div>
			<span
				v-tooltip="
					!auth.user.value ? formatMessage(messages.syncAcrossDevicesSignedOutTooltip) : undefined
				"
				class="inline-flex shrink-0"
			>
				<Toggle
					id="sync-behavior-across-devices"
					:model-value="Boolean(auth.user.value) && current.syncBehaviorAcrossDevices"
					:disabled="!auth.user.value"
					aria-labelledby="sync-behavior-across-devices-label"
					@update:model-value="current.syncBehaviorAcrossDevices = $event"
				/>
			</span>
		</div>
	</section>

	<section class="mt-6">
		<h2 class="m-0 text-xl font-semibold text-contrast">
			{{ formatMessage(messages.startupAndNavigationTitle) }}
		</h2>
		<div class="mt-4 flex flex-col gap-6">
			<div class="flex items-center justify-between gap-4">
				<div>
					<h3 class="m-0 text-lg font-semibold text-contrast">
						{{ formatMessage(messages.minimizeLauncherTitle) }}
					</h3>
					<p class="m-0 mt-1">
						{{ formatMessage(messages.minimizeLauncherDescription) }}
					</p>
				</div>
				<Toggle id="minimize-launcher" v-model="current.minimizeApp" />
			</div>

			<div class="flex items-center justify-between gap-4">
				<div>
					<h3 class="m-0 text-lg font-semibold text-contrast">
						{{ formatMessage(messages.toggleSidebarTitle) }}
					</h3>
					<p class="m-0 mt-1">{{ formatMessage(messages.toggleSidebarDescription) }}</p>
				</div>
				<Toggle id="toggle-sidebar" v-model="current.hideRightSidebar" />
			</div>
		</div>
	</section>

	<section class="mt-8 border-0 border-t border-solid border-divider pt-6">
		<h2 class="m-0 text-xl font-semibold text-contrast">
			{{ formatMessage(messages.contentTitle) }}
		</h2>
		<div class="mt-4 flex flex-col gap-6">
			<div class="flex items-center justify-between gap-4">
				<div>
					<h3 class="m-0 text-lg font-semibold text-contrast">
						{{ formatMessage(messages.jumpBackIntoWorldsTitle) }}
					</h3>
					<p class="m-0 mt-1">
						{{ formatMessage(messages.jumpBackIntoWorldsDescription) }}
					</p>
				</div>
				<Toggle id="jump-back-into-worlds" v-model="current.showJumpIn" />
			</div>

			<div class="flex items-center justify-between gap-4">
				<div>
					<h3 class="m-0 text-lg font-semibold text-contrast">
						{{ formatMessage(messages.compactModeTitle) }}
					</h3>
					<p class="m-0 mt-1">{{ formatMessage(messages.compactModeDescription) }}</p>
				</div>
				<Toggle id="compact-mode" v-model="current.compactInstanceCards" />
			</div>

			<div class="flex items-center justify-between gap-4">
				<div>
					<h3 class="m-0 text-lg font-semibold text-contrast">
						{{ formatMessage(messages.showPlayTimeTitle) }}
					</h3>
					<p class="m-0 mt-1">{{ formatMessage(messages.showPlayTimeDescription) }}</p>
				</div>
				<Toggle id="show-play-time" v-model="current.showPlayTime" />
			</div>

			<div class="flex items-center justify-between gap-4">
				<div>
					<h3 class="m-0 text-lg font-semibold text-contrast">
						{{ formatMessage(messages.hideNametagTitle) }}
					</h3>
					<p class="m-0 mt-1">{{ formatMessage(messages.hideNametagDescription) }}</p>
				</div>
				<Toggle id="hide-nametag-skins-page" v-model="current.hideNametag" />
			</div>

			<div class="flex items-center justify-between gap-4">
				<div>
					<h3 class="m-0 text-lg font-semibold text-contrast">
						{{ formatMessage(messages.showSidebarNewsTitle) }}
					</h3>
					<p class="m-0 mt-1">{{ formatMessage(messages.showSidebarNewsDescription) }}</p>
				</div>
				<Toggle id="show-sidebar-news" v-model="current.showSidebarNews" />
			</div>
		</div>
	</section>

	<section class="mt-8 border-0 border-t border-solid border-divider pt-6">
		<h2 class="m-0 text-xl font-semibold text-contrast">
			{{ formatMessage(messages.confirmationsTitle) }}
		</h2>
		<div class="mt-4 flex flex-col gap-6">
			<div class="flex items-center justify-between gap-4">
				<div>
					<h3 class="m-0 text-lg font-semibold text-contrast">
						{{ formatMessage(messages.unknownPackWarningTitle) }}
					</h3>
					<p class="m-0 mt-1">
						{{ formatMessage(messages.unknownPackWarningDescription) }}
					</p>
				</div>
				<Toggle
					id="warn-before-installing-unknown-modpacks"
					v-model="current.warnOnUnknownModpacks"
				/>
			</div>

			<div class="flex items-center justify-between gap-4">
				<div>
					<h3 class="m-0 text-lg font-semibold text-contrast">
						{{ formatMessage(messages.skipNonEssentialWarningsTitle) }}
					</h3>
					<p class="m-0 mt-1">
						{{ formatMessage(messages.skipNonEssentialWarningsDescription) }}
					</p>
				</div>
				<Toggle id="skip-non-essential-warnings" v-model="current.skipNonEssentialWarnings" />
			</div>
		</div>
	</section>

	<section class="mt-8 border-0 border-t border-solid border-divider pt-6">
		<h2 class="m-0 text-xl font-semibold text-contrast">
			Обновления MacrosApp
		</h2>
		<div class="mt-4 flex flex-col gap-6">
			<div
				v-if="macrosAppUpdate"
				class="flex items-center justify-between p-4 rounded-xl bg-brand/10 border border-brand/30"
			>
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center text-brand shrink-0">
						<ArrowBigUpDashIcon class="w-6 h-6" />
					</div>
					<div>
						<div class="font-bold text-contrast flex items-center gap-2">
							Доступно обновление {{ macrosAppUpdate.version }}!
							<span class="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
						</div>
						<div class="text-xs text-secondary mt-0.5">
							{{ macrosAppUpdate.notes || 'Новая версия готова к загрузке' }}
						</div>
					</div>
				</div>
				<a
					:href="macrosAppUpdate.downloadUrl"
					target="_blank"
					class="px-4 py-2 rounded-lg bg-brand text-black font-semibold hover:brightness-110 no-underline transition-all flex items-center gap-2 shrink-0"
				>
					<ArrowBigUpDashIcon class="w-4 h-4" />
					Скачать обновление
				</a>
			</div>

			<div class="flex items-center justify-between gap-4">
				<div>
					<h3 class="m-0 text-lg font-semibold text-contrast">
						Проверять обновления при запуске
					</h3>
					<p class="m-0 mt-1">
						Автоматически проверять наличие новых версий лаунчера на GitHub при запуске приложения.
					</p>
				</div>
				<Toggle id="check-launcher-updates" v-model="current.checkLauncherUpdates" />
			</div>

			<div class="flex items-center gap-3">
				<Button
					type="outlined"
					size="sm"
					:disabled="checkingUpdate"
					@click="manualCheckUpdate"
				>
					<RefreshCwIcon class="w-4 h-4 mr-1.5" :class="{ 'animate-spin': checkingUpdate }" />
					{{ checkingUpdate ? 'Проверка...' : 'Проверить сейчас' }}
				</Button>
			</div>
		</div>
	</section>
</template>
