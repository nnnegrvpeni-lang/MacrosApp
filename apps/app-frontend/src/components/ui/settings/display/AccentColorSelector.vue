<script setup lang="ts">
import { CheckIcon, PaletteIcon, RefreshCwIcon } from '@macros/assets'
import { Button } from '@macros/ui'
import { computed, ref, watch } from 'vue'

import {
	ACCENT_COLOR_PRESETS,
	DEFAULT_ACCENT_COLOR,
	useAccentColor,
} from '@/composables/use-accent-color'

const { activeColor, setAccentColor, resetToDefault } = useAccentColor()

const colorPickerRef = ref<HTMLInputElement | null>(null)
const hexInput = ref(activeColor.value)

watch(activeColor, (newColor) => {
	hexInput.value = newColor
})

const isDefault = computed(
	() => activeColor.value.toLowerCase() === DEFAULT_ACCENT_COLOR.toLowerCase(),
)

const isCustomColor = computed(() => {
	const current = activeColor.value.toLowerCase()
	return !ACCENT_COLOR_PRESETS.some((preset) => preset.color.toLowerCase() === current)
})

function selectPreset(color: string) {
	setAccentColor(color)
	hexInput.value = color
}

function openColorPicker() {
	colorPickerRef.value?.click()
}

function onColorPickerInput(event: Event) {
	const target = event.target as HTMLInputElement
	if (target?.value) {
		setAccentColor(target.value)
		hexInput.value = target.value
	}
}

function onHexInputChange() {
	let value = hexInput.value.trim()
	if (!value.startsWith('#')) {
		value = `#${value}`
	}
	const isValidHex = /^#([0-9A-Fa-f]{3}){1,2}$/.test(value)
	if (isValidHex) {
		setAccentColor(value)
	}
}
</script>

<template>
	<section class="mt-8 border-0 border-t border-solid border-divider pt-6">
		<div class="flex flex-col gap-1">
			<h2 class="m-0 text-xl font-semibold text-contrast">Accent color</h2>
			<p class="m-0 text-secondary">
				Personalize your launcher with custom accent colors across buttons, highlights, and active
				tabs.
			</p>
		</div>

		<div class="mt-5 flex flex-wrap items-center gap-3">
			<button
				v-for="preset in ACCENT_COLOR_PRESETS"
				:key="preset.id"
				v-tooltip="preset.name"
				type="button"
				class="group relative flex size-11 cursor-pointer items-center justify-center rounded-2xl border-2 border-solid transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-contrast"
				:class="[
					activeColor.toLowerCase() === preset.color.toLowerCase()
						? 'border-contrast shadow-lg scale-105 ring-2 ring-contrast/30'
						: 'border-transparent hover:border-white/20',
				]"
				:style="{ backgroundColor: preset.color }"
				:aria-label="preset.name"
				@click="selectPreset(preset.color)"
			>
				<CheckIcon
					v-if="activeColor.toLowerCase() === preset.color.toLowerCase()"
					class="size-5 drop-shadow"
					:style="{ color: preset.contrast }"
				/>
			</button>

			<div class="relative">
				<input
					ref="colorPickerRef"
					type="color"
					class="sr-only"
					:value="activeColor"
					@input="onColorPickerInput"
				/>
				<button
					v-tooltip="'Custom color picker'"
					type="button"
					class="group relative flex size-11 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-contrast"
					:class="[
						isCustomColor
							? 'border-contrast shadow-lg scale-105 ring-2 ring-contrast/30'
							: 'border-surface-5 bg-surface-2 hover:border-contrast/50 hover:bg-surface-3',
					]"
					:style="isCustomColor ? { backgroundColor: activeColor } : undefined"
					aria-label="Custom color picker"
					@click="openColorPicker"
				>
					<PaletteIcon
						class="size-5 transition-colors"
						:class="[
							isCustomColor
								? 'text-contrast drop-shadow'
								: 'text-secondary group-hover:text-contrast',
						]"
					/>
				</button>
			</div>
		</div>

		<div class="mt-4 flex flex-wrap items-center gap-4">
			<div
				class="flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-1.5 border border-solid border-surface-4"
			>
				<span class="text-sm font-semibold text-secondary">HEX</span>
				<input
					v-model="hexInput"
					type="text"
					maxlength="7"
					class="w-24 bg-transparent font-mono text-sm font-medium text-contrast outline-none placeholder:text-secondary/50"
					placeholder="#00af5c"
					@change="onHexInputChange"
					@keyup.enter="onHexInputChange"
				/>
				<div
					class="size-4 rounded-full border border-solid border-white/20"
					:style="{ backgroundColor: activeColor }"
				></div>
			</div>

			<Button
				v-if="!isDefault"
				type="link"
				class="text-secondary hover:text-contrast"
				@click="resetToDefault"
			>
				<RefreshCwIcon class="size-4" />
				Reset to default
			</Button>
		</div>
	</section>
</template>
