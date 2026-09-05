<template>
	<div
		v-if="accounts.length === 0"
		class="flex flex-col gap-3 bg-button-bg border border-solid border-surface-5 rounded-xl p-3 mt-2"
	>
		<span>{{ formatMessage(messages.notSignedIn) }}</span>
		<div class="flex flex-col gap-2">
			<Button type="colored" color="brand" :disabled="loginDisabled" @click="openOfflineModal()">
				<UserPlusIcon />
				{{ formatMessage(messages.addOfflineAccount) }}
			</Button>
			<Button class="w-full !bg-surface-3 hover:!bg-surface-4 text-primary" :disabled="loginDisabled" @click="openElybyModal()">
				<SparklesIcon />
				{{ formatMessage(messages.addElybyAccount) }}
			</Button>
			<Button class="w-full !bg-surface-3 hover:!bg-surface-4 text-primary" :disabled="loginDisabled" @click="login()">
				<LogInIcon v-if="!loginDisabled" />
				<SpinnerIcon v-else class="animate-spin" />
				{{ formatMessage(messages.signInToMinecraft) }}
			</Button>
		</div>
	</div>
	<Accordion
		v-else
		class="w-full mt-2 bg-button-bg border border-solid border-surface-5 rounded-xl overflow-clip"
		button-class="button-base w-full bg-transparent px-3 py-2 border-0 cursor-pointer"
		:open-by-default="false"
	>
		<template #title>
			<div class="flex gap-2 w-full min-w-0">
				<Avatar
					size="36px"
					disable-conditional-icon-padding
					:src="
						selectedAccount
							? avatarUrl
							: 'https://launcher-files.modrinth.com/assets/steve_head.png'
					"
				/>
				<div class="flex flex-col items-start w-full min-w-0">
					<div class="flex items-center gap-1.5 w-full min-w-0">
						<span class="truncate text-left">{{
							selectedAccount ? selectedAccount.profile.name : formatMessage(messages.selectAccount)
						}}</span>
						<Badge
							v-if="selectedAccount && selectedAccount.refresh_token?.startsWith('elyby:')"
							color="cyan"
							size="small"
						>
							Ely.by
						</Badge>
						<Badge
							v-else-if="selectedAccount && (selectedAccount.is_offline || selectedAccount.refresh_token === 'offline')"
							color="purple"
							size="small"
						>
							Offline
						</Badge>
					</div>
					<span class="text-secondary text-xs">{{ getAccountSubtitle(selectedAccount) }}</span>
				</div>
			</div>
		</template>
		<div class="bg-button-bg pt-1 pb-2 border border-solid border-surface-5">
			<template v-if="accounts.length > 0">
				<div v-for="account in accounts" :key="account.profile.id" class="flex gap-1 items-center">
					<button
						class="flex items-center flex-shrink flex-grow overflow-clip gap-2 p-2 border-0 bg-transparent cursor-pointer button-base min-w-0"
						@click="setAccount(account)"
					>
						<RadioButtonCheckedIcon
							v-if="selectedAccount && selectedAccount.profile.id === account.profile.id"
							class="w-5 h-5 text-brand shrink-0"
						/>
						<RadioButtonIcon v-else class="w-5 h-5 text-secondary shrink-0" />
						<Avatar
							:src="getAccountAvatarUrl(account)"
							size="24px"
							disable-conditional-icon-padding
						/>
						<p
							class="m-0 truncate min-w-0"
							:class="
								selectedAccount && selectedAccount.profile.id === account.profile.id
									? 'text-contrast font-semibold'
									: 'text-primary'
							"
						>
							{{ account.profile.name }}
						</p>
						<Badge
							v-if="account.refresh_token?.startsWith('elyby:')"
							color="cyan"
							size="small"
							class="ml-auto mr-1 shrink-0"
						>
							Ely.by
						</Badge>
						<Badge
							v-else-if="account.is_offline || account.refresh_token === 'offline'"
							color="purple"
							size="small"
							class="ml-auto mr-1 shrink-0"
						>
							Offline
						</Badge>
					</button>
					<IconButton
						v-tooltip="formatMessage(messages.removeAccount)"
						type="quiet"
						color="red"
						:label="formatMessage(messages.removeAccount)"
						class="mr-2 !bg-button-bg !text-primary ![box-shadow:var(--shadow-button)] hover:!bg-red focus-visible:!bg-red hover:!text-[var(--color-accent-contrast)] focus-visible:!text-[var(--color-accent-contrast)]"
						@click="logout(account.profile.id)"
					>
						<TrashIcon />
					</IconButton>
				</div>
			</template>
			<div class="flex flex-col gap-2 px-2 pt-2">
				<Button
					v-if="accounts.length > 0"
					class="w-full !bg-button-bg !text-primary ![box-shadow:var(--shadow-button)]"
					:disabled="loginDisabled"
					@click="openOfflineModal()"
				>
					<UserPlusIcon />
					{{ formatMessage(messages.addOfflineAccount) }}
				</Button>
				<Button
					v-if="accounts.length > 0"
					class="w-full !bg-button-bg !text-primary ![box-shadow:var(--shadow-button)]"
					:disabled="loginDisabled"
					@click="openElybyModal()"
				>
					<SparklesIcon />
					{{ formatMessage(messages.addElybyAccount) }}
				</Button>
				<Button
					v-if="accounts.length > 0"
					class="w-full !bg-button-bg !text-primary ![box-shadow:var(--shadow-button)]"
					:disabled="loginDisabled"
					@click="login()"
				>
					<PlusIcon />
					{{ formatMessage(messages.addMicrosoftAccount) }}
				</Button>
			</div>
		</div>
	</Accordion>

	<NewModal
		ref="offlineModalRef"
		:header="formatMessage(messages.addOfflineAccountHeader)"
		max-width="440px"
		width="100%"
	>
		<form class="flex flex-col gap-4 p-5" @submit.prevent="submitOfflineAccount">
			<div class="flex flex-col gap-1.5">
				<label class="text-sm font-medium text-primary">
					{{ formatMessage(messages.offlineNicknameLabel) }}
				</label>
				<input
					v-model="offlineUsername"
					type="text"
					autofocus
					placeholder="Steve"
					maxlength="16"
					class="px-3 py-2 rounded-lg bg-surface-3 border border-surface-5 text-primary text-sm focus:outline-none focus:border-brand"
				/>
				<span v-if="offlineError" class="text-xs text-red mt-1">{{ offlineError }}</span>
			</div>
			<div class="flex justify-end gap-2 mt-2">
				<Button type="quiet" native-type="button" @click="offlineModalRef?.hide()">
					{{ formatMessage(messages.cancel) }}
				</Button>
				<Button
					type="colored"
					color="brand"
					native-type="submit"
					:disabled="!offlineUsername.trim() || isSubmittingOffline"
				>
					<SpinnerIcon v-if="isSubmittingOffline" class="animate-spin" />
					<span>{{ formatMessage(messages.addAccount) }}</span>
				</Button>
			</div>
		</form>
	</NewModal>

	<NewModal
		ref="elybyModalRef"
		:header="formatMessage(messages.addElybyAccountHeader)"
		max-width="460px"
		width="100%"
		@hide="cancelElybyDeviceCode"
	>
		<!-- Device code flow view -->
		<div v-if="elybyDeviceCode" class="flex flex-col items-center text-center gap-4 p-5">
			<div class="p-3 bg-surface-3 rounded-full text-brand">
				<SparklesIcon class="w-8 h-8" />
			</div>
			<div class="flex flex-col gap-1">
				<h3 class="text-base font-bold text-primary m-0">Подтверждение в браузере</h3>
				<p class="text-xs text-secondary m-0">
					Мы открыли страницу входа в браузере. Код уже подставлен автоматически — просто нажмите «Разрешить» на сайте:
				</p>
			</div>

			<div class="flex items-center gap-3 bg-surface-2 border border-surface-5 px-5 py-3 rounded-xl">
				<span class="text-2xl font-mono font-bold tracking-widest text-brand select-all">
					{{ elybyDeviceCode.user_code }}
				</span>
				<IconButton
					:label="codeCopied ? 'Скопировано!' : 'Копировать код'"
					class="!text-secondary hover:!text-primary"
					@click="copyElybyCode"
				>
					<CheckIcon v-if="codeCopied" class="text-brand" />
					<CopyIcon v-else />
				</IconButton>
			</div>

			<div class="flex items-center gap-2 text-xs text-secondary">
				<SpinnerIcon class="w-4 h-4 animate-spin text-brand" />
				<span>Ожидание подтверждения на сайте Ely.by...</span>
			</div>

			<span v-if="elybyError" class="text-xs text-red">{{ elybyError }}</span>

			<div class="flex flex-col gap-2 w-full mt-2">
				<Button
					class="w-full !bg-surface-3 hover:!bg-surface-4 text-primary text-xs"
					type="button"
					@click="reopenElybyBrowser"
				>
					<ExternalIcon class="w-3.5 h-3.5 mr-1.5" />
					Открыть страницу в браузере повторно
				</Button>
				<Button
					type="quiet"
					class="w-full text-xs"
					@click="cancelElybyDeviceCode"
				>
					{{ formatMessage(messages.cancel) }}
				</Button>
			</div>
		</div>

		<!-- Loading or error state while waiting for device code -->
		<div v-else class="flex flex-col items-center text-center gap-4 p-5">
			<div class="p-3 bg-surface-3 rounded-full text-brand">
				<SparklesIcon class="w-8 h-8" />
			</div>
			<div v-if="isSubmittingElyby" class="flex flex-col items-center gap-2 py-4">
				<SpinnerIcon class="w-6 h-6 animate-spin text-brand" />
				<span class="text-sm text-secondary">Запрос авторизации на сайте Ely.by...</span>
			</div>
			<div v-else-if="elybyError" class="flex flex-col items-center gap-2 py-2">
				<span class="text-xs text-red">{{ elybyError }}</span>
				<Button
					type="colored"
					color="brand"
					class="mt-2 text-xs"
					@click="startElybyDeviceCodeLogin"
				>
					Попробовать снова
				</Button>
			</div>
			<Button
				type="quiet"
				class="w-full text-xs mt-2"
				@click="cancelElybyDeviceCode"
			>
				{{ formatMessage(messages.cancel) }}
			</Button>
		</div>
	</NewModal>
