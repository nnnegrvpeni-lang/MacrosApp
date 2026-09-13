<script setup lang="ts">
import type { Labrinth } from '@macros/api-client'
import { ServerStackIcon } from '@macros/assets'
import { injectModrinthClient, ServersManagePageIndex } from '@macros/ui'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import { useRootBreadcrumb } from '@/providers/breadcrumbs'

import { config } from '../config'

const stripePublishableKey = (config.stripePublishableKey as string) || ''

const client = injectModrinthClient()

useRootBreadcrumb({
	slot: 'root',
	id: 'servers',
	label: 'Hosting',
	to: '/hosting/manage/',
	visual: { type: 'icon', component: ServerStackIcon },
})

const { data: products } = useQuery({
	queryKey: ['billing', 'products'],
	queryFn: () => client.labrinth.billing_internal.getProducts(),
})

const resolvedProducts = computed<Labrinth.Billing.Internal.Product[]>(() => products.value ?? [])
</script>

<template>
	<ServersManagePageIndex
		:stripe-publishable-key="stripePublishableKey"
		:products="resolvedProducts"
	/>
</template>
