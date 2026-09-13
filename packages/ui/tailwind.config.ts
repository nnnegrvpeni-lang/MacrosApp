import preset from '@macros/tooling-config/tailwind/tailwind-preset.ts'
import type { Config } from 'tailwindcss'

const config: Config = {
	content: ['./src/**/*.{js,vue,ts,mdx}', './.storybook/**/*.{ts,js}'],
	presets: [preset],
}

export default config
