import type { AbstractModrinthClient } from '@macros/api-client'
import { provideUserCountry } from '@macros/ui'
import { ref } from 'vue'

export function setupUserCountryProvider(client: AbstractModrinthClient) {
	const country = ref('US')

	void client.labrinth.geoip
		.getCountry()
		.then((detectedCountry) => {
			country.value = detectedCountry ?? country.value
		})
		.catch(() => {})

	return provideUserCountry(country)
}
