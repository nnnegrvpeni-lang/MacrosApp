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
					В вашем браузере открылась страница авторизации Modrinth. Войдите через Google, Discord, GitHub, Steam или по логину/паролю.
				</p>
				<div class="flex items-center gap-2 pt-1 text-primary">
					<SpinnerIcon aria-hidden="true" class="h-4 w-4 shrink-0 animate-spin text-brand" />
					<span class="text-xs text-primary font-medium">
						Ожидание подтверждения из браузера...
					</span>
				</div>
			</div>

			<div class="flex flex-col gap-2.5 rounded-2xl bg-surface-2 p-4 border border-surface-4 shadow-sm">
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold text-contrast uppercase tracking-wider">
						Ручной ввод ссылки / токена
					</span>
					<button
						type="button"
						class="text-xs text-brand hover:underline font-semibold bg-transparent border-0 cursor-pointer p-0"
						@click="pasteFromClipboard"
					>
						📋 Вставить из буфера
					</button>
				</div>
				<div class="rounded-xl bg-surface-3/60 p-3 text-xs text-secondary leading-relaxed border border-surface-5">
					<p class="m-0 font-semibold text-contrast mb-1.5">Если вход не произошёл автоматически:</p>
					<ol class="m-0 pl-4 space-y-1.5">
						<li>На странице входа в браузере нажмите <strong>правой кнопкой мыши прямо по кнопке «Open Modrinth App →»</strong> &rarr; выберите <strong>«Посмотреть код»</strong> (или нажмите <kbd class="px-1 py-0.5 rounded bg-surface-4 font-mono text-[11px] text-contrast">F12</kbd>).</li>
						<li>В коде прямо над кнопкой вы увидите скрытую строку с адресом <code class="text-brand font-mono text-[11px]">&lt;iframe src="http://127.0.0.1:.../?code=mra_..."&gt;</code>.</li>
						<li>Скопируйте ссылку или токен <code class="text-brand font-mono text-[11px]">mra_...</code>, вставьте в поле ниже и нажмите «Войти» (или нажмите «📋 Вставить из буфера»).</li>
					</ol>
				</div>
				<div class="flex gap-2 pt-1">
					<input
						v-model="manualToken"
						type="text"
						placeholder="http://127.0.0.1:.../?code=mra_... или mra_..."
						class="flex-1 rounded-lg bg-surface-3 px-3 py-2 text-sm text-contrast border border-surface-5 focus:outline-none focus:border-brand font-mono text-xs"
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
import { LogInIcon, RefreshCwIcon, SpinnerIcon, UserPlusIcon, XIcon } from '@modrinth/assets'
import {
	Button,
	commonMessages,
	defineMessages,
	IntlFormatted,
	NewModal,
	useVIntl,
} from '@modrinth/ui'
import { openUrl } from '@tauri-apps/plugin-opener'
import { onMounted, onUnmounted, ref } from 'vue'

import { cancelLogin, type ModrinthAuthFlow } from '@/helpers/mr_auth'
import { invoke } from '@tauri-apps/api/core'

const props = defineProps<{
	requestAuth: (flow: ModrinthAuthFlow) => Promise<boolean>
}>()

const { formatMessage } = useVIntl()
const modal = ref<InstanceType<typeof NewModal>>()
const authenticating = ref<ModrinthAuthFlow | null>(null)
const reopeningBrowser = ref(false)
const manualToken = ref('')
const directUsername = ref('')
const directPassword = ref('')
const direct2FAFlow = ref<string | null>(null)
const direct2FACode = ref('')
const directLoading = ref(false)
const directError = ref<string | null>(null)

async function performDirectLogin() {
	if (!directUsername.value.trim() || !directPassword.value.trim() || directLoading.value) return
	directLoading.value = true
	directError.value = null
	try {
		const res = await invoke<{
			success: boolean
			session?: string
			flow?: string
			error?: string
		}>('plugin:mr-auth|direct_modrinth_login', {
			username: directUsername.value.trim(),
			password: directPassword.value.trim(),
		})

		if (res.success) {
			directLoading.value = false
			finish(true)
			modal.value?.hide()
		} else if (res.flow) {
			direct2FAFlow.value = res.flow
			directLoading.value = false
		} else {
			let err = res.error || 'Ошибка входа'
			if (err.includes('challenge')) {
				err = 'Сервер Modrinth требует прохождение проверки безопасности. Пожалуйста, используйте кнопку «Войти через браузер» ниже.'
			}
			directError.value = err
			directLoading.value = false
		}
	} catch (e: any) {
		let err = e?.message || String(e)
		if (err.includes('challenge')) {
			err = 'Сервер Modrinth требует прохождение проверки безопасности. Пожалуйста, используйте кнопку «Войти через браузер» ниже.'
		}
		directError.value = err
		directLoading.value = false
	}
}

