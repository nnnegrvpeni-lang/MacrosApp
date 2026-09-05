<template>
	<NewModal
		ref="modal"
		:header="formatMessage(messages.signingInHeader)"
		:on-hide="handleHide"
		no-padding
		max-width="548px"
		width="100%"
	>
		<div class="flex w-full flex-col gap-5 p-6">
			<div class="flex flex-col gap-2 px-1">
				<h2 class="m-0 text-xl font-bold leading-7 text-contrast">
					Вход в аккаунт Modrinth
				</h2>
				<p class="m-0 text-xs text-secondary leading-relaxed">
					Открыто окно авторизации. Войдите в свой аккаунт Modrinth через появившееся окно — лаунчер автоматически завершит подключение.
				</p>
				<div v-if="errorMessage" class="rounded-xl bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-400">
					{{ errorMessage }}
				</div>
				<div v-else-if="authenticating" class="flex items-center gap-2.5 rounded-xl bg-surface-2 px-3 py-2.5 border border-surface-4 text-primary">
					<SpinnerIcon aria-hidden="true" class="h-4 w-4 shrink-0 animate-spin text-brand" />
					<span class="text-xs text-primary font-medium">
						Ожидание завершения авторизации...
					</span>
				</div>
				<div v-else class="flex items-center justify-between gap-2.5 rounded-xl bg-surface-2 px-3 py-2 border border-surface-4 text-secondary">
					<span class="text-xs font-medium text-contrast">
						Окно авторизации закрыто
					</span>
					<Button type="colored" color="brand" @click="authenticate('sign-in')">
						Войти снова
					</Button>
				</div>
			</div>

			<details class="group rounded-2xl bg-surface-2 p-3.5 border border-surface-4 shadow-sm text-xs">
				<summary class="cursor-pointer font-semibold text-secondary hover:text-contrast select-none flex items-center justify-between">
					<span>Дополнительно: ручной ввод токена</span>
					<span class="text-xs text-brand transition-transform group-open:rotate-180">▼</span>
				</summary>
				<div class="flex flex-col gap-2.5 pt-3">
					<p class="m-0 text-secondary text-xs leading-relaxed">
						Если у вас есть персональный токен доступа (PAT) или ссылка авторизации, укажите её ниже:
					</p>
					<div class="flex gap-2">
						<input
							v-model="manualToken"
							type="text"
							placeholder="mra_... или ссылка"
							class="flex-1 rounded-lg bg-surface-3 px-3 py-2 text-xs text-contrast border border-surface-5 focus:outline-none focus:border-brand font-mono"
							@keyup.enter="submitManualToken"
						/>
						<Button
							type="colored"
							color="brand"
							:disabled="!manualToken.trim()"
							@click="submitManualToken"
						>
							Войти
						</Button>
					</div>
				</div>
			</details>

			<div class="flex flex-col gap-3">
				<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
					<Button type="outlined" class="w-full justify-center" native-type="button" @click="modal?.hide()">
						<XIcon aria-hidden="true" />
						Отмена
					</Button>
					<Button
						class="w-full justify-center"
						native-type="button"
						:disabled="reopeningBrowser"
						@click="reopenBrowser"
					>
						<RefreshCwIcon aria-hidden="true" />
						Открыть сайт
					</Button>
					<Button
						class="w-full justify-center"
						native-type="button"
						@click="authenticate('sign-up')"
					>
						<UserPlusIcon aria-hidden="true" />
						Регистрация
					</Button>
				</div>
			</div>
		</div>
	</NewModal>
</template>

<script setup lang="ts">
import { RefreshCwIcon, SpinnerIcon, UserPlusIcon, XIcon } from '@modrinth/assets'
import {
	Button,
	defineMessages,
	NewModal,
	useVIntl,
} from '@modrinth/ui'
import { invoke } from '@tauri-apps/api/core'
import { onMounted, onUnmounted, ref } from 'vue'

import { cancelLogin, type ModrinthAuthFlow } from '@/helpers/mr_auth'

