<script setup lang="ts">
import type { Labrinth } from '@macros/api-client'
import { ServersManagePageIndex } from '@macros/ui'

import { products } from '~/generated/state.json'

definePageMeta({
	middleware: 'auth',
})

useHead({
	title: 'Hosting - Modrinth',
})

const config = useRuntimeConfig()
</script>

<template>
	<ServersManagePageIndex
		:stripe-publishable-key="config.public.stripePublishableKey"
		:site-url="config.public.siteUrl"
		:products="(products ?? []) as Labrinth.Billing.Internal.Product[]"
		class="max-w-[1280px] py-0"
	/>
</template>