</template>

<script setup lang="ts">
import {
	CheckIcon,
	CopyIcon,
	ExternalIcon,
	LogInIcon,
	PlusIcon,
	RadioButtonCheckedIcon,
	RadioButtonIcon,
	SparklesIcon,
	SpinnerIcon,
	TrashIcon,
	UserPlusIcon,
} from '@modrinth/assets'
import {
	Accordion,
	Avatar,
	Badge,
	Button,
	defineMessages,
	IconButton,
	injectNotificationManager,
	NewModal,
	useVIntl,
} from '@modrinth/ui'
import { arrayBufferToBase64 } from '@modrinth/utils'
import { openUrl } from '@tauri-apps/plugin-opener'
import type { Ref } from 'vue'
import { computed, onUnmounted, ref, watch } from 'vue'

import { useAppEvent } from '@/composables/use-app-event'
import { handleSevereError } from '@/composables/use-error.js'
import { trackEvent } from '@/helpers/analytics'
import {
	get_default_user,
	login as login_flow,
	login_offline,
	poll_elyby_device_code,
	remove_user,
	set_default_user,
	start_elyby_device_code,
	users,
} from '@/helpers/auth'
import { generatePlayerHeadBlob, getPlayerHeadUrl } from '@/helpers/rendering/batch-skin-renderer.ts'
import type { Skin } from '@/helpers/skins'
import { get_available_skins, normalize_skin_texture } from '@/helpers/skins'

