import { attributionQuickReplies } from '@macros/moderation'
import { provideAttributionModeration } from '@macros/ui'

export function setupAttributionModerationProvider() {
	provideAttributionModeration({ attributionQuickReplies })
}