async function performDirect2FA() {
	if (!direct2FAFlow.value || !direct2FACode.value.trim() || directLoading.value) return
	directLoading.value = true
	directError.value = null
	try {
		const res = await invoke<{
			success: boolean
			session?: string
			flow?: string
			error?: string
		}>('plugin:mr-auth|direct_modrinth_2fa', {
			flow: direct2FAFlow.value,
			code: direct2FACode.value.trim(),
		})

		if (res.success) {
			directLoading.value = false
			finish(true)
			modal.value?.hide()
		} else {
			directError.value = res.error || 'Неверный код 2FA'
			directLoading.value = false
		}
	} catch (e: any) {
		directError.value = e?.message || String(e)
		directLoading.value = false
	}
}

async function submitManualToken() {
	const val = manualToken.value.trim()
	if (!val) return
	try {
		await invoke('plugin:mr-auth|submit_manual_auth_code', { code: val })
	} catch (e) {
		console.error('Failed to submit manual auth code', e)
	}
}

async function pasteFromClipboard() {
	try {
		const text = await navigator.clipboard.readText()
		if (text && text.trim()) {
			manualToken.value = text.trim()
			await submitManualToken()
		}
	} catch (e) {
		console.warn('Cannot read clipboard', e)
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

	const authentication = (async () => {
		try {
			if ((await props.requestAuth(flow)) && authenticationId === id) {
				authenticating.value = null
				activeAuthentication = undefined
				finish(true)
				modal.value?.hide()
			}
		} finally {
			if (authenticationId === id) {
				authenticating.value = null
				activeAuthentication = undefined
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
	directLoading.value = false
	directError.value = null
	direct2FAFlow.value = null
	direct2FACode.value = ''

	if (cancelActive && wasAuthenticating) void cancelLogin()
}

function handleHide() {
	resetAuthentication(true)
	finish(false)
}

function openSupport() {
	openUrl('https://support.modrinth.com')
}

const messages = defineMessages({
	header: {
		id: 'modal.modrinth-account-required.header',
		defaultMessage: 'Account required',
	},
	signingInHeader: {
		id: 'modal.modrinth-account-required.signing-in-header',
		defaultMessage: 'Signing in',
	},
	signInHeading: {
		id: 'modal.modrinth-account-required.sign-in-heading',
		defaultMessage: 'Sign in to a Modrinth account',
	},
	description: {
		id: 'modal.modrinth-account-required.description',
		defaultMessage:
			"You'll need to sign into your Modrinth account before you can use this feature.",
	},
	createAccountButton: {
		id: 'modal.modrinth-account-required.create-account-button',
		defaultMessage: 'Create an account',
	},
	signInButton: {
		id: 'modal.modrinth-account-required.sign-in-button',
		defaultMessage: 'Sign in to Modrinth',
	},
	continueInBrowserHeading: {
		id: 'modal.modrinth-account-required.continue-in-browser-heading',
		defaultMessage: 'Continue in your browser',
	},
	browserDescription: {
		id: 'modal.modrinth-account-required.browser-description',
		defaultMessage:
			'A new tab opened to sign in. Complete the sign in there, then return to the app.',
	},
	waitingForBrowser: {
		id: 'modal.modrinth-account-required.waiting-for-browser',
		defaultMessage: 'Waiting for browser confirmation...',
	},
	openBrowserAgainButton: {
		id: 'modal.modrinth-account-required.open-browser-again-button',
		defaultMessage: 'Open browser again',
	},
	supportPrompt: {
		id: 'modal.modrinth-account-required.support-prompt',
		defaultMessage: 'Having trouble signing in? <support>Get support</support>',
	},
})

defineExpose({ show, showSigningIn })
</script>