const { formatMessage } = useVIntl()
const { handleError } = injectNotificationManager()

const emit = defineEmits<{
	change: []
}>()

type MinecraftCredential = {
	profile: {
		id: string
		name: string
	}
	access_token?: string
	refresh_token?: string
	is_offline?: boolean
}

const accounts: Ref<MinecraftCredential[]> = ref([])
const loginDisabled = ref(false)
const defaultUser = ref<string | undefined>()
const equippedSkin = ref<Skin | null>(null)
const headUrlCache = ref(new Map<string, string>())

const offlineModalRef = ref<InstanceType<typeof NewModal> | null>(null)
const offlineUsername = ref('')
const offlineError = ref('')
const isSubmittingOffline = ref(false)

const elybyModalRef = ref<InstanceType<typeof NewModal> | null>(null)
const elybyError = ref('')
const isSubmittingElyby = ref(false)
const elybyDeviceCode = ref<{
	user_code: string
	device_code: string
	verification_uri: string
	expires_in: number
	interval: number
} | null>(null)
const isPollingElyby = ref(false)
const codeCopied = ref(false)
let elybyPollTimer: any = null

function openOfflineModal() {
	offlineUsername.value = ''
	offlineError.value = ''
	offlineModalRef.value?.show()
}

function openElybyModal() {
	cancelElybyDeviceCode()
	elybyError.value = ''
	elybyModalRef.value?.show()
	startElybyDeviceCodeLogin()
}

