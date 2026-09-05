import { getVersion } from '@tauri-apps/api/app'
import { fetch as tauriFetch } from '@tauri-apps/plugin-http'
import { openUrl } from '@tauri-apps/plugin-opener'
import { ref } from 'vue'

export interface MacrosAppUpdateInfo {
	version: string
	releaseName: string
	summary: string
	downloadUrl: string
	releaseUrl: string
	publishedAt: string
}

export const macrosAppUpdate = ref<MacrosAppUpdateInfo | null>(null)
export const checkingUpdate = ref(false)

export function isVersionNewer(latest: string, current: string): boolean {
	if (!latest || !current) return false
	const cleanLatest = String(latest).replace(/^v/, '').trim()
	const cleanCurrent = String(current).replace(/^v/, '').trim()
	if (cleanLatest === cleanCurrent) return false

	const lParts = cleanLatest.split('.').map((p) => parseInt(p, 10) || 0)
	const cParts = cleanCurrent.split('.').map((p) => parseInt(p, 10) || 0)
	for (let i = 0; i < Math.max(lParts.length, cParts.length); i++) {
		const l = lParts[i] ?? 0
		const c = cParts[i] ?? 0
		if (l > c) return true
		if (l < c) return false
	}
	return false
}

export async function checkForMacrosUpdate(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	popupManager?: any,
	opts: { isStartup?: boolean; notifyIfLatest?: boolean; forceSimulate?: boolean } = {},
) {
	if (opts.forceSimulate) {
		macrosAppUpdate.value = {
			version: 'v1.2.1',
			releaseName: 'MacrosApp v1.2.1 (Тест)',
			summary:
				'Тестовое уведомление: проверка отображения кнопки в шапке, всплывающего окна и блока в настройках.',
			downloadUrl: 'https://github.com/nnnegrvpeni-lang/MacrosApp/releases',
			releaseUrl: 'https://github.com/nnnegrvpeni-lang/MacrosApp/releases',
			publishedAt: new Date().toISOString(),
		}
		if (popupManager) {
			showUpdateToast(popupManager, macrosAppUpdate.value)
		}
		return
	}

	checkingUpdate.value = true
	try {
		const currentVersion = await getVersion()
		const fetchHttp = async (url: string) => {
			try {
				return await tauriFetch(url, {
					headers: {
						'User-Agent': 'MacrosApp',
						Accept: 'application/vnd.github.v3+json',
					},
				})
			} catch {
				return await fetch(url)
			}
		}

		const res = await fetchHttp(
			'https://api.github.com/repos/nnnegrvpeni-lang/MacrosApp/releases/latest',
		)
		if (!res.ok) {
			throw new Error(`GitHub API returned status ${res.status}`)
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const release: any = await res.json()
		const latestTag = release.tag_name || ''

		if (isVersionNewer(latestTag, currentVersion)) {
			let downloadUrl = release.html_url
			if (Array.isArray(release.assets)) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const exeAsset = release.assets.find((a: any) =>
					typeof a.name === 'string' && a.name.endsWith('.exe'),
				)
				if (exeAsset?.browser_download_url) {
					downloadUrl = exeAsset.browser_download_url
				}
			}

			let summary = (release.body || '')
				.replace(/#{1,6}\s+/g, '')
				.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
				.replace(/[*_`~]/g, '')
				.replace(/\r?\n+/g, ' ')
				.trim()
			if (summary.length > 150) {
				summary = `${summary.slice(0, 150)}...`
			}

			const updateInfo: MacrosAppUpdateInfo = {
				version: latestTag,
				releaseName: release.name || latestTag,
				summary:
					summary || 'Доступна новая версия лаунчера с улучшениями и исправлениями.',
				downloadUrl,
				releaseUrl: release.html_url,
				publishedAt: release.published_at || release.created_at,
			}

			macrosAppUpdate.value = updateInfo

			if (popupManager) {
				showUpdateToast(popupManager, updateInfo)
			}
		} else {
			macrosAppUpdate.value = null
			if (opts.notifyIfLatest && popupManager) {
				popupManager.addPopupNotification({
					contentType: 'standard',
					title: 'Обновлений не найдено',
					text: `У вас установлена последняя версия MacrosApp (${currentVersion}).`,
					type: 'success',
					autoCloseMs: 4000,
					dismissible: true,
				})
			}
		}
	} catch (error) {
		console.warn('Failed to check for MacrosApp update:', error)
	} finally {
		checkingUpdate.value = false
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function showUpdateToast(popupManager: any, update: MacrosAppUpdateInfo) {
	popupManager.addPopupNotification({
		contentType: 'standard',
		title: `Доступно обновление MacrosApp ${update.version}!`,
		text: update.summary,
		type: 'info',
		autoCloseMs: 10000,
		dismissible: true,
		buttons: [
			{
				label: 'Скачать установщик',
				action: () => void openUrl(update.downloadUrl),
				color: 'brand',
			},
			{
				label: 'Что нового',
				action: () => void openUrl(update.releaseUrl),
				keepOpen: true,
			},
		],
	})
}