const props = defineProps<{
	requestAuth: (flow: ModrinthAuthFlow) => Promise<boolean>
}>()

const { formatMessage } = useVIntl()
const modal = ref<InstanceType<typeof NewModal>>()
const authenticating = ref<ModrinthAuthFlow | null>(null)
const reopeningBrowser = ref(false)
const manualToken = ref('')

const errorMessage = ref<string | null>(null)

async function submitManualToken() {
	const val = manualToken.value.trim()
	if (!val) return
	try {
		await invoke('plugin:mr-auth|submit_manual_auth_code', { code: val })
	} catch (e) {
		console.error('Failed to submit manual auth code', e)
	}
}

async function onWindowFocus() {
	if (authenticating.value) {
		try {
			const text = await navigator.clipboard.readText()
			if (text && (text.includes('mra_') || text.includes('code=mra_') || text.startsWith('modrinth://') || text.includes('127.0.0.1:'))) {
				manualToken.value = text.trim()
				await submitManualToken()
			}
		} catch {}
	}
}

onMounted(() => {
	window.addEventListener('focus', onWindowFocus)
})

onUnmounted(() => {
	window.removeEventListener('focus', onWindowFocus)
})

let resolveShow: ((signedIn: boolean) => void) | undefined
let authenticationId = 0
let activeAuthentication: Promise<void> | undefined

function show(event?: MouseEvent) {
	resetAuthentication(true)
	resolveShow?.(false)
	const modalInstance = modal.value
	if (!modalInstance) return Promise.resolve(false)

	const promise = new Promise<boolean>((resolve) => {
		resolveShow = resolve
		modalInstance.show(event)
	})
	authenticate('sign-in')
	return promise
}

function showSigningIn(flow: ModrinthAuthFlow = 'sign-in', event?: MouseEvent) {
	resetAuthentication(true)
	resolveShow?.(false)
	const modalInstance = modal.value
	if (!modalInstance) return Promise.resolve(false)

	const promise = new Promise<boolean>((resolve) => {
		resolveShow = resolve
		modalInstance.show(event)
	})
	authenticate(flow)
	return promise
}

function finish(signedIn: boolean) {
	resolveShow?.(signedIn)
	resolveShow = undefined
}

function authenticate(flow: ModrinthAuthFlow) {
	const id = ++authenticationId
	authenticating.value = flow
	errorMessage.value = null

	const authentication = (async () => {
		try {
			const success = await props.requestAuth(flow)
			if (success && authenticationId === id) {
				authenticating.value = null
				activeAuthentication = undefined
				finish(true)
				modal.value?.hide()
			} else if (authenticationId === id) {
				authenticating.value = null
				activeAuthentication = undefined
			}
		} catch (err: any) {
			if (authenticationId === id) {
				authenticating.value = null
				activeAuthentication = undefined
				errorMessage.value = err?.message || String(err)
			}
		}
	})()

	activeAuthentication = authentication
}

async function reopenBrowser() {
	const flow = authenticating.value
	if (!flow || reopeningBrowser.value) return

	reopeningBrowser.value = true
	const previousAuthentication = activeAuthentication
	++authenticationId

	try {
		await cancelLogin()
		await previousAuthentication?.catch(() => undefined)
		if (authenticating.value === flow) authenticate(flow)
	} finally {
		reopeningBrowser.value = false
	}
}

function resetAuthentication(cancelActive: boolean) {
	const wasAuthenticating = authenticating.value !== null
	++authenticationId
	activeAuthentication = undefined
	authenticating.value = null
	reopeningBrowser.value = false
	errorMessage.value = null

	if (cancelActive && wasAuthenticating) void cancelLogin()
}

function handleHide() {
	resetAuthentication(true)
	finish(false)
}

const messages = defineMessages({
	signingInHeader: {
		id: 'modal.modrinth-account-required.signing-in-header',
		defaultMessage: 'Signing in',
	},
})

defineExpose({ show, showSigningIn })
</script>