async function submitOfflineAccount() {
	const name = offlineUsername.value.trim()
	if (!name) {
		offlineError.value = 'Please enter a username'
		return
	}
	if (!/^[a-zA-Z0-9_]{1,16}$/.test(name)) {
		offlineError.value = 'Username must be 1-16 characters (letters, numbers, underscores)'
		return
	}

	offlineError.value = ''
	isSubmittingOffline.value = true

	try {
		const newAccount = await login_offline(name)
		offlineModalRef.value?.hide()
		await setAccount(newAccount)
		trackEvent('AccountLogIn', { type: 'offline' })
	} catch (err: any) {
		offlineError.value = err?.message || 'Failed to add offline account'
	} finally {
		isSubmittingOffline.value = false
	}
}

async function startElybyDeviceCodeLogin() {
	elybyError.value = ''
	isSubmittingElyby.value = true
	try {
		const info = await start_elyby_device_code()
		elybyDeviceCode.value = info
		startPollingElyby(info)
	} catch (err: any) {
		elybyError.value =
			typeof err === 'string'
				? err
				: err?.message || 'Не удалось запросить код авторизации Ely.by'
	} finally {
		isSubmittingElyby.value = false
	}
}

function startPollingElyby(info: { device_code: string; interval: number; expires_in: number }) {
	stopPollingElyby()
	isPollingElyby.value = true
	const pollInterval = Math.max((info.interval || 5) * 1000, 3000)

	elybyPollTimer = setInterval(async () => {
		try {
			const creds = await poll_elyby_device_code(info.device_code)
			if (creds) {
				stopPollingElyby()
				elybyDeviceCode.value = null
				elybyModalRef.value?.hide()
				await setAccount(creds)
				trackEvent('AccountLogIn', { type: 'elyby' })
			}
		} catch (err: any) {
			stopPollingElyby()
			elybyError.value =
				typeof err === 'string'
					? err
					: err?.message || 'Ошибка авторизации Ely.by'
		}
	}, pollInterval)
}

function stopPollingElyby() {
	if (elybyPollTimer) {
		clearInterval(elybyPollTimer)
		elybyPollTimer = null
	}
	isPollingElyby.value = false
}

function cancelElybyDeviceCode() {
	stopPollingElyby()
	elybyDeviceCode.value = null
	elybyError.value = ''
}

async function copyElybyCode() {
	if (!elybyDeviceCode.value?.user_code) return
	try {
		await navigator.clipboard.writeText(elybyDeviceCode.value.user_code)
		codeCopied.value = true
		setTimeout(() => {
			codeCopied.value = false
		}, 2000)
	} catch {}
}

async function reopenElybyBrowser() {
	if (elybyDeviceCode.value?.user_code) {
		await openUrl(`https://account.ely.by/code?user_code=${elybyDeviceCode.value.user_code}`)
	}
}

