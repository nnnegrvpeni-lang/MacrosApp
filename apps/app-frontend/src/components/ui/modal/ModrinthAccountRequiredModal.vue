<template>
	<NewModal
		ref="modal"
		:header="formatMessage(messages.signingInHeader)"
		:on-hide="handleHide"
		no-padding
		max-width="480px"
		width="100%"
	>
		<div class="flex w-full flex-col gap-5 p-6">
			<div class="flex flex-col gap-2 px-1">
				<h2 class="m-0 text-xl font-bold leading-7 text-contrast">Вход в аккаунт Macros ID</h2>
				<p class="m-0 text-xs text-secondary leading-relaxed">
					Для быстрой и безопасной авторизации страница входа открыта в вашем браузере. Вы можете
					войти через Google или по логину и паролю.
				</p>
				<div
					v-if="errorMessage"
					class="rounded-xl bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-400"
				>
					{{ errorMessage }}
				</div>
				<div
					v-else
					class="flex items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3.5 border border-surface-4 text-primary shadow-sm"
				>
					<SpinnerIcon aria-hidden="true" class="h-5 w-5 shrink-0 animate-spin text-brand" />
					<div class="flex flex-col">
						<span class="text-xs text-contrast font-medium"
							>Ожидание авторизации в браузере...</span
						>
						<span class="text-[11px] text-secondary"
							>После входа на сайте лаунчер подключится автоматически</span
						>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-3">
				<div class="grid grid-cols-2 gap-2">
					<Button
						type="outlined"
						class="w-full justify-center"
						native-type="button"
						@click="modal?.hide()"
					>
						<XIcon aria-hidden="true" />
						Отмена
					</Button>
					<Button
						type="colored"
						color="brand"
						class="w-full justify-center"
						native-type="button"
						:disabled="reopeningBrowser"
						@click="reopenBrowser"
					>
						<RefreshCwIcon aria-hidden="true" />
						Открыть сайт
					</Button>
				</div>
			</div>
		</div>
	</NewModal>
</template>

<script setup lang="ts">
import { RefreshCwIcon, SpinnerIcon, XIcon } from '@macros/assets'
import { Button, defineMessages, NewModal, useVIntl } from '@macros/ui'
import { ref } from 'vue'

import { cancelLogin, type ModrinthAuthFlow } from '@/helpers/mr_auth'

const props = defineProps<{
	requestAuth: (flow: ModrinthAuthFlow) => Promise<boolean>
}>()

const { formatMessage } = useVIntl()
const modal = ref<InstanceType<typeof NewModal>>()
const authenticating = ref<ModrinthAuthFlow | null>(null)
const reopeningBrowser = ref(false)
const errorMessage = ref<string | null>(null)

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
		} catch (err: unknown) {
			if (authenticationId === id) {
				authenticating.value = null
				activeAuthentication = undefined
				errorMessage.value = (err as Error)?.message || String(err)
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
