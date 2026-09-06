import { computed, ref, watch } from 'vue'

export interface AccentColorPreset {
	id: string
	name: string
	color: string
	highlight: string
	shadow: string
	contrast: string
}

export const DEFAULT_ACCENT_COLOR = '#00af5c'

export const ACCENT_COLOR_PRESETS: AccentColorPreset[] = [
	{
		id: 'emerald',
		name: 'Emerald (Classic)',
		color: '#00af5c',
		highlight: 'rgba(27, 217, 106, 0.25)',
		shadow: 'rgba(27, 217, 106, 0.7)',
		contrast: '#000000',
	},
	{
		id: 'amethyst',
		name: 'Amethyst Purple',
		color: '#8b5cf6',
		highlight: 'rgba(139, 92, 246, 0.25)',
		shadow: 'rgba(139, 92, 246, 0.7)',
		contrast: '#ffffff',
	},
	{
		id: 'azure',
		name: 'Sapphire Azure',
		color: '#0099ff',
		highlight: 'rgba(0, 153, 255, 0.25)',
		shadow: 'rgba(0, 153, 255, 0.7)',
		contrast: '#ffffff',
	},
	{
		id: 'cyan',
		name: 'Diamond Cyan',
		color: '#06b6d4',
		highlight: 'rgba(6, 182, 212, 0.25)',
		shadow: 'rgba(6, 182, 212, 0.7)',
		contrast: '#000000',
	},
	{
		id: 'redstone',
		name: 'Redstone Crimson',
		color: '#ef4444',
		highlight: 'rgba(239, 68, 68, 0.25)',
		shadow: 'rgba(239, 68, 68, 0.7)',
		contrast: '#ffffff',
	},
	{
		id: 'copper',
		name: 'Sunset Orange',
		color: '#f97316',
		highlight: 'rgba(249, 115, 22, 0.25)',
		shadow: 'rgba(249, 115, 22, 0.7)',
		contrast: '#ffffff',
	},
	{
		id: 'sakura',
		name: 'Sakura Pink',
		color: '#ec4899',
		highlight: 'rgba(236, 72, 153, 0.25)',
		shadow: 'rgba(236, 72, 153, 0.7)',
		contrast: '#ffffff',
	},
	{
		id: 'amber',
		name: 'Gold Amber',
		color: '#f59e0b',
		highlight: 'rgba(245, 158, 11, 0.25)',
		shadow: 'rgba(245, 158, 11, 0.7)',
		contrast: '#000000',
	},
]

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const sanitized = hex.replace('#', '').trim()
	if (sanitized.length === 3) {
		const r = parseInt(sanitized[0] + sanitized[0], 16)
		const g = parseInt(sanitized[1] + sanitized[1], 16)
		const b = parseInt(sanitized[2] + sanitized[2], 16)
		return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b }
	}
	if (sanitized.length === 6) {
		const r = parseInt(sanitized.slice(0, 2), 16)
		const g = parseInt(sanitized.slice(2, 4), 16)
		const b = parseInt(sanitized.slice(4, 6), 16)
		return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b }
	}
	return null
}

function getLuminance(r: number, g: number, b: number): number {
	return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

export function applyAccentColorStyles(color: string | null): void {
	if (typeof document === 'undefined') return
	const root = document.documentElement

	if (!color || color.toLowerCase() === DEFAULT_ACCENT_COLOR.toLowerCase()) {
		root.style.removeProperty('--color-brand')
		root.style.removeProperty('--color-brand-highlight')
		root.style.removeProperty('--color-brand-shadow')
		root.style.removeProperty('--color-accent-contrast')
		root.style.removeProperty('--color-button-bg-selected')
		root.style.removeProperty('--color-button-text-selected')
		root.style.removeProperty('--loading-bar-gradient')
		root.style.removeProperty('--brand-gradient-bg')
		root.style.removeProperty('--brand-gradient-border')
		return
	}

	const rgb = hexToRgb(color)
	if (!rgb) return

	const { r, g, b } = rgb
	const lum = getLuminance(r, g, b)
	const contrast = lum > 0.6 ? '#000000' : '#ffffff'
	const highlight = `rgba(${r}, ${g}, ${b}, 0.25)`
	const shadow = `rgba(${r}, ${g}, ${b}, 0.7)`

	root.style.setProperty('--color-brand', color)
	root.style.setProperty('--color-brand-highlight', highlight)
	root.style.setProperty('--color-brand-shadow', shadow)
	root.style.setProperty('--color-accent-contrast', contrast)
	root.style.setProperty('--color-button-bg-selected', highlight)
	root.style.setProperty('--color-button-text-selected', color)
	root.style.setProperty(
		'--loading-bar-gradient',
		`linear-gradient(to right, ${color} 0%, rgba(${r}, ${g}, ${b}, 0.8) 100%)`,
	)
	root.style.setProperty(
		'--brand-gradient-bg',
		`linear-gradient(0deg, rgba(${r}, ${g}, ${b}, 0.15) 0%, rgba(${r}, ${g}, ${b}, 0.08) 100%)`,
	)
	root.style.setProperty('--brand-gradient-border', `rgba(${r}, ${g}, ${b}, 0.2)`)
}

const STORAGE_KEY = 'macros_accent_color'
const activeColor = ref<string>(
	typeof window !== 'undefined'
		? window.localStorage.getItem(STORAGE_KEY) || DEFAULT_ACCENT_COLOR
		: DEFAULT_ACCENT_COLOR,
)

if (typeof window !== 'undefined') {
	applyAccentColorStyles(activeColor.value)
}

watch(activeColor, (color) => {
	if (typeof window === 'undefined') return
	if (!color || color.toLowerCase() === DEFAULT_ACCENT_COLOR.toLowerCase()) {
		window.localStorage.removeItem(STORAGE_KEY)
	} else {
		window.localStorage.setItem(STORAGE_KEY, color)
	}
	applyAccentColorStyles(color)
})

export function useAccentColor() {
	const isCustom = computed(() => {
		const current = activeColor.value.toLowerCase()
		return !ACCENT_COLOR_PRESETS.some((preset) => preset.color.toLowerCase() === current)
	})

	const currentPresetId = computed(() => {
		const current = activeColor.value.toLowerCase()
		const preset = ACCENT_COLOR_PRESETS.find((p) => p.color.toLowerCase() === current)
		return preset ? preset.id : 'custom'
	})

	function setAccentColor(color: string) {
		activeColor.value = color
	}

	function resetToDefault() {
		activeColor.value = DEFAULT_ACCENT_COLOR
	}

	return {
		activeColor,
		presets: ACCENT_COLOR_PRESETS,
		isCustom,
		currentPresetId,
		setAccentColor,
		resetToDefault,
	}
}

export function initAccentColor() {
	if (typeof window === 'undefined') return
	const saved = window.localStorage.getItem(STORAGE_KEY)
	if (saved) {
		activeColor.value = saved
		applyAccentColorStyles(saved)
	}
}