onUnmounted(() => {
	stopPollingElyby()
})

async function refreshValues() {
	defaultUser.value = await get_default_user().catch(handleError)
	const userList = await users().catch(handleError)
	accounts.value = Array.isArray(userList) ? [...userList] : []
	accounts.value.sort((a, b) => (a.profile?.name ?? '').localeCompare(b.profile?.name ?? ''))

	try {
		const skins = await get_available_skins()
		equippedSkin.value = skins.find((skin) => skin.is_equipped) ?? null

		if (equippedSkin.value) {
			try {
				const headUrl = await getPlayerHeadUrl(equippedSkin.value)
				headUrlCache.value = new Map(headUrlCache.value).set(
					equippedSkin.value.texture_key,
					headUrl,
				)
			} catch (error) {
				console.warn('Failed to get head render for equipped skin:', error)
			}
		}
	} catch {
		equippedSkin.value = null
	}
}

async function setEquippedSkin(skin: Skin) {
	equippedSkin.value = skin

	try {
		const headUrl = await getPlayerHeadUrl(skin)
		headUrlCache.value = new Map(headUrlCache.value).set(skin.texture_key, headUrl)
	} catch (error) {
		console.warn('Failed to get head render for equipped skin:', error)
	}
}

function setLoginDisabled(value: boolean) {
	loginDisabled.value = value
}

defineExpose({
	refreshValues,
	setEquippedSkin,
	setLoginDisabled,
	login,
	openOfflineModal,
	openElybyModal,
	loginDisabled,
})

await refreshValues()

const selectedAccount = computed(() =>
	accounts.value.find((account) => account.profile.id === defaultUser.value),
)

const elyHeadMap = ref(new Map<string, string>())

async function loadElybyHead(username: string) {
	if (!username || elyHeadMap.value.has(username)) return
	try {
		const skinUrl = `http://skinsystem.ely.by/skins/${encodeURIComponent(username)}.png`
		const data = await normalize_skin_texture(skinUrl)
		const base64 = arrayBufferToBase64(data)
		const dataUrl = `data:image/png;base64,${base64}`
		const headBlob = await generatePlayerHeadBlob(dataUrl, 64)
		const blobUrl = URL.createObjectURL(headBlob)
		const nextMap = new Map(elyHeadMap.value)
		nextMap.set(username, blobUrl)
		elyHeadMap.value = nextMap
	} catch (e) {
		console.warn('Failed to render Ely.by player head:', e)
	}
}

watch(
	() => accounts.value,
	(accs) => {
		for (const acc of accs) {
			if (acc.refresh_token?.startsWith('elyby:') && acc.profile?.name) {
				loadElybyHead(acc.profile.name)
			}
		}
	},
	{ immediate: true, deep: true },
)

function getAccountSubtitle(account?: MinecraftCredential) {
	if (!account) return formatMessage(messages.minecraftAccount)
	if (account.refresh_token?.startsWith('elyby:')) {
		return formatMessage(messages.elybyAccount)
	}
	if (account.is_offline || account.refresh_token === 'offline') {
		return formatMessage(messages.offlineAccount)
	}
	return formatMessage(messages.microsoftAccount)
}

const avatarUrl = computed(() => {
	if (selectedAccount.value?.refresh_token?.startsWith('elyby:') && selectedAccount.value?.profile?.name) {
		const rendered = elyHeadMap.value.get(selectedAccount.value.profile.name)
		if (rendered) return rendered
		loadElybyHead(selectedAccount.value.profile.name)
		return `https://mc-heads.net/avatar/${selectedAccount.value.profile.name}/128`
	}
	if (equippedSkin.value?.texture_key) {
		const cachedUrl = headUrlCache.value.get(equippedSkin.value.texture_key)
		if (cachedUrl) {
			return cachedUrl
		}
		return `https://mc-heads.net/avatar/${equippedSkin.value.texture_key}/128`
	}
	if (selectedAccount.value?.profile?.id) {
		return `https://mc-heads.net/avatar/${selectedAccount.value.profile.id}/128`
	}
	return 'https://launcher-files.modrinth.com/assets/steve_head.png'
})

