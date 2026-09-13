import config from '@macros/tooling-config/eslint/nuxt.mjs'

export default config.append([
	{
		ignores: ['dist/'],
	},
])
