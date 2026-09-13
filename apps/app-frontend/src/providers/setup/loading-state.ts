import type { LoadingStateProvider } from '@macros/ui'
import { createLoadingStateCore, provideLoadingState } from '@macros/ui'

/**
 * Source of truth for the desktop app's loading state.
 *
 * Owns the token-based ref-counter directly. Consumers
 * obtain the same reactive state via `injectLoadingState()` from `@macros/ui`.
 *
 * Returns the provider so the call site (App.vue) can also use it directly
 * without a second injection round-trip.
 */
export function setupLoadingStateProvider(): LoadingStateProvider {
	const provider = createLoadingStateCore({ barEnabled: false })
	provideLoadingState(provider)
	return provider
}