function getAccountAvatarUrl(account: MinecraftCredential) {
	if (account.refresh_token?.startsWith('elyby:') && account.profile?.name) {
		const rendered = elyHeadMap.value.get(account.profile.name)
		if (rendered) return rendered
		loadElybyHead(account.profile.name)
		return `https://mc-heads.net/avatar/${account.profile.name}/128`
	}
	if (
		account.profile.id === selectedAccount.value?.profile?.id &&
		equippedSkin.value?.texture_key
	) {
		const cachedUrl = headUrlCache.value.get(equippedSkin.value.texture_key)
		if (cachedUrl) {
			return cachedUrl
		}
	}
	return `https://mc-heads.net/avatar/${account.profile.id}/128`
}

async function setAccount(account: MinecraftCredential) {
	defaultUser.value = account.profile.id
	await set_default_user(account.profile.id).catch(handleError)
	await refreshValues()
	emit('change')
}

async function login() {
	loginDisabled.value = true
	const loggedIn = await login_flow().catch(handleSevereError)

	if (loggedIn) {
		await setAccount(loggedIn)
	}

	trackEvent('AccountLogIn')
	loginDisabled.value = false
}

async function logout(id: string) {
	await remove_user(id).catch(handleError)
	await refreshValues()
	if (!selectedAccount.value && accounts.value.length > 0) {
		await setAccount(accounts.value[0])
	} else {
		emit('change')
	}
	trackEvent('AccountLogOut')
}

useAppEvent('process', async (e) => {
	if (e.event === 'launched') {
		await refreshValues()
	}
})

const messages = defineMessages({
	notSignedIn: {
		id: 'minecraft-account.not-signed-in',
		defaultMessage: 'Not signed in',
	},
	addAccount: {
		id: 'minecraft-account.add-account',
		defaultMessage: 'Add account',
	},
	addMicrosoftAccount: {
		id: 'minecraft-account.add-microsoft-account',
		defaultMessage: 'Add Microsoft account',
	},
	addOfflineAccount: {
		id: 'minecraft-account.add-offline-account',
		defaultMessage: 'Add offline account',
	},
	addOfflineAccountHeader: {
		id: 'minecraft-account.add-offline-account-header',
		defaultMessage: 'Add Offline Minecraft Account',
	},
	addElybyAccount: {
		id: 'minecraft-account.add-elyby-account',
		defaultMessage: 'Sign in with Ely.by (Skins)',
	},
	addElybyAccountHeader: {
		id: 'minecraft-account.add-elyby-account-header',
		defaultMessage: 'Sign into Ely.by Account',
	},
	elybyHint: {
		id: 'minecraft-account.elyby-hint',
		defaultMessage: 'Ely.by provides custom skins and capes that will render in-game.',
	},
	elybyAccount: {
		id: 'minecraft-account.elyby-account',
		defaultMessage: 'Ely.by account',
	},
	offlineAccount: {
		id: 'minecraft-account.offline-account',
		defaultMessage: 'Offline account',
	},
	microsoftAccount: {
		id: 'minecraft-account.microsoft-account',
		defaultMessage: 'Microsoft account',
	},
	offlineNicknameLabel: {
		id: 'minecraft-account.offline-nickname-label',
		defaultMessage: 'Minecraft nickname / username',
	},
	cancel: {
		id: 'minecraft-account.cancel',
		defaultMessage: 'Cancel',
	},
	removeAccount: {
		id: 'minecraft-account.remove-account',
		defaultMessage: 'Remove account',
	},
	selectAccount: {
		id: 'minecraft-account.select-account',
		defaultMessage: 'Select account',
	},
	minecraftAccount: {
		id: 'minecraft-account.label',
		defaultMessage: 'Minecraft account',
	},
	signInToMinecraft: {
		id: 'minecraft-account.sign-in',
		defaultMessage: 'Sign in to Minecraft (Microsoft)',
	},
})
</script>
