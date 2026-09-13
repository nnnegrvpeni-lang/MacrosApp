export const OLED_SCROLLBAR_CSS = `
		/* Custom Modern OLED Scrollbar */
		::-webkit-scrollbar {
			width: 8px;
			height: 8px;
		}
		::-webkit-scrollbar-track {
			background: #000000;
		}
		::-webkit-scrollbar-thumb {
			background: #27272a;
			border-radius: 9999px;
			border: 2px solid #000000;
			background-clip: padding-box;
		}
		::-webkit-scrollbar-thumb:hover {
			background: #3f3f46;
			background-clip: padding-box;
		}
		::-webkit-scrollbar-thumb:active {
			background: #10b981;
			background-clip: padding-box;
		}
		::-webkit-scrollbar-corner {
			background: #000000;
		}
		::-webkit-scrollbar-button {
			display: none;
			width: 0;
			height: 0;
		}
		* {
			scrollbar-width: thin;
			scrollbar-color: #27272a #000000;
		}
`

export const THEME_HEAD_SCRIPT = `
	<script>
		(function() {
			try {
				var theme = localStorage.getItem('macros_theme') || 'oled';
				var effective = theme;
				if (theme === 'system') {
					var m = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
					effective = (m && m.matches) ? 'dark' : 'light';
				}
				document.documentElement.setAttribute('data-theme', effective);
				document.documentElement.setAttribute('data-theme-setting', theme);
				if (effective === 'light') {
					document.documentElement.classList.remove('dark');
				} else {
					document.documentElement.classList.add('dark');
				}
			} catch(e) {}
		})();
	</script>
`

export const THEME_CSS = `
	:root, html[data-theme="oled"] {
		--theme-bg-page: #000000;
		--theme-bg-card: #09090b;
		--theme-bg-card-hover: #121216;
		--theme-bg-sub: #141418;
		--theme-bg-header: rgba(0, 0, 0, 0.85);
		--theme-border: rgba(255, 255, 255, 0.08);
		--theme-border-sub: #27272a;
		--theme-text-primary: #ffffff;
		--theme-text-secondary: #a1a1aa;
		--theme-text-muted: #71717a;
		--theme-input-bg: #09090b;
		--theme-input-border: #27272a;
	}

	html[data-theme="dark"] {
		--theme-bg-page: #121214;
		--theme-bg-card: #18181c;
		--theme-bg-card-hover: #222228;
		--theme-bg-sub: #202026;
		--theme-bg-header: rgba(18, 18, 20, 0.88);
		--theme-border: #27272e;
		--theme-border-sub: #33333e;
		--theme-text-primary: #f4f4f5;
		--theme-text-secondary: #94a3b8;
		--theme-text-muted: #64748b;
		--theme-input-bg: #141418;
		--theme-input-border: #2a2a34;
	}

	html[data-theme="light"] {
		--theme-bg-page: #f8fafc;
		--theme-bg-card: #ffffff;
		--theme-bg-card-hover: #f1f5f9;
		--theme-bg-sub: #f1f5f9;
		--theme-bg-header: rgba(255, 255, 255, 0.95);
		--theme-border: #e2e8f0;
		--theme-border-sub: #cbd5e1;
		--theme-text-primary: #0f172a;
		--theme-text-secondary: #475569;
		--theme-text-muted: #94a3b8;
		--theme-input-bg: #ffffff;
		--theme-input-border: #cbd5e1;
	}

	/* Dark Theme Overrides */
	html[data-theme="dark"] body {
		background-color: #121214 !important;
	}
	html[data-theme="dark"] header {
		background-color: rgba(18, 18, 20, 0.88) !important;
		border-color: #27272e !important;
	}
	html[data-theme="dark"] .oled-card,
	html[data-theme="dark"] .bg-\[\#09090b\],
	html[data-theme="dark"] .bg-\[\#000000\],
	html[data-theme="dark"] .bg-zinc-950,
	html[data-theme="dark"] .bg-zinc-900\/40,
	html[data-theme="dark"] .bg-zinc-900\/50,
	html[data-theme="dark"] .bg-zinc-900\/60,
	html[data-theme="dark"] .bg-zinc-900\/80,
	html[data-theme="dark"] .bg-zinc-900 {
		background-color: #18181c !important;
		border-color: #27272e !important;
	}
	html[data-theme="dark"] .bg-\[\#141418\],
	html[data-theme="dark"] .bg-\[\#18181c\] {
		background-color: #202026 !important;
	}
	html[data-theme="dark"] ::-webkit-scrollbar-track {
		background: #121214;
	}
	html[data-theme="dark"] ::-webkit-scrollbar-thumb {
		background: #2a2a34;
		border: 2px solid #121214;
	}
	html[data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
		background: #3f3f4e;
	}
	html[data-theme="dark"] * {
		scrollbar-color: #2a2a34 #121214;
	}

	/* Light Theme Overrides */
	html[data-theme="light"] body {
		background-color: #f8fafc !important;
		color: #0f172a !important;
	}
	html[data-theme="light"] header {
		background-color: rgba(255, 255, 255, 0.95) !important;
		border-color: #e2e8f0 !important;
	}
	html[data-theme="light"] header a,
	html[data-theme="light"] header span.text-white,
	html[data-theme="light"] header .text-white {
		color: #0f172a !important;
	}
	html[data-theme="light"] header nav a {
		color: #475569 !important;
	}
	html[data-theme="light"] header nav a:hover {
		color: #0f172a !important;
	}
	html[data-theme="light"] .oled-card,
	html[data-theme="light"] .bg-\[\#09090b\],
	html[data-theme="light"] .bg-\[\#000000\],
	html[data-theme="light"] .bg-zinc-950,
	html[data-theme="light"] .bg-zinc-900\/40,
	html[data-theme="light"] .bg-zinc-900\/50,
	html[data-theme="light"] .bg-zinc-900\/60,
	html[data-theme="light"] .bg-zinc-900\/80,
	html[data-theme="light"] .bg-zinc-900,
	html[data-theme="light"] aside {
		background-color: #ffffff !important;
		border-color: #e2e8f0 !important;
	}
	html[data-theme="light"] aside nav button {
		color: #475569 !important;
	}
	html[data-theme="light"] aside nav button:hover {
		background-color: #f1f5f9 !important;
		color: #0f172a !important;
	}
	html[data-theme="light"] .bg-\[\#141418\],
	html[data-theme="light"] .bg-\[\#18181c\],
	html[data-theme="light"] .bg-zinc-800,
	html[data-theme="light"] .bg-zinc-800\/50,
	html[data-theme="light"] .bg-zinc-800\/80 {
		background-color: #f1f5f9 !important;
		border-color: #e2e8f0 !important;
	}
	html[data-theme="light"] .text-white {
		color: #0f172a !important;
	}
	html[data-theme="light"] .text-zinc-200 {
		color: #1e293b !important;
	}
	html[data-theme="light"] .text-zinc-300 {
		color: #334155 !important;
	}
	html[data-theme="light"] .text-zinc-400 {
		color: #64748b !important;
	}
	html[data-theme="light"] .text-zinc-500 {
		color: #94a3b8 !important;
	}
	html[data-theme="light"] .border-zinc-800,
	html[data-theme="light"] .border-zinc-900,
	html[data-theme="light"] .border-zinc-800\/80,
	html[data-theme="light"] .border-white\/5,
	html[data-theme="light"] .border-white\/10 {
		border-color: #e2e8f0 !important;
	}
	html[data-theme="light"] input:not([type="checkbox"]):not([type="radio"]),
	html[data-theme="light"] textarea,
	html[data-theme="light"] select {
		background-color: #ffffff !important;
		border-color: #cbd5e1 !important;
		color: #0f172a !important;
	}
	html[data-theme="light"] input::placeholder,
	html[data-theme="light"] textarea::placeholder {
		color: #94a3b8 !important;
	}
	html[data-theme="light"] .hover\:bg-zinc-900\/60:hover,
	html[data-theme="light"] .hover\:bg-zinc-800:hover,
	html[data-theme="light"] .hover\:bg-zinc-800\/80:hover {
		background-color: #f1f5f9 !important;
	}
	html[data-theme="light"] .hover\:border-zinc-700:hover {
		border-color: #cbd5e1 !important;
	}
	html[data-theme="light"] .text-emerald-400 {
		color: #059669 !important;
	}
	html[data-theme="light"] .bg-emerald-500\/10,
	html[data-theme="light"] .bg-emerald-500\/15 {
		background-color: #ecfdf5 !important;
	}
	html[data-theme="light"] .border-emerald-500\/20,
	html[data-theme="light"] .border-emerald-500\/30 {
		border-color: #a7f3d0 !important;
	}
	html[data-theme="light"] #userMenuDropdown,
	html[data-theme="light"] #langDropdown {
		background-color: #ffffff !important;
		border-color: #e2e8f0 !important;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
	}
	html[data-theme="light"] #userMenuDropdown a,
	html[data-theme="light"] #langDropdown button {
		color: #334155 !important;
	}
	html[data-theme="light"] #userMenuDropdown a:hover,
	html[data-theme="light"] #langDropdown button:hover {
		background-color: #f1f5f9 !important;
		color: #0f172a !important;
	}
	html[data-theme="light"] ::-webkit-scrollbar-track {
		background: #f8fafc;
	}
	html[data-theme="light"] ::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border: 2px solid #f8fafc;
	}
	html[data-theme="light"] ::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
	html[data-theme="light"] * {
		scrollbar-color: #cbd5e1 #f8fafc;
	}
`

export function escapeHtml(str: any): string {
	if (str === null || str === undefined) return ''
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
}

export function renderNavbarUserHtml(user?: any): string {
	const safeUsername = escapeHtml(user?.username || '')
	const initial = safeUsername ? safeUsername.charAt(0).toUpperCase() : 'U'
	const avatarInner = user
		? (user.avatar_url
			? `<img src="${user.avatar_url}" alt="${user.username}" class="w-full h-full object-cover">`
			: `<span class="text-xs font-bold text-white select-none">${initial}</span>`)
		: ''

	const langSwitcher = `
	<div class="relative inline-block text-left" id="langSwitcherContainer">
		<button id="langSwitcherBtn" type="button" onclick="window.toggleLangMenu(event)" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-xs font-semibold text-zinc-300 transition active:scale-95 cursor-pointer" title="Switch language / Сменить язык">
			<svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
			<span id="currentLangLabel">EN</span>
			<svg class="w-3 h-3 text-zinc-500 transition-transform duration-200" id="langChevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
		</button>
		<div id="langDropdown" class="hidden absolute right-0 mt-2 w-32 rounded-xl bg-[#0c0c0e] border border-zinc-800 shadow-2xl p-1.5 z-50 animate-fade-up">
			<button type="button" id="btnLangEn" onclick="window.setAppLanguage('en')" class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-zinc-800 text-left transition font-medium text-zinc-200 cursor-pointer">
				<span>English</span>
				<span class="text-[10px] text-emerald-400 font-bold" id="checkLangEn">✓</span>
			</button>
			<button type="button" id="btnLangRu" onclick="window.setAppLanguage('ru')" class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-zinc-800 text-left transition font-medium text-zinc-200 cursor-pointer">
				<span>Русский</span>
				<span class="text-[10px] text-emerald-400 font-bold hidden" id="checkLangRu">✓</span>
			</button>
		</div>
	</div>`

	if (!user) {
		return `
		<div class="flex items-center gap-2.5">
			${langSwitcher}
			<a href="/auth/sign-in" data-i18n="nav.signin" class="text-xs font-medium px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition active:scale-95">
				Sign in
			</a>
			<a href="/download" data-i18n="nav.download" class="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black transition active:scale-95 shadow-lg shadow-emerald-500/10">
				Download
			</a>
		</div>`
	}

	return `
	<div class="flex items-center gap-2.5">
		${langSwitcher}
		<button id="navPublishBtn" type="button" onclick="window.openCreateProjectModal()" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-200 border border-white/10 transition cursor-pointer active:scale-95 select-none" title="Create a new project">
			<svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
			<span data-i18n="nav.publish">Publish</span>
		</button>
		<div class="relative inline-block text-left" id="userMenuDropdownContainer">
			<button id="userMenuTrigger" type="button" onclick="window.toggleUserMenu(event)" class="flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-white/20 transition cursor-pointer select-none focus:outline-none active:scale-95" title="${safeUsername} — Menu">
				<div class="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center overflow-hidden text-xs font-bold shrink-0">
					${avatarInner}
				</div>
				<svg id="userMenuChevron" class="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
			</button>

			<div id="userMenuDropdown" class="hidden absolute right-0 mt-2 w-56 rounded-2xl bg-[#09090b]/95 backdrop-blur-2xl border border-zinc-800 shadow-2xl p-2 z-50 animate-fade-up select-none">
				<div class="px-3 py-2 border-b border-zinc-800/80 mb-1">
					<div class="text-xs font-bold text-white truncate">${safeUsername}</div>
					<div class="text-[11px] text-zinc-500 truncate">${user.email || ''}</div>
				</div>
				<a href="/account" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition">
					<svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
					<span data-i18n="nav.menu.profile">Profile</span>
				</a>
				<a href="/dashboard/projects" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition">
					<svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
					<span data-i18n="nav.menu.projects">Projects</span>
				</a>
				<a href="/settings" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition">
					<svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
					<span data-i18n="nav.menu.settings">Settings</span>
				</a>
				<div class="my-1 border-t border-zinc-800/80"></div>
				<button id="menuLogoutBtn" type="button" onclick="window.handleMenuLogout()" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left cursor-pointer">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
					<span data-i18n="nav.menu.signout">Log out</span>
				</button>
			</div>
		</div>
	</div>`
}

export function renderCreateProjectModalHtml(): string {
	return `
	<div id="createProjectModal" class="hidden fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" onclick="if(event.target===this)window.closeCreateProjectModal()">
		<div class="relative w-full max-w-lg rounded-2xl bg-[#09090b] border border-zinc-800 shadow-2xl p-6 text-zinc-200 select-none my-auto" onclick="event.stopPropagation()">
			<div class="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
				<h2 class="text-base font-bold text-white flex items-center gap-2">
					<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
					<span data-i18n="project.create.title">Create a project</span>
				</h2>
				<button type="button" onclick="window.closeCreateProjectModal()" class="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
				</button>
			</div>

			<form id="createProjectForm" onsubmit="window.handleCreateProject(event)" class="space-y-4 text-xs">
				<div>
					<label class="block text-zinc-300 font-semibold mb-1.5" data-i18n="project.create.type">Project type</label>
					<div class="grid grid-cols-3 gap-2">
						<button type="button" onclick="window.selectProjectType('mod')" id="btnType_mod" class="project-type-btn py-2 px-3 rounded-xl border border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold transition text-center cursor-pointer">Mod</button>
						<button type="button" onclick="window.selectProjectType('modpack')" id="btnType_modpack" class="project-type-btn py-2 px-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 font-medium hover:border-zinc-700 transition text-center cursor-pointer">Modpack</button>
						<button type="button" onclick="window.selectProjectType('resourcepack')" id="btnType_resourcepack" class="project-type-btn py-2 px-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 font-medium hover:border-zinc-700 transition text-center cursor-pointer">Resource Pack</button>
						<button type="button" onclick="window.selectProjectType('shader')" id="btnType_shader" class="project-type-btn py-2 px-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 font-medium hover:border-zinc-700 transition text-center cursor-pointer">Shader</button>
						<button type="button" onclick="window.selectProjectType('datapack')" id="btnType_datapack" class="project-type-btn py-2 px-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 font-medium hover:border-zinc-700 transition text-center cursor-pointer">Data Pack</button>
						<button type="button" onclick="window.selectProjectType('plugin')" id="btnType_plugin" class="project-type-btn py-2 px-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 font-medium hover:border-zinc-700 transition text-center cursor-pointer">Plugin</button>
					</div>
					<input type="hidden" id="newProjectType" value="mod">
				</div>

				<div>
					<label for="newProjectName" class="block text-zinc-300 font-semibold mb-1.5" data-i18n="project.create.name">Name</label>
					<input id="newProjectName" type="text" required maxlength="64" placeholder="e.g. Sodium, Iris Shaders" oninput="window.onProjectNameChange(this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition">
				</div>

				<div>
					<label for="newProjectSlug" class="block text-zinc-300 font-semibold mb-1.5" data-i18n="project.create.url">URL Slug</label>
					<div class="flex items-center rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-hidden focus-within:border-emerald-500 transition">
						<span class="px-3 py-2.5 text-zinc-500 select-none bg-zinc-950 border-r border-zinc-800 text-[11px]">/mod/</span>
						<input id="newProjectSlug" type="text" required maxlength="64" placeholder="project-slug" class="w-full px-3 py-2.5 bg-transparent text-white focus:outline-none">
					</div>
				</div>

				<div>
					<label for="newProjectSummary" class="block text-zinc-300 font-semibold mb-1.5" data-i18n="project.create.summary">Summary</label>
					<textarea id="newProjectSummary" maxlength="256" rows="2" placeholder="A short description of what your project does..." class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition resize-none"></textarea>
				</div>

				<div id="createProjectError" class="hidden p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"></div>

				<div class="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
					<button type="button" onclick="window.closeCreateProjectModal()" class="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition font-semibold cursor-pointer">Cancel</button>
					<button type="submit" id="btnSubmitProject" class="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition active:scale-95 shadow-lg shadow-emerald-500/10 cursor-pointer">Create project</button>
				</div>
			</form>
		</div>
	</div>`
}

export function renderNavbarUserScript(): string {
	return `
	<script>
	(function() {
		window.applyTheme = function(theme) {
			try {
				localStorage.setItem('macros_theme', theme);
				var effective = theme;
				if (theme === 'system') {
					var m = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
					effective = (m && m.matches) ? 'dark' : 'light';
				}
				document.documentElement.setAttribute('data-theme', effective);
				document.documentElement.setAttribute('data-theme-setting', theme);
				if (effective === 'light') {
					document.documentElement.classList.remove('dark');
				} else {
					document.documentElement.classList.add('dark');
				}
			} catch(e) {}
		};

		if (window.matchMedia) {
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
				if (localStorage.getItem('macros_theme') === 'system') {
					window.applyTheme('system');
				}
			});
		}

		window.toggleLangMenu = function(e) {
			if (e) {
				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
			}
			const langDrop = document.getElementById('langDropdown');
			const langChev = document.getElementById('langChevron');
			if (!langDrop) return;
			const isHidden = langDrop.classList.contains('hidden');
			const userDrop = document.getElementById('userMenuDropdown');
			const userChev = document.getElementById('userMenuChevron');
			if (userDrop) userDrop.classList.add('hidden');
			if (userChev) userChev.style.transform = 'rotate(0deg)';

			if (isHidden) {
				langDrop.classList.remove('hidden');
				if (langChev) langChev.style.transform = 'rotate(180deg)';
			} else {
				langDrop.classList.add('hidden');
				if (langChev) langChev.style.transform = 'rotate(0deg)';
			}
		};

		window.toggleUserMenu = function(e) {
			if (e) {
				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
			}
			const dropdown = document.getElementById('userMenuDropdown');
			const chevron = document.getElementById('userMenuChevron');
			if (!dropdown) return;
			const isHidden = dropdown.classList.contains('hidden');
			const langDrop = document.getElementById('langDropdown');
			const langChev = document.getElementById('langChevron');
			if (langDrop) langDrop.classList.add('hidden');
			if (langChev) langChev.style.transform = 'rotate(0deg)';

			if (isHidden) {
				dropdown.classList.remove('hidden');
				if (chevron) chevron.style.transform = 'rotate(180deg)';
			} else {
				dropdown.classList.add('hidden');
				if (chevron) chevron.style.transform = 'rotate(0deg)';
			}
		};

		window.handleMenuLogout = async function() {
			localStorage.removeItem('macros_token');
			localStorage.removeItem('macros_user');
			try { await fetch('/api/v1/auth/logout', { method: 'POST' }); } catch (err) {}
			document.cookie = 'macros_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			window.location.href = '/';
		};

		function ensureModalAtBody() {
			const modal = document.getElementById('createProjectModal');
			if (modal && modal.parentElement !== document.body) {
				document.body.appendChild(modal);
			}
		}
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', ensureModalAtBody);
		} else {
			ensureModalAtBody();
		}

		window.openCreateProjectModal = function(defaultType) {
			ensureModalAtBody();
			const modal = document.getElementById('createProjectModal');
			if (!modal) {
				window.location.href = '/dashboard/projects?create=1';
				return;
			}
			modal.classList.remove('hidden');
			document.body.style.overflow = 'hidden';
			if (defaultType && window.selectProjectType) {
				window.selectProjectType(defaultType);
			}
			setTimeout(function() {
				const input = document.getElementById('newProjectName');
				if (input) input.focus();
			}, 60);
		};

		window.closeCreateProjectModal = function() {
			const modal = document.getElementById('createProjectModal');
			if (modal) modal.classList.add('hidden');
			document.body.style.overflow = '';
			const err = document.getElementById('createProjectError');
			if (err) err.classList.add('hidden');
		};

		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape') {
				const modal = document.getElementById('createProjectModal');
				if (modal && !modal.classList.contains('hidden')) {
					window.closeCreateProjectModal();
				}
			}
		});

		window.selectProjectType = function(type) {
			const input = document.getElementById('newProjectType');
			if (input) input.value = type;
			document.querySelectorAll('.project-type-btn').forEach(function(btn) {
				btn.className = 'project-type-btn py-2 px-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 font-medium hover:border-zinc-700 transition text-center cursor-pointer';
			});
			const activeBtn = document.getElementById('btnType_' + type);
			if (activeBtn) {
				activeBtn.className = 'project-type-btn py-2 px-3 rounded-xl border border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold transition text-center cursor-pointer';
			}
		};

		window.onProjectNameChange = function(val) {
			const slugInput = document.getElementById('newProjectSlug');
			if (slugInput && !slugInput.dataset.manual) {
				slugInput.value = val.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
			}
		};

		window.handleCreateProject = async function(e) {
			if (e && e.preventDefault) e.preventDefault();
			const err = document.getElementById('createProjectError');
			const submitBtn = document.getElementById('btnSubmitProject');
			if (err) err.classList.add('hidden');
			if (submitBtn) {
				submitBtn.disabled = true;
				submitBtn.textContent = 'Creating...';
			}
			try {
				const projectType = document.getElementById('newProjectType')?.value || 'mod';
				const name = document.getElementById('newProjectName')?.value?.trim();
				const slug = document.getElementById('newProjectSlug')?.value?.trim();
				const summary = document.getElementById('newProjectSummary')?.value?.trim();

				if (!name || !slug) {
					throw new Error('Name and URL slug are required');
				}

				const token = localStorage.getItem('macros_token') || '';
				const headers = { 'Content-Type': 'application/json' };
				if (token) headers['Authorization'] = 'Bearer ' + token;

				const res = await fetch('/api/v1/projects', {
					method: 'POST',
					headers: headers,
					body: JSON.stringify({
						title: name,
						slug: slug,
						project_type: projectType,
						description: summary
					})
				});

				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || 'Failed to create project');
				}

				window.closeCreateProjectModal();
				window.location.href = '/dashboard/projects';
			} catch (error) {
				if (err) {
					err.textContent = error.message;
					err.classList.remove('hidden');
				}
			} finally {
				if (submitBtn) {
					submitBtn.disabled = false;
					submitBtn.textContent = 'Create project';
				}
			}
		};

		const TRANSLATIONS = {
			en: {
				'nav.catalog': 'Discover',
				'nav.features': 'Features',
				'nav.github': 'GitHub',
				'nav.download': 'Download',
				'nav.signin': 'Sign in',
				'nav.publish': 'Publish',
				'nav.menu.profile': 'Profile',
				'nav.menu.pro': 'Upgrade to Macros+',
				'nav.menu.servers': 'My servers',
				'nav.menu.settings': 'Settings',
				'nav.menu.notifications': 'Notifications',
				'nav.menu.reports': 'Active reports',
				'nav.menu.collections': 'Collections',
				'nav.menu.projects': 'Projects',
				'nav.menu.organizations': 'Organizations',
				'nav.menu.analytics': 'Analytics',
				'nav.menu.revenue': 'Revenue',
				'nav.menu.switch_account': 'Switch account',
				'nav.menu.signout': 'Sign out',
				'nav.menu.dashboard': 'Dashboard',
				'nav.menu.download': 'Download launcher',
				'nav.menu.logout': 'Log out',
				'nav.user.default': 'Community member',

				'nav.home': 'Home',
				'download.title': 'Download MacrosApp — Official Launcher',
				'download.subtitle': 'Autonomous Minecraft launcher for Windows',
				'download.installer': 'Download for Windows (.exe)',
				'download.portable': 'Portable version (no installation)',
				'download.back_home': 'Back to home',

				'account.title': 'Dashboard — MacrosApp',
				'account.loading': 'Loading profile...',
				'account.badge.early': 'Early Adopter',
				'account.bio.default': 'A Macros user.',
				'account.edit.btn': 'Edit',
				'account.stats.projects': 'projects',
				'account.stats.downloads': 'downloads',
				'account.stats.joined': 'Joined',
				'account.stats.recently': 'recently',
				'account.menu.manage_projects': 'Manage projects',
				'account.menu.copy_id': 'Copy ID',
				'account.menu.copy_link': 'Copy permanent link',
				'account.tab.projects': 'Projects',
				'account.tab.instances': 'Shared Modpacks',
				'account.tab.friends': 'Friends',
				'account.empty.title': 'This user has no projects!',
				'account.empty.subtitle': "You don't have any projects yet.",
				'account.empty.create_btn': 'Create a project',
				'mod.back': 'Discover content',
				'mod.tab.description': 'Description',
				'mod.tab.versions': 'Versions',
				'mod.tab.gallery': 'Gallery',
				'mod.compatibility': 'Compatibility',
				'mod.platforms': 'Platforms',
				'mod.environments': 'Supported environments',
				'mod.links': 'Links',
				'mod.tags': 'Tags',
				'mod.creators': 'Creators',
				'mod.filter.all_versions': 'All game versions',
				'mod.filter.all_loaders': 'All loaders',
				'mod.filter.all_channels': 'All channels',
				'mod.share_copied': 'Project link copied to clipboard!',
				'account.friends.title': 'Online Friends',
				'account.friends.placeholder': "Friend's username...",
				'account.friends.add': 'Add',
				'account.friends.empty': 'Friend list is empty',
				'account.friends.status_friend': 'Friend',
				'account.friends.status_request': 'Pending',
				'account.instances.title': 'Shared Modpacks',
				'account.instances.subtitle': 'Modpacks and instances you share with friends directly from MacrosApp.',
				'account.instances.empty': "You haven't shared any modpacks from the launcher yet",

				'toast.id_copied': 'Account ID copied to clipboard!',
				'toast.link_copied': 'Profile link copied to clipboard!',

				'catalog.title': 'Discover content | MacrosApp',
				'catalog.provider.modrinth': 'Modrinth',
				'catalog.provider.curseforge': 'CurseForge',
				'catalog.category.mods': 'Mods',
				'catalog.category.resourcepacks': 'Resource Packs',
				'catalog.category.datapacks': 'Data Packs',
				'catalog.category.shaders': 'Shaders',
				'catalog.category.modpacks': 'Modpacks',
				'catalog.sidebar.game_version': 'Game version',
				'catalog.sidebar.loader': 'Loader',
				'catalog.sidebar.category': 'Category',
				'catalog.search.placeholder': 'Search mods, resource packs, shaders...',
				'catalog.search.version_search': 'Filter versions...',
				'catalog.sort.relevance': 'Relevance',
				'catalog.sort.downloads': 'Downloads',
				'catalog.sort.updated': 'Recently updated',
				'catalog.sort.newest': 'Newest',
				'catalog.sort.label': 'Sort by:',
				'catalog.btn.download': 'Download',
				'catalog.btn.install_launcher': 'In Launcher',
				'catalog.stats.downloads': 'downloads',
				'catalog.stats.follows': 'follows',
				'catalog.loading': 'Loading catalog...',
				'catalog.empty': 'No results found matching your filters',
				'catalog.all_versions': 'Show all versions',
				'catalog.filter.any_version': 'Any version',
				'catalog.filter.any_loader': 'Any loader',
				'catalog.filter.any_category': 'Any category',
				'catalog.modal.download_latest': 'Download latest',
				'catalog.modal.install_launcher': 'Install in Launcher',
				'catalog.modal.tab_description': 'Description',
				'catalog.modal.tab_versions': 'Versions',
				'catalog.modal.tab_gallery': 'Gallery',
				'catalog.modal.no_description': 'No description provided.',
				'catalog.modal.no_versions': 'No compatible versions found.',
				'catalog.modal.no_gallery': 'No screenshots available.',
				'catalog.modal.loading': 'Loading project details...',
				'catalog.modal.version': 'Version',
				'catalog.modal.release': 'Release',
				'catalog.modal.beta': 'Beta',
				'catalog.modal.alpha': 'Alpha',
				'catalog.modal.size': 'Size',
				'catalog.modal.date': 'Date',
				'catalog.modal.loaders': 'Loaders',
				'catalog.modal.game_versions': 'Game versions',

				'modal.edit.title': 'Edit Profile',
				'modal.tab.profile': 'Profile',
				'modal.tab.security': 'Security',
				'modal.avatar.label': 'Profile Avatar',
				'modal.avatar.upload_btn': 'Upload image from PC',
				'modal.avatar.hint': 'PNG, JPG, WebP or GIF (up to 5 MB)',
				'modal.username.label': 'Username (login)',
				'modal.username.hint': '3-25 characters: letters, numbers, _ - .',
				'modal.bio.label': 'About me',
				'modal.bio.placeholder': 'Tell about yourself...',
				'modal.btn.cancel': 'Cancel',
				'modal.btn.save': 'Save',
				'modal.sec.desc': 'To change password, enter current password and new password:',
				'modal.sec.current': 'Current password',
				'modal.sec.new': 'New password',
				'modal.sec.confirm': 'Confirm password',
				'modal.sec.btn': 'Change Password',

				'toast.friend_removed': 'Friend removed',
				'toast.friend_request_sent': 'Friend request sent!',
				'toast.user_not_found': 'User not found',
				'toast.file_too_large': 'File is too large (max 5 MB)',
				'toast.profile_updated': 'Profile updated successfully!',
				'toast.profile_save_failed': 'Failed to save profile',
				'toast.fill_all_passwords': 'Please fill in all password fields',
				'toast.passwords_mismatch': 'Passwords do not match',
				'toast.password_too_short': 'Password must be at least 6 characters',
				'toast.password_updated': 'Password changed successfully!',
				'toast.password_change_failed': 'Failed to change password',
				'toast.incorrect_password': 'Incorrect current password',
				'toast.username_taken': 'Username is already taken',
				'toast.rate_limit': 'Too many attempts. Please wait a minute.',
				'toast.invalid_credentials': 'Invalid username or password',
				'toast.error_generic': 'An error occurred',

				'auth.title.signin': 'Sign in — MacrosApp',
				'auth.title.signup': 'Sign up — MacrosApp',
				'auth.tab.signin': 'Sign in',
				'auth.tab.signup': 'Sign up',
				'auth.close': 'Close',
				'auth.launcher_badge': 'Launcher',
				'auth.launcher_hint': 'Sign in to link your account to the Macros launcher.',
				'auth.google_btn': 'Continue with Google',
				'auth.divider': 'or with login',
				'auth.label.login': 'Username or Email',
				'auth.placeholder.login': 'Username',
				'auth.label.email': 'Email (optional)',
				'auth.label.password': 'Password',
				'auth.btn.signin': 'Sign in to account',
				'auth.btn.signup': 'Create account',
				'auth.btn.signing_in': 'Signing in...',
				'auth.btn.signing_up': 'Creating account...',

				'hero.badge': 'Open-Source Modrinth App Fork',
				'hero.title': 'The Minecraft Launcher',
				'hero.subtitle': 'Next-generation Minecraft launcher — an open-source fork of the Modrinth App with full Ely.by skins & auth support, Microsoft accounts, friend instance sharing, and one-click mod installation.',
				'hero.btn.download': 'Download launcher (.exe)',
				'hero.btn.account': 'Dashboard',
				'hero.btn.signin': 'Sign in',
				'hero.btn.github': 'GitHub',

				'showcase.badge': 'For Players',
				'showcase.title': 'Discover over 100,000 creations',
				'showcase.subtitle': 'From magical biomes to cursed dungeons, you can be sure to find content to bring your gameplay to the next level.',

				'search.heading': 'Find what you want, quickly and easily',
				'search.description': 'Instant search and smart filters let you discover the right mods, modpacks, and shaders as you type.',
				'search.bullet1.title': 'Automatic dependency resolution',
				'search.bullet1.desc': 'Required libraries and mod APIs are resolved and installed automatically without conflicts.',
				'search.bullet2.title': 'Version compatibility check',
				'search.bullet2.desc': 'Protection against crashes and strict version filtering for Fabric, Forge, and NeoForge loaders.',
				'search.bullet3.title': 'Direct CDN downloads',
				'search.bullet3.desc': 'Maximum download speeds with zero queues, throttling, or waiting.',

				'demo.search.placeholder': 'Search mods, resource packs, shaders...',
				'demo.search.sort': 'Sort by: <strong class="text-zinc-200 font-medium">Relevance</strong>',

				'notif.badge': 'Auto-Updates',
				'notif.heading': 'Follow your favorite<br><span class="text-emerald-400">projects and authors</span>',
				'notif.desc': 'Be the first to know when updates arrive for your Minecraft version. The launcher automatically keeps your mods up-to-date.',
				'notif.feed.title': 'Update Feed',
				'notif.feed.count': '3 new',
				'notif.item1.title': 'Sodium updated!',
				'notif.item1.desc': 'Version 0.6.0 released for Minecraft 1.21.1',
				'notif.item1.time': '2h ago',
				'notif.item2.title': 'Iris Shaders updated!',
				'notif.item2.desc': 'Version 1.8.0 released for Minecraft 1.21.1',
				'notif.item2.time': '5h ago',
				'notif.item3.title': 'Mod Menu updated!',
				'notif.item3.desc': 'Version 11.0.1 released with new filter options',
				'notif.item3.time': '1d ago',

				'preview.title': 'MacrosApp Launcher — v1.0.0',
				'preview.tab.instances': 'My Instances',
				'preview.tab.catalog': 'Discover',
				'preview.tab.friends': 'Friends & Play',
				'preview.tab.settings': 'Settings',
				'preview.card.status': 'Fabric • 42 mods active',
				'preview.btn.play': 'Play',

				'features.badge': 'Platform Performance',
				'features.heading': 'Engineered for speed, privacy, and control',
				'features.subtitle': 'Built with Rust and Tauri for near-zero idle memory usage, instantaneous startup, and total independence.',
				'feat1.title': 'Blazing fast startup',
				'feat1.desc': 'Starts in milliseconds with zero bloated background processes or memory leaks.',
				'feat2.title': 'Ely.by & Microsoft accounts',
				'feat2.desc': 'Full support for Ely.by skins and auth, official Microsoft accounts, and offline play.',
				'feat3.title': 'Friend instances & sharing',
				'feat3.desc': 'Share your modpacks and instance configurations with friends with zero hassle.',
				'feat4.title': 'Multi-loader support',
				'feat4.desc': 'Seamless installation of Fabric, Forge, NeoForge, and Quilt with automated runtime setup.',
				'feat5.title': 'Isolated game profiles',
				'feat5.desc': 'Every instance has its own separate mods, configs, saves, and Java runtimes.',
				'feat6.title': '100% open-source & transparent',
				'feat6.desc': 'No telemetry, no hidden miners, no adware. Pure open-source code you can audit and trust.',

				'cta.heading': 'Ready to enhance your Minecraft experience?',
				'cta.subtitle': 'Download the MacrosApp launcher today or explore thousands of community mods.',
				'cta.btn.download': 'Download for Windows (.exe)',
				'cta.btn.catalog': 'Explore Catalog',

				'footer.desc': 'Next-generation Minecraft launcher & mod platform built for speed and freedom.',
				'footer.links.catalog': 'Discover',
				'footer.links.features': 'Features',
				'footer.links.download': 'Download',
				'footer.links.github': 'GitHub',
				'footer.disclaimer': 'MacrosApp is an open-source Minecraft launcher based on the Modrinth App fork, enhanced with Ely.by accounts and community sharing. Not affiliated with Mojang Studios or Microsoft.'
			},
			ru: {
				'nav.catalog': 'Каталог',
				'nav.features': 'Возможности',
				'nav.github': 'GitHub',
				'nav.download': 'Скачать',
				'nav.signin': 'Войти',
				'nav.publish': 'Опубликовать',
				'nav.menu.profile': 'Профиль',
				'nav.menu.pro': 'Macros+ Pro',
				'nav.menu.servers': 'Мои серверы',
				'nav.menu.settings': 'Настройки',
				'nav.menu.notifications': 'Уведомления',
				'nav.menu.reports': 'Жалобы и отчеты',
				'nav.menu.collections': 'Коллекции',
				'nav.menu.projects': 'Проекты',
				'nav.menu.organizations': 'Организации',
				'nav.menu.analytics': 'Аналитика',
				'nav.menu.revenue': 'Доход',
				'nav.menu.switch_account': 'Сменить аккаунт',
				'nav.menu.signout': 'Выйти',
				'nav.menu.dashboard': 'Личный кабинет',
				'nav.menu.download': 'Скачать лаунчер',
				'nav.menu.logout': 'Выйти',
				'nav.user.default': 'Игрок сообщества',

				'hero.badge': 'Открытый форк Modrinth App',
				'nav.home': 'Главная',
				'download.title': 'Скачать MacrosApp — Официальный лаунчер',
				'download.subtitle': 'Автономный лаунчер Minecraft для Windows',
				'download.installer': 'Скачать для Windows (.exe)',
				'download.portable': 'Портативная версия (без установки)',
				'download.back_home': 'Вернуться на главную',

				'account.title': 'Личный кабинет — MacrosApp',
				'account.loading': 'Загрузка профиля...',
				'account.badge.early': 'Early Adopter',
				'account.bio.default': 'Участник сообщества MacrosApp',
				'account.edit.btn': 'Редактировать',
				'account.stats.projects': 'проектов',
				'account.stats.downloads': 'скачиваний',
				'account.stats.joined': 'В сообществе',
				'account.stats.recently': 'недавно',
				'account.menu.manage_projects': 'Управление проектами',
				'account.menu.copy_id': 'Скопировать ID',
				'account.menu.copy_link': 'Скопировать ссылку',
				'account.tab.projects': 'Проекты',
				'account.tab.instances': 'Общие сборки',
				'account.tab.friends': 'Друзья',
				'account.empty.title': 'У пользователя нет проектов!',
				'account.empty.subtitle': 'У вас пока нет проектов.',
				'account.empty.create_btn': 'Создать проект',
				'mod.back': 'Каталог',
				'mod.tab.description': 'Описание',
				'mod.tab.versions': 'Версии',
				'mod.tab.gallery': 'Галерея',
				'mod.compatibility': 'Совместимость',
				'mod.platforms': 'Платформы',
				'mod.environments': 'Поддерживаемое окружение',
				'mod.links': 'Ссылки',
				'mod.tags': 'Теги',
				'mod.creators': 'Создатели',
				'mod.filter.all_versions': 'Все версии игры',
				'mod.filter.all_loaders': 'Все загрузчики',
				'mod.filter.all_channels': 'Все каналы',
				'mod.share_copied': 'Ссылка на проект скопирована в буфер обмена!',
				'account.friends.title': 'Друзья в сети',
				'account.friends.placeholder': 'Никнейм друга...',
				'account.friends.add': 'Добавить',
				'account.friends.empty': 'Список друзей пуст',
				'account.friends.status_friend': 'В друзьях',
				'account.friends.status_request': 'Запрос',
				'account.instances.title': 'Общие сборки',
				'account.instances.subtitle': 'Сборки, которыми вы делитесь со своими друзьями прямо из MacrosApp.',
				'account.instances.empty': 'Вы еще не делились сборками из лаунчера',

				'toast.id_copied': 'ID аккаунта скопирован в буфер обмена!',
				'toast.link_copied': 'Ссылка на профиль скопирована в буфер обмена!',

				'catalog.title': 'Discover content | MacrosApp',
				'catalog.provider.modrinth': 'Modrinth',
				'catalog.provider.curseforge': 'CurseForge',
				'catalog.category.mods': 'Моды',
				'catalog.category.resourcepacks': 'Ресурспаки',
				'catalog.category.datapacks': 'Датапаки',
				'catalog.category.shaders': 'Шейдеры',
				'catalog.category.modpacks': 'Сборки',
				'catalog.sidebar.game_version': 'Версия игры',
				'catalog.sidebar.loader': 'Загрузчик',
				'catalog.sidebar.category': 'Категория',
				'catalog.search.placeholder': 'Поиск модов, сборок, шейдеров...',
				'catalog.search.version_search': 'Фильтр версий...',
				'catalog.sort.relevance': 'По релевантности',
				'catalog.sort.downloads': 'По скачиваниям',
				'catalog.sort.updated': 'Недавно обновленные',
				'catalog.sort.newest': 'Сначала новые',
				'catalog.sort.label': 'Сортировка:',
				'catalog.btn.download': 'Скачать',
				'catalog.btn.install_launcher': 'В лаунчер',
				'catalog.stats.downloads': 'скачиваний',
				'catalog.stats.follows': 'подписчиков',
				'catalog.loading': 'Загрузка каталога...',
				'catalog.empty': 'Ничего не найдено по заданным фильтрам',
				'catalog.all_versions': 'Показать все версии',
				'catalog.filter.any_version': 'Все версии',
				'catalog.filter.any_loader': 'Все загрузчики',
				'catalog.filter.any_category': 'Все категории',
				'catalog.modal.download_latest': 'Скачать последнюю',
				'catalog.modal.install_launcher': 'Установить в лаунчер',
				'catalog.modal.tab_description': 'Описание',
				'catalog.modal.tab_versions': 'Версии',
				'catalog.modal.tab_gallery': 'Галерея',
				'catalog.modal.no_description': 'Описание отсутствует.',
				'catalog.modal.no_versions': 'Совместимые версии не найдены.',
				'catalog.modal.no_gallery': 'Скриншоты отсутствуют.',
				'catalog.modal.loading': 'Загрузка информации о проекте...',
				'catalog.modal.version': 'Версия',
				'catalog.modal.release': 'Релиз',
				'catalog.modal.beta': 'Бета',
				'catalog.modal.alpha': 'Альфа',
				'catalog.modal.size': 'Размер',
				'catalog.modal.date': 'Дата',
				'catalog.modal.loaders': 'Загрузчики',
				'catalog.modal.game_versions': 'Версии игры',

				'modal.edit.title': 'Редактирование профиля',
				'modal.tab.profile': 'Профиль',
				'modal.tab.security': 'Безопасность',
				'modal.avatar.label': 'Аватар профиля',
				'modal.avatar.upload_btn': 'Загрузить фото с ПК',
				'modal.avatar.hint': 'PNG, JPG, WebP или GIF (до 5 МБ)',
				'modal.username.label': 'Имя пользователя (логин)',
				'modal.username.hint': '3-25 символов: буквы, цифры, _ - .',
				'modal.bio.label': 'О себе',
				'modal.bio.placeholder': 'Расскажите о себе...',
				'modal.btn.cancel': 'Отмена',
				'modal.btn.save': 'Сохранить',
				'modal.sec.desc': 'Для смены пароля введите текущий пароль и новый:',
				'modal.sec.current': 'Текущий пароль',
				'modal.sec.new': 'Новый пароль',
				'modal.sec.confirm': 'Подтвердите пароль',
				'modal.sec.btn': 'Сменить пароль',

				'toast.friend_removed': 'Друг удален',
				'toast.friend_request_sent': 'Запрос в друзья отправлен!',
				'toast.user_not_found': 'Пользователь не найден',
				'toast.file_too_large': 'Файл слишком большой (макс. 5 МБ)',
				'toast.profile_updated': 'Профиль успешно обновлён!',
				'toast.profile_save_failed': 'Не удалось сохранить профиль',
				'toast.fill_all_passwords': 'Заполните все поля пароля',
				'toast.passwords_mismatch': 'Пароли не совпадают',
				'toast.password_too_short': 'Пароль минимум 6 символов',
				'toast.password_updated': 'Пароль успешно изменён!',
				'toast.password_change_failed': 'Не удалось изменить пароль',
				'toast.incorrect_password': 'Неверный текущий пароль',
				'toast.username_taken': 'Имя пользователя уже занято',
				'toast.rate_limit': 'Слишком много попыток. Подождите минуту.',
				'toast.invalid_credentials': 'Неверный логин или пароль',
				'toast.error_generic': 'Произошла ошибка',

				'auth.title.signin': 'Вход — MacrosApp',
				'auth.title.signup': 'Регистрация — MacrosApp',
				'auth.tab.signin': 'Вход',
				'auth.tab.signup': 'Регистрация',
				'auth.close': 'Закрыть',
				'auth.launcher_badge': 'Лаунчер',
				'auth.launcher_hint': 'Вход для подключения вашего аккаунта к лаунчеру Macros.',
				'auth.google_btn': 'Продолжить через Google',
				'auth.divider': 'или логин',
				'auth.label.login': 'Логин или Email',
				'auth.placeholder.login': 'Никнейм',
				'auth.label.email': 'Email (опционально)',
				'auth.label.password': 'Пароль',
				'auth.btn.signin': 'Войти в аккаунт',
				'auth.btn.signup': 'Зарегистрироваться',
				'auth.btn.signing_in': 'Вход...',
				'auth.btn.signing_up': 'Регистрация...',

				'hero.title': 'Лаунчер Minecraft',
				'hero.subtitle': 'Быстрый и свободный лаунчер Minecraft — открытый форк Modrinth App с поддержкой скинов и авторизации Ely.by, официальных аккаунтов, обмена сборками и установки любых модов в один клик.',
				'hero.btn.download': 'Скачать лаунчер (.exe)',
				'hero.btn.account': 'Личный кабинет',
				'hero.btn.signin': 'Войти',
				'hero.btn.github': 'GitHub',

				'showcase.badge': 'Для игроков',
				'showcase.title': 'Более 100 000 дополнений',
				'showcase.subtitle': 'От потрясающих биомов и магии до рекордной оптимизации FPS — находите и устанавливайте контент прямо в лаунчере.',

				'search.heading': 'Находите то, что нужно, быстро и просто',
				'search.description': 'Мгновенный поиск лаунчера MacrosApp и интеллектуальные фильтры позволяют находить нужные моды, модпаки и шейдеры прямо во время ввода запроса.',
				'search.bullet1.title': 'Автоматический расчет зависимостей',
				'search.bullet1.desc': 'Все библиотеки и API модов подтягиваются автоматически без конфликтов.',
				'search.bullet2.title': 'Проверка совместимости версий',
				'search.bullet2.desc': 'Защита от сбоев и фильтрация версий под загрузчики Fabric, Forge и NeoForge.',
				'search.bullet3.title': 'Загрузка напрямую с CDN',
				'search.bullet3.desc': 'Максимальная скорость скачивания файлов без очередей и рекламы.',

				'demo.search.placeholder': 'Поиск модов, ресурспаков, шейдеров...',
				'demo.search.sort': 'Сортировка: <strong class="text-zinc-200 font-medium">По релевантности</strong>',

				'notif.badge': 'Авто-уведомления',
				'notif.heading': 'Следите за любимыми<br><span class="text-emerald-400">проектами и авторами</span>',
				'notif.desc': 'Будьте первыми, кто узнает о выходе обновлений для вашей любимой версии Minecraft. Лаунчер аккуратно покажет готовые к установке апдейты.',
				'notif.feed.title': 'Лента обновлений',
				'notif.feed.count': '3 новых',
				'notif.item1.title': 'Sodium обновлен!',
				'notif.item1.desc': 'Вышла версия 0.6.0 для Minecraft 1.21.1',
				'notif.item1.time': '2 ч. назад',
				'notif.item2.title': 'Iris Shaders обновлен!',
				'notif.item2.desc': 'Вышла версия 1.8.0 для Minecraft 1.21.1',
				'notif.item2.time': '5 ч. назад',
				'notif.item3.title': 'Mod Menu обновлен!',
				'notif.item3.desc': 'Вышла версия 11.0.1 с новыми фильтрами',
				'notif.item3.time': '1 день назад',

				'preview.title': 'MacrosApp Launcher — v1.0.0',
				'preview.tab.instances': 'Мои сборки',
				'preview.tab.catalog': 'Каталог',
				'preview.tab.friends': 'Мультиплеер',
				'preview.tab.settings': 'Настройки',
				'preview.card.status': 'Fabric • 42 мода активно',
				'preview.btn.play': 'Играть',

				'features.badge': 'Архитектура и скорость',
				'features.heading': 'Создан для скорости, надежности и свободы',
				'features.subtitle': 'Максимальная производительность на движке Rust и Tauri. Меньше потребление памяти, быстрее запуск.',
				'feat1.title': 'Мгновенный запуск',
				'feat1.desc': 'Запускается за доли секунды, потребляет минимум оперативной памяти и не нагружает систему.',
				'feat2.title': 'Ely.by и Microsoft',
				'feat2.desc': 'Полная поддержка скинов и авторизации Ely.by, официальных аккаунтов Microsoft и оффлайн-режима.',
				'feat3.title': 'Общие сборки для друзей',
				'feat3.desc': 'Делитесь своими настроенными сборками с друзьями и играйте вместе без лишних сложностей.',
				'feat4.title': 'Поддержка всех загрузчиков',
				'feat4.desc': 'Автоматическая установка Fabric, Forge, NeoForge и Quilt в один клик без ручной возни.',
				'feat5.title': 'Изолированные профили',
				'feat5.desc': 'Каждая сборка изолирована: свои моды, миры, конфиги и версии Java без конфликтов.',
				'feat6.title': 'Полная прозрачность и безопасность',
				'feat6.desc': 'Открытый исходный код без скрытого софта, телеметрии и рекламы. Полный контроль за вами.',

				'cta.heading': 'Готовы к новому уровню игры в Minecraft?',
				'cta.subtitle': 'Скачайте лаунчер MacrosApp или находите тысячи модификаций, ресурспаков и шейдеров от сообщества.',
				'cta.btn.download': 'Скачать для Windows (.exe)',
				'cta.btn.catalog': 'Открыть каталог модов',

				'footer.desc': 'Лаунчер Minecraft нового поколения и платформа модов, созданные для скорости и свободы.',
				'footer.links.catalog': 'Каталог',
				'footer.links.features': 'Возможности',
				'footer.links.download': 'Скачать',
				'footer.links.github': 'GitHub',
				'footer.disclaimer': 'MacrosApp — открытый лаунчер Minecraft, созданный на базе форка Modrinth App с интеграцией Ely.by и обменом сборками с друзьями. Не связан с Mojang Studios или Microsoft.'
			}
		};

		const HERO_WORDS = {
			en: ['for mods', 'for modpacks', 'for shaders', 'for resource packs', 'for friends', 'for performance', 'for players', 'for mods'],
			ru: ['для модов', 'для сборок', 'для шейдеров', 'для ресурспаков', 'для друзей', 'для высокой скорости', 'для игроков', 'для модов']
		};

		function setAppLanguage(lang) {
			if (!TRANSLATIONS[lang]) lang = 'en';
			localStorage.setItem('macros_lang', lang);
			document.documentElement.lang = lang;

			const label = document.getElementById('currentLangLabel');
			if (label) label.textContent = lang.toUpperCase();

			const checkEn = document.getElementById('checkLangEn');
			const checkRu = document.getElementById('checkLangRu');
			if (checkEn) checkEn.classList.toggle('hidden', lang !== 'en');
			if (checkRu) checkRu.classList.toggle('hidden', lang !== 'ru');

			document.querySelectorAll('[data-i18n]').forEach(el => {
				const key = el.getAttribute('data-i18n');
				if (TRANSLATIONS[lang][key]) {
					el.textContent = TRANSLATIONS[lang][key];
				}
			});

			document.querySelectorAll('[data-i18n-html]').forEach(el => {
				const key = el.getAttribute('data-i18n-html');
				if (TRANSLATIONS[lang][key]) {
					el.innerHTML = TRANSLATIONS[lang][key];
				}
			});

			document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
				const key = el.getAttribute('data-i18n-placeholder');
				if (TRANSLATIONS[lang][key]) {
					el.placeholder = TRANSLATIONS[lang][key];
				}
			});

			const wordsContainer = document.getElementById('heroRotatingWords');
			if (wordsContainer && HERO_WORDS[lang]) {
				wordsContainer.innerHTML = HERO_WORDS[lang]
					.map(w => '<strong class="main-header-strong">' + w + '</strong>')
					.join('');
			}

			const dropdown = document.getElementById('langDropdown');
			const chevron = document.getElementById('langChevron');
			if (dropdown) dropdown.classList.add('hidden');
			if (chevron) chevron.style.transform = 'rotate(0deg)';

			const sortPrefix = document.getElementById('sortPrefixText');
			if (sortPrefix) sortPrefix.textContent = lang === 'ru' ? 'Сортировка:' : 'Sort:';
			const sortLabels = {
				ru: { relevance: 'По релевантности', downloads: 'По скачиваниям', follows: 'По популярности', updated: 'По обновлениям', newest: 'Новые' },
				en: { relevance: 'Relevance', downloads: 'Most downloads', follows: 'Most follows', updated: 'Recently updated', newest: 'Recently published' }
			};
			document.querySelectorAll('.custom-sort-item').forEach(item => {
				const val = item.getAttribute('data-value');
				const lbl = item.querySelector('.sort-label');
				if (lbl && sortLabels[lang] && sortLabels[lang][val]) {
					lbl.textContent = sortLabels[lang][val];
				}
			});
			const currentSortLabel = document.getElementById('sortCurrentLabel');
			const curVal = typeof currentSortValue !== 'undefined' ? currentSortValue : 'relevance';
			if (currentSortLabel && sortLabels[lang] && sortLabels[lang][curVal]) {
				currentSortLabel.textContent = sortLabels[lang][curVal];
			}
		}

		window.setAppLanguage = setAppLanguage;
		window.TRANSLATIONS = TRANSLATIONS;

		document.addEventListener('click', (e) => {
			const langDrop = document.getElementById('langDropdown');
			const langChev = document.getElementById('langChevron');
			const langBtn = document.getElementById('langSwitcherBtn');
			if (langDrop && !langDrop.classList.contains('hidden')) {
				if (!langDrop.contains(e.target) && !langBtn?.contains(e.target)) {
					langDrop.classList.add('hidden');
					if (langChev) langChev.style.transform = 'rotate(0deg)';
				}
			}
			const dropdown = document.getElementById('userMenuDropdown');
			const chevron = document.getElementById('userMenuChevron');
			const userMenuTrigger = document.getElementById('userMenuTrigger');
			if (dropdown && !dropdown.classList.contains('hidden')) {
				if (!dropdown.contains(e.target) && !userMenuTrigger?.contains(e.target)) {
					dropdown.classList.add('hidden');
					if (chevron) chevron.style.transform = 'rotate(0deg)';
				}
			}
			const projModal = document.getElementById('createProjectModal');
			if (projModal && !projModal.classList.contains('hidden') && e.target === projModal) {
				window.closeCreateProjectModal();
			}
		});

		// Initialize Language on DOMContentLoaded
		const initialLang = localStorage.getItem('macros_lang') || 'en';
		setAppLanguage(initialLang);
	})();
	</script>`
}

export function renderLandingHtml(user?: any): string {
	return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>MacrosApp | The Minecraft Modding Platform</title>
	<link rel="icon" type="image/png" href="/assets/favicon.png">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
	<script src="https://cdn.tailwindcss.com"></script>
	<script>
		tailwind.config = {
			darkMode: 'class',
			theme: {
				extend: {
					colors: {
						oled: '#000000',
						card: '#0c0c0d',
						'card-hover': '#141416',
						brand: '#10b981',
						'brand-hover': '#059669',
						border: 'rgba(255, 255, 255, 0.08)',
						'border-hover': 'rgba(255, 255, 255, 0.16)'
					},
					fontFamily: {
						sans: ['Inter', 'system-ui', 'sans-serif'],
					}
				}
			}
		}
	</script>
	${THEME_HEAD_SCRIPT}
	<style>
		${OLED_SCROLLBAR_CSS}
		${THEME_CSS}
		
		html {
			scroll-behavior: smooth;
		}
		html, body {
			background-color: var(--theme-bg-page, #000000);
			color: var(--theme-text-primary, #f4f4f5);
			overflow-x: hidden;
			width: 100%;
			margin: 0;
			padding: 0;
		}
		@keyframes fadeUp {
			from { opacity: 0; transform: translateY(16px); }
			to { opacity: 1; transform: translateY(0); }
		}
		.animate-fade-up {
			animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		}
		.oled-card {
			background: #09090b;
			border: 1px solid rgba(255, 255, 255, 0.08);
			transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		}
		.oled-card:hover {
			border-color: rgba(255, 255, 255, 0.18);
			transform: translateY(-2px);
		}

		/* Hero Header & Rotating Animation (Modrinth Standard) */
		.animate-strong {
			height: 1.25em;
			line-height: 1.25em;
			position: relative;
			overflow: hidden;
			display: flex;
			width: 100%;
			justify-content: center;
			text-align: center;
			margin-top: 0.35rem;
		}
		.animate-strong > span {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			width: 100%;
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			animation: slideHero 14s infinite;
		}
		.main-header-strong {
			font-weight: 800;
			background: linear-gradient(180deg, #6ee7b7 0%, #10b981 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			color: #10b981;
			display: block;
			width: 100%;
			height: 1.25em;
			line-height: 1.25em;
			text-align: center;
			white-space: nowrap;
		}
		@keyframes slideHero {
			0%, 12.5% { top: 0; }
			14.3%, 26.8% { top: -1.25em; }
			28.6%, 41.1% { top: -2.5em; }
			42.9%, 55.4% { top: -3.75em; }
			57.2%, 69.7% { top: -5.0em; }
			71.5%, 84% { top: -6.25em; }
			85.8%, 98.3% { top: -7.5em; }
			100% { top: -8.75em; }
		}

		/* Marquee Ribbons (Smooth Slow Glide) */
		.marquee-wrapper {
			width: 100%;
			overflow: hidden;
			position: relative;
			mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
			-webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
		}
		.marquee-row {
			display: flex;
			gap: 1rem;
			margin-bottom: 1rem;
			width: max-content;
		}
		.marquee-row:hover .marquee-content {
			animation-play-state: paused;
		}
		.marquee-content {
			display: flex;
			gap: 1rem;
			flex-shrink: 0;
		}
		.marquee-content.row-1 {
			animation: marqueeScroll 85s linear infinite;
		}
		.marquee-content.row-2 {
			animation: marqueeScrollReverse 95s linear infinite;
		}
		.marquee-content.row-3 {
			animation: marqueeScroll 90s linear infinite;
		}
		@keyframes marqueeScroll {
			from { transform: translateX(0); }
			to { transform: translateX(-50%); }
		}
		@keyframes marqueeScrollReverse {
			from { transform: translateX(-50%); }
			to { transform: translateX(0); }
		}
	</style>
</head>
<body class="min-h-screen flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
	<!-- Navbar -->
	<header class="border-b border-[rgba(255,255,255,0.08)] sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-xl">
		<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
			<div class="flex items-center gap-8">
				<a href="/" class="flex items-center gap-2.5 group shrink-0">
					<img src="/assets/logo.png" alt="MacrosApp" class="w-8 h-8 rounded-lg object-contain group-hover:scale-105 transition-transform">
					<span class="text-base font-bold tracking-tight text-white">MacrosApp</span>
				</a>

				<nav class="hidden md:flex items-center gap-6 text-sm text-zinc-400">
					<a href="/catalog" data-i18n="nav.catalog" class="hover:text-white transition">Discover</a>
					<a href="#features" data-i18n="nav.features" class="hover:text-white transition">Features</a>
					<a href="/download" data-i18n="nav.download" class="hover:text-white transition">Download</a>
					<a href="https://github.com/nnnegrvpeni-lang/MacrosApp" target="_blank" class="hover:text-white transition flex items-center gap-1.5">
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
						GitHub
					</a>
				</nav>
			</div>

			<!-- User Dropdown & Language Switcher in Navbar -->
			<div id="navUserSlot" class="flex items-center gap-3 shrink-0">
				${renderNavbarUserHtml(user)}
			</div>
		</div>
	</header>

	<!-- Hero Section -->
	<main class="flex-1 w-full flex flex-col items-center text-center pt-16 pb-28">
		<div class="max-w-4xl mx-auto px-6 flex flex-col items-center w-full">
			<!-- MacrosApp Logo (Large, No Background) -->
			<div class="mb-6 flex justify-center items-center">
				<img src="/assets/logo.png" alt="MacrosApp Logo" class="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_12px_28px_rgba(16,185,129,0.35)] select-none hover:scale-105 transition-transform duration-300">
			</div>

			<!-- Rotating Words Header -->
			<h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.2] w-full text-center animate-fade-up">
				<span id="heroTitleMain" data-i18n="hero.title">The Minecraft Launcher</span>
				<div class="animate-strong">
					<span id="heroRotatingWords">
						<strong class="main-header-strong">for mods</strong>
						<strong class="main-header-strong">for modpacks</strong>
						<strong class="main-header-strong">for shaders</strong>
						<strong class="main-header-strong">for resource packs</strong>
						<strong class="main-header-strong">for friends</strong>
						<strong class="main-header-strong">for performance</strong>
						<strong class="main-header-strong">for players</strong>
						<strong class="main-header-strong">for mods</strong>
					</span>
				</div>
			</h1>

			<!-- Subheading -->
			<p data-i18n="hero.subtitle" class="mt-6 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed animate-fade-up">
				Next-generation Minecraft launcher — open-source fork of the Modrinth App. Full support for Ely.by skins & auth, official Microsoft accounts, and one-click mod installation.
			</p>

			<!-- CTA Buttons -->
			<div class="mt-8 flex flex-wrap items-center justify-center gap-3.5 animate-fade-up">
				<a href="/download" class="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition active:scale-95 shadow-xl shadow-emerald-500/20">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
					<span data-i18n="hero.btn.download">Download launcher (.exe)</span>
				</a>
				${
					user
						? `<a href="/account" class="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-sm transition active:scale-95">
							<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
							<span data-i18n="hero.btn.account">Dashboard</span>
						</a>`
						: `<a href="/auth/sign-in" class="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-sm transition active:scale-95">
							<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
							<span data-i18n="hero.btn.signin">Sign in</span>
						</a>`
				}
				<a href="https://github.com/nnnegrvpeni-lang/MacrosApp" target="_blank" class="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 text-sm transition">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
					<span data-i18n="hero.btn.github">GitHub</span>
				</a>
			</div>
		</div>

		<!-- 3 Smooth Infinite Marquee Rows (45 real Modrinth mods, non-repeating) -->
		<div class="w-full mt-20 marquee-wrapper">
			<!-- Row 1: Left scroll (85s) -->
			<div class="marquee-row">
				<div class="marquee-content row-1">
					
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/P7dR8mSH/icon.png" alt="Fabric API" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Fabric API</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 252.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Lightweight and modular API providing common hooks and intercompatibility measures utilized by mods using the Fabric toolchain.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Library</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by modmuss50</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/AANobbMI/295862f4724dc3f78df3447ad6072b2dcd3ef0c9_96.webp" alt="Sodium" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Sodium</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 223.8M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A high-performance rendering engine replacement for Minecraft, which greatly improves frame rates and reduces micro-stutter.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Neoforge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by jellysquid3</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/YL57xq9U/18d0e7f076d3d6ed5bedd472b853909aac5da202_96.webp" alt="Iris Shaders" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Iris Shaders</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 173.9M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A modern shader pack loader for Minecraft intended to be compatible with existing OptiFine shader packs</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by coderbot</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/9s6osm5g/ed8a2316cbb6f4fc5f510e8e13a59a85cbbbff4d_96.webp" alt="Cloth Config API" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Cloth Config API</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 165.9M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Configuration Library for Minecraft Mods</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by shedaniel</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/NNAgCjsB/7873452d6cede4daed12da3d7d8c193ab88b4fd6_96.webp" alt="Entity Culling" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Entity Culling</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 164.6M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Using async path-tracing to hide Block-/Entities that are not visible</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Babric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by tr7zw</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/uXXizFIs/222a126f26f8f9ae1eb339f3b767677f18bff31f_96.webp" alt="FerriteCore" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">FerriteCore</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 149.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Memory usage optimizations</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by malte0811</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/mOgUt4GM/5a20ed1450a0e1e79a1fe04e61bb4e5878bf1d20.png" alt="Mod Menu" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Mod Menu</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 142.1M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Adds a mod menu to view the list of mods you have installed.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Quilt</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Prospector</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/gvQqBUqZ/bcc8686c13af0143adf4285d741256af824f70b7_96.webp" alt="Lithium" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Lithium</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 126.3M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">No-compromises game logic optimization mod, useful for both single-player games and multi-player servers.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Neoforge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by jellysquid3</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/5ZwdcRci/e57b6b451425692ac17ad322d5e14bea686a383a_96.webp" alt="ImmediatelyFast" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">ImmediatelyFast</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 122.0M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Speed up immediate mode rendering in Minecraft</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by RaphiMC</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/1eAoo2KR/08c0cd32515e260f4bb20bbc0696510041523f9a_96.webp" alt="YetAnotherConfigLib (YACL)" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">YetAnotherConfigLib (YACL)</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 120.9M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A builder-based configuration library for Minecraft!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by isxander</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/Ha28R6CL/72c3d74aeb665e45aea93a945a01474cbce3b7da_96.webp" alt="Fabric Language Kotlin" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Fabric Language Kotlin</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 116.7M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">This is a mod that enables usage of the Kotlin programming language for Fabric mods.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Library</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by modmuss50</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/1bokaNcj/354080f65407e49f486fcf9c4580e82c45ae63b8_96.webp" alt="Xaero's Minimap" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Xaero's Minimap</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 108.8M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Displays a map of the nearby world terrain, players, mobs, entities in the corner of your screen. Lets you create waypoints which help you find the locations you've marked.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by thexaero</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/BVzZfTc1/af683d206d50b05258d865b0d6e4aa2f2cee12f2_96.webp" alt="[ETF] Entity Texture Features" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">[ETF] Entity Texture Features</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 99.6M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Emissive, Random & Custom texture support for entities in resourcepacks just like Optifine but for Fabric</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Traben</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/lhGA9TYQ/05fe3a61c28faaccaec3533b92e1b321edde7bf6_96.webp" alt="Architectury API" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Architectury API</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 98.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">An intermediary api aimed to ease developing multiplatform mods.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by shedaniel</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/NcUtCpym/354080f65407e49f486fcf9c4580e82c45ae63b8_96.webp" alt="Xaero's World Map" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Xaero's World Map</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 95.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Adds a full screen world map which shows you what you have explored in the world. Works great together with Xaero's Minimap.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by thexaero</span>
								</div>
							</div>
						</div>
				</div>
				<div class="marquee-content row-1" aria-hidden="true">
					
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/P7dR8mSH/icon.png" alt="Fabric API" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Fabric API</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 252.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Lightweight and modular API providing common hooks and intercompatibility measures utilized by mods using the Fabric toolchain.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Library</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by modmuss50</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/AANobbMI/295862f4724dc3f78df3447ad6072b2dcd3ef0c9_96.webp" alt="Sodium" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Sodium</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 223.8M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A high-performance rendering engine replacement for Minecraft, which greatly improves frame rates and reduces micro-stutter.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Neoforge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by jellysquid3</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/YL57xq9U/18d0e7f076d3d6ed5bedd472b853909aac5da202_96.webp" alt="Iris Shaders" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Iris Shaders</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 173.9M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A modern shader pack loader for Minecraft intended to be compatible with existing OptiFine shader packs</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by coderbot</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/9s6osm5g/ed8a2316cbb6f4fc5f510e8e13a59a85cbbbff4d_96.webp" alt="Cloth Config API" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Cloth Config API</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 165.9M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Configuration Library for Minecraft Mods</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by shedaniel</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/NNAgCjsB/7873452d6cede4daed12da3d7d8c193ab88b4fd6_96.webp" alt="Entity Culling" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Entity Culling</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 164.6M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Using async path-tracing to hide Block-/Entities that are not visible</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Babric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by tr7zw</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/uXXizFIs/222a126f26f8f9ae1eb339f3b767677f18bff31f_96.webp" alt="FerriteCore" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">FerriteCore</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 149.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Memory usage optimizations</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by malte0811</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/mOgUt4GM/5a20ed1450a0e1e79a1fe04e61bb4e5878bf1d20.png" alt="Mod Menu" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Mod Menu</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 142.1M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Adds a mod menu to view the list of mods you have installed.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Quilt</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Prospector</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/gvQqBUqZ/bcc8686c13af0143adf4285d741256af824f70b7_96.webp" alt="Lithium" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Lithium</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 126.3M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">No-compromises game logic optimization mod, useful for both single-player games and multi-player servers.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Neoforge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by jellysquid3</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/5ZwdcRci/e57b6b451425692ac17ad322d5e14bea686a383a_96.webp" alt="ImmediatelyFast" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">ImmediatelyFast</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 122.0M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Speed up immediate mode rendering in Minecraft</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by RaphiMC</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/1eAoo2KR/08c0cd32515e260f4bb20bbc0696510041523f9a_96.webp" alt="YetAnotherConfigLib (YACL)" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">YetAnotherConfigLib (YACL)</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 120.9M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A builder-based configuration library for Minecraft!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by isxander</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/Ha28R6CL/72c3d74aeb665e45aea93a945a01474cbce3b7da_96.webp" alt="Fabric Language Kotlin" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Fabric Language Kotlin</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 116.7M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">This is a mod that enables usage of the Kotlin programming language for Fabric mods.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Library</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by modmuss50</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/1bokaNcj/354080f65407e49f486fcf9c4580e82c45ae63b8_96.webp" alt="Xaero's Minimap" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Xaero's Minimap</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 108.8M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Displays a map of the nearby world terrain, players, mobs, entities in the corner of your screen. Lets you create waypoints which help you find the locations you've marked.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by thexaero</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/BVzZfTc1/af683d206d50b05258d865b0d6e4aa2f2cee12f2_96.webp" alt="[ETF] Entity Texture Features" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">[ETF] Entity Texture Features</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 99.6M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Emissive, Random & Custom texture support for entities in resourcepacks just like Optifine but for Fabric</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Traben</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/lhGA9TYQ/05fe3a61c28faaccaec3533b92e1b321edde7bf6_96.webp" alt="Architectury API" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Architectury API</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 98.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">An intermediary api aimed to ease developing multiplatform mods.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by shedaniel</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/NcUtCpym/354080f65407e49f486fcf9c4580e82c45ae63b8_96.webp" alt="Xaero's World Map" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Xaero's World Map</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 95.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Adds a full screen world map which shows you what you have explored in the world. Works great together with Xaero's Minimap.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by thexaero</span>
								</div>
							</div>
						</div>
				</div>
			</div>

			<!-- Row 2: Right scroll (reverse, 95s) -->
			<div class="marquee-row">
				<div class="marquee-content row-2 reverse">
					
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/PtjYWJkn/0df4fb22a11e1dcb5e83cb0aadd275b571aca7a9_96.webp" alt="Sodium Extra" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Sodium Extra</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 95.0M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A Sodium addon that adds features that shouldn't be in Sodium.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Cursed</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by FlashyReese</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/4I1XuqiY/6e5bbd0d06b1741bfdab6c0cfab6de8fdaf0064c_96.webp" alt="[EMF] Entity Model Features" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">[EMF] Entity Model Features</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 94.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">EMF is an, OptiFine format, Custom Entity Model replacement mod available for Fabric and Forge.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Traben</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/EsAfCjCV/icon.png" alt="AppleSkin" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">AppleSkin</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 88.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Food/hunger-related HUD improvements</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Food</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by squeek502</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/MPCX6s5C/b97fd5f7a893165052408b747286d6eb38d57abb_96.webp" alt="Not Enough Animations" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Not Enough Animations</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 85.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Bringing first-person animations to the third-person</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by tr7zw</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/OhduvhIc/5ea1f538e66ee4d4e5e571ad952cba0e06e0bd5c.png" alt="VeinMiner" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">VeinMiner</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 81.7M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Mine the whole vein on mining a single ore/block. Make the tedious mining experience to something satisfying and fun!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Bukkit</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Cursed</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Miraculixx</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/Bh37bMuy/icon.png" alt="Reese's Sodium Options" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Reese's Sodium Options</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 79.6M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Alternative Options Menu for Sodium</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Neoforge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by FlashyReese</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/nmDcB62a/2af94de5e08ae54567ee86b968fc7ce076d9fee5_96.webp" alt="ModernFix" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">ModernFix</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 76.8M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">All-in-one mod that improves performance, reduces memory usage, and fixes many bugs. Compatible with all your favorite performance mods!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by embeddedt</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/u6dRKJwZ/4a3f18ac0d096c9f8e9176984c44be4e58f94c89_96.webp" alt="Just Enough Items (JEI)" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Just Enough Items (JEI)</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 75.8M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">View Items and Recipes</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by mezz</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/zV5r3pPn/ff7010d4ec0275609866c8b0f603b25e25949c08_96.webp" alt="3D Skin Layers" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">3D Skin Layers</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 75.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Render the player skin layer in 3d!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by tr7zw</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/1IjD5062/icon.png" alt="Continuity" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Continuity</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 72.1M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A Minecraft mod that allows for efficient connected textures</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Pepper_Bell</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/8BmcQJ2H/012d1aadbc754995de66e8c149a56aa10b63fe05_96.webp" alt="Geckolib" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Geckolib</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 68.6M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A 3D animation library for entities, blocks, items, armor, and more!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Gecko</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/9eGKb6K1/icon.png" alt="Simple Voice Chat" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Simple Voice Chat</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 67.9M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A working voice chat in Minecraft!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Bukkit</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by henkelmax</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/nvQzSEkH/b04217bc2b7dc524c4d12f81ff42cc1cefb9b0fc_96.webp" alt="Jade 🔍" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Jade 🔍</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 66.9M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Shows information about what you are looking at. (Hwyla/Waila fork for Minecraft 1.16+)</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Snownee</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/w7ThoJFB/e2de67a0bfb9e8aa2347982ab3ec5463f26cca31_96.webp" alt="Zoomify (Zoom)" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Zoomify (Zoom)</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 65.1M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A zoom mod with infinite customizability.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Quilt</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by isxander</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/51shyZVL/c51b07193b56e952269ef50101d12aecba2b4747_96.webp" alt="More Culling" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">More Culling</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 64.7M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A mod that changes how multiple types of culling are handled in order to improve performance</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Library</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by FX</span>
								</div>
							</div>
						</div>
				</div>
				<div class="marquee-content row-2 reverse" aria-hidden="true">
					
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/PtjYWJkn/0df4fb22a11e1dcb5e83cb0aadd275b571aca7a9_96.webp" alt="Sodium Extra" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Sodium Extra</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 95.0M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A Sodium addon that adds features that shouldn't be in Sodium.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Cursed</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by FlashyReese</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/4I1XuqiY/6e5bbd0d06b1741bfdab6c0cfab6de8fdaf0064c_96.webp" alt="[EMF] Entity Model Features" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">[EMF] Entity Model Features</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 94.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">EMF is an, OptiFine format, Custom Entity Model replacement mod available for Fabric and Forge.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Traben</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/EsAfCjCV/icon.png" alt="AppleSkin" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">AppleSkin</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 88.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Food/hunger-related HUD improvements</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Food</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by squeek502</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/MPCX6s5C/b97fd5f7a893165052408b747286d6eb38d57abb_96.webp" alt="Not Enough Animations" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Not Enough Animations</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 85.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Bringing first-person animations to the third-person</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by tr7zw</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/OhduvhIc/5ea1f538e66ee4d4e5e571ad952cba0e06e0bd5c.png" alt="VeinMiner" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">VeinMiner</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 81.7M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Mine the whole vein on mining a single ore/block. Make the tedious mining experience to something satisfying and fun!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Bukkit</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Cursed</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Miraculixx</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/Bh37bMuy/icon.png" alt="Reese's Sodium Options" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Reese's Sodium Options</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 79.6M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Alternative Options Menu for Sodium</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Neoforge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by FlashyReese</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/nmDcB62a/2af94de5e08ae54567ee86b968fc7ce076d9fee5_96.webp" alt="ModernFix" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">ModernFix</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 76.8M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">All-in-one mod that improves performance, reduces memory usage, and fixes many bugs. Compatible with all your favorite performance mods!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by embeddedt</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/u6dRKJwZ/4a3f18ac0d096c9f8e9176984c44be4e58f94c89_96.webp" alt="Just Enough Items (JEI)" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Just Enough Items (JEI)</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 75.8M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">View Items and Recipes</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by mezz</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/zV5r3pPn/ff7010d4ec0275609866c8b0f603b25e25949c08_96.webp" alt="3D Skin Layers" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">3D Skin Layers</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 75.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Render the player skin layer in 3d!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by tr7zw</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/1IjD5062/icon.png" alt="Continuity" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Continuity</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 72.1M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A Minecraft mod that allows for efficient connected textures</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Pepper_Bell</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/8BmcQJ2H/012d1aadbc754995de66e8c149a56aa10b63fe05_96.webp" alt="Geckolib" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Geckolib</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 68.6M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A 3D animation library for entities, blocks, items, armor, and more!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Gecko</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/9eGKb6K1/icon.png" alt="Simple Voice Chat" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Simple Voice Chat</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 67.9M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A working voice chat in Minecraft!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Bukkit</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by henkelmax</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/nvQzSEkH/b04217bc2b7dc524c4d12f81ff42cc1cefb9b0fc_96.webp" alt="Jade 🔍" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Jade 🔍</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 66.9M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Shows information about what you are looking at. (Hwyla/Waila fork for Minecraft 1.16+)</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Snownee</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/w7ThoJFB/e2de67a0bfb9e8aa2347982ab3ec5463f26cca31_96.webp" alt="Zoomify (Zoom)" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Zoomify (Zoom)</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 65.1M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A zoom mod with infinite customizability.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Quilt</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by isxander</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/51shyZVL/c51b07193b56e952269ef50101d12aecba2b4747_96.webp" alt="More Culling" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">More Culling</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 64.7M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A mod that changes how multiple types of culling are handled in order to improve performance</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Library</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by FX</span>
								</div>
							</div>
						</div>
				</div>
			</div>

			<!-- Row 3: Left scroll (90s) -->
			<div class="marquee-row">
				<div class="marquee-content row-3">
					
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/LQ3K71Q1/5056368d0d87c1a9f3efead0cb48ab39a4ea87bf_96.webp" alt="Dynamic FPS" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Dynamic FPS</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 64.7M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Reduce resource usage while Minecraft is in the background, idle, or on battery.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by juliand665</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/Wq5SjeWM/e4e82d028244a1326e6d346bf5b5336140576bb9_96.webp" alt="FancyMenu" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">FancyMenu</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 64.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Customize Minecraft's menus with ease!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Keksuccino</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/ohNO6lps/cb3b942cc18a66a0f35f802e004713f134e46cc2_96.webp" alt="Forge Config API Port" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Forge Config API Port</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 64.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">NeoForge's & Forge's config systems provided to other modding ecosystems. Designed for a multiloader architecture.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Fuzs</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/e0M1UDsY/f5e4fe9ac298e2c14591920d6bda937c566accd0_96.webp" alt="Collective" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Collective</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 63.8M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">🎓 Collective is a shared library with common code for all of Serilum's mods.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Serilum</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/eXts2L7r/e9c9990896e6422bffc5f73d2c41b8f077348f83.png" alt="Text Placeholder API" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Text Placeholder API</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 63.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Placeholder and Text manipulation library for your Minecraft mods.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Library</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Patbox</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/QAGBst4M/c78216c61f65b6ce82593e4e92e9c358402bb524_96.webp" alt="Puzzles Lib" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Puzzles Lib</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 60.6M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Why is it called Puzzles? That's the puzzle.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Fuzs</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/J81TRJWm/f27c753fd9ec7944b49f4fe2d7cfd32527340183_96.webp" alt="Konkrete" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Konkrete</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 60.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Just another boring library mod.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Keksuccino</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/MBAkmtvl/285b7bcfd6e525c043e640b08f3efc0cde90f7dd_96.webp" alt="Balm" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Balm</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 58.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Abstraction Layer for Multi-Loader Mods</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by BlayTheNinth</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/aC3cM3Vq/6c0eaa4e60a9c87f4766f222ff63286f09da32c0_96.webp" alt="Mouse Tweaks" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Mouse Tweaks</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 57.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Enhances inventory management by adding various functions to the mouse buttons. </p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by YaLTeR</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/qQyHxfxd/icon.png" alt="No Chat Reports" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">No Chat Reports</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 56.8M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Makes chat unreportable (where possible)</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Aizistral</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/yBW8D80W/d4f5c3ff8df7caf024178b04eca6d69f95979cfe_96.webp" alt="LambDynamicLights - Dynamic Lights" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">LambDynamicLights - Dynamic Lights</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 56.6M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Adds dynamic lights to Minecraft as the most feature-complete and optimized dynamic lighting mod.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by LambdAurora</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/dxa0Bm8m/3cfaaf9dcd74090bf78a03650ee43bf864d21ea5_96.webp" alt="VeinMiner Hotkey" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">VeinMiner Hotkey</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 56.3M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Veinminer Addon - Use a hotkey to veinmine with a dynamic crosshair & block highlighting</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Equipment</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Miraculixx</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/qyVF9oeo/798fbfae58ec95ad51f3e1d522b43227306c326c.png" alt="Sound Physics Remastered" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Sound Physics Remastered</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 52.0M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A Minecraft mod that provides realistic sound attenuation, reverberation, and absorption through blocks.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by henkelmax</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/OsZiaDHq/4953ecd3c0c8b185b2a56d64cdb104b03f3e5038_96.webp" alt="CreativeCore" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">CreativeCore</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 50.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A core mod</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by creativemd</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/ordsPcFz/064b8f129b776eb303f7f8b1a610e21d153c74b9_96.webp" alt="Kotlin for Forge" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Kotlin for Forge</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 49.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Adds a Kotlin language loader and provides some optional utilities.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Library</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by thedarkcolour</span>
								</div>
							</div>
						</div>
				</div>
				<div class="marquee-content row-3" aria-hidden="true">
					
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/LQ3K71Q1/5056368d0d87c1a9f3efead0cb48ab39a4ea87bf_96.webp" alt="Dynamic FPS" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Dynamic FPS</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 64.7M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Reduce resource usage while Minecraft is in the background, idle, or on battery.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by juliand665</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/Wq5SjeWM/e4e82d028244a1326e6d346bf5b5336140576bb9_96.webp" alt="FancyMenu" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">FancyMenu</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 64.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Customize Minecraft's menus with ease!</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Keksuccino</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/ohNO6lps/cb3b942cc18a66a0f35f802e004713f134e46cc2_96.webp" alt="Forge Config API Port" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Forge Config API Port</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 64.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">NeoForge's & Forge's config systems provided to other modding ecosystems. Designed for a multiloader architecture.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Fuzs</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/e0M1UDsY/f5e4fe9ac298e2c14591920d6bda937c566accd0_96.webp" alt="Collective" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Collective</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 63.8M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">🎓 Collective is a shared library with common code for all of Serilum's mods.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Serilum</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/eXts2L7r/e9c9990896e6422bffc5f73d2c41b8f077348f83.png" alt="Text Placeholder API" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Text Placeholder API</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 63.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Placeholder and Text manipulation library for your Minecraft mods.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Library</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Patbox</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/QAGBst4M/c78216c61f65b6ce82593e4e92e9c358402bb524_96.webp" alt="Puzzles Lib" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Puzzles Lib</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 60.6M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Why is it called Puzzles? That's the puzzle.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Fuzs</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/J81TRJWm/f27c753fd9ec7944b49f4fe2d7cfd32527340183_96.webp" alt="Konkrete" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Konkrete</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 60.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Just another boring library mod.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Keksuccino</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/MBAkmtvl/285b7bcfd6e525c043e640b08f3efc0cde90f7dd_96.webp" alt="Balm" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Balm</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 58.2M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Abstraction Layer for Multi-Loader Mods</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by BlayTheNinth</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/aC3cM3Vq/6c0eaa4e60a9c87f4766f222ff63286f09da32c0_96.webp" alt="Mouse Tweaks" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Mouse Tweaks</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 57.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Enhances inventory management by adding various functions to the mouse buttons. </p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by YaLTeR</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/qQyHxfxd/icon.png" alt="No Chat Reports" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">No Chat Reports</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 56.8M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Makes chat unreportable (where possible)</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Aizistral</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/yBW8D80W/d4f5c3ff8df7caf024178b04eca6d69f95979cfe_96.webp" alt="LambDynamicLights - Dynamic Lights" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">LambDynamicLights - Dynamic Lights</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 56.6M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Adds dynamic lights to Minecraft as the most feature-complete and optimized dynamic lighting mod.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Decoration</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by LambdAurora</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/dxa0Bm8m/3cfaaf9dcd74090bf78a03650ee43bf864d21ea5_96.webp" alt="VeinMiner Hotkey" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">VeinMiner Hotkey</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 56.3M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Veinminer Addon - Use a hotkey to veinmine with a dynamic crosshair & block highlighting</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Equipment</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by Miraculixx</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/qyVF9oeo/798fbfae58ec95ad51f3e1d522b43227306c326c.png" alt="Sound Physics Remastered" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Sound Physics Remastered</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 52.0M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A Minecraft mod that provides realistic sound attenuation, reverberation, and absorption through blocks.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Adventure</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by henkelmax</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/OsZiaDHq/4953ecd3c0c8b185b2a56d64cdb104b03f3e5038_96.webp" alt="CreativeCore" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">CreativeCore</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 50.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">A core mod</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Fabric</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by creativemd</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 hover:bg-[#141417] transition cursor-pointer w-[340px] shrink-0 text-left">
							<img src="https://cdn.modrinth.com/data/ordsPcFz/064b8f129b776eb303f7f8b1a610e21d153c74b9_96.webp" alt="Kotlin for Forge" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0" loading="lazy">
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-1">
									<span class="text-xs font-bold text-white truncate">Kotlin for Forge</span>
									<span class="text-[10px] text-zinc-500 font-mono shrink-0">⬇ 49.4M</span>
								</div>
								<p class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">Adds a Kotlin language loader and provides some optional utilities.</p>
								<div class="flex items-center gap-1.5 mt-2">
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Forge</span>
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">Library</span>
									<span class="text-[10px] text-zinc-500 ml-auto truncate">by thedarkcolour</span>
								</div>
							</div>
						</div>
				</div>
			</div>
		</div>

		<!-- Modrinth Style Feature Section (Discover 100,000 creations) -->
		<div id="showcase" class="mt-28 w-full max-w-6xl mx-auto px-6 scroll-mt-24">
			<div class="text-center max-w-2xl mx-auto mb-16">
				<span data-i18n="showcase.badge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
					For Players
				</span>
				<h2 data-i18n="showcase.title" class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
					Discover over 100,000 creations
				</h2>
				<p data-i18n="showcase.subtitle" class="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
					From magical biomes to cursed dungeons, you can be sure to find content to bring your gameplay to the next level.
				</p>
			</div>

			<!-- Interactive Search Feature Grid -->
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
				<!-- Left text & feature list -->
				<div class="lg:col-span-5 text-left flex flex-col justify-center">
					<h3 data-i18n="search.heading" class="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
						Find what you want,<br>
						<span class="text-emerald-400">quickly and easily</span>
					</h3>
					<p data-i18n="search.description" class="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed">
						Instant search and smart filters let you discover the right mods, modpacks, and shaders as you type.
					</p>

					<div class="mt-8 flex flex-col gap-4">
						<!-- Clean modern SVG Bullet 1 -->
						<div class="flex items-start gap-3.5 p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-emerald-500/30 transition">
							<div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
							</div>
							<div>
								<h4 data-i18n="search.bullet1.title" class="text-xs font-bold text-white">Automatic dependency resolution</h4>
								<p data-i18n="search.bullet1.desc" class="text-[11px] text-zinc-400 mt-0.5">Required libraries and mod APIs are resolved and installed automatically without conflicts.</p>
							</div>
						</div>

						<!-- Clean modern SVG Bullet 2 -->
						<div class="flex items-start gap-3.5 p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-emerald-500/30 transition">
							<div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
							</div>
							<div>
								<h4 data-i18n="search.bullet2.title" class="text-xs font-bold text-white">Version compatibility check</h4>
								<p data-i18n="search.bullet2.desc" class="text-[11px] text-zinc-400 mt-0.5">Protection against crashes and strict version filtering for Fabric, Forge, and NeoForge loaders.</p>
							</div>
						</div>

						<!-- Clean modern SVG Bullet 3 -->
						<div class="flex items-start gap-3.5 p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-emerald-500/30 transition">
							<div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
							</div>
							<div>
								<h4 data-i18n="search.bullet3.title" class="text-xs font-bold text-white">Direct CDN downloads</h4>
								<p data-i18n="search.bullet3.desc" class="text-[11px] text-zinc-400 mt-0.5">Maximum download speeds with zero queues, throttling, or waiting.</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Right: Real Modrinth Search Demonstration (Live & Interactive) -->
				<div class="lg:col-span-7">
					<div class="oled-card rounded-2xl p-5 border border-white/10 bg-[#09090b] shadow-2xl">
						<!-- Search bar inside mockup -->
						<div class="flex items-center gap-3 mb-4">
							<div class="relative flex-1">
								<svg class="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
								<input id="demoSearchInput" type="text" value="sodium" data-i18n-placeholder="demo.search.placeholder" placeholder="Search mods, resource packs, shaders..." class="w-full pl-10 pr-4 py-2 rounded-xl bg-[#050507] border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition">
							</div>
							<!-- Custom Styled Dropdown for Sorting -->
							<div class="relative shrink-0" id="customSortContainer">
								<button type="button" id="customSortBtn" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#050507] border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-400 hover:text-zinc-200 transition focus:outline-none select-none">
									<span id="sortPrefixText">Сортировка:</span>
									<strong id="sortCurrentLabel" class="text-zinc-200 font-medium">По релевантности</strong>
									<svg id="sortChevron" class="w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
								</button>

								<!-- Dropdown Menu -->
								<div id="customSortMenu" class="hidden absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#0c0c0e] border border-white/10 shadow-2xl p-1.5 z-40 flex flex-col gap-1 backdrop-blur-md">
									<button type="button" data-value="relevance" class="custom-sort-item w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 flex items-center justify-between hover:bg-zinc-800/80 transition">
										<span class="sort-label">По релевантности</span>
										<svg class="check-icon w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
									</button>
									<button type="button" data-value="downloads" class="custom-sort-item w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 flex items-center justify-between hover:bg-zinc-800/80 hover:text-white transition">
										<span class="sort-label">По скачиваниям</span>
										<svg class="check-icon w-3.5 h-3.5 text-emerald-400 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
									</button>
									<button type="button" data-value="follows" class="custom-sort-item w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 flex items-center justify-between hover:bg-zinc-800/80 hover:text-white transition">
										<span class="sort-label">По популярности</span>
										<svg class="check-icon w-3.5 h-3.5 text-emerald-400 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
									</button>
									<button type="button" data-value="updated" class="custom-sort-item w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 flex items-center justify-between hover:bg-zinc-800/80 hover:text-white transition">
										<span class="sort-label">По обновлениям</span>
										<svg class="check-icon w-3.5 h-3.5 text-emerald-400 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
									</button>
									<button type="button" data-value="newest" class="custom-sort-item w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 flex items-center justify-between hover:bg-zinc-800/80 hover:text-white transition">
										<span class="sort-label">Новые</span>
										<svg class="check-icon w-3.5 h-3.5 text-emerald-400 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
									</button>
								</div>
							</div>
						</div>

						<!-- Live mod search results — populated by JS on page load -->
				<div id="demoSearchResults" class="flex flex-col gap-2.5 text-left">
					<!-- Skeleton loader shown before API results arrive -->
					<div class="skeleton-card p-3.5 rounded-xl bg-[#0c0c0e] border border-white/5">
						<div class="flex items-start gap-3">
							<div class="w-11 h-11 rounded-xl bg-zinc-800 animate-pulse shrink-0"></div>
							<div class="flex-1 min-w-0 flex flex-col gap-2">
								<div class="h-3 w-32 rounded bg-zinc-800 animate-pulse"></div>
								<div class="h-2.5 w-full rounded bg-zinc-800/70 animate-pulse"></div>
								<div class="flex gap-2"><div class="h-2 w-12 rounded bg-zinc-800/50 animate-pulse"></div><div class="h-2 w-16 rounded bg-zinc-800/50 animate-pulse"></div></div>
							</div>
						</div>
					</div>
					<div class="skeleton-card p-3.5 rounded-xl bg-[#0c0c0e] border border-white/5">
						<div class="flex items-start gap-3">
							<div class="w-11 h-11 rounded-xl bg-zinc-800 animate-pulse shrink-0"></div>
							<div class="flex-1 min-w-0 flex flex-col gap-2">
								<div class="h-3 w-44 rounded bg-zinc-800 animate-pulse"></div>
								<div class="h-2.5 w-4/5 rounded bg-zinc-800/70 animate-pulse"></div>
								<div class="flex gap-2"><div class="h-2 w-20 rounded bg-zinc-800/50 animate-pulse"></div><div class="h-2 w-10 rounded bg-zinc-800/50 animate-pulse"></div></div>
							</div>
						</div>
					</div>
					<div class="skeleton-card p-3.5 rounded-xl bg-[#0c0c0e] border border-white/5">
						<div class="flex items-start gap-3">
							<div class="w-11 h-11 rounded-xl bg-zinc-800 animate-pulse shrink-0"></div>
							<div class="flex-1 min-w-0 flex flex-col gap-2">
								<div class="h-3 w-28 rounded bg-zinc-800 animate-pulse"></div>
								<div class="h-2.5 w-3/4 rounded bg-zinc-800/70 animate-pulse"></div>
								<div class="flex gap-2"><div class="h-2 w-14 rounded bg-zinc-800/50 animate-pulse"></div><div class="h-2 w-14 rounded bg-zinc-800/50 animate-pulse"></div></div>
							</div>
						</div>
					</div>
				</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Follow Projects / Notifications Showcase (Modrinth-style) -->
		<div class="mt-28 w-full max-w-6xl mx-auto px-6">
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
				<!-- Left demo notifications -->
				<div class="lg:col-span-7 order-2 lg:order-1">
					<div class="oled-card rounded-2xl p-5 border border-white/10 bg-[#09090b] shadow-2xl text-left">
						<div class="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
							<div class="flex items-center gap-2">
								<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
								<span data-i18n="notif.feed.title" class="text-xs font-bold text-white uppercase tracking-wider">Update Feed</span>
							</div>
							<span data-i18n="notif.feed.count" class="text-[11px] text-zinc-500 font-mono">3 new</span>
						</div>

						<div class="flex flex-col gap-2.5">
							<!-- Notif 1 -->
							<div class="flex items-center gap-3.5 p-3 rounded-xl bg-[#0c0c0e] border border-white/5">
								<img src="https://cdn.modrinth.com/data/AANobbMI/295862f4724dc3f78df3447ad6072b2dcd3ef0c9_96.webp" alt="Sodium" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-10 h-10 rounded-xl object-contain bg-zinc-900 shrink-0">
								<div class="min-w-0 flex-1">
									<div data-i18n="notif.item1.title" class="text-xs font-bold text-white truncate">Sodium updated!</div>
									<div data-i18n="notif.item1.desc" class="text-[11px] text-zinc-400 mt-0.5 truncate">Version 0.6.0 released for Minecraft 1.21.1</div>
								</div>
								<span data-i18n="notif.item1.time" class="text-[10px] text-zinc-500 shrink-0 font-mono">2h ago</span>
							</div>

							<!-- Notif 2 -->
							<div class="flex items-center gap-3.5 p-3 rounded-xl bg-[#0c0c0e] border border-white/5">
								<img src="https://cdn.modrinth.com/data/YL57xq9U/18d0e7f076d3d6ed5bedd472b853909aac5da202_96.webp" alt="Iris Shaders" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-10 h-10 rounded-xl object-contain bg-zinc-900 shrink-0">
								<div class="min-w-0 flex-1">
									<div data-i18n="notif.item2.title" class="text-xs font-bold text-white truncate">Iris Shaders updated!</div>
									<div data-i18n="notif.item2.desc" class="text-[11px] text-zinc-400 mt-0.5 truncate">Version 1.8.0 released for Minecraft 1.21.1</div>
								</div>
								<span data-i18n="notif.item2.time" class="text-[10px] text-zinc-500 shrink-0 font-mono">5h ago</span>
							</div>

							<!-- Notif 3 -->
							<div class="flex items-center gap-3.5 p-3 rounded-xl bg-[#0c0c0e] border border-white/5">
								<img src="https://cdn.modrinth.com/data/mOgUt4GM/5a20ed1450a0e1e79a1fe04e61bb4e5878bf1d20.png" alt="Mod Menu" onerror="this.src=\'https://cdn.modrinth.com/data/P7dR8mSH/icon.png\'" class="w-10 h-10 rounded-xl object-contain bg-zinc-900 shrink-0">
								<div class="min-w-0 flex-1">
									<div data-i18n="notif.item3.title" class="text-xs font-bold text-white truncate">Mod Menu updated!</div>
									<div data-i18n="notif.item3.desc" class="text-[11px] text-zinc-400 mt-0.5 truncate">Version 11.0.1 released with new filter options</div>
								</div>
								<span data-i18n="notif.item3.time" class="text-[10px] text-zinc-500 shrink-0 font-mono">1d ago</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Right text description -->
				<div class="lg:col-span-5 text-left order-1 lg:order-2 flex flex-col justify-center">
					<span data-i18n="notif.badge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-3">
						Auto-Updates
					</span>
					<h3 data-i18n-html="notif.heading" class="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
						Follow your favorite<br>
						<span class="text-emerald-400">projects and authors</span>
					</h3>
					<p data-i18n="notif.desc" class="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed">
						Be the first to know when updates arrive for your Minecraft version. The launcher automatically keeps your mods up-to-date.
					</p>
				</div>
			</div>
		</div>

		<!-- Real Launcher Window Preview -->
		<div class="mt-28 w-full max-w-5xl mx-auto px-6">
			<div class="rounded-2xl oled-card overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.08)] bg-[#09090b]">
				<div class="flex items-center justify-between px-4 py-3 bg-[#0c0c0e] border-b border-[rgba(255,255,255,0.06)]">
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-[#ff5f56]/80"></div>
						<div class="w-3 h-3 rounded-full bg-[#ffbd2e]/80"></div>
						<div class="w-3 h-3 rounded-full bg-[#27c93f]/80"></div>
					</div>
					<span data-i18n="preview.title" class="text-xs font-medium text-zinc-400">MacrosApp Launcher — v1.0.0</span>
					<div class="w-12"></div>
				</div>

				<!-- Real Launcher Screenshot -->
				<div class="relative bg-black w-full overflow-hidden">
					<img src="/assets/launcher-preview.png" alt="MacrosApp Launcher Interface" class="w-full h-auto block select-none">
				</div>
			</div>
		</div>

		<!-- Features Grid Section -->
		<div id="features" class="mt-28 w-full max-w-6xl mx-auto px-6 text-left scroll-mt-24">
			<div class="text-center max-w-2xl mx-auto mb-16">
				<span data-i18n="features.badge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
					Platform Performance
				</span>
				<h2 data-i18n="features.heading" class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
					Engineered for speed, privacy, and control
				</h2>
				<p data-i18n="features.subtitle" class="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
					Built with Rust and Tauri for near-zero idle memory usage, instantaneous startup, and total independence.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<!-- Card 1 -->
				<div class="oled-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
					<div>
						<div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
						</div>
						<h3 data-i18n="feat1.title" class="text-base font-bold text-white">Blazing fast startup</h3>
						<p data-i18n="feat1.desc" class="text-xs text-zinc-400 mt-2 leading-relaxed">
							Starts in milliseconds with zero bloated background processes or memory leaks.
						</p>
					</div>
				</div>

				<!-- Card 2 -->
				<div class="oled-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
					<div>
						<div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
						</div>
						<h3 data-i18n="feat2.title" class="text-base font-bold text-white">Ely.by & Microsoft accounts</h3>
						<p data-i18n="feat2.desc" class="text-xs text-zinc-400 mt-2 leading-relaxed">
							Full support for Ely.by skins and auth, official Microsoft accounts, and offline play.
						</p>
					</div>
				</div>

				<!-- Card 3 -->
				<div class="oled-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
					<div>
						<div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
						</div>
						<h3 data-i18n="feat3.title" class="text-base font-bold text-white">Friend instances & sharing</h3>
						<p data-i18n="feat3.desc" class="text-xs text-zinc-400 mt-2 leading-relaxed">
							Share your modpacks and instance configurations with friends with zero hassle.
						</p>
					</div>
				</div>

				<!-- Card 4 -->
				<div class="oled-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
					<div>
						<div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
						</div>
						<h3 data-i18n="feat4.title" class="text-base font-bold text-white">Multi-loader support</h3>
						<p data-i18n="feat4.desc" class="text-xs text-zinc-400 mt-2 leading-relaxed">
							Seamless installation of Fabric, Forge, NeoForge, and Quilt with automated runtime setup.
						</p>
					</div>
				</div>

				<!-- Card 5 -->
				<div class="oled-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
					<div>
						<div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
						</div>
						<h3 data-i18n="feat5.title" class="text-base font-bold text-white">Isolated game profiles</h3>
						<p data-i18n="feat5.desc" class="text-xs text-zinc-400 mt-2 leading-relaxed">
							Every instance has its own separate mods, configs, saves, and Java runtimes.
						</p>
					</div>
				</div>

				<!-- Card 6 -->
				<div class="oled-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
					<div>
						<div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
						</div>
						<h3 data-i18n="feat6.title" class="text-base font-bold text-white">100% open-source & transparent</h3>
						<p data-i18n="feat6.desc" class="text-xs text-zinc-400 mt-2 leading-relaxed">
							No telemetry, no hidden miners, no adware. Pure open-source code you can audit and trust.
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom CTA Banner -->
		<div class="mt-28 w-full max-w-5xl mx-auto px-6">
			<div class="rounded-3xl p-10 sm:p-14 bg-gradient-to-b from-zinc-900/90 to-black border border-white/10 text-center relative overflow-hidden shadow-2xl">
				<div class="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
				<div class="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

				<h2 data-i18n="cta.heading" class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
					Ready to enhance your Minecraft experience?
				</h2>
				<p data-i18n="cta.subtitle" class="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
					Download the MacrosApp launcher today or explore thousands of community mods.
				</p>
				<div class="mt-8 flex flex-wrap items-center justify-center gap-4">
					<a href="/download" class="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition active:scale-95 shadow-xl shadow-emerald-500/20">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
						<span data-i18n="cta.btn.download">Download for Windows (.exe)</span>
					</a>
					<a href="#showcase" class="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-sm font-semibold transition">
						<span data-i18n="cta.btn.catalog">Explore Catalog</span>
					</a>
				</div>
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-[rgba(255,255,255,0.08)] bg-[#050507] text-zinc-400 text-xs py-12">
		<div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
			<div class="flex items-center gap-3">
				<img src="/assets/logo.png" alt="MacrosApp" class="w-6 h-6 rounded-lg object-contain">
				<span class="font-bold text-white tracking-tight">MacrosApp</span>
				<span class="text-zinc-600">|</span>
				<span data-i18n="footer.desc" class="text-zinc-500">Next-generation Minecraft launcher & mod platform built for speed and freedom.</span>
			</div>
			<div class="flex items-center gap-6 text-zinc-400">
				<a href="#showcase" data-i18n="footer.links.catalog" class="hover:text-white transition">Discover</a>
				<a href="#features" data-i18n="footer.links.features" class="hover:text-white transition">Features</a>
				<a href="/download" data-i18n="footer.links.download" class="hover:text-white transition">Download</a>
				<a href="https://github.com/nnnegrvpeni-lang/MacrosApp" target="_blank" data-i18n="footer.links.github" class="hover:text-white transition">GitHub</a>
			</div>
		</div>
		<div class="max-w-6xl mx-auto px-6 mt-6 pt-6 border-t border-white/5 text-[11px] text-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-3">
			<span data-i18n="footer.disclaimer">MacrosApp is an open-source Minecraft launcher based on the Modrinth App fork, enhanced with Ely.by accounts and community sharing. Not affiliated with Mojang Studios or Microsoft.</span>
			<span>&copy; ${new Date().getFullYear()} MacrosApp. Open Source under MIT.</span>
		</div>
	</footer>

	${renderNavbarUserScript()}

		<!-- Live Mod Search & Smooth Scroll Scripts -->
	<script>
		// Smooth Scroll for header and anchor links
		document.querySelectorAll('a[href^="#"]').forEach(a => {
			a.addEventListener('click', e => {
				const id = a.getAttribute('href');
				if (id === '#') return;
				const target = document.querySelector(id);
				if (target) {
					e.preventDefault();
					target.scrollIntoView({ behavior: 'smooth' });
					history.pushState(null, null, id);
				}
			});
		});

		// Live Interactive Mod Search for Landing Page Demo
		const searchInput = document.getElementById('demoSearchInput');
		const searchResults = document.getElementById('demoSearchResults');
		let searchTimeout = null;

		function formatCount(n) {
			if (!n) return '0';
			if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
			if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
			return String(n);
		}

		let currentSortValue = 'relevance';
		const sortBtn = document.getElementById('customSortBtn');
		const sortMenu = document.getElementById('customSortMenu');
		const sortChevron = document.getElementById('sortChevron');
		const sortCurrentLabel = document.getElementById('sortCurrentLabel');
		const sortOptions = document.querySelectorAll('.custom-sort-item');

		if (sortBtn && sortMenu) {
			sortBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				const isOpen = !sortMenu.classList.contains('hidden');
				if (isOpen) {
					sortMenu.classList.add('hidden');
					if (sortChevron) sortChevron.classList.remove('rotate-180');
				} else {
					sortMenu.classList.remove('hidden');
					if (sortChevron) sortChevron.classList.add('rotate-180');
				}
			});

			document.addEventListener('click', (e) => {
				if (!sortMenu.contains(e.target) && !sortBtn.contains(e.target)) {
					sortMenu.classList.add('hidden');
					if (sortChevron) sortChevron.classList.remove('rotate-180');
				}
			});

			sortOptions.forEach(opt => {
				opt.addEventListener('click', () => {
					currentSortValue = opt.getAttribute('data-value') || 'relevance';
					const label = opt.querySelector('.sort-label');
					if (sortCurrentLabel && label) sortCurrentLabel.textContent = label.textContent;

					sortOptions.forEach(o => {
						const isSelected = o === opt;
						const check = o.querySelector('.check-icon');
						if (isSelected) {
							o.className = 'custom-sort-item w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 flex items-center justify-between hover:bg-zinc-800/80 transition';
							if (check) check.classList.remove('hidden');
						} else {
							o.className = 'custom-sort-item w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 flex items-center justify-between hover:bg-zinc-800/80 hover:text-white transition';
							if (check) check.classList.add('hidden');
						}
					});

					sortMenu.classList.add('hidden');
					if (sortChevron) sortChevron.classList.remove('rotate-180');

					performSearch(searchInput ? searchInput.value : 'sodium');
				});
			});
		}

		async function fetchSearchResults(query) {
			const facets = encodeURIComponent('[["project_type:mod"]]');
			const q = encodeURIComponent(query);
			const sort = currentSortValue || 'relevance';
			try {
				const res = await fetch('https://api.modrinth.com/v2/search?query=' + q + '&limit=3&index=' + sort + '&facets=' + facets);
				if (res.ok) return await res.json();
			} catch (e) {}
			try {
				const res = await fetch('/v2/search?query=' + q + '&limit=3&index=' + sort + '&facets=' + facets);
				if (res.ok) return await res.json();
			} catch (e) {}
			return null;
		}

		async function performSearch(q) {
			if (!searchResults) return;
			const query = (q || '').trim() || 'sodium';
			try {
				const data = await fetchSearchResults(query);
				if (!data || !data.hits || data.hits.length === 0) {
					searchResults.innerHTML = '<div class="p-6 text-center text-xs text-zinc-500">Ничего не найдено / No mods found</div>';
					return;
				}

				searchResults.innerHTML = '';
				data.hits.forEach(h => {
					const card = document.createElement('div');
					card.className = 'p-3.5 rounded-xl bg-[#0c0c0e] border border-white/5 hover:border-zinc-700 transition cursor-pointer';
					const targetUrl = 'https://modrinth.com/mod/' + encodeURIComponent(h.slug || h.project_id);
					card.addEventListener('click', () => window.open(targetUrl, '_blank'));

					const icon = h.icon_url || 'https://cdn.modrinth.com/data/P7dR8mSH/icon.png';
					const title = h.title || 'Mod';
					const author = h.author || 'Creator';
					const desc = h.description || '';
					const cat = (h.categories && h.categories[0]) ? h.categories[0] : 'mod';
					const downloads = formatCount(h.downloads);
					const follows = (h.follows || 0).toLocaleString();

					const row = document.createElement('div');
					row.className = 'flex items-start gap-3';

					const img = document.createElement('img');
					img.src = icon;
					img.alt = title;
					img.className = 'w-11 h-11 rounded-xl object-contain bg-zinc-900 border border-white/5 shrink-0';
					img.onerror = function() {
						this.src = 'https://cdn.modrinth.com/data/P7dR8mSH/icon.png';
					};
					row.appendChild(img);

					const info = document.createElement('div');
					info.className = 'flex-1 min-w-0';
					info.innerHTML = 
						'<div class="flex items-center gap-2">' +
							'<span class="text-xs font-bold text-white truncate">' + title + '</span>' +
							'<span class="text-[11px] text-zinc-500 truncate">by ' + author + '</span>' +
						'</div>' +
						'<p class="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">' + desc + '</p>' +
						'<div class="flex flex-wrap items-center gap-2 mt-2 text-[10px]">' +
							'<span class="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800 capitalize">' + cat + '</span>' +
							'<span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Minecraft</span>' +
							'<div class="ml-auto flex items-center gap-3 text-zinc-500 font-mono">' +
								'<span>⬇ ' + downloads + '</span>' +
								'<span>♡ ' + follows + '</span>' +
							'</div>' +
						'</div>';
					row.appendChild(info);
					card.appendChild(row);
					searchResults.appendChild(card);
				});
			} catch (err) {
				console.error('Search error:', err);
				searchResults.innerHTML = '<div class="p-6 text-center text-xs text-zinc-500">Ошибка загрузки / Failed to load</div>';
			}
		}

		if (searchInput && searchResults) {
			searchInput.addEventListener('input', (e) => {
				const q = e.target.value.trim();
				clearTimeout(searchTimeout);
				searchTimeout = setTimeout(() => performSearch(q || 'sodium'), 250);
			});
		}



		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				performSearch(searchInput ? searchInput.value : 'sodium');
			});
		} else {
			performSearch(searchInput ? searchInput.value : 'sodium');
		}</script>
	${renderNavbarUserScript()}
	${renderCreateProjectModalHtml()}
</body>
</html>`
}

export function renderAuthHtml(mode: 'sign-in' | 'sign-up', query: any): string {
	const isSignIn = mode === 'sign-in'
	const isLauncher = query.flow === 'launcher' || Boolean(query.port)
	return `<!DOCTYPE html>
<html lang="ru" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title id="authTitle">${isSignIn ? 'Sign in' : 'Sign up'} — MacrosApp</title>
	<link rel="icon" type="image/png" href="/assets/favicon.png">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
	<script src="https://cdn.tailwindcss.com"></script>
	<script>
		tailwind.config = {
			darkMode: 'class',
			theme: {
				extend: {
					fontFamily: {
						sans: ['Inter', 'system-ui', 'sans-serif'],
					}
				}
			}
		}
	</script>
	${THEME_HEAD_SCRIPT}
	<style>
		${OLED_SCROLLBAR_CSS}
		${THEME_CSS}
		
		body { background-color: var(--theme-bg-page, #000000); color: var(--theme-text-primary, #f4f4f5); font-family: 'Inter', sans-serif; }
		.oled-card {
			background: #09090b;
			border: 1px solid rgba(255, 255, 255, 0.08);
		}
	</style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-sm oled-card rounded-2xl p-7 shadow-2xl">
		<!-- Header -->
		<div class="flex items-center justify-between mb-5">
			<a href="/" class="flex items-center gap-2.5">
				<img src="/assets/logo.png" alt="MacrosApp" class="w-7 h-7 rounded-lg object-contain">
				<span class="text-sm font-bold tracking-tight text-white">MacrosApp</span>
			</a>
			<div class="flex items-center gap-2.5">
				<!-- Language toggle -->
				<div class="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[10px] font-bold">
					<button type="button" id="authLangEn" class="px-1.5 py-0.5 rounded transition text-zinc-400 hover:text-white">EN</button>
					<button type="button" id="authLangRu" class="px-1.5 py-0.5 rounded transition text-zinc-400 hover:text-white">RU</button>
				</div>
				${
					isLauncher
						? `<span data-i18n="auth.launcher_badge" class="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Launcher</span>`
						: `<a href="/" data-i18n="auth.close" class="text-xs text-zinc-500 hover:text-zinc-300 transition">&times; Close</a>`
				}
			</div>
		</div>

		${
			isLauncher
				? `
		<div class="mb-5 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-3">
			<div class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
			<div data-i18n="auth.launcher_hint" class="text-[11px] text-zinc-300">
				Sign in to link your account to the Macros launcher.
			</div>
		</div>`
				: ''
		}

		<div id="authContent">
			<!-- Tab Switcher -->
			<div class="flex p-1 rounded-xl bg-zinc-950 border border-zinc-800 mb-5 text-xs font-medium">
				<button id="tabSignIn" class="flex-1 py-1.5 rounded-lg transition ${isSignIn ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}">
					<span data-i18n="auth.tab.signin">Sign in</span>
				</button>
				<button id="tabSignUp" class="flex-1 py-1.5 rounded-lg transition ${!isSignIn ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}">
					<span data-i18n="auth.tab.signup">Sign up</span>
				</button>
			</div>

			<div id="errorBox" class="hidden mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 leading-relaxed"></div>

			<!-- Google Login Button -->
			<button type="button" id="googleBtn" class="w-full py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-medium transition flex items-center justify-center gap-2.5 mb-4 active:scale-[0.98]">
				<svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>
				<span data-i18n="auth.google_btn">Continue with Google</span>
			</button>

			<div class="relative flex py-1 items-center mb-4">
				<div class="flex-grow border-t border-zinc-900"></div>
				<span data-i18n="auth.divider" class="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-zinc-600">or with login</span>
				<div class="flex-grow border-t border-zinc-900"></div>
			</div>

			<!-- Auth Form -->
			<form id="authForm" class="flex flex-col gap-3.5">
				<div>
					<label data-i18n="auth.label.login" class="block text-xs font-medium text-zinc-400 mb-1.5">Username or Email</label>
					<input id="loginInput" type="text" required autocomplete="username" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition" data-i18n-placeholder="auth.placeholder.login" placeholder="Username">
				</div>

				<div id="emailGroup" class="${isSignIn ? 'hidden' : ''}">
					<label data-i18n="auth.label.email" class="block text-xs font-medium text-zinc-400 mb-1.5">Email (optional)</label>
					<input id="emailInput" type="email" autocomplete="email" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition" placeholder="name@example.com">
				</div>

				<div>
					<label data-i18n="auth.label.password" class="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
					<input id="passwordInput" type="password" required autocomplete="current-password" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition" placeholder="••••••••">
				</div>

				<button type="submit" id="submitBtn" class="mt-2 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition active:scale-[0.98] flex items-center justify-center gap-2">
					<span id="btnText" data-i18n="${isSignIn ? 'auth.btn.signin' : 'auth.btn.signup'}">${isSignIn ? 'Sign in to account' : 'Create account'}</span>
				</button>
			</form>
		</div>
	</div>

	<script>
		const TRANSLATIONS = {
			en: {
				'auth.title.signin': 'Sign in — MacrosApp',
				'auth.title.signup': 'Sign up — MacrosApp',
				'auth.tab.signin': 'Sign in',
				'auth.tab.signup': 'Sign up',
				'auth.close': '✕ Close',
				'auth.launcher_badge': 'Launcher',
				'auth.launcher_hint': 'Sign in to link your account to the Macros launcher.',
				'auth.google_btn': 'Continue with Google',
				'auth.divider': 'or with login',
				'auth.label.login': 'Username or Email',
				'auth.placeholder.login': 'Username',
				'auth.label.email': 'Email (optional)',
				'auth.label.password': 'Password',
				'auth.btn.signin': 'Sign in to account',
				'auth.btn.signup': 'Create account',
				'auth.btn.signing_in': 'Signing in...',
				'auth.btn.signing_up': 'Creating account...',
				'toast.username_taken': 'Username or email already in use',
				'toast.rate_limit': 'Too many attempts. Please wait a minute.',
				'toast.invalid_credentials': 'Invalid username/email or password',
				'toast.error_generic': 'Authentication failed'
			},
			ru: {
				'auth.title.signin': 'Вход — MacrosApp',
				'auth.title.signup': 'Регистрация — MacrosApp',
				'auth.tab.signin': 'Вход',
				'auth.tab.signup': 'Регистрация',
				'auth.close': '✕ Закрыть',
				'auth.launcher_badge': 'Лаунчер',
				'auth.launcher_hint': 'Вход для подключения вашего аккаунта к лаунчеру Macros.',
				'auth.google_btn': 'Продолжить через Google',
				'auth.divider': 'или логин',
				'auth.label.login': 'Логин или Email',
				'auth.placeholder.login': 'Никнейм',
				'auth.label.email': 'Email (опционально)',
				'auth.label.password': 'Пароль',
				'auth.btn.signin': 'Войти в аккаунт',
				'auth.btn.signup': 'Зарегистрироваться',
				'auth.btn.signing_in': 'Вход...',
				'auth.btn.signing_up': 'Регистрация...',
				'toast.username_taken': 'Имя пользователя или email уже заняты',
				'toast.rate_limit': 'Слишком много попыток. Подождите минуту.',
				'toast.invalid_credentials': 'Неверный логин или пароль',
				'toast.error_generic': 'Ошибка авторизации'
			}
		};

		let isLoginMode = ${isSignIn};

		function t(key, fallback) {
			const lang = localStorage.getItem('macros_lang') || 'en';
			const dict = TRANSLATIONS[lang] || TRANSLATIONS.en || {};
			return dict[key] || fallback || key;
		}

		function setAuthLanguage(lang) {
			localStorage.setItem('macros_lang', lang);
			const dict = TRANSLATIONS[lang] || TRANSLATIONS.en || {};

			document.querySelectorAll('[data-i18n]').forEach(el => {
				const k = el.getAttribute('data-i18n');
				if (dict[k]) el.textContent = dict[k];
			});

			document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
				const k = el.getAttribute('data-i18n-placeholder');
				if (dict[k]) el.setAttribute('placeholder', dict[k]);
			});

			const pageTitle = dict[isLoginMode ? 'auth.title.signin' : 'auth.title.signup'];
			if (pageTitle) document.title = pageTitle;

			const btnEn = document.getElementById('authLangEn');
			const btnRu = document.getElementById('authLangRu');
			if (btnEn && btnRu) {
				const active = 'bg-zinc-800 text-white shadow-sm';
				const inactive = 'text-zinc-400 hover:text-white';
				btnEn.className = 'px-1.5 py-0.5 rounded transition ' + (lang === 'en' ? active : inactive);
				btnRu.className = 'px-1.5 py-0.5 rounded transition ' + (lang === 'ru' ? active : inactive);
			}

			const btnText = document.getElementById('btnText');
			if (btnText) {
				btnText.textContent = isLoginMode ? dict['auth.btn.signin'] : dict['auth.btn.signup'];
			}
		}

		function setMode(login) {
			isLoginMode = login;
			document.getElementById('emailGroup').classList.toggle('hidden', login);
			const dict = TRANSLATIONS[localStorage.getItem('macros_lang') || 'en'] || TRANSLATIONS.en;
			document.getElementById('btnText').textContent = login ? dict['auth.btn.signin'] : dict['auth.btn.signup'];
			document.getElementById('tabSignIn').className = 'flex-1 py-1.5 rounded-lg transition ' + (login ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white');
			document.getElementById('tabSignUp').className = 'flex-1 py-1.5 rounded-lg transition ' + (!login ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white');
			document.getElementById('errorBox').classList.add('hidden');
			document.title = dict[login ? 'auth.title.signin' : 'auth.title.signup'] || document.title;
		}

		document.getElementById('tabSignIn').onclick = () => setMode(true);
		document.getElementById('tabSignUp').onclick = () => setMode(false);
		document.getElementById('authLangEn').onclick = () => setAuthLanguage('en');
		document.getElementById('authLangRu').onclick = () => setAuthLanguage('ru');

		function handleSuccess(data) {
			localStorage.setItem('macros_token', data.token);
			localStorage.setItem('macros_user', JSON.stringify(data.user));
			document.cookie = 'macros_session=' + data.token + '; Path=/; SameSite=Lax; Max-Age=2592000';

			const params = new URLSearchParams(window.location.search);
			const port = params.get('port');
			if (port) {
				window.location.href = 'http://127.0.0.1:' + port + '/?code=' + encodeURIComponent(data.token);
			} else {
				window.location.href = '/account';
			}
		}

		(function checkExistingAuth() {
			const params = new URLSearchParams(window.location.search);
			const port = params.get('port');
			if (!port) return;
			const token = localStorage.getItem('macros_token');
			if (token) {
				window.location.href = 'http://127.0.0.1:' + port + '/?code=' + encodeURIComponent(token);
			}
		})();

		function resolveAuthError(msg) {
			if (!msg) return t('toast.error_generic', 'Authentication failed');
			const lang = localStorage.getItem('macros_lang') || 'en';
			const dict = TRANSLATIONS[lang] || TRANSLATIONS.en || {};
			if (dict[msg]) return dict[msg];
			if (msg.includes('already taken') || msg.includes('already in use') || msg.includes('уже заняты')) return dict['toast.username_taken'] || msg;
			if (msg.includes('Too many') || msg.includes('Слишком много')) return dict['toast.rate_limit'] || msg;
			if (msg.includes('Invalid') || msg.includes('Неверный') || msg.includes('required')) return dict['toast.invalid_credentials'] || msg;
			return msg;
		}

		function showError(msg) {
			const box = document.getElementById('errorBox');
			box.textContent = resolveAuthError(msg);
			box.classList.remove('hidden');
		}

		document.getElementById('authForm').addEventListener('submit', async (e) => {
			e.preventDefault();
			const login = document.getElementById('loginInput').value.trim();
			const password = document.getElementById('passwordInput').value;
			const btn = document.getElementById('submitBtn');
			const btnText = document.getElementById('btnText');

			btn.disabled = true;
			btnText.textContent = isLoginMode ? t('auth.btn.signing_in', 'Signing in...') : t('auth.btn.signing_up', 'Creating account...');

			try {
				const url = isLoginMode ? '/api/v1/auth/login' : '/api/v1/auth/register';
				const body = isLoginMode ? { login, password } : {
					username: login,
					email: document.getElementById('emailInput')?.value.trim() || undefined,
					password
				};

				const res = await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Authentication error');
				handleSuccess(data);
			} catch (err) {
				showError(err.message);
				btn.disabled = false;
				btnText.textContent = isLoginMode ? t('auth.btn.signin', 'Sign in') : t('auth.btn.signup', 'Create account');
			}
		});

		document.getElementById('googleBtn').onclick = () => {
			const params = new URLSearchParams(window.location.search);
			const port = params.get('port') || '';
			const flow = port ? 'launcher' : (params.get('flow') || 'web');
			window.location.href = '/api/v1/auth/google/login?flow=' + encodeURIComponent(flow) + '&port=' + encodeURIComponent(port);
		};

		// Init language on load
		setAuthLanguage(localStorage.getItem('macros_lang') || 'en');
	</script>
</body>
</html>`
}

export function renderAccountHtml(user?: any): string {
	return `<!DOCTYPE html>
<html lang="ru" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Account | MacrosApp</title>
	<link rel="icon" type="image/png" href="/assets/favicon.png">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
	<script src="https://cdn.tailwindcss.com"></script>
	<script>
		tailwind.config = {
			darkMode: 'class',
			theme: {
				extend: {
					fontFamily: {
						sans: ['Inter', 'system-ui', 'sans-serif'],
					}
				}
			}
		}
	</script>
	${THEME_HEAD_SCRIPT}
	<style>
		${OLED_SCROLLBAR_CSS}
		${THEME_CSS}
		
		body { background-color: var(--theme-bg-page, #000000); color: var(--theme-text-primary, #f4f4f5); font-family: 'Inter', sans-serif; }
		.oled-card {
			background: #09090b;
			border: 1px solid rgba(255, 255, 255, 0.08);
			transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		}
		.oled-card:hover {
			border-color: rgba(255, 255, 255, 0.14);
		}
	</style>
</head>
<body class="min-h-screen flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
	<!-- Top Bar -->
	<header class="border-b border-zinc-900 sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-xl">
		<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
			<div class="flex items-center gap-8">
				<a href="/" class="flex items-center gap-2.5 group shrink-0">
					<img src="/assets/logo.png" alt="MacrosApp" class="w-8 h-8 rounded-lg object-contain group-hover:scale-105 transition-transform">
					<span class="text-base font-bold tracking-tight text-white">MacrosApp</span>
				</a>

				<nav class="hidden md:flex items-center gap-6 text-sm text-zinc-400">
					<a href="/catalog" data-i18n="nav.catalog" class="hover:text-white transition">Discover</a>
					<a href="/#features" data-i18n="nav.features" class="hover:text-white transition">Features</a>
					<a href="/download" data-i18n="nav.download" class="hover:text-white transition">Download</a>
					<a href="https://github.com/nnnegrvpeni-lang/MacrosApp" target="_blank" data-i18n="nav.github" class="hover:text-white transition flex items-center gap-1.5">GitHub</a>
				</nav>
			</div>

			<div id="navUserSlot" class="flex items-center gap-3 shrink-0">
				${renderNavbarUserHtml(user)}
			</div>
		</div>
	</header>

	<main class="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
		<div id="loading" class="${user ? 'hidden' : ''} text-center py-24 text-zinc-500 text-xs">Загрузка профиля...</div>

		<div id="profileContent" class="${user ? '' : 'hidden'} flex flex-col">
			<!-- Modrinth Authentic Profile Header -->
			<div class="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6">
				<div class="flex items-start gap-6">
					<!-- Circular Avatar (96x96) -->
					<div class="w-24 h-24 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-3xl overflow-hidden shrink-0 shadow-xl border border-white/10 select-none">
						<img id="userAvatar" class="w-full h-full object-cover hidden" src="${user?.avatar_url || ''}" alt="Avatar">
						<span id="userAvatarInitial" class="text-3xl font-bold">${escapeHtml(user?.username ? user.username.charAt(0).toUpperCase() : 'U')}</span>
					</div>

					<!-- Username, Bio, Stats -->
					<div>
						<div class="flex items-center gap-3">
							<h1 id="userName" class="text-2xl sm:text-3xl font-bold text-white tracking-tight">${escapeHtml(user?.username || '')}</h1>
							<span id="userBadge" data-i18n="account.badge.early" class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Early Adopter</span>
						</div>
						<p id="userBio" ${user?.bio ? '' : 'data-i18n="account.bio.default"'} class="text-sm text-zinc-400 mt-1">${escapeHtml(user?.bio || 'A Macros user.')}</p>

						<!-- Stats row: projects • downloads • joined -->
						<div class="flex flex-wrap items-center gap-2.5 text-xs text-zinc-400 mt-3.5 select-none font-medium">
							<div class="flex items-center gap-1.5">
								<svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
								<span id="statsProjects">0</span> <span data-i18n="account.stats.projects">projects</span>
							</div>
							<span class="text-zinc-600">•</span>
							<div class="flex items-center gap-1.5">
								<svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
								<span id="statsDownloads">0</span> <span data-i18n="account.stats.downloads">downloads</span>
							</div>
							<span class="text-zinc-600">•</span>
							<div class="flex items-center gap-1.5">
								<svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
								<span data-i18n="account.stats.joined">Joined</span> <span id="joinedDateText" data-i18n="account.stats.recently">recently</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Right Action Buttons: [Edit] and [...] -->
				<div class="flex items-center gap-2 shrink-0 self-start">
					<button id="openEditProfileBtn" type="button" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-zinc-200 text-xs font-semibold transition active:scale-95 shadow-sm">
						<svg class="w-3.5 h-3.5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
						<span data-i18n="account.edit.btn">Edit</span>
					</button>

					<!-- 3-dots Menu (media_1789235563116.png) -->
					<div class="relative inline-block text-left" id="profileActionsContainer">
						<button id="profileActionsTrigger" type="button" class="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-zinc-300 text-xs transition active:scale-95" title="More options">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.75"/><circle cx="12" cy="12" r="1.75"/><circle cx="12" cy="19" r="1.75"/></svg>
						</button>
						<div id="profileActionsDropdown" class="hidden absolute right-0 mt-2 w-52 rounded-2xl bg-[#09090b]/95 backdrop-blur-2xl border border-zinc-800 shadow-2xl p-1.5 z-50 animate-fade-up select-none">
							<button type="button" id="btnActionManageProjects" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition text-left">
								<svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
								<span data-i18n="account.menu.manage_projects">Manage projects</span>
							</button>
							<div class="my-1 border-t border-zinc-800/80"></div>
							<button type="button" id="btnActionCopyId" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition text-left">
								<svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
								<span data-i18n="account.menu.copy_id">Copy ID</span>
							</button>
							<button type="button" id="btnActionCopyLink" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition text-left">
								<svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
								<span data-i18n="account.menu.copy_link">Copy permanent link</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Navigation Tabs (Projects, Shared Modpacks, Friends) -->
			<div class="border-b border-zinc-800/80 flex items-center gap-8 text-sm select-none">
				<button id="accTabProjects" type="button" class="pb-3 text-emerald-400 font-semibold border-b-2 border-emerald-500 transition -mb-px flex items-center gap-2">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
					<span data-i18n="account.tab.projects">Projects</span>
				</button>
				<button id="accTabInstances" type="button" class="pb-3 text-zinc-400 hover:text-white font-medium border-b-2 border-transparent transition -mb-px flex items-center gap-2">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
					<span data-i18n="account.tab.instances">Shared Modpacks</span>
				</button>
				<button id="accTabFriends" type="button" class="pb-3 text-zinc-400 hover:text-white font-medium border-b-2 border-transparent transition -mb-px flex items-center gap-2">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
					<span data-i18n="account.tab.friends">Friends</span>
				</button>
			</div>

			<!-- Tab 1: Projects -->
			<div id="accPaneProjects" class="py-8 flex flex-col items-center justify-center text-center">
				<div id="accProjectsLoading" class="py-16 text-center text-xs text-zinc-500">Loading projects...</div>
				<div id="accProjectsEmpty" class="hidden py-8 flex flex-col items-center justify-center text-center">
					<div class="mx-auto mb-6 flex items-center justify-center select-none">
						<svg class="h-[140px] sm:h-[160px] w-auto" viewBox="0 50 250 100" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M63 134H154C154.515 134 155.017 133.944 155.5 133.839C155.983 133.944 156.485 134 157 134H209C212.866 134 216 130.866 216 127C216 123.134 212.866 120 209 120H203C199.134 120 196 116.866 196 113C196 109.134 199.134 106 203 106H222C225.866 106 229 102.866 229 99C229 95.134 225.866 92 222 92H200C203.866 92 207 88.866 207 85C207 81.134 203.866 78 200 78H136C139.866 78 143 74.866 143 71C143 67.134 139.866 64 136 64H79C75.134 64 72 67.134 72 71C72 74.866 75.134 78 79 78H39C35.134 78 32 81.134 32 85C32 88.866 35.134 92 39 92H64C67.866 92 71 95.134 71 99C71 102.866 67.866 106 64 106H24C20.134 106 17 109.134 17 113C17 116.866 20.134 120 24 120H63C59.134 120 56 123.134 56 127C56 130.866 59.134 134 63 134ZM226 134C229.866 134 233 130.866 233 127C233 123.134 229.866 120 226 120C222.134 120 219 123.134 219 127C219 130.866 222.134 134 226 134Z" fill="#141416"/>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M113.119 112.307C113.04 112.86 113 113.425 113 114C113 120.627 118.373 126 125 126C131.627 126 137 120.627 137 114C137 113.425 136.96 112.86 136.881 112.307H166V139C166 140.657 164.657 142 163 142H87C85.3431 142 84 140.657 84 139V112.307H113.119Z" fill="#09090b"/>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M138 112C138 119.18 132.18 125 125 125C117.82 125 112 119.18 112 112C112 111.767 112.006 111.536 112.018 111.307H84L93.5604 83.0389C93.9726 81.8202 95.1159 81 96.4023 81H153.598C154.884 81 156.027 81.8202 156.44 83.0389L166 111.307H137.982C137.994 111.536 138 111.767 138 112Z" fill="#09090b"/>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M136.098 112.955C136.098 118.502 131.129 124 125 124C118.871 124 113.902 118.502 113.902 112.955C113.902 112.775 113.908 111.596 113.918 111.419H93L101.161 91.5755C101.513 90.6338 102.489 90 103.587 90H146.413C147.511 90 148.487 90.6338 148.839 91.5755L157 111.419H136.082C136.092 111.596 136.098 112.775 136.098 112.955Z" fill="#141416"/>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M85.25 111.512V138C85.25 138.966 86.0335 139.75 87 139.75H163C163.966 139.75 164.75 138.966 164.75 138V111.512L155.255 83.4393C155.015 82.7285 154.348 82.25 153.598 82.25H96.4023C95.6519 82.25 94.985 82.7285 94.7446 83.4393L85.25 111.512Z" stroke="#27272a" stroke-width="2.5"/>
							<path d="M98 111C101.937 111 106.185 111 110.745 111C112.621 111 112.621 112.319 112.621 113C112.621 119.627 118.117 125 124.897 125C131.677 125 137.173 119.627 137.173 113C137.173 112.319 137.173 111 139.05 111H164M90.5737 111H93H90.5737Z" stroke="#27272a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M150.1 58.3027L139 70.7559M124.1 54V70.7559V54ZM98 58.3027L109.1 70.7559L98 58.3027Z" stroke="#1f2024" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</div>
					<h2 data-i18n="account.empty.title" class="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">This user has no projects!</h2>
					<p data-i18n="account.empty.subtitle" class="text-xs sm:text-sm text-zinc-400 mb-6 max-w-sm">You don't have any projects yet.</p>
					<button type="button" onclick="window.openCreateProjectModal()" data-i18n="account.empty.create_btn" class="px-6 py-2.5 rounded-2xl bg-[#00af5c] hover:bg-[#00c568] text-black font-semibold text-xs sm:text-sm transition active:scale-95 shadow-lg shadow-emerald-500/10 cursor-pointer">
						Create a project
					</button>
				</div>
				<div id="accProjectsList" class="hidden w-full flex flex-col gap-4 text-left">
					<div class="flex items-center justify-between pb-2">
						<div class="text-xs text-zinc-400 font-medium" id="accProjectsCountText"></div>
						<button type="button" onclick="window.openCreateProjectModal()" class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition active:scale-95 shadow-sm cursor-pointer">
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
							<span data-i18n="account.empty.create_btn">Create a project</span>
						</button>
					</div>
					<div id="accProjectsCards" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
				</div>
			</div>

			<!-- Tab 2: Shared Modpacks -->
			<div id="accPaneInstances" class="py-8 hidden flex flex-col gap-6">
				<div class="oled-card p-6 rounded-2xl">
					<div class="flex items-center justify-between mb-2">
						<h2 data-i18n="account.instances.title" class="text-sm font-bold text-white">Shared Modpacks</h2>
						<span class="text-xs text-zinc-500">configs.zip</span>
					</div>
					<p data-i18n="account.instances.subtitle" class="text-xs text-zinc-400 mb-4 leading-relaxed">
						Modpacks and instances you share with friends directly from MacrosApp.
					</p>
					<div id="instancesList" class="flex flex-col gap-2 max-h-72 overflow-y-auto">
						<div data-i18n="account.instances.empty" class="text-xs text-zinc-600 py-8 text-center">You haven't shared any modpacks from the launcher yet</div>
					</div>
				</div>
			</div>

			<!-- Tab 3: Friends -->
			<div id="accPaneFriends" class="py-8 hidden flex flex-col gap-6">
				<div class="oled-card p-6 rounded-2xl">
					<div class="flex items-center justify-between mb-4">
						<h2 data-i18n="account.friends.title" class="text-sm font-bold text-white">Online Friends</h2>
						<span id="friendsCount" class="text-xs font-mono text-emerald-400">0</span>
					</div>

					<div class="flex gap-2 mb-4 max-w-md">
						<input id="addFriendInput" data-i18n-placeholder="account.friends.placeholder" type="text" placeholder="Friend's username..." class="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500">
						<button id="addFriendBtn" data-i18n="account.friends.add" class="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium transition">
							Add
						</button>
					</div>

					<div id="friendsList" class="flex flex-col gap-2 max-h-72 overflow-y-auto">
						<div data-i18n="account.friends.empty" class="text-xs text-zinc-600 py-8 text-center">Friend list is empty</div>
					</div>
				</div>
			</div>
		</div>
	</main>

	<!-- Full Profile Edit Modal -->
	<div id="editProfileModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden overflow-y-auto">
		<div class="w-full max-w-lg oled-card rounded-2xl shadow-2xl text-left my-auto">
			<!-- Modal Header -->
			<div class="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
				<h3 data-i18n="modal.edit.title" class="text-sm font-bold text-white">Редактирование профиля</h3>
				<button id="closeEditProfileModal" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
				</button>
			</div>
			<!-- Modal Tabs -->
			<div class="flex border-b border-zinc-900">
				<button id="tabProfile" type="button" data-i18n="modal.tab.profile" class="px-5 py-3 text-xs font-semibold text-emerald-400 border-b-2 border-emerald-500 -mb-px transition">Профиль</button>
				<button id="tabSecurity" type="button" data-i18n="modal.tab.security" class="px-5 py-3 text-xs font-semibold text-zinc-400 hover:text-white border-b-2 border-transparent -mb-px transition">Безопасность</button>
			</div>
			<!-- Profile Tab -->
			<div id="tabContentProfile" class="p-6 flex flex-col gap-5">
				<div>
					<label data-i18n="modal.avatar.label" class="block text-xs font-semibold text-zinc-300 mb-2">Аватар профиля</label>
					<div class="flex items-center gap-5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
						<div class="relative group cursor-pointer shrink-0" onclick="document.getElementById('avatarFileInput').click()">
							<img id="editAvatarPreview" class="w-16 h-16 rounded-2xl object-cover bg-zinc-900 border border-zinc-700 group-hover:border-emerald-500 shadow-md transition" src="${user?.avatar_url || ''}" alt="Avatar">
							<div class="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition">
								<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
							</div>
						</div>
						<div class="flex flex-col gap-2">
							<input type="file" id="avatarFileInput" accept="image/png, image/jpeg, image/webp, image/gif" class="hidden">
							<button type="button" onclick="document.getElementById('avatarFileInput').click()" class="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-xs text-zinc-200 font-semibold flex items-center gap-2 transition active:scale-95 w-fit shadow-sm">
								<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
								<span data-i18n="modal.avatar.upload_btn">Загрузить фото с ПК</span>
							</button>
							<span id="avatarFileStatus" data-i18n="modal.avatar.hint" class="text-[11px] text-zinc-500">PNG, JPG, WebP или GIF (до 5 МБ)</span>
						</div>
					</div>
				</div>
				<div>
					<label data-i18n="modal.username.label" class="block text-xs font-semibold text-zinc-300 mb-1.5">Имя пользователя (логин)</label>
					<input id="editUsername" type="text" placeholder="username" autocomplete="username" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition">
					<p data-i18n="modal.username.hint" class="text-[11px] text-zinc-600 mt-1.5">3-25 символов: буквы, цифры, _ - .</p>
				</div>
				<div>
					<label data-i18n="modal.bio.label" class="block text-xs font-semibold text-zinc-300 mb-1.5">О себе</label>
					<textarea id="editBio" data-i18n-placeholder="modal.bio.placeholder" rows="3" placeholder="Расскажите о себе..." class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition resize-none"></textarea>
				</div>
				<div class="flex justify-end gap-2 pt-2">
					<button type="button" id="cancelEditProfile" data-i18n="modal.btn.cancel" class="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-300 text-xs hover:bg-zinc-800 transition">Отмена</button>
					<button type="button" id="saveProfileBtn" class="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition flex items-center gap-2">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
						<span data-i18n="modal.btn.save">Сохранить</span>
					</button>
				</div>
			</div>
			<!-- Security Tab -->
			<div id="tabContentSecurity" class="p-6 flex-col gap-5" style="display:none">
				<p data-i18n="modal.sec.desc" class="text-xs text-zinc-400 leading-relaxed">Для смены пароля введите текущий пароль и новый:</p>
				<div>
					<label data-i18n="modal.sec.current" class="block text-xs font-semibold text-zinc-300 mb-1.5">Текущий пароль</label>
					<input id="editOldPassword" type="password" placeholder="..." autocomplete="current-password" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition">
				</div>
				<div>
					<label data-i18n="modal.sec.new" class="block text-xs font-semibold text-zinc-300 mb-1.5">Новый пароль</label>
					<input id="editNewPassword" type="password" placeholder="..." autocomplete="new-password" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition">
				</div>
				<div>
					<label data-i18n="modal.sec.confirm" class="block text-xs font-semibold text-zinc-300 mb-1.5">Подтвердите пароль</label>
					<input id="editConfirmPassword" type="password" placeholder="..." autocomplete="new-password" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition">
				</div>
				<div class="flex justify-end gap-2 pt-2">
					<button type="button" id="cancelEditSecurity" data-i18n="modal.btn.cancel" class="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-300 text-xs hover:bg-zinc-800 transition">Отмена</button>
					<button type="button" id="savePasswordBtn" class="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition flex items-center gap-2">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
						<span data-i18n="modal.sec.btn">Сменить пароль</span>
					</button>
				</div>
			</div>
		</div>
	</div>

	${renderNavbarUserScript()}
	<script>
	(function() {
		function getCookie(name) {
			const value = '; ' + document.cookie;
			const parts = value.split('; ' + name + '=');
			if (parts.length === 2) return parts.pop().split(';').shift();
			return null;
		}

		const token = localStorage.getItem('macros_token') || getCookie('macros_session') || '';
		if (!token && !${Boolean(user)}) {
			window.location.href = '/auth/sign-in';
		}
		if (token) {
			localStorage.setItem('macros_token', token);
		}

		async function loadProfile() {
			try {
				const headers = {};
				if (token) headers['Authorization'] = 'Bearer ' + token;
				const res = await fetch('/v2/user', { headers });
				if (!res.ok) {
					if (!${Boolean(user)}) {
						localStorage.removeItem('macros_token');
						localStorage.removeItem('macros_user');
						document.cookie = 'macros_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
						window.location.href = '/auth/sign-in';
						return;
					}
				} else {
					const userData = await res.json();
					localStorage.setItem('macros_user', JSON.stringify(userData));
					document.getElementById('loading').classList.add('hidden');
					document.getElementById('profileContent').classList.remove('hidden');

					document.getElementById('userName').textContent = userData.username;
					if (userData.avatar_url) {
						const av = document.getElementById('userAvatar');
						av.src = userData.avatar_url;
						av.classList.remove('hidden');
						document.getElementById('userAvatarInitial').classList.add('hidden');
					} else {
						const init = (userData.username || 'U').charAt(0).toUpperCase();
						document.getElementById('userAvatarInitial').textContent = init;
						document.getElementById('userAvatarInitial').classList.remove('hidden');
						document.getElementById('userAvatar').classList.add('hidden');
					}
					const bioEl = document.getElementById('userBio');
					if (userData.bio) {
						bioEl.textContent = userData.bio;
						bioEl.removeAttribute('data-i18n');
					} else {
						bioEl.setAttribute('data-i18n', 'account.bio.default');
					}

					if (userData.created_at) {
						try {
							const d = new Date(userData.created_at);
							const now = new Date();
							const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
							const curLang = localStorage.getItem('macros_lang') || 'en';
							let str = '';
							if (diffDays < 1) {
								str = curLang === 'ru' ? 'сегодня' : 'today';
							} else if (diffDays < 7) {
								str = curLang === 'ru' ? diffDays + ' дн. назад' : diffDays + ' days ago';
							} else if (diffDays < 30) {
								const w = Math.floor(diffDays / 7);
								str = curLang === 'ru' ? w + ' нед. назад' : w + ' weeks ago';
							} else {
								const m = Math.floor(diffDays / 30);
								str = curLang === 'ru' ? m + ' мес. назад' : m + ' months ago';
							}
							const el = document.getElementById('joinedDateText');
							if (el) { el.textContent = str; el.removeAttribute('data-i18n'); }
						} catch (e) {}
					}

					const curLang = localStorage.getItem('macros_lang') || 'en';
					if (window.setAppLanguage) window.setAppLanguage(curLang);
				}

				loadFriends();
				loadInstances();
				loadUserProjects();
			} catch (err) {
				console.error(err);
			}
		}

		async function loadUserProjects() {
			try {
				const headers = {};
				if (token) headers['Authorization'] = 'Bearer ' + token;
				const res = await fetch('/api/v1/projects/my', { headers });
				const loadingEl = document.getElementById('accProjectsLoading');
				const emptyEl = document.getElementById('accProjectsEmpty');
				const listEl = document.getElementById('accProjectsList');
				const cardsEl = document.getElementById('accProjectsCards');
				const statsEl = document.getElementById('statsProjects');

				if (loadingEl) loadingEl.classList.add('hidden');

				if (res.ok) {
					const projects = await res.json();
					const count = Array.isArray(projects) ? projects.length : 0;
					if (statsEl) statsEl.textContent = count;

					if (count === 0) {
						if (emptyEl) emptyEl.classList.remove('hidden');
						if (listEl) listEl.classList.add('hidden');
					} else {
						if (emptyEl) emptyEl.classList.add('hidden');
						if (listEl) listEl.classList.remove('hidden');
						const countText = document.getElementById('accProjectsCountText');
						if (countText) countText.textContent = count + ' ' + (count === 1 ? 'project' : 'projects');
						if (cardsEl) {
							cardsEl.innerHTML = projects.map(p => {
								const safeTitle = (p.title || p.slug || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
								const safeSlug = (p.slug || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
								const safeDesc = (p.description || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
								const type = (p.project_type || 'mod').toLowerCase();
								return '<div class="oled-card p-5 rounded-2xl flex flex-col justify-between gap-3 hover:border-emerald-500/40 transition">' +
									'<div>' +
										'<div class="flex items-center justify-between gap-2 mb-1.5">' +
											'<a href="/mod/' + safeSlug + '" class="font-bold text-white hover:text-emerald-400 transition text-sm truncate">' + safeTitle + '</a>' +
											'<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/5 border border-white/10 text-zinc-300 shrink-0">' + type + '</span>' +
										'</div>' +
										'<p class="text-xs text-zinc-400 line-clamp-2 leading-relaxed">' + (safeDesc || 'No description provided.') + '</p>' +
									'</div>' +
									'<div class="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500">' +
										'<span>/' + safeSlug + '</span>' +
										'<a href="/mod/' + safeSlug + '" class="text-emerald-400 hover:text-emerald-300 font-medium">View &rarr;</a>' +
									'</div>' +
								'</div>';
							}).join('');
						}
					}
				} else {
					if (emptyEl) emptyEl.classList.remove('hidden');
				}
			} catch (e) {
				const loadingEl = document.getElementById('accProjectsLoading');
				const emptyEl = document.getElementById('accProjectsEmpty');
				if (loadingEl) loadingEl.classList.add('hidden');
				if (emptyEl) emptyEl.classList.remove('hidden');
			}
		}

		async function loadInstances() {
			try {
				const headers = {};
				if (token) headers['Authorization'] = 'Bearer ' + token;
				const res = await fetch('/v3/share/instances', { headers });
				if (res.ok) {
					const instances = await res.json();
					const list = document.getElementById('instancesList');
					if (instances && instances.length > 0) {
						list.innerHTML = '';
						instances.forEach(inst => {
							const div = document.createElement('div');
							div.className = 'flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 text-xs';
							const left = document.createElement('div');
							left.className = 'flex items-center gap-3';
							left.innerHTML = '<div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">' +
								'<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' +
								'</div>' +
								'<div>' +
								'<div class="font-bold text-white">' + (inst.name || 'Сборка') + '</div>' +
								'<div class="text-[11px] text-zinc-500">' + (inst.game_version || '1.20.1') + ' • ' + (inst.loader || 'Fabric') + '</div>' +
								'</div>';
							const right = document.createElement('a');
							right.href = '/share/' + encodeURIComponent(inst.invite_id || inst.id);
							right.target = '_blank';
							right.className = 'px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium transition';
							right.textContent = 'Открыть';
							div.appendChild(left);
							div.appendChild(right);
							list.appendChild(div);
						});
					}
				}
			} catch (e) {}
		}

		async function loadFriends() {
			try {
				const headers = {};
				if (token) headers['Authorization'] = 'Bearer ' + token;
				const res = await fetch('/v3/friends', { headers });
				if (res.ok) {
					const friends = await res.json();
					document.getElementById('friendsCount').textContent = friends.length;
					const list = document.getElementById('friendsList');
					const curLang = localStorage.getItem('macros_lang') || 'en';
					const t = (window.TRANSLATIONS && window.TRANSLATIONS[curLang]) || (window.TRANSLATIONS && window.TRANSLATIONS.en) || {};
					const stFriend = t['account.friends.status_friend'] || 'Friend';
					const stPending = t['account.friends.status_request'] || 'Pending';
					const emptyText = t['account.friends.empty'] || 'Friend list is empty';

					if (friends.length > 0) {
						list.innerHTML = '';
						friends.forEach(f => {
							const div = document.createElement('div');
							div.className = 'flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-xs';
							
							const left = document.createElement('div');
							left.className = 'flex items-center gap-2';
							const dot = document.createElement('span');
							dot.className = 'w-1.5 h-1.5 rounded-full ' + (f.accepted ? 'bg-emerald-500' : 'bg-yellow-500');
							const name = document.createElement('span');
							name.className = 'font-medium text-zinc-200';
							name.textContent = f.friend_id;
							left.appendChild(dot);
							left.appendChild(name);

							const right = document.createElement('div');
							right.className = 'flex items-center gap-2';
							const st = document.createElement('span');
							st.className = 'text-[11px] text-zinc-500';
							st.textContent = f.accepted ? stFriend : stPending;
							const del = document.createElement('button');
							del.className = 'text-zinc-600 hover:text-red-400 transition ml-2';
							del.innerHTML = '&times;';
							del.onclick = () => removeFriend(f.friend_id);
							right.appendChild(st);
							right.appendChild(del);

							div.appendChild(left);
							div.appendChild(right);
							list.appendChild(div);
						});
					} else {
						list.innerHTML = '<div data-i18n="account.friends.empty" class="text-xs text-zinc-600 py-6 text-center">' + emptyText + '</div>';
					}
				}
			} catch (err) {}
		}

		function t(key, fallback) {
			const curLang = localStorage.getItem('macros_lang') || 'en';
			const dict = (window.TRANSLATIONS && window.TRANSLATIONS[curLang]) || (window.TRANSLATIONS && window.TRANSLATIONS.en) || {};
			return dict[key] || fallback || key;
		}

		function resolveToastMessage(msg) {
			if (!msg) return t('toast.error_generic', 'An error occurred');
			const curLang = localStorage.getItem('macros_lang') || 'en';
			const dict = (window.TRANSLATIONS && window.TRANSLATIONS[curLang]) || (window.TRANSLATIONS && window.TRANSLATIONS.en) || {};
			if (dict[msg]) return dict[msg];

			if (msg === 'Заполните все поля пароля' || msg.includes('fill in all password')) return t('toast.fill_all_passwords', 'Please fill in all password fields');
			if (msg === 'Пароли не совпадают' || msg.includes('Passwords do not match')) return t('toast.passwords_mismatch', 'Passwords do not match');
			if (msg.includes('минимум 6') || msg.includes('at least 6')) return t('toast.password_too_short', 'Password must be at least 6 characters');
			if (msg === 'Пароль успешно изменён!' || msg.includes('Password changed')) return t('toast.password_updated', 'Password changed successfully!');
			if (msg === 'Не удалось изменить пароль' || msg.includes('Failed to change password')) return t('toast.password_change_failed', 'Failed to change password');
			if (msg === 'Профиль успешно обновлён!' || msg.includes('Profile updated')) return t('toast.profile_updated', 'Profile updated successfully!');
			if (msg === 'Не удалось сохранить профиль' || msg.includes('Failed to save profile')) return t('toast.profile_save_failed', 'Failed to save profile');
			if (msg === 'Друг удален' || msg.includes('Friend removed')) return t('toast.friend_removed', 'Friend removed');
			if (msg === 'Запрос в друзья отправлен!' || msg.includes('Friend request sent')) return t('toast.friend_request_sent', 'Friend request sent!');
			if (msg === 'Пользователь не найден' || msg.includes('User not found')) return t('toast.user_not_found', 'User not found');
			if (msg.includes('5 МБ') || msg.includes('5 MB')) return t('toast.file_too_large', 'File is too large (max 5 MB)');
			if (msg.includes('Incorrect current password') || msg.includes('Неверный текущий пароль')) return t('toast.incorrect_password', 'Incorrect current password');
			if (msg.includes('already taken') || msg.includes('already in use') || msg.includes('уже занято')) return t('toast.username_taken', 'Username is already taken');
			if (msg.includes('Too many') || msg.includes('Слишком много')) return t('toast.rate_limit', 'Too many attempts. Please wait a minute.');
			if (msg.includes('Invalid') || msg.includes('Неверный')) return t('toast.invalid_credentials', 'Invalid username or password');

			return msg;
		}

		const activeToasts = new Map();

		function showToast(messageOrKey, type = 'info') {
			const container = document.getElementById('toastContainer');
			if (!container) return;

			const message = resolveToastMessage(messageOrKey);

			const existing = activeToasts.get(message);
			if (existing && document.body.contains(existing.el)) {
				clearTimeout(existing.timer);
				existing.el.classList.add('scale-[1.03]');
				setTimeout(() => existing.el.classList.remove('scale-[1.03]'), 150);
				existing.timer = setTimeout(() => dismissToast(existing.el, message), 4000);
				return;
			}

			const isError = type === 'error';
			const isSuccess = type === 'success';

			const toast = document.createElement('div');
			toast.className = 'pointer-events-auto flex items-center gap-3 px-3.5 py-3 rounded-xl bg-zinc-950/95 backdrop-blur-xl border ' +
				(isError
					? 'border-red-500/25 shadow-[0_12px_32px_-4px_rgba(239,68,68,0.2)]'
					: isSuccess
						? 'border-emerald-500/25 shadow-[0_12px_32px_-4px_rgba(16,185,129,0.2)]'
						: 'border-zinc-800 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.7)]') +
				' transition-all duration-300 transform translate-y-3 opacity-0 scale-95 select-none w-auto max-w-sm';

			const iconDiv = document.createElement('div');
			iconDiv.className = 'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ' +
				(isError
					? 'bg-red-500/10 text-red-400 border border-red-500/20'
					: isSuccess
						? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
						: 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/50');

			iconDiv.innerHTML = isError
				? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
				: isSuccess
					? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
					: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';

			const textSpan = document.createElement('span');
			textSpan.className = 'text-xs font-medium text-zinc-200 leading-snug flex-1';
			textSpan.textContent = message;

			const closeBtn = document.createElement('button');
			closeBtn.type = 'button';
			closeBtn.className = 'text-zinc-500 hover:text-zinc-300 transition p-1 -mr-1 rounded-md hover:bg-white/5 shrink-0';
			closeBtn.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
			closeBtn.onclick = () => dismissToast(toast, message);

			toast.appendChild(iconDiv);
			toast.appendChild(textSpan);
			toast.appendChild(closeBtn);
			container.appendChild(toast);

			requestAnimationFrame(() => {
				toast.classList.remove('translate-y-3', 'opacity-0', 'scale-95');
				toast.classList.add('translate-y-0', 'opacity-100', 'scale-100');
			});

			const timer = setTimeout(() => dismissToast(toast, message), 4000);
			activeToasts.set(message, { el: toast, timer });
		}

		function dismissToast(toast, key) {
			if (key) activeToasts.delete(key);
			toast.classList.remove('translate-y-0', 'opacity-100', 'scale-100');
			toast.classList.add('-translate-y-2', 'opacity-0', 'scale-95');
			setTimeout(() => toast.remove(), 250);
		}

		async function removeFriend(friendId) {
			const headers = {};
			if (token) headers['Authorization'] = 'Bearer ' + token;
			await fetch('/v3/friend/' + encodeURIComponent(friendId), {
				method: 'DELETE',
				headers
			});
			showToast('toast.friend_removed', 'info');
			loadFriends();
		}

		document.getElementById('addFriendBtn').onclick = async () => {
			const nick = document.getElementById('addFriendInput').value.trim();
			if (!nick) return;
			const headers = {};
			if (token) headers['Authorization'] = 'Bearer ' + token;
			const res = await fetch('/v3/friend/' + encodeURIComponent(nick), {
				method: 'POST',
				headers
			});
			if (res.ok) {
				document.getElementById('addFriendInput').value = '';
				showToast('toast.friend_request_sent', 'success');
				loadFriends();
			} else {
				showToast('toast.user_not_found', 'error');
			}
		};

		// Edit Profile Modal
		function switchTab(tab) {
			const isProfile = tab === 'profile';
			document.getElementById('tabContentProfile').style.display = isProfile ? 'flex' : 'none';
			document.getElementById('tabContentSecurity').style.display = isProfile ? 'none' : 'flex';
			const activeClass = 'text-emerald-400 border-emerald-500';
			const inactiveClass = 'text-zinc-400 border-transparent hover:text-white';
			document.getElementById('tabProfile').className = 'px-5 py-3 text-xs font-semibold border-b-2 -mb-px transition ' + (isProfile ? activeClass : inactiveClass);
			document.getElementById('tabSecurity').className = 'px-5 py-3 text-xs font-semibold border-b-2 -mb-px transition ' + (!isProfile ? activeClass : inactiveClass);
		}

		function openEditProfileModal() {
			const userData = JSON.parse(localStorage.getItem('macros_user') || '{}');
			pendingAvatarDataUrl = null;
			document.getElementById('editAvatarPreview').src = userData.avatar_url || '';
			const statusEl = document.getElementById('avatarFileStatus');
			if (statusEl) {
				statusEl.textContent = t('modal.avatar.hint', 'PNG, JPG, WebP or GIF (up to 5 MB)');
				statusEl.className = 'text-[11px] text-zinc-500';
			}
			document.getElementById('editUsername').value = userData.username || '';
			document.getElementById('editBio').value = userData.bio || '';
			document.getElementById('editOldPassword').value = '';
			document.getElementById('editNewPassword').value = '';
			document.getElementById('editConfirmPassword').value = '';
			switchTab('profile');
			document.getElementById('editProfileModal').classList.remove('hidden');
		}

		function closeEditProfileModal() {
			document.getElementById('editProfileModal').classList.add('hidden');
		}

		let pendingAvatarDataUrl = null;

		const avatarInput = document.getElementById('avatarFileInput');
		if (avatarInput) {
			avatarInput.addEventListener('change', function(e) {
				const file = e.target.files && e.target.files[0];
				if (!file) return;
				if (file.size > 5 * 1024 * 1024) {
					showToast('toast.file_too_large', 'error');
					return;
				}
				const reader = new FileReader();
				reader.onload = function(evt) {
					const img = new Image();
					img.onload = function() {
						const canvas = document.createElement('canvas');
						canvas.width = 256;
						canvas.height = 256;
						const ctx = canvas.getContext('2d');
						const minSide = Math.min(img.width, img.height);
						const sx = (img.width - minSide) / 2;
						const sy = (img.height - minSide) / 2;
						ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, 256, 256);
						pendingAvatarDataUrl = canvas.toDataURL('image/png');
						document.getElementById('editAvatarPreview').src = pendingAvatarDataUrl;
						const statusEl = document.getElementById('avatarFileStatus');
						if (statusEl) {
							statusEl.textContent = file.name + ' (' + Math.round(file.size / 1024) + ' KB) ✓';
							statusEl.className = 'text-[11px] text-emerald-400 font-semibold';
						}
					};
					img.src = evt.target.result;
				};
				reader.readAsDataURL(file);
			});
		}

		document.getElementById('openEditProfileBtn').onclick = openEditProfileModal;
		document.getElementById('closeEditProfileModal').onclick = closeEditProfileModal;
		document.getElementById('cancelEditProfile').onclick = closeEditProfileModal;
		document.getElementById('cancelEditSecurity').onclick = closeEditProfileModal;
		document.getElementById('editProfileModal').addEventListener('click', function(e) {
			if (e.target === this) closeEditProfileModal();
		});

		document.getElementById('saveProfileBtn').onclick = async () => {
			const body = {};
			if (pendingAvatarDataUrl) {
				body.avatar_url = pendingAvatarDataUrl;
			}
			const username = document.getElementById('editUsername').value.trim();
			const bio = document.getElementById('editBio').value.trim();
			if (username) body.username = username;
			body.bio = bio;
			const headers = { 'Content-Type': 'application/json' };
			if (token) headers['Authorization'] = 'Bearer ' + token;
			const res = await fetch('/api/v1/user/profile', {
				method: 'PATCH',
				headers,
				body: JSON.stringify(body)
			});
			if (res.ok) {
				const updated = await res.json();
				localStorage.setItem('macros_user', JSON.stringify(updated));
				document.getElementById('userName').textContent = updated.username || '';
				document.getElementById('userBio').textContent = updated.bio || t('account.bio.default', 'MacrosApp community member');
				if (updated.avatar_url) document.getElementById('userAvatar').src = updated.avatar_url;
				closeEditProfileModal();
				showToast('toast.profile_updated', 'success');
			} else {
				const err = await res.json().catch(() => ({}));
				showToast(err.error || 'toast.profile_save_failed', 'error');
			}
		};

		document.getElementById('savePasswordBtn').onclick = async () => {
			const oldPw = document.getElementById('editOldPassword').value;
			const newPw = document.getElementById('editNewPassword').value;
			const confirmPw = document.getElementById('editConfirmPassword').value;
			if (!oldPw || !newPw || !confirmPw) { showToast('toast.fill_all_passwords', 'error'); return; }
			if (newPw !== confirmPw) { showToast('toast.passwords_mismatch', 'error'); return; }
			if (newPw.length < 6) { showToast('toast.password_too_short', 'error'); return; }
			const headers = { 'Content-Type': 'application/json' };
			if (token) headers['Authorization'] = 'Bearer ' + token;
			const res = await fetch('/api/v1/user/profile', {
				method: 'PATCH',
				headers,
				body: JSON.stringify({ old_password: oldPw, password: newPw })
			});
			if (res.ok) {
				document.getElementById('editOldPassword').value = '';
				document.getElementById('editNewPassword').value = '';
				document.getElementById('editConfirmPassword').value = '';
				closeEditProfileModal();
				showToast('toast.password_updated', 'success');
			} else {
				const err = await res.json().catch(() => ({}));
				showToast(err.error || 'toast.password_change_failed', 'error');
			}
		};

		switchTab('profile');

		const lBtn = document.getElementById('logoutBtn'); if (lBtn) lBtn.onclick = async () => {
			localStorage.removeItem('macros_token');
			localStorage.removeItem('macros_user');
			try {
				await fetch('/api/v1/auth/logout', { method: 'POST' });
			} catch (e) {}
			document.cookie = 'macros_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			window.location.href = '/';
		};

		function switchAccountTab(tab) {
			const isProjects = tab === 'projects';
			const isInstances = tab === 'instances';
			const isFriends = tab === 'friends';

			const paneProj = document.getElementById('accPaneProjects');
			const paneInst = document.getElementById('accPaneInstances');
			const paneFr = document.getElementById('accPaneFriends');

			if (paneProj) paneProj.classList.toggle('hidden', !isProjects);
			if (paneInst) paneInst.classList.toggle('hidden', !isInstances);
			if (paneFr) paneFr.classList.toggle('hidden', !isFriends);

			const activeCls = 'pb-3 text-emerald-400 font-semibold border-b-2 border-emerald-500 transition -mb-px flex items-center gap-2';
			const inactiveCls = 'pb-3 text-zinc-400 hover:text-white font-medium border-b-2 border-transparent transition -mb-px flex items-center gap-2';

			const tabProj = document.getElementById('accTabProjects');
			const tabInst = document.getElementById('accTabInstances');
			const tabFr = document.getElementById('accTabFriends');

			if (tabProj) tabProj.className = isProjects ? activeCls : inactiveCls;
			if (tabInst) tabInst.className = isInstances ? activeCls : inactiveCls;
			if (tabFr) tabFr.className = isFriends ? activeCls : inactiveCls;
		}

		const tabProjBtn = document.getElementById('accTabProjects');
		const tabInstBtn = document.getElementById('accTabInstances');
		const tabFrBtn = document.getElementById('accTabFriends');
		if (tabProjBtn) tabProjBtn.onclick = () => switchAccountTab('projects');
		if (tabInstBtn) tabInstBtn.onclick = () => switchAccountTab('instances');
		if (tabFrBtn) tabFrBtn.onclick = () => switchAccountTab('friends');

		const actionsTrigger = document.getElementById('profileActionsTrigger');
		const actionsDrop = document.getElementById('profileActionsDropdown');
		if (actionsTrigger && actionsDrop) {
			actionsTrigger.onclick = (e) => {
				e.stopPropagation();
				actionsDrop.classList.toggle('hidden');
			};
			document.addEventListener('click', (e) => {
				if (actionsDrop && !actionsDrop.contains(e.target) && actionsTrigger && !actionsTrigger.contains(e.target)) {
					actionsDrop.classList.add('hidden');
				}
			});
		}

		const btnManageProj = document.getElementById('btnActionManageProjects');
		if (btnManageProj) {
			btnManageProj.onclick = () => {
				if (actionsDrop) actionsDrop.classList.add('hidden');
				switchAccountTab('projects');
			};
		}

		const btnCopyId = document.getElementById('btnActionCopyId');
		if (btnCopyId) {
			btnCopyId.onclick = async () => {
				if (actionsDrop) actionsDrop.classList.add('hidden');
				const userData = JSON.parse(localStorage.getItem('macros_user') || '{}');
				const idToCopy = userData.id || '';
				if (idToCopy) {
					try {
						await navigator.clipboard.writeText(idToCopy);
						showToast('toast.id_copied', 'success');
					} catch (e) {
						showToast(idToCopy, 'info');
					}
				}
			};
		}

		const btnCopyLink = document.getElementById('btnActionCopyLink');
		if (btnCopyLink) {
			btnCopyLink.onclick = async () => {
				if (actionsDrop) actionsDrop.classList.add('hidden');
				const userData = JSON.parse(localStorage.getItem('macros_user') || '{}');
				const link = window.location.origin + '/user/' + (userData.username || '');
				try {
					await navigator.clipboard.writeText(link);
					showToast('toast.link_copied', 'success');
				} catch (e) {
					showToast(link, 'info');
				}
			};
		}

		const hash = window.location.hash || '';
		const urlParams = new URLSearchParams(window.location.search);
		const initialTab = urlParams.get('tab');
		if (initialTab === 'modpacks' || hash === '#modpacks' || initialTab === 'instances') {
			switchAccountTab('instances');
		} else if (initialTab === 'friends' || hash === '#friends') {
			switchAccountTab('friends');
		} else if (initialTab === 'settings' || hash === '#settings') {
			openEditProfileModal();
		}

		loadProfile();
	})();
	</script>
	<div id="toastContainer" class="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none"></div>
	${renderCreateProjectModalHtml()}
</body>
</html>`
}

export function renderDashboardProjectsHtml(user?: any): string {
	return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Projects | MacrosApp</title>
	<link rel="icon" type="image/png" href="/assets/favicon.png">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
	<script src="https://cdn.tailwindcss.com"></script>
	<script>
		tailwind.config = {
			darkMode: 'class',
			theme: {
				extend: {
					fontFamily: {
						sans: ['Inter', 'system-ui', 'sans-serif'],
					}
				}
			}
		}
	</script>
	${THEME_HEAD_SCRIPT}
	<style>
		${OLED_SCROLLBAR_CSS}
		${THEME_CSS}
		body { background-color: var(--theme-bg-page, #000000); color: var(--theme-text-primary, #f4f4f5); font-family: 'Inter', sans-serif; }
	</style>
</head>
<body class="min-h-screen flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
	<header class="border-b border-zinc-900 sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-xl">
		<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
			<div class="flex items-center gap-8">
				<a href="/" class="flex items-center gap-2.5 group shrink-0">
					<img src="/assets/logo.png" alt="MacrosApp" class="w-8 h-8 rounded-lg object-contain group-hover:scale-105 transition-transform">
					<span class="text-base font-bold tracking-tight text-white">MacrosApp</span>
				</a>
				<nav class="hidden md:flex items-center gap-6 text-sm text-zinc-400">
					<a href="/catalog" data-i18n="nav.catalog" class="hover:text-white transition">Discover</a>
					<a href="/#features" data-i18n="nav.features" class="hover:text-white transition">Features</a>
					<a href="/download" data-i18n="nav.download" class="hover:text-white transition">Download</a>
					<a href="https://github.com/nnnegrvpeni-lang/MacrosApp" target="_blank" data-i18n="nav.github" class="hover:text-white transition flex items-center gap-1.5">GitHub</a>
				</nav>
			</div>
			<div id="navUserSlot" class="flex items-center gap-3 shrink-0">
				${renderNavbarUserHtml(user)}
			</div>
		</div>
	</header>

	<main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex flex-col md:flex-row items-start gap-8">
		<!-- Sidebar Navigation (Matching Modrinth Screenshot 1) -->
		<aside class="w-full md:w-60 shrink-0 space-y-6 select-none">
			<div>
				<div class="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-3 mb-2">DASHBOARD</div>
				<nav class="space-y-1">
					<a href="/dashboard" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition">
						<svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
						<span>Overview</span>
					</a>
					<a href="/dashboard/notifications" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition">
						<svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
						<span>Notifications</span>
					</a>
					<a href="/dashboard/reports" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition">
						<svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/></svg>
						<span>Active reports</span>
					</a>
					<a href="/dashboard/collections" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition">
						<svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
						<span>Collections</span>
					</a>
				</nav>
			</div>

			<div>
				<div class="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-3 mb-2">CREATORS</div>
				<nav class="space-y-1">
					<a href="/dashboard/projects" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 transition">
						<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
						<span>Projects</span>
					</a>
					<a href="/dashboard/organizations" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition">
						<svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
						<span>Organizations</span>
					</a>
					<a href="/dashboard/analytics" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition">
						<svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
						<span>Analytics</span>
					</a>
					<a href="/dashboard/revenue" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition">
						<svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
						<span>Revenue</span>
					</a>
				</nav>
			</div>
		</aside>

		<!-- Main Card Content (Matching Modrinth Screenshot 1) -->
		<section class="flex-1 w-full bg-[#09090b] border border-zinc-800/80 rounded-2xl p-6 sm:p-7 shadow-2xl">
			<div class="flex items-center justify-between pb-5">
				<h1 class="text-2xl font-bold text-white tracking-tight">Projects</h1>
				<button type="button" onclick="window.openCreateProjectModal()" class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition active:scale-95 shadow-lg shadow-emerald-500/10 cursor-pointer">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
					<span>Create a project</span>
				</button>
			</div>

			<!-- Table Header -->
			<div class="border-t border-zinc-800/80">
				<div class="grid grid-cols-12 items-center py-3.5 px-4 text-xs font-semibold text-zinc-400 border-b border-zinc-800/80 select-none bg-zinc-900/30 rounded-t-xl">
					<div class="col-span-1 flex items-center">
						<input type="checkbox" class="rounded border-zinc-700 bg-zinc-800 text-emerald-500 accent-emerald-500">
					</div>
					<div class="col-span-5 flex items-center gap-1 cursor-pointer hover:text-white transition">
						<span>Name</span>
						<svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
					</div>
					<div class="col-span-2">ID</div>
					<div class="col-span-2">Type</div>
					<div class="col-span-2 text-right">Status</div>
				</div>

				<!-- Empty State or Projects List -->
				<div id="projectsListContainer" class="min-h-[260px] flex flex-col justify-center">
					<div id="projectsLoading" class="py-16 text-center text-xs text-zinc-500">Loading projects...</div>
					<div id="projectsEmpty" class="hidden py-24 text-center px-4">
						<p class="text-xs sm:text-sm text-zinc-400">You don't have any projects yet. Click the green button above to begin.</p>
					</div>
					<div id="projectsRows" class="hidden divide-y divide-zinc-800/60"></div>
				</div>
			</div>
		</section>
	</main>

	${renderNavbarUserScript()}

	<script>
	(async function() {
		const loadingEl = document.getElementById('projectsLoading');
		const emptyEl = document.getElementById('projectsEmpty');
		const rowsEl = document.getElementById('projectsRows');

		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('create') === '1') {
			window.openCreateProjectModal();
		}

		try {
			const res = await fetch('/api/v1/projects/my');
			if (res.ok) {
				const projects = await res.json();
				if (loadingEl) loadingEl.classList.add('hidden');
				if (!projects || projects.length === 0) {
					if (emptyEl) emptyEl.classList.remove('hidden');
				} else {
					if (rowsEl) {
						rowsEl.classList.remove('hidden');
						rowsEl.innerHTML = projects.map(p => {
							const safeTitle = (p.title || p.slug || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
							const safeSlug = (p.slug || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
							const safeId = (p.id || '').slice(0, 8);
							const type = (p.project_type || 'mod').toLowerCase();
							const status = (p.status || 'approved').toLowerCase();
							const statusBadge = status === 'approved' 
								? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Approved</span>'
								: '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">In review</span>';

							return '<div class="grid grid-cols-12 items-center py-3.5 px-4 text-xs hover:bg-zinc-900/40 transition">' +
								'<div class="col-span-1 flex items-center">' +
									'<input type="checkbox" class="rounded border-zinc-700 bg-zinc-800 text-emerald-500 accent-emerald-500">' +
								'</div>' +
								'<div class="col-span-5 flex items-center gap-3 min-w-0 pr-2">' +
									'<div class="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0 text-zinc-400">' +
										'<svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' +
									'</div>' +
									'<div class="min-w-0">' +
										'<a href="/mod/' + safeSlug + '" class="font-semibold text-white hover:text-emerald-400 transition truncate block">' + safeTitle + '</a>' +
										'<span class="text-[11px] text-zinc-500 truncate block">/' + safeSlug + '</span>' +
									'</div>' +
								'</div>' +
								'<div class="col-span-2 text-zinc-400 font-mono text-[11px] truncate">' + safeId + '</div>' +
								'<div class="col-span-2 text-zinc-300 capitalize">' + type + '</div>' +
								'<div class="col-span-2 text-right">' + statusBadge + '</div>' +
							'</div>';
						}).join('');
					}
				}
			} else {
				if (loadingEl) loadingEl.classList.add('hidden');
				if (emptyEl) emptyEl.classList.remove('hidden');
			}
		} catch (e) {
			if (loadingEl) loadingEl.classList.add('hidden');
			if (emptyEl) emptyEl.classList.remove('hidden');
		}
	})();
	</script>
	${renderCreateProjectModalHtml()}
</body>
</html>`;
}

export function renderSettingsHtml(user?: any, section = 'appearance'): string {
	const activeSection = section || 'appearance'

	return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Settings | MacrosApp</title>
	<link rel="icon" type="image/png" href="/assets/favicon.png">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
	<script src="https://cdn.tailwindcss.com"></script>
	<script>
		tailwind.config = {
			darkMode: 'class',
			theme: {
				extend: {
					fontFamily: {
						sans: ['Inter', 'system-ui', 'sans-serif'],
					}
				}
			}
		}
	</script>
	${THEME_HEAD_SCRIPT}
	<style>
		${OLED_SCROLLBAR_CSS}
		${THEME_CSS}
		body { background-color: var(--theme-bg-page, #000000); color: var(--theme-text-primary, #f4f4f5); font-family: 'Inter', sans-serif; }
		.theme-card-preview {
			height: 60px;
			border-radius: 8px;
			position: relative;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	</style>
</head>
<body class="min-h-screen flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
	<header class="border-b border-zinc-900 sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-xl">
		<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
			<div class="flex items-center gap-8">
				<a href="/" class="flex items-center gap-2.5 group shrink-0">
					<img src="/assets/logo.png" alt="MacrosApp" class="w-8 h-8 rounded-lg object-contain group-hover:scale-105 transition-transform">
					<span class="text-base font-bold tracking-tight text-white">MacrosApp</span>
				</a>
				<nav class="hidden md:flex items-center gap-6 text-sm text-zinc-400">
					<a href="/catalog" data-i18n="nav.catalog" class="hover:text-white transition">Discover</a>
					<a href="/#features" data-i18n="nav.features" class="hover:text-white transition">Features</a>
					<a href="/download" data-i18n="nav.download" class="hover:text-white transition">Download</a>
					<a href="https://github.com/nnnegrvpeni-lang/MacrosApp" target="_blank" data-i18n="nav.github" class="hover:text-white transition flex items-center gap-1.5">GitHub</a>
				</nav>
			</div>
			<div id="navUserSlot" class="flex items-center gap-3 shrink-0">
				${renderNavbarUserHtml(user)}
			</div>
		</div>
	</header>

	<main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex flex-col md:flex-row items-start gap-8">
		<!-- Sidebar Navigation (Only real, working tabs) -->
		<aside class="w-full md:w-64 shrink-0 space-y-6 select-none">
			<div>
				<div class="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-3 mb-2">DISPLAY</div>
				<nav class="space-y-1">
					<button type="button" onclick="window.switchSettingsTab('appearance')" id="navTabAppearance" class="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-left transition cursor-pointer">
						<svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
						<span data-i18n="settings.tab.appearance">Appearance</span>
					</button>
					<button type="button" onclick="window.switchSettingsTab('language')" id="navTabLanguage" class="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 text-left transition cursor-pointer">
						<svg class="w-4 h-4 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
						<span data-i18n="settings.tab.language">Language</span>
					</button>
				</nav>
			</div>

			<div>
				<div class="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-3 mb-2">ACCOUNT</div>
				<nav class="space-y-1">
					<button type="button" onclick="window.switchSettingsTab('account')" id="navTabAccount" class="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 text-left transition cursor-pointer">
						<svg class="w-4 h-4 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
						<span data-i18n="settings.tab.account">Account & Security</span>
					</button>
				</nav>
			</div>
		</aside>

		<!-- Main Settings Content -->
		<section class="flex-1 w-full space-y-6">
			<div class="flex items-center justify-between">
				<h1 id="settingsHeaderTitle" class="text-3xl font-bold text-white tracking-tight">Settings</h1>
				<div id="settingsToast" class="hidden px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 transition"></div>
			</div>

			<!-- Section 1: Appearance -->
			<div id="sectionAppearance" class="bg-[#09090b] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
				<!-- Color Theme -->
				<div>
					<h2 class="text-base font-bold text-white">Color theme</h2>
					<p class="text-xs text-zinc-400 mt-1 mb-4">Select your preferred color theme across MacrosApp.</p>

					<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
						<!-- Sync with system -->
						<div onclick="window.selectTheme('system')" id="themeCard_system" class="theme-card p-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition cursor-pointer flex flex-col justify-between">
							<div class="theme-card-preview bg-gradient-to-r from-zinc-300 via-zinc-700 to-zinc-950 border border-zinc-700/50 mb-3 flex items-center justify-center">
								<div class="w-8 h-2.5 bg-zinc-500 rounded"></div>
							</div>
							<div class="flex items-center gap-2 text-xs font-medium text-zinc-300">
								<input type="radio" name="colorTheme" id="radioTheme_system" value="system" class="accent-emerald-500">
								<span>Sync with system</span>
							</div>
						</div>

						<!-- Light -->
						<div onclick="window.selectTheme('light')" id="themeCard_light" class="theme-card p-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition cursor-pointer flex flex-col justify-between">
							<div class="theme-card-preview bg-slate-100 border border-slate-300 mb-3 flex items-center justify-center">
								<div class="w-8 h-2.5 bg-slate-400 rounded"></div>
							</div>
							<div class="flex items-center gap-2 text-xs font-medium text-zinc-300">
								<input type="radio" name="colorTheme" id="radioTheme_light" value="light" class="accent-emerald-500">
								<span>Light ☀️</span>
							</div>
						</div>

						<!-- Dark -->
						<div onclick="window.selectTheme('dark')" id="themeCard_dark" class="theme-card p-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition cursor-pointer flex flex-col justify-between">
							<div class="theme-card-preview bg-[#18181c] border border-zinc-700/60 mb-3 flex items-center justify-center">
								<div class="w-8 h-2.5 bg-zinc-500 rounded"></div>
							</div>
							<div class="flex items-center gap-2 text-xs font-medium text-zinc-300">
								<input type="radio" name="colorTheme" id="radioTheme_dark" value="dark" class="accent-emerald-500">
								<span>Dark</span>
							</div>
						</div>

						<!-- OLED -->
						<div onclick="window.selectTheme('oled')" id="themeCard_oled" class="theme-card p-3 rounded-2xl border border-emerald-500/80 bg-emerald-500/5 transition cursor-pointer flex flex-col justify-between">
							<div class="theme-card-preview bg-black border border-zinc-800 mb-3 flex items-center justify-center">
								<div class="w-8 h-2.5 bg-emerald-500 rounded"></div>
							</div>
							<div class="flex items-center gap-2 text-xs font-bold text-emerald-400">
								<input type="radio" name="colorTheme" id="radioTheme_oled" value="oled" checked class="accent-emerald-500">
								<span>OLED 🌙</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Sync theme across devices -->
				<div class="pt-6 border-t border-zinc-800/80 flex items-center justify-between gap-4 select-none">
					<div>
						<h3 class="text-xs sm:text-sm font-semibold text-white">Sync theme across devices</h3>
						<p class="text-xs text-zinc-400 mt-0.5">Use this theme everywhere you're signed in. Turn this off to keep a separate theme on this device.</p>
					</div>
					<label class="relative inline-flex items-center cursor-pointer shrink-0">
						<input type="checkbox" id="toggleSyncTheme" onchange="window.handleToggleSyncTheme(this.checked)" checked class="sr-only peer">
						<div class="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
					</label>
				</div>

				<!-- Project list layouts -->
				<div class="pt-6 border-t border-zinc-800/80 space-y-6 select-none">
					<div>
						<h2 class="text-base font-bold text-white">Project list layouts</h2>
						<p class="text-xs text-zinc-400 mt-1">Select your preferred layout for each page that displays project lists. Changes take effect immediately in the catalog.</p>
					</div>

					<!-- Mods page -->
					<div>
						<h4 class="text-xs font-semibold text-zinc-300 mb-2.5">Mods page (Catalog)</h4>
						<div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md">
							<div onclick="window.selectLayout('mods', 'rows')" id="layoutCard_mods_rows" class="p-3 rounded-2xl border border-emerald-500 bg-emerald-500/5 transition cursor-pointer flex flex-col justify-between">
								<div class="h-16 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col justify-center gap-1.5 px-3 mb-2.5">
									<div class="h-2 bg-emerald-500 rounded-full w-full"></div>
									<div class="h-2 bg-emerald-500/60 rounded-full w-4/5"></div>
									<div class="h-2 bg-emerald-500/40 rounded-full w-3/4"></div>
								</div>
								<div class="flex items-center gap-2 text-xs font-bold text-emerald-400">
									<input type="radio" name="layoutMods" id="radioMods_rows" value="rows" checked class="accent-emerald-500">
									<span>Rows</span>
								</div>
							</div>
							<div onclick="window.selectLayout('mods', 'grid')" id="layoutCard_mods_grid" class="p-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition cursor-pointer flex flex-col justify-between">
								<div class="h-16 rounded-lg bg-zinc-950 border border-zinc-800 grid grid-cols-2 gap-1.5 p-2 mb-2.5">
									<div class="bg-zinc-800 rounded"></div>
									<div class="bg-zinc-800 rounded"></div>
									<div class="bg-zinc-800 rounded"></div>
									<div class="bg-zinc-800 rounded"></div>
								</div>
								<div class="flex items-center gap-2 text-xs font-medium text-zinc-400">
									<input type="radio" name="layoutMods" id="radioMods_grid" value="grid" class="accent-emerald-500">
									<span>Grid</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Plugins page -->
					<div>
						<h4 class="text-xs font-semibold text-zinc-300 mb-2.5">Plugins page</h4>
						<div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md">
							<div onclick="window.selectLayout('plugins', 'rows')" id="layoutCard_plugins_rows" class="p-3 rounded-2xl border border-emerald-500 bg-emerald-500/5 transition cursor-pointer flex flex-col justify-between">
								<div class="h-16 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col justify-center gap-1.5 px-3 mb-2.5">
									<div class="h-2 bg-emerald-500 rounded-full w-full"></div>
									<div class="h-2 bg-emerald-500/60 rounded-full w-4/5"></div>
									<div class="h-2 bg-emerald-500/40 rounded-full w-3/4"></div>
								</div>
								<div class="flex items-center gap-2 text-xs font-bold text-emerald-400">
									<input type="radio" name="layoutPlugins" id="radioPlugins_rows" value="rows" checked class="accent-emerald-500">
									<span>Rows</span>
								</div>
							</div>
							<div onclick="window.selectLayout('plugins', 'grid')" id="layoutCard_plugins_grid" class="p-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition cursor-pointer flex flex-col justify-between">
								<div class="h-16 rounded-lg bg-zinc-950 border border-zinc-800 grid grid-cols-2 gap-1.5 p-2 mb-2.5">
									<div class="bg-zinc-800 rounded"></div>
									<div class="bg-zinc-800 rounded"></div>
									<div class="bg-zinc-800 rounded"></div>
									<div class="bg-zinc-800 rounded"></div>
								</div>
								<div class="flex items-center gap-2 text-xs font-medium text-zinc-400">
									<input type="radio" name="layoutPlugins" id="radioPlugins_grid" value="grid" class="accent-emerald-500">
									<span>Grid</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Section 2: Language -->
			<div id="sectionLanguage" class="hidden bg-[#09090b] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
				<div>
					<h2 class="text-base font-bold text-white">Language / Язык интерфейса</h2>
					<p class="text-xs text-zinc-400 mt-1">Select your preferred language. Changes apply immediately across the entire site.</p>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl select-none">
					<!-- Russian -->
					<div onclick="window.selectLanguage('ru')" id="langCard_ru" class="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition cursor-pointer flex items-center justify-between gap-4">
						<div class="flex items-center gap-3.5">
							<span class="text-2xl shrink-0">🇷🇺</span>
							<div>
								<div class="text-sm font-bold text-white flex items-center gap-2">
									<span>Русский</span>
									<span id="langBadge_ru" class="hidden px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Активен</span>
								</div>
								<div class="text-xs text-zinc-400 mt-0.5">Полный русский интерфейс</div>
							</div>
						</div>
						<input type="radio" name="appLang" id="radioLang_ru" value="ru" class="accent-emerald-500 w-4 h-4">
					</div>

					<!-- English -->
					<div onclick="window.selectLanguage('en')" id="langCard_en" class="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition cursor-pointer flex items-center justify-between gap-4">
						<div class="flex items-center gap-3.5">
							<span class="text-2xl shrink-0">🇬🇧</span>
							<div>
								<div class="text-sm font-bold text-white flex items-center gap-2">
									<span>English</span>
									<span id="langBadge_en" class="hidden px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Active</span>
								</div>
								<div class="text-xs text-zinc-400 mt-0.5">Standard English UI</div>
							</div>
						</div>
						<input type="radio" name="appLang" id="radioLang_en" value="en" class="accent-emerald-500 w-4 h-4">
					</div>
				</div>
			</div>

			<!-- Section 3: Account & Security -->
			<div id="sectionAccount" class="hidden bg-[#09090b] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
				${user ? `
				<!-- Profile details -->
				<div class="space-y-4">
					<div>
						<h2 class="text-base font-bold text-white">Profile details</h2>
						<p class="text-xs text-zinc-400 mt-0.5">Manage your public MacrosApp profile information.</p>
					</div>

					<form id="settingsProfileForm" onsubmit="window.handleSaveSettingsProfile(event)" class="space-y-4 text-xs max-w-lg">
						<div>
							<label for="settingsUsername" class="block font-semibold text-zinc-300 mb-1.5">Username</label>
							<input id="settingsUsername" type="text" value="${escapeHtml(user?.username || '')}" required class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500 transition">
						</div>
						<div>
							<label for="settingsBio" class="block font-semibold text-zinc-300 mb-1.5">Bio</label>
							<textarea id="settingsBio" rows="3" placeholder="Tell the community about yourself..." class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500 transition resize-none">${escapeHtml(user?.bio || '')}</textarea>
						</div>
						<div>
							<label for="settingsMcUsername" class="block font-semibold text-zinc-300 mb-1.5">Minecraft username</label>
							<input id="settingsMcUsername" type="text" placeholder="Your Minecraft Java IGN" value="${escapeHtml(user?.minecraft_username || '')}" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500 transition">
						</div>
						<div class="pt-1">
							<button type="submit" id="btnSaveSettingsProfile" class="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition active:scale-95 shadow-lg shadow-emerald-500/10 cursor-pointer">Save profile</button>
						</div>
					</form>
				</div>

				<!-- Change Password -->
				<div class="pt-8 border-t border-zinc-800/80 space-y-4">
					<div>
						<h2 class="text-base font-bold text-white">Password & Security</h2>
						<p class="text-xs text-zinc-400 mt-0.5">Change your account password. Must be at least 6 characters.</p>
					</div>

					<form id="settingsPasswordForm" onsubmit="window.handleSaveSettingsPassword(event)" class="space-y-4 text-xs max-w-lg">
						<div>
							<label for="settingsOldPassword" class="block font-semibold text-zinc-300 mb-1.5">Current password</label>
							<input id="settingsOldPassword" type="password" required placeholder="Enter current password" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500 transition">
						</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label for="settingsNewPassword" class="block font-semibold text-zinc-300 mb-1.5">New password</label>
								<input id="settingsNewPassword" type="password" required minlength="6" placeholder="Min. 6 characters" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500 transition">
							</div>
							<div>
								<label for="settingsConfirmPassword" class="block font-semibold text-zinc-300 mb-1.5">Confirm new password</label>
								<input id="settingsConfirmPassword" type="password" required minlength="6" placeholder="Repeat new password" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500 transition">
							</div>
						</div>
						<div class="pt-1">
							<button type="submit" id="btnSaveSettingsPassword" class="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition active:scale-95 border border-zinc-700 cursor-pointer">Update password</button>
						</div>
					</form>
				</div>

				<!-- Account Metadata -->
				<div class="pt-8 border-t border-zinc-800/80 space-y-4 select-none">
					<div>
						<h2 class="text-base font-bold text-white">Account Information</h2>
						<p class="text-xs text-zinc-400 mt-0.5">Identifiers and membership data.</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg text-xs">
						<div class="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
							<div>
								<div class="text-[11px] text-zinc-500 font-medium">USER ID</div>
								<div id="settingsUserIdText" class="font-mono text-zinc-200 mt-0.5 truncate max-w-[160px]">${escapeHtml(user?.id || '')}</div>
							</div>
							<button type="button" onclick="window.copyUserId('${escapeHtml(user?.id || '')}')" id="btnCopyUserId" class="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-semibold transition cursor-pointer">
								Copy ID
							</button>
						</div>

						<div class="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
							<div class="text-[11px] text-zinc-500 font-medium">EMAIL</div>
							<div class="text-zinc-200 mt-0.5 truncate">${escapeHtml(user?.email || 'Not provided')}</div>
						</div>
					</div>
				</div>

				<!-- Danger zone: Logout -->
				<div class="pt-8 border-t border-zinc-800/80 flex items-center justify-between gap-4">
					<div>
						<h3 class="text-xs sm:text-sm font-semibold text-red-400">Sign out</h3>
						<p class="text-xs text-zinc-400 mt-0.5">Log out of your account on this browser session.</p>
					</div>
					<button type="button" onclick="window.handleMenuLogout()" class="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition cursor-pointer">
						Log out
					</button>
				</div>
				` : `
				<div class="text-center py-12 space-y-4">
					<div class="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
					</div>
					<div class="space-y-1">
						<h3 class="text-base font-bold text-white">Sign in required</h3>
						<p class="text-xs text-zinc-400 max-w-sm mx-auto">Please sign in to your MacrosApp account to manage profile details, change your password, and view security settings.</p>
					</div>
					<a href="/auth/sign-in?redirect=/settings/account" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition shadow-lg shadow-emerald-500/10">
						Sign in to account
					</a>
				</div>
				`}
			</div>
		</section>
	</main>

	${renderNavbarUserScript()}

	<script>
	(function() {
		function showSettingsToast(msg, isError) {
			const toast = document.getElementById('settingsToast');
			if (!toast) return;
			toast.textContent = msg;
			toast.className = isError
				? 'px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/25 transition block'
				: 'px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 transition block';
			clearTimeout(window._toastTimeout);
			window._toastTimeout = setTimeout(() => {
				toast.className = 'hidden px-4 py-2 rounded-xl text-xs font-semibold';
			}, 3500);
		}

		window.selectTheme = function(theme) {
			if (typeof window.applyTheme === 'function') {
				window.applyTheme(theme);
			} else {
				localStorage.setItem('macros_theme', theme);
				document.documentElement.setAttribute('data-theme', theme);
			}
			['system', 'light', 'dark', 'oled'].forEach(t => {
				const card = document.getElementById('themeCard_' + t);
				const radio = document.getElementById('radioTheme_' + t);
				if (card) {
					if (t === theme) {
						card.className = 'theme-card p-3 rounded-2xl border border-emerald-500/80 bg-emerald-500/5 transition cursor-pointer flex flex-col justify-between';
						const span = card.querySelector('.flex.items-center span');
						if (span) span.className = 'font-bold text-emerald-400';
					} else {
						card.className = 'theme-card p-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition cursor-pointer flex flex-col justify-between';
						const span = card.querySelector('.flex.items-center span');
						if (span) span.className = '';
					}
				}
				if (radio) radio.checked = (t === theme);
			});
			showSettingsToast('Theme updated: ' + theme.toUpperCase());
		};

		window.handleToggleSyncTheme = function(checked) {
			localStorage.setItem('macros_sync_theme', checked ? '1' : '0');
			showSettingsToast(checked ? 'Theme sync enabled' : 'Theme sync disabled');
		};

		window.selectLayout = function(page, type) {
			localStorage.setItem('macros_layout_' + page, type);
			['rows', 'grid'].forEach(t => {
				const card = document.getElementById('layoutCard_' + page + '_' + t);
				if (card) {
					card.className = t === type
						? 'p-3 rounded-2xl border border-emerald-500 bg-emerald-500/5 transition cursor-pointer flex flex-col justify-between'
						: 'p-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition cursor-pointer flex flex-col justify-between';
					const span = card.querySelector('span');
					if (span) span.className = t === type ? 'font-bold text-emerald-400' : 'text-zinc-400';
				}
				const radio = document.getElementById('radio' + (page === 'mods' ? 'Mods_' : 'Plugins_') + t);
				if (radio) radio.checked = (t === type);
			});
			showSettingsToast(page.toUpperCase() + ' layout set to ' + type.toUpperCase());
		};

		window.selectLanguage = function(lang) {
			localStorage.setItem('macros_lang', lang);
			document.documentElement.lang = lang;
			['ru', 'en'].forEach(l => {
				const card = document.getElementById('langCard_' + l);
				const badge = document.getElementById('langBadge_' + l);
				const radio = document.getElementById('radioLang_' + l);
				if (card) {
					card.className = l === lang
						? 'p-4 rounded-2xl border border-emerald-500 bg-emerald-500/5 transition cursor-pointer flex items-center justify-between gap-4'
						: 'p-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition cursor-pointer flex items-center justify-between gap-4';
				}
				if (badge) badge.classList.toggle('hidden', l !== lang);
				if (radio) radio.checked = (l === lang);
			});
			if (typeof window.setAppLanguage === 'function') {
				window.setAppLanguage(lang);
			}
			showSettingsToast(lang === 'ru' ? 'Язык изменен на Русский' : 'Language changed to English');
		};

		window.switchSettingsTab = function(tab) {
			if (tab === 'profile') tab = 'account';
			const tabs = ['appearance', 'language', 'account'];
			if (!tabs.includes(tab)) tab = 'appearance';

			tabs.forEach(t => {
				const sec = document.getElementById('section' + t.charAt(0).toUpperCase() + t.slice(1));
				const btn = document.getElementById('navTab' + t.charAt(0).toUpperCase() + t.slice(1));
				if (sec) sec.classList.toggle('hidden', t !== tab);
				if (btn) {
					if (t === tab) {
						btn.className = 'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-left transition cursor-pointer';
						const svg = btn.querySelector('svg');
						if (svg) svg.className = 'w-4 h-4 text-emerald-400 shrink-0';
					} else {
						btn.className = 'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 text-left transition cursor-pointer';
						const svg = btn.querySelector('svg');
						if (svg) svg.className = 'w-4 h-4 text-zinc-500 shrink-0';
					}
				}
			});

			try {
				history.replaceState(null, '', '/settings/' + tab);
			} catch(e) {}
		};

		window.copyUserId = function(id) {
			if (!id) return;
			navigator.clipboard.writeText(id).then(() => {
				const btn = document.getElementById('btnCopyUserId');
				if (btn) {
					const oldText = btn.textContent;
					btn.textContent = 'Copied!';
					btn.className = 'px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold transition';
					setTimeout(() => {
						btn.textContent = oldText;
						btn.className = 'px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-semibold transition cursor-pointer';
					}, 2000);
				}
				showSettingsToast('User ID copied to clipboard');
			});
		};

		window.handleSaveSettingsProfile = async function(e) {
			if (e && e.preventDefault) e.preventDefault();
			const btn = document.getElementById('btnSaveSettingsProfile');
			if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }
			try {
				const username = document.getElementById('settingsUsername')?.value?.trim();
				const bio = document.getElementById('settingsBio')?.value?.trim();
				const mcUser = document.getElementById('settingsMcUsername')?.value?.trim();
				const res = await fetch('/api/v1/user/profile', {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ username, bio, minecraft_username: mcUser })
				});
				const data = await res.json();
				if (!res.ok) {
					showSettingsToast(data.error || 'Failed to update profile', true);
				} else {
					showSettingsToast('Profile updated successfully!');
				}
			} catch (err) {
				showSettingsToast(err.message || 'Error updating profile', true);
			} finally {
				if (btn) { btn.disabled = false; btn.textContent = 'Save profile'; }
			}
		};

		window.handleSaveSettingsPassword = async function(e) {
			if (e && e.preventDefault) e.preventDefault();
			const btn = document.getElementById('btnSaveSettingsPassword');
			const oldPassword = document.getElementById('settingsOldPassword')?.value;
			const newPassword = document.getElementById('settingsNewPassword')?.value;
			const confirmPassword = document.getElementById('settingsConfirmPassword')?.value;

			if (!oldPassword || !newPassword) {
				showSettingsToast('Please enter both current and new password', true);
				return;
			}
			if (newPassword !== confirmPassword) {
				showSettingsToast('New passwords do not match', true);
				return;
			}
			if (newPassword.length < 6) {
				showSettingsToast('New password must be at least 6 characters', true);
				return;
			}

			if (btn) { btn.disabled = true; btn.textContent = 'Updating...'; }
			try {
				const res = await fetch('/api/v1/user/profile', {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ password: newPassword, old_password: oldPassword })
				});
				const data = await res.json();
				if (!res.ok) {
					showSettingsToast(data.error || 'Failed to update password', true);
				} else {
					showSettingsToast('Password updated successfully!');
					document.getElementById('settingsPasswordForm')?.reset();
				}
			} catch (err) {
				showSettingsToast(err.message || 'Error updating password', true);
			} finally {
				if (btn) { btn.disabled = false; btn.textContent = 'Update password'; }
			}
		};

		// Initialize state from localStorage
		const savedTheme = localStorage.getItem('macros_theme') || 'oled';
		window.selectTheme(savedTheme);

		const savedModsLayout = localStorage.getItem('macros_layout_mods') || 'rows';
		window.selectLayout('mods', savedModsLayout);

		const savedPluginsLayout = localStorage.getItem('macros_layout_plugins') || 'rows';
		window.selectLayout('plugins', savedPluginsLayout);

		const savedLang = localStorage.getItem('macros_lang') || 'en';
		window.selectLanguage(savedLang);

		const initSection = '${activeSection}';
		window.switchSettingsTab(initSection);
	})();
	</script>
	${renderCreateProjectModalHtml()}
</body>
</html>`;
}

export function renderShareHtml(
	instance: any,
	version: any,
	inviteId: string,
	modsList: any[] = [],
	creator?: any
): string {
	const instanceName = instance?.name || 'Minecraft Сборка'
	const instanceIcon = instance?.icon_path || '/assets/logo.png'
	const gameVersion = version?.game_version || '1.20.1'
	const loader = version?.loader || 'Fabric'
	const loaderVersion = version?.loader_version || ''
	const creatorName = creator?.username || 'Пользователь MacrosApp'
	const creatorAvatar = creator?.avatar_url || '/assets/logo.png'
	const totalMods = modsList.length
	const customModsCount = modsList.filter((m) => m.is_custom).length
	const catalogModsCount = totalMods - customModsCount

	const modsJson = JSON.stringify(modsList).replace(/</g, '\\u003c')

	return `<!DOCTYPE html>
<html lang="ru" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${instanceName} — Сборка Minecraft | MacrosApp</title>
	<link rel="icon" type="image/png" href="/assets/favicon.png">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
	<script src="https://cdn.tailwindcss.com"></script>
	<script>
		tailwind.config = {
			darkMode: 'class',
			theme: {
				extend: {
					fontFamily: {
						sans: ['Inter', 'system-ui', 'sans-serif'],
						mono: ['JetBrains Mono', 'monospace'],
					}
				}
			}
		}
	</script>
	${THEME_HEAD_SCRIPT}
	<style>
		${OLED_SCROLLBAR_CSS}
		${THEME_CSS}
		
		body { 
			background-color: #050507; 
			color: var(--theme-text-primary, #f4f4f5); 
			font-family: 'Inter', sans-serif; 
			background-image: 
				radial-gradient(circle at 50% -10%, rgba(16, 185, 129, 0.18), transparent 50%),
				radial-gradient(circle at 100% 60%, rgba(16, 185, 129, 0.05), transparent 40%);
			background-attachment: fixed;
		}

		.glass-panel {
			background: rgba(18, 18, 22, 0.65);
			backdrop-filter: blur(20px);
			-webkit-backdrop-filter: blur(20px);
			border: 1px solid rgba(255, 255, 255, 0.08);
		}

		.glass-panel:hover {
			border-color: rgba(255, 255, 255, 0.14);
		}

		.mod-card {
			background: rgba(24, 24, 28, 0.45);
			border: 1px solid rgba(255, 255, 255, 0.06);
			transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		}

		.mod-card:hover {
			background: rgba(30, 30, 36, 0.7);
			border-color: rgba(16, 185, 129, 0.35);
			transform: translateY(-1px);
		}

		.emerald-glow-btn {
			background: #10b981;
			box-shadow: 0 0 24px rgba(16, 185, 129, 0.25);
			transition: all 0.2s ease;
		}

		.emerald-glow-btn:hover {
			background: #34d399;
			box-shadow: 0 0 32px rgba(16, 185, 129, 0.45);
			transform: translateY(-1px);
		}

		.emerald-glow-btn:active {
			transform: scale(0.98);
		}

		.line-clamp-2 {
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	</style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-200">

	<!-- Top Navigation -->
	<header class="sticky top-0 z-40 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
			<a href="/" class="flex items-center gap-3 group">
				<div class="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center p-1.5 transition group-hover:border-emerald-500/50">
					<img src="/assets/logo.png" alt="MacrosApp" class="w-full h-full object-contain">
				</div>
				<span class="font-bold text-base text-white tracking-tight group-hover:text-emerald-400 transition">MacrosApp</span>
			</a>

			<div class="flex items-center gap-3">
				<a href="/catalog" class="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition hidden sm:inline-block">Каталог</a>
				<a href="/download" class="text-xs font-semibold px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white hover:text-emerald-400 transition flex items-center gap-2">
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
					Скачать лаунчер
				</a>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
		
		<!-- Hero Instance Card -->
		<div class="glass-panel rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden">
			<div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

			<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
				<!-- Left: Icon & Meta -->
				<div class="flex items-start sm:items-center gap-5 sm:gap-6">
					<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zinc-900/90 border border-white/10 flex-shrink-0 flex items-center justify-center p-2.5 shadow-xl overflow-hidden">
						<img src="${instanceIcon}" alt="${instanceName}" class="w-full h-full object-cover rounded-xl" onerror="this.src='/assets/logo.png'">
					</div>

					<div>
						<div class="flex flex-wrap items-center gap-2 mb-2">
							<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold tracking-wide uppercase">
								Общая сборка
							</span>
							<span class="text-xs text-zinc-500">•</span>
							<div class="flex items-center gap-1.5 text-xs text-zinc-400">
								<img src="${creatorAvatar}" class="w-4 h-4 rounded-full object-cover" onerror="this.src='/assets/logo.png'">
								<span>Создатель: <strong class="text-zinc-200 font-medium">${creatorName}</strong></span>
							</div>
						</div>

						<h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
							${instanceName}
						</h1>

						<!-- Badges -->
						<div class="flex flex-wrap items-center gap-2 text-xs">
							<div class="px-3 py-1 rounded-xl bg-zinc-900/90 border border-white/10 text-emerald-400 font-mono flex items-center gap-1.5">
								<span class="w-2 h-2 rounded-full bg-emerald-400"></span>
								Minecraft ${gameVersion}
							</div>
							<div class="px-3 py-1 rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-300 capitalize flex items-center gap-1.5">
								<svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
								${loader} ${loaderVersion ? `<span class="text-zinc-500 font-mono text-[11px]">${loaderVersion}</span>` : ''}
							</div>
							<div class="px-3 py-1 rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-400">
								📦 <strong>${totalMods}</strong> ${totalMods === 1 ? 'мод' : totalMods < 5 ? 'мода' : 'модов'}
							</div>
						</div>
					</div>
				</div>

				<!-- Right: Actions -->
				<div class="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px] flex-shrink-0">
					<button id="openLauncherBtn" onclick="openInLauncher('${inviteId}')" class="emerald-glow-btn w-full py-4 px-6 rounded-2xl text-black font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg">
						<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
						<span>Открыть в MacrosApp</span>
					</button>

					<button id="copyLinkBtn" onclick="copyInviteLink()" class="w-full py-3 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition active:scale-[0.98]">
						<svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
						<span id="copyLinkText">Скопировать ссылку</span>
					</button>
				</div>
			</div>

			<!-- Notice banner -->
			<div class="mt-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-zinc-400">
				<div class="flex items-center gap-2">
					<svg class="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
					<span>Для запуска требуется установленный лаунчер <strong>MacrosApp</strong>. Нажмите кнопку выше для мгновенного импорта.</span>
				</div>
				<a href="/download" class="text-emerald-400 hover:text-emerald-300 font-medium whitespace-nowrap transition flex items-center gap-1">
					Скачать бесплатно &rarr;
				</a>
			</div>
		</div>

		<!-- How to Play Quick Steps -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
			<div class="glass-panel rounded-2xl p-5 border border-white/5 flex items-start gap-4">
				<div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
					1
				</div>
				<div>
					<h3 class="text-sm font-semibold text-white mb-1">Установите MacrosApp</h3>
					<p class="text-xs text-zinc-400 leading-relaxed">Скачайте и запустите официальный лаунчер с нашего сайта.</p>
				</div>
			</div>

			<div class="glass-panel rounded-2xl p-5 border border-white/5 flex items-start gap-4">
				<div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
					2
				</div>
				<div>
					<h3 class="text-sm font-semibold text-white mb-1">Нажмите «Открыть»</h3>
					<p class="text-xs text-zinc-400 leading-relaxed">Кнопка в карточке выше передаст команду напрямую в лаунчер.</p>
				</div>
			</div>

			<div class="glass-panel rounded-2xl p-5 border border-white/5 flex items-start gap-4">
				<div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
					3
				</div>
				<div>
					<h3 class="text-sm font-semibold text-white mb-1">Играйте с друзьями</h3>
					<p class="text-xs text-zinc-400 leading-relaxed">Лаунчер сам загрузит моды и конфиги и синхронизирует обновления!</p>
				</div>
			</div>
		</div>

		<!-- Mods Section -->
		<div class="mb-12">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<div class="flex items-center gap-3">
					<h2 class="text-xl font-bold text-white tracking-tight">Содержимое сборки</h2>
					<span class="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400" id="modCountBadge">
						${totalMods}
					</span>
					${
						customModsCount > 0
							? `<span class="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px]">
								${customModsCount} кастомных
							</span>`
							: ''
					}
				</div>

				<div class="relative w-full sm:w-72">
					<svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
					<input 
						type="text" 
						id="modSearchInput" 
						oninput="filterMods(this.value)" 
						placeholder="Поиск мода по названию..." 
						class="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
					>
				</div>
			</div>

			<!-- Mods Grid -->
			<div id="modsGrid" class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
				${
					modsList.length > 0
						? modsList
								.map(
									(mod) => `
					<div class="mod-card rounded-2xl p-4 flex items-start gap-3.5 group relative" data-title="${encodeURIComponent((mod.title || '').toLowerCase())}" data-desc="${encodeURIComponent((mod.description || '').toLowerCase())}">
						<div class="w-12 h-12 rounded-xl bg-zinc-900/90 border border-white/10 flex-shrink-0 flex items-center justify-center p-1.5 overflow-hidden">
							<img src="${mod.icon_url || '/assets/logo.png'}" alt="${mod.title}" class="w-full h-full object-contain rounded-lg" onerror="this.src='/assets/logo.png'">
						</div>

						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between gap-2 mb-1">
								<h4 class="font-bold text-sm text-zinc-100 group-hover:text-emerald-400 transition truncate">
									${mod.title}
								</h4>
								${
									mod.is_custom
										? `<span class="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-medium whitespace-nowrap flex-shrink-0">
											Кастомный
										</span>`
										: `<span class="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium whitespace-nowrap flex-shrink-0">
											Каталог
										</span>`
								}
							</div>

							<p class="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
								${mod.description || 'Модификация для оптимизации и улучшения игрового процесса.'}
							</p>

							${
								mod.version_name
									? `<div class="mt-2 text-[11px] font-mono text-zinc-500 truncate">
										Версия: ${mod.version_name}
									</div>`
									: ''
							}
						</div>
					</div>`
								)
								.join('')
						: `<div class="col-span-full py-12 text-center text-zinc-500 text-xs bg-zinc-900/30 rounded-2xl border border-white/5">
							В этой сборке пока нет модов
						</div>`
				}
			</div>

			<!-- Empty Search State -->
			<div id="noModsFound" class="hidden py-16 text-center bg-zinc-900/30 rounded-2xl border border-white/5">
				<p class="text-sm font-semibold text-zinc-300 mb-1">Ничего не найдено</p>
				<p class="text-xs text-zinc-500">Попробуйте изменить поисковый запрос</p>
			</div>
		</div>

	</main>

	<!-- Footer -->
	<footer class="border-t border-white/5 py-8 bg-black/40 text-center text-xs text-zinc-600">
		<div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
			<div class="flex items-center gap-2">
				<img src="/assets/logo.png" class="w-4 h-4 object-contain opacity-70">
				<span>© 2026 MacrosApp. Все права защищены.</span>
			</div>
			<div class="flex items-center gap-4 text-zinc-500">
				<a href="/catalog" class="hover:text-zinc-300 transition">Каталог</a>
				<a href="/download" class="hover:text-zinc-300 transition">Лаунчер</a>
				<a href="https://github.com/nnnegrvpeni-lang/MacrosApp" target="_blank" class="hover:text-zinc-300 transition">GitHub</a>
			</div>
		</div>
	</footer>

	<!-- Client Script -->
	<script>
		const modsData = ${modsJson};

		function openInLauncher(inviteId) {
			const btn = document.getElementById('openLauncherBtn');
			if (btn) {
				btn.innerHTML = \`<svg class="w-5 h-5 animate-spin text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> <span>Запуск лаунчера...</span>\`;
			}

			// Try macros://share/ first (supported by current and new launchers)
			window.location.href = 'macros://share/' + inviteId;

			setTimeout(() => {
				if (btn) {
					btn.innerHTML = \`<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> <span>Открыть в MacrosApp</span>\`;
				}
			}, 3000);
		}

		async function copyInviteLink() {
			const btnText = document.getElementById('copyLinkText');
			try {
				await navigator.clipboard.writeText(window.location.href);
				if (btnText) {
					const old = btnText.textContent;
					btnText.textContent = 'Ссылка скопирована!';
					setTimeout(() => { btnText.textContent = old; }, 2500);
				}
			} catch (err) {
				prompt('Скопируйте ссылку вручную:', window.location.href);
			}
		}

		function filterMods(query) {
			const q = query.trim().toLowerCase();
			const cards = document.querySelectorAll('.mod-card');
			let visibleCount = 0;

			cards.forEach((card) => {
				const title = decodeURIComponent(card.getAttribute('data-title') || '');
				const desc = decodeURIComponent(card.getAttribute('data-desc') || '');
				if (!q || title.includes(q) || desc.includes(q)) {
					card.style.display = 'flex';
					visibleCount++;
				} else {
					card.style.display = 'none';
				}
			});

			const noMods = document.getElementById('noModsFound');
			if (noMods) {
				noMods.classList.toggle('hidden', visibleCount > 0);
			}

			const badge = document.getElementById('modCountBadge');
			if (badge) {
				badge.textContent = visibleCount;
			}
		}
	</script>
</body>
</html>`
}

export function renderDownloadHtml(user?: any): string {
	return `<!DOCTYPE html>
<html lang="ru" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Download MacrosApp | Official Launcher</title>
	<link rel="icon" type="image/png" href="/assets/favicon.png">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
	<script src="https://cdn.tailwindcss.com"></script>
	<script>
		tailwind.config = {
			darkMode: 'class',
			theme: {
				extend: {
					colors: {
						oled: '#000000',
						card: '#09090b',
						border: 'rgba(255, 255, 255, 0.08)',
						'border-hover': 'rgba(255, 255, 255, 0.16)'
					},
					fontFamily: {
						sans: ['Inter', 'system-ui', 'sans-serif'],
					}
				}
			}
		}
	</script>
	${THEME_HEAD_SCRIPT}
	<style>
		${OLED_SCROLLBAR_CSS}
		${THEME_CSS}
		
		body { background-color: var(--theme-bg-page, #000000); color: var(--theme-text-primary, #f4f4f5); }
		.oled-card {
			background: #09090b;
			border: 1px solid rgba(255, 255, 255, 0.08);
			transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		}
		.oled-card:hover {
			border-color: rgba(255, 255, 255, 0.18);
			transform: translateY(-2px);
		}
	</style>
</head>
<body class="min-h-screen flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
	<!-- Navbar -->
	<header class="border-b border-[rgba(255,255,255,0.08)] sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-xl">
		<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
			<div class="flex items-center gap-8">
				<a href="/" class="flex items-center gap-2.5 group shrink-0">
					<img src="/assets/logo.png" alt="MacrosApp" class="w-8 h-8 rounded-lg object-contain group-hover:scale-105 transition-transform">
					<span class="text-base font-bold tracking-tight text-white">MacrosApp</span>
				</a>

				<nav class="hidden md:flex items-center gap-6 text-sm text-zinc-400">
					<a href="/catalog" data-i18n="nav.catalog" class="hover:text-white transition">Discover</a>
					<a href="/#features" data-i18n="nav.features" class="hover:text-white transition">Features</a>
					<a href="/download" data-i18n="nav.download" class="text-white font-semibold transition">Download</a>
					<a href="https://github.com/nnnegrvpeni-lang/MacrosApp" target="_blank" data-i18n="nav.github" class="hover:text-white transition flex items-center gap-1.5">
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
						GitHub
					</a>
				</nav>
			</div>

			<div id="navUserSlot" class="flex items-center gap-3 shrink-0">
				${renderNavbarUserHtml(user)}
			</div>
		</div>
	</header>

	<!-- Download Content -->
	<main class="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
		<div class="w-full max-w-md flex flex-col items-center">
			<img src="/assets/logo.png" alt="MacrosApp" class="w-20 h-20 rounded-2xl mb-6 select-none">

			<h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
				MacrosApp
			</h1>

			<p data-i18n="download.subtitle" class="text-sm text-zinc-400 mb-8">
				Autonomous Minecraft launcher for Windows
			</p>

			<div class="w-full flex flex-col gap-3">
				<a href="/downloads/Macros_1.2.6_x64-setup.exe" class="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition flex items-center justify-center gap-2.5 active:scale-[0.98] shadow-lg shadow-emerald-500/10">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
					<span data-i18n="download.installer">Download for Windows (.exe)</span>
				</a>

				<a href="/downloads/Macros.exe" class="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium text-xs transition flex items-center justify-center gap-2 active:scale-[0.98]">
					<svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
					<span data-i18n="download.portable">Portable version (no installation)</span>
				</a>
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-[rgba(255,255,255,0.08)] py-8 text-center text-xs text-zinc-500">
		<div class="max-w-6xl mx-auto px-6 flex items-center justify-between">
			<span>MacrosApp &copy; 2026</span>
			<a href="/" data-i18n="download.back_home" class="hover:text-zinc-300 transition">Back to home</a>
		</div>
	</footer>

	${renderNavbarUserScript()}
	${renderCreateProjectModalHtml()}
</body>
</html>`
}

export function renderCatalogHtml(user?: any): string {
	return `<!DOCTYPE html>
<html lang="ru" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title data-i18n="catalog.title">Discover content | MacrosApp</title>
	<link rel="icon" type="image/png" href="/assets/favicon.png">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
	<script src="https://cdn.tailwindcss.com"></script>
	<script>
		tailwind.config = {
			darkMode: 'class',
			theme: {
				extend: {
					fontFamily: {
						sans: ['Inter', 'system-ui', 'sans-serif'],
					}
				}
			}
		}
	</script>
	${THEME_HEAD_SCRIPT}
	<style>
		${OLED_SCROLLBAR_CSS}
		${THEME_CSS}

		body { background-color: var(--theme-bg-page, #000000); color: var(--theme-text-primary, #f4f4f5); font-family: 'Inter', sans-serif; }
		.oled-card {
			background: #09090b;
			border: 1px solid rgba(255, 255, 255, 0.08);
			transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		}
		.oled-card:hover {
			border-color: rgba(255, 255, 255, 0.16);
		}
		.provider-badge-modrinth {
			background: rgba(16, 185, 129, 0.12);
			color: #10b981;
			border: 1px solid rgba(16, 185, 129, 0.3);
		}
		.provider-badge-curseforge {
			background: rgba(241, 100, 54, 0.12);
			color: #f16436;
			border: 1px solid rgba(241, 100, 54, 0.3);
		}
		.prose-desc h1 { font-size: 1.35rem; font-weight: 700; color: #ffffff; margin-top: 1.25rem; margin-bottom: 0.5rem; }
		.prose-desc h2 { font-size: 1.2rem; font-weight: 700; color: #ffffff; margin-top: 1rem; margin-bottom: 0.4rem; }
		.prose-desc h3 { font-size: 1.05rem; font-weight: 600; color: #ffffff; margin-top: 0.85rem; margin-bottom: 0.35rem; }
		.prose-desc p { margin-top: 0.5rem; margin-bottom: 0.5rem; line-height: 1.65; color: #d4d4d8; }
		.prose-desc a { color: #10b981; text-decoration: underline; text-underline-offset: 2px; }
		.prose-desc a:hover { color: #34d399; }
		.prose-desc ul, .prose-desc ol { margin-left: 1.25rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
		.prose-desc li { margin-bottom: 0.25rem; }
		.prose-desc img { max-width: 100%; border-radius: 0.75rem; margin: 0.75rem 0; }
		.prose-desc pre { background: #0c0c0e; border: 1px solid #27272a; padding: 0.75rem; border-radius: 0.75rem; overflow-x: auto; margin: 0.75rem 0; }
		.prose-desc code { font-family: monospace; font-size: 0.85em; background: #18181b; padding: 0.15rem 0.35rem; border-radius: 0.35rem; color: #10b981; }
		.prose-desc pre code { background: transparent; padding: 0; color: #e4e4e7; }
		.prose-desc blockquote { border-left: 3px solid #10b981; padding-left: 0.75rem; color: #a1a1aa; font-style: italic; margin: 0.75rem 0; }
	</style>
</head>
<body class="min-h-screen flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
	<!-- Top Bar -->
	<header class="border-b border-zinc-900 sticky top-0 z-40 bg-[#000000]/80 backdrop-blur-xl">
		<div class="max-w-[1440px] mx-auto px-6 sm:px-8 h-16 flex items-center justify-between gap-6">
			<div class="flex items-center gap-8">
				<a href="/" class="flex items-center gap-2.5 group shrink-0">
					<img src="/assets/logo.png" alt="MacrosApp" class="w-8 h-8 rounded-lg object-contain group-hover:scale-105 transition-transform">
					<span class="text-base font-bold tracking-tight text-white">MacrosApp</span>
				</a>

				<nav class="hidden md:flex items-center gap-6 text-sm text-zinc-400">
					<a href="/catalog" data-i18n="nav.catalog" class="text-white font-semibold transition">Discover</a>
					<a href="/#features" data-i18n="nav.features" class="hover:text-white transition">Features</a>
					<a href="/download" data-i18n="nav.download" class="hover:text-white transition">Download</a>
					<a href="https://github.com/nnnegrvpeni-lang/MacrosApp" target="_blank" data-i18n="nav.github" class="hover:text-white transition flex items-center gap-1.5">GitHub</a>
				</nav>
			</div>

			<div id="navUserSlot" class="flex items-center gap-3 shrink-0">
				${renderNavbarUserHtml(user)}
			</div>
		</div>
	</header>

	<!-- Main Catalog Page Content -->
	<main class="flex-1 max-w-[1440px] mx-auto px-6 sm:px-8 py-8 w-full flex flex-col gap-6">
		<!-- Subheader: Dual Provider Switcher & Category Pills -->
		<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
			<!-- Dual Provider Switcher -->
			<div class="flex items-center gap-2 p-1 rounded-2xl bg-zinc-950 border border-zinc-800/80 w-fit select-none">
				<button type="button" id="btnProviderModrinth" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 provider-badge-modrinth shadow-sm cursor-pointer">
					<svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12.252 0c-.39 0-.77.16-1.047.44L3.655 7.99a1.47 1.47 0 00-.43 1.05v9.48a1.47 1.47 0 001.47 1.47h14.61a1.47 1.47 0 001.47-1.47V9.04c0-.39-.16-.77-.44-1.05l-7.55-7.55A1.48 1.48 0 0012.252 0zm-.01 3.52l6.23 6.23h-4.23a2 2 0 01-2-2V3.52z"/></svg>
					<span data-i18n="catalog.provider.modrinth">Modrinth</span>
				</button>
				<button type="button" id="btnProviderCurseforge" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 text-zinc-400 hover:text-zinc-200 cursor-pointer">
					<svg class="w-3.5 h-3.5 text-[#f16436]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.87 2.05l-4.52 4.02h7.32l-3.32 3.12h4.52l-9.15 8.16 2.31-6.14H8.71l3.32-3.12H4.71l9.15-8.16-2.31 6.14h4.32l3-4.02z"/></svg>
					<span data-i18n="catalog.provider.curseforge">CurseForge</span>
				</button>
			</div>

			<!-- Category Pills (matching Modrinth media_1789238281400.png) -->
			<div class="flex flex-wrap items-center gap-2 select-none" id="categoryPills">
				<button type="button" data-category="mods" class="cat-pill px-5 py-2 rounded-full text-sm font-semibold bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 transition cursor-pointer">
					<span data-i18n="catalog.category.mods">Mods</span>
				</button>
				<button type="button" data-category="resourcepacks" class="cat-pill px-5 py-2 rounded-full text-sm font-medium bg-[#141418] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer">
					<span data-i18n="catalog.category.resourcepacks">Resource Packs</span>
				</button>
				<button type="button" data-category="datapacks" class="cat-pill px-5 py-2 rounded-full text-sm font-medium bg-[#141418] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer">
					<span data-i18n="catalog.category.datapacks">Data Packs</span>
				</button>
				<button type="button" data-category="shaders" class="cat-pill px-5 py-2 rounded-full text-sm font-medium bg-[#141418] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer">
					<span data-i18n="catalog.category.shaders">Shaders</span>
				</button>
				<button type="button" data-category="modpacks" class="cat-pill px-5 py-2 rounded-full text-sm font-medium bg-[#141418] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer">
					<span data-i18n="catalog.category.modpacks">Modpacks</span>
				</button>
			</div>
		</div>

		<!-- Layout: Filters Sidebar + Results List -->
		<div class="flex flex-col md:flex-row items-start gap-8">
			<!-- Left Filter Sidebar (w-72 to w-80, comfortable spacious layout) -->
			<aside class="w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-4 select-none">
				<!-- Game Version Section -->
				<div class="oled-card p-5 rounded-2xl flex flex-col gap-3.5">
					<button type="button" id="toggleVersionSec" class="w-full flex items-center justify-between text-sm font-bold text-white text-left focus:outline-none cursor-pointer">
						<span data-i18n="catalog.sidebar.game_version">Game version</span>
						<svg id="chevronVersion" class="w-4 h-4 text-zinc-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
					</button>
					<div id="versionSecBody" class="flex flex-col gap-3">
						<input type="text" id="versionSearchInput" data-i18n-placeholder="catalog.search.version_search" placeholder="Filter versions..." class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition">
						<div id="versionList" class="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
							<!-- Dynamically populated version items -->
						</div>
					</div>
				</div>

				<!-- Loader Section (clean monochrome gray, NO colored dots!) -->
				<div class="oled-card p-5 rounded-2xl flex flex-col gap-3.5">
					<button type="button" id="toggleLoaderSec" class="w-full flex items-center justify-between text-sm font-bold text-white text-left focus:outline-none cursor-pointer">
						<span data-i18n="catalog.sidebar.loader">Loader</span>
						<svg id="chevronLoader" class="w-4 h-4 text-zinc-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
					</button>
					<div id="loaderSecBody" class="flex flex-col gap-1 text-sm">
						<button type="button" data-loader="" class="loader-filter-btn w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between bg-zinc-800 text-white border border-zinc-700/60 cursor-pointer">
							<span data-i18n="catalog.filter.any_loader">Any loader</span>
							<span class="loader-check text-emerald-400 font-bold">✓</span>
						</button>
						<button type="button" data-loader="fabric" class="loader-filter-btn group w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between text-zinc-300 hover:text-white hover:bg-zinc-850/70 cursor-pointer">
							<div class="flex items-center gap-2.5">
								<svg class="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>
								<span>Fabric</span>
							</div>
							<span class="loader-check text-emerald-400 font-bold hidden">✓</span>
						</button>
						<button type="button" data-loader="forge" class="loader-filter-btn group w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between text-zinc-300 hover:text-white hover:bg-zinc-850/70 cursor-pointer">
							<div class="flex items-center gap-2.5">
								<svg class="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 5h12l-2 4H8L6 5zM8 9v6l-3 4h14l-3-4V9"/></svg>
								<span>Forge</span>
							</div>
							<span class="loader-check text-emerald-400 font-bold hidden">✓</span>
						</button>
						<button type="button" data-loader="neoforge" class="loader-filter-btn group w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between text-zinc-300 hover:text-white hover:bg-zinc-850/70 cursor-pointer">
							<div class="flex items-center gap-2.5">
								<svg class="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15 8 21 9 17 14 18 20 12 17 6 20 7 14 3 9 9 8 12 2"/></svg>
								<span>NeoForge</span>
							</div>
							<span class="loader-check text-emerald-400 font-bold hidden">✓</span>
						</button>
						<button type="button" data-loader="quilt" class="loader-filter-btn group w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between text-zinc-300 hover:text-white hover:bg-zinc-850/70 cursor-pointer">
							<div class="flex items-center gap-2.5">
								<svg class="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
								<span>Quilt</span>
							</div>
							<span class="loader-check text-emerald-400 font-bold hidden">✓</span>
						</button>
					</div>
				</div>

				<!-- Category Section (clean monochrome gray, matching Modrinth) -->
				<div class="oled-card p-5 rounded-2xl flex flex-col gap-3.5">
					<button type="button" id="toggleCategorySec" class="w-full flex items-center justify-between text-sm font-bold text-white text-left focus:outline-none cursor-pointer">
						<span data-i18n="catalog.sidebar.category">Category</span>
						<svg id="chevronCategory" class="w-4 h-4 text-zinc-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
					</button>
					<div id="categorySecBody" class="flex flex-col gap-1 text-sm">
						<button type="button" data-tag="" class="tag-filter-btn w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between bg-zinc-800 text-white border border-zinc-700/60 cursor-pointer">
							<div class="flex items-center gap-2.5">
								<svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
								<span data-i18n="catalog.filter.any_category">Any category</span>
							</div>
							<span class="tag-check text-emerald-400 font-bold">✓</span>
						</button>
						<button type="button" data-tag="optimization" class="tag-filter-btn group w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between text-zinc-300 hover:text-white hover:bg-zinc-850/70 cursor-pointer">
							<div class="flex items-center gap-2.5">
								<svg class="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
								<span>Optimization</span>
							</div>
							<span class="tag-check text-emerald-400 font-bold hidden">✓</span>
						</button>
						<button type="button" data-tag="adventure" class="tag-filter-btn group w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between text-zinc-300 hover:text-white hover:bg-zinc-850/70 cursor-pointer">
							<div class="flex items-center gap-2.5">
								<svg class="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
								<span>Adventure</span>
							</div>
							<span class="tag-check text-emerald-400 font-bold hidden">✓</span>
						</button>
						<button type="button" data-tag="technology" class="tag-filter-btn group w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between text-zinc-300 hover:text-white hover:bg-zinc-850/70 cursor-pointer">
							<div class="flex items-center gap-2.5">
								<svg class="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>
								<span>Technology</span>
							</div>
							<span class="tag-check text-emerald-400 font-bold hidden">✓</span>
						</button>
						<button type="button" data-tag="magic" class="tag-filter-btn group w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between text-zinc-300 hover:text-white hover:bg-zinc-850/70 cursor-pointer">
							<div class="flex items-center gap-2.5">
								<svg class="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2"></path><path d="M15 16v-2"></path><path d="M8 9h2"></path><path d="M20 9h2"></path><path d="M17.8 11.8 19 13"></path><path d="M15 9h0"></path><path d="M17.8 6.2 19 5"></path><path d="m3 21 9-9"></path><path d="M12.2 6.2 11 5"></path></svg>
								<span>Magic</span>
							</div>
							<span class="tag-check text-emerald-400 font-bold hidden">✓</span>
						</button>
						<button type="button" data-tag="decoration" class="tag-filter-btn group w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between text-zinc-300 hover:text-white hover:bg-zinc-850/70 cursor-pointer">
							<div class="flex items-center gap-2.5">
								<svg class="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
								<span>Decoration</span>
							</div>
							<span class="tag-check text-emerald-400 font-bold hidden">✓</span>
						</button>
						<button type="button" data-tag="utility" class="tag-filter-btn group w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between text-zinc-300 hover:text-white hover:bg-zinc-850/70 cursor-pointer">
							<div class="flex items-center gap-2.5">
								<svg class="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
								<span>Utility</span>
							</div>
							<span class="tag-check text-emerald-400 font-bold hidden">✓</span>
						</button>
						<button type="button" data-tag="library" class="tag-filter-btn group w-full px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between text-zinc-300 hover:text-white hover:bg-zinc-850/70 cursor-pointer">
							<div class="flex items-center gap-2.5">
								<svg class="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
								<span>Library</span>
							</div>
							<span class="tag-check text-emerald-400 font-bold hidden">✓</span>
						</button>
					</div>
				</div>

				<!-- Reset Filters -->
				<button type="button" id="btnResetFilters" class="w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-sm font-medium transition active:scale-95 cursor-pointer">
					Reset filters
				</button>
			</aside>

			<!-- Right Main Results Feed -->
			<section class="flex-1 w-full flex flex-col gap-4">
				<!-- Search and Sort Top Controls (matching Modrinth media_1789238281400.png) -->
				<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
					<div class="relative flex-1">
						<svg class="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
						<input type="text" id="catalogSearchInput" data-i18n-placeholder="catalog.search.placeholder" placeholder="Search mods, resource packs, shaders..." class="w-full pl-11 pr-10 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition">
						<button type="button" id="catalogSearchClear" class="hidden absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-sm font-bold cursor-pointer">✕</button>
					</div>

					<!-- Custom Dark OLED Sort Dropdown -->
					<div class="relative inline-block text-left" id="sortMenuContainer">
						<button type="button" id="sortMenuBtn" class="flex items-center gap-2.5 px-4 h-12 rounded-2xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-sm font-medium text-zinc-300 transition active:scale-95 select-none shrink-0 cursor-pointer">
							<span class="text-zinc-500" data-i18n="catalog.sort.label">Sort by:</span>
							<span id="sortMenuCurrent" class="text-white font-semibold">Relevance</span>
							<svg id="sortMenuChevron" class="w-4 h-4 text-zinc-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
						</button>
						<div id="sortMenuDropdown" class="hidden absolute right-0 mt-2 w-52 rounded-2xl bg-[#09090b]/95 backdrop-blur-2xl border border-zinc-800 shadow-2xl p-1.5 z-40 animate-fade-up select-none">
							<button type="button" data-sort="relevance" class="sort-option w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm hover:bg-zinc-800 text-left transition font-medium text-white cursor-pointer">
								<span data-i18n="catalog.sort.relevance">Relevance</span>
								<span class="sort-check text-emerald-400 font-bold text-sm">✓</span>
							</button>
							<button type="button" data-sort="downloads" class="sort-option w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm hover:bg-zinc-800 text-left transition font-medium text-zinc-300 cursor-pointer">
								<span data-i18n="catalog.sort.downloads">Downloads</span>
								<span class="sort-check text-emerald-400 font-bold text-sm hidden">✓</span>
							</button>
							<button type="button" data-sort="updated" class="sort-option w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm hover:bg-zinc-800 text-left transition font-medium text-zinc-300 cursor-pointer">
								<span data-i18n="catalog.sort.updated">Recently updated</span>
								<span class="sort-check text-emerald-400 font-bold text-sm hidden">✓</span>
							</button>
							<button type="button" data-sort="newest" class="sort-option w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm hover:bg-zinc-800 text-left transition font-medium text-zinc-300 cursor-pointer">
								<span data-i18n="catalog.sort.newest">Newest</span>
								<span class="sort-check text-emerald-400 font-bold text-sm hidden">✓</span>
							</button>
						</div>
					</div>
				</div>

				<!-- Active filters summary / result count & Layout Toggle -->
				<div class="flex items-center justify-between text-sm text-zinc-400 px-1 select-none">
					<span id="resultsCountLabel" class="font-medium">Loading...</span>
					<div class="flex items-center gap-3">
						<div class="flex items-center p-0.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
							<button type="button" onclick="window.setCatalogLayout('rows')" id="btnCatalogLayoutRows" title="Rows view" class="p-1.5 rounded-lg text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 transition cursor-pointer">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
							</button>
							<button type="button" onclick="window.setCatalogLayout('grid')" id="btnCatalogLayoutGrid" title="Grid view" class="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition cursor-pointer">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
							</button>
						</div>
						<span id="activeProviderTag" class="px-3 py-1 rounded-full text-xs font-semibold provider-badge-modrinth">Modrinth</span>
					</div>
				</div>

				<!-- Results Container -->
				<div id="resultsContainer" class="flex flex-col gap-3.5 min-h-[400px]">
					<div class="text-center py-20 text-zinc-500 text-sm flex flex-col items-center gap-3">
						<svg class="w-7 h-7 animate-spin text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path></svg>
						<span data-i18n="catalog.loading">Loading catalog...</span>
					</div>
				</div>

				<!-- Pagination Controls -->
				<div id="paginationControls" class="hidden flex items-center justify-between py-5 border-t border-zinc-900 mt-2 select-none">
					<button type="button" id="btnPrevPage" class="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-semibold text-zinc-300 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer">
						&larr; Previous
					</button>
					<span id="pageIndicator" class="text-sm text-zinc-400 font-mono">Page 1</span>
					<button type="button" id="btnNextPage" class="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-semibold text-zinc-300 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer">
						Next &rarr;
					</button>
				</div>
			</section>
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-zinc-900 py-8 text-center text-xs text-zinc-500">
		<div class="max-w-[1440px] mx-auto px-6 sm:px-8 flex items-center justify-between">
			<span>MacrosApp &copy; 2026</span>
			<a href="/" data-i18n="download.back_home" class="hover:text-zinc-300 transition">Back to home</a>
		</div>
	</footer>

	<!-- Full Project Details Modal (Authentic Modrinth / CurseForge project page) -->
	<div id="modModal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
		<div class="relative w-full max-w-4xl bg-[#09090b] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
			<!-- Modal Header with Mod Info -->
			<div class="p-6 sm:p-7 border-b border-zinc-800/80 bg-zinc-950/60 flex flex-col sm:flex-row items-start justify-between gap-6">
				<div class="flex items-start gap-4 sm:gap-5 min-w-0 flex-1">
					<div id="modalIconContainer" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden shadow-xl">
						<img id="modalIcon" src="/assets/logo.png" alt="" class="w-full h-full object-cover">
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-2.5">
							<h2 id="modalTitle" class="text-xl sm:text-2xl font-bold text-white truncate">Mod Title</h2>
							<span id="modalProviderBadge" class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold provider-badge-modrinth">Modrinth</span>
						</div>
						<p id="modalAuthor" class="text-xs text-zinc-400 mt-1 font-medium">by Author</p>
						<p id="modalSummary" class="text-xs text-zinc-300 mt-2 leading-relaxed line-clamp-2">Summary description</p>

						<!-- Stats bar inside modal -->
						<div id="modalStats" class="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-medium mt-3 select-none">
							<span class="flex items-center gap-1.5">
								<svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
								<span id="modalDownloads">0</span>
							</span>
							<span class="flex items-center gap-1.5">
								<svg class="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
								<span id="modalFollows">0</span>
							</span>
							<span class="flex items-center gap-1.5 text-zinc-500">
								<svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
								<span id="modalUpdated">Recently</span>
							</span>
						</div>
					</div>
				</div>

				<!-- CTAs & Close Button -->
				<div class="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
					<a id="modalDownloadBtn" href="#" target="_blank" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/15 active:scale-95">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
						<span data-i18n="catalog.modal.download_latest">Download</span>
					</a>
					<a id="modalLauncherBtn" href="#" class="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 hover:text-white font-medium text-xs transition flex items-center gap-2 active:scale-95">
						<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
						<span data-i18n="catalog.modal.install_launcher">In Launcher</span>
					</a>
					<button type="button" id="modalCloseBtn" class="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition" title="Close (Esc)">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
					</button>
				</div>
			</div>

			<!-- Modal Tab Navigation -->
			<div class="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-zinc-900 bg-zinc-950/40 select-none">
				<button type="button" id="modalTabDescBtn" class="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 transition">
					<span data-i18n="catalog.modal.tab_description">Description</span>
				</button>
				<button type="button" id="modalTabVersionsBtn" class="px-4 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition flex items-center gap-1.5">
					<span data-i18n="catalog.modal.tab_versions">Versions</span>
					<span id="modalVersionsCount" class="px-1.5 py-0.2 rounded-md bg-zinc-800 text-[10px] text-zinc-400">0</span>
				</button>
				<button type="button" id="modalTabGalleryBtn" class="hidden px-4 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition">
					<span data-i18n="catalog.modal.tab_gallery">Gallery</span>
				</button>
			</div>

			<!-- Modal Content Panes -->
			<div class="flex-1 overflow-y-auto p-6 sm:p-8" id="modalContentContainer">
				<!-- Tab 1: Description Pane -->
				<div id="modalTabDesc" class="prose-desc max-w-none text-xs sm:text-sm">
					<div class="py-12 text-center text-zinc-500 text-xs flex flex-col items-center gap-3">
						<svg class="w-6 h-6 animate-spin text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path></svg>
						<span data-i18n="catalog.modal.loading">Loading project details...</span>
					</div>
				</div>

				<!-- Tab 2: Versions Pane -->
				<div id="modalTabVersions" class="hidden flex flex-col gap-3">
					<div id="modalVersionsList" class="flex flex-col gap-2">
						<!-- Dynamically populated versions -->
					</div>
				</div>

				<!-- Tab 3: Gallery Pane -->
				<div id="modalTabGallery" class="hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
					<!-- Dynamically populated screenshots -->
				</div>
			</div>
		</div>
	</div>

	<!-- Catalog Interactive Client Script -->
	<script>
	(function() {
		let VERSIONS = [
			'26.2', '26.1.2', '26.1.1', '26.1',
			'1.21.11', '1.21.10', '1.21.9', '1.21.8', '1.21.7', '1.21.6', '1.21.5',
			'1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21',
			'1.20.6', '1.20.4', '1.20.2', '1.20.1',
			'1.19.4', '1.19.2', '1.18.2', '1.16.5', '1.12.2'
		];

		async function fetchLiveVersions() {
			try {
				const res = await fetch('/v2/tag/game_version');
				if (res.ok) {
					const tags = await res.json();
					if (Array.isArray(tags) && tags.length > 0) {
						const releases = tags.filter(t => t.version_type === 'release').map(t => t.version);
						const snapshots = tags.filter(t => t.version_type === 'snapshot').map(t => t.version);
						const all = [...releases, ...snapshots];
						if (all.length > 0) {
							VERSIONS = all;
							populateVersionsList(document.getElementById('versionSearchInput')?.value || '');
						}
					}
				}
			} catch (err) {
				console.error('Failed to load live game versions:', err);
			}
		}

		const state = {
			provider: 'modrinth',
			category: 'mods',
			query: '',
			gameVersion: '',
			loader: '',
			tag: '',
			sort: 'relevance',
			page: 0,
			totalHits: 0,
			currentModalData: null
		};

		function t(key, fallback) {
			const lang = localStorage.getItem('macros_lang') || 'en';
			const dict = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || (window.TRANSLATIONS && window.TRANSLATIONS.en) || {};
			return dict[key] || fallback || key;
		}

		function formatNumber(num) {
			if (!num) return '0';
			if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
			if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
			return String(num);
		}

		function formatFileSize(bytes) {
			if (!bytes) return '';
			if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
			if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
			return bytes + ' B';
		}

		function formatRelativeDate(dateStr) {
			if (!dateStr) return '';
			try {
				const d = new Date(dateStr);
				const diffDays = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
				const lang = localStorage.getItem('macros_lang') || 'en';
				if (diffDays < 1) return lang === 'ru' ? 'Сегодня' : 'Today';
				if (diffDays === 1) return lang === 'ru' ? 'Вчера' : 'Yesterday';
				if (diffDays < 30) return lang === 'ru' ? diffDays + ' дн. назад' : diffDays + ' days ago';
				const months = Math.floor(diffDays / 30);
				return lang === 'ru' ? months + ' мес. назад' : months + ' months ago';
			} catch (e) {
				return '';
			}
		}

		function renderMarkdown(md) {
			if (!md) return '<p class="text-zinc-500 italic">' + t('catalog.modal.no_description', 'No description provided.') + '</p>';
			let html = md
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
			html = html.replace(new RegExp('\\\\x60{3}([a-z]*)\\\\n([\\\\s\\\\S]*?)\\\\x60{3}', 'g'), '<pre class="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono overflow-x-auto text-zinc-300 my-3"><code>$2</code></pre>');
			html = html.replace(new RegExp('\\\\x60([^\\\\x60]+)\\\\x60', 'g'), '<code class="bg-zinc-900 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
			html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-white mt-4 mb-2">$1</h3>');
			html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-white mt-5 mb-2">$1</h2>');
			html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-white mt-6 mb-3">$1</h1>');
			html = html.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong class="font-bold text-white">$1</strong>');
			html = html.replace(/\\*([^*]+)\\*/g, '<em class="italic text-zinc-300">$1</em>');
			html = html.replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<img src="$2" alt="$1" class="rounded-xl my-3 max-w-full border border-zinc-800 shadow-md">');
			html = html.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-emerald-400 hover:underline font-medium">$1</a>');
			html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-emerald-500/50 pl-4 py-1 text-zinc-400 italic my-2">$1</blockquote>');
			html = html.replace(/^\\s*[-*]\\s+(.*$)/gim, '<li class="ml-4 list-disc text-zinc-300 my-1">$1</li>');
			html = html.replace(/\\n\\n+/g, '</p><p class="my-2 leading-relaxed text-zinc-300">');
			return '<p class="my-2 leading-relaxed text-zinc-300">' + html + '</p>';
		}

		function populateVersionsList(filter = '') {
			const container = document.getElementById('versionList');
			if (!container) return;
			container.innerHTML = '';

			const anyBtn = document.createElement('button');
			anyBtn.type = 'button';
			anyBtn.className = 'version-filter-btn w-full px-3 py-1.5 rounded-xl text-left font-medium transition flex items-center justify-between ' +
				(!state.gameVersion ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-850');
			anyBtn.innerHTML = '<span>' + t('catalog.filter.any_version', 'Any version') + '</span>' +
				'<span class="ver-check text-emerald-400 font-bold text-xs ' + (!state.gameVersion ? '' : 'hidden') + '">✓</span>';
			anyBtn.onclick = () => {
				state.gameVersion = '';
				state.page = 0;
				populateVersionsList(document.getElementById('versionSearchInput')?.value || '');
				fetchCatalog();
			};
			container.appendChild(anyBtn);

			const filtered = VERSIONS.filter(v => !filter || v.includes(filter.trim()));
			filtered.forEach(v => {
				const isSel = state.gameVersion === v;
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'version-filter-btn w-full px-3 py-1.5 rounded-xl text-left font-medium transition flex items-center justify-between ' +
					(isSel ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-850');
				btn.innerHTML = '<span class="font-mono">' + v + '</span>' +
					'<span class="ver-check text-emerald-400 font-bold text-xs ' + (isSel ? '' : 'hidden') + '">✓</span>';
				btn.onclick = () => {
					state.gameVersion = isSel ? '' : v;
					state.page = 0;
					populateVersionsList(document.getElementById('versionSearchInput')?.value || '');
					fetchCatalog();
				};
				container.appendChild(btn);
			});
		}

		async function fetchCatalog() {
			const container = document.getElementById('resultsContainer');
			const countEl = document.getElementById('resultsCountLabel');
			const pagination = document.getElementById('paginationControls');

			container.innerHTML = '<div class="text-center py-20 text-zinc-500 text-xs flex flex-col items-center gap-3">' +
				'<svg class="w-6 h-6 animate-spin text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path></svg>' +
				'<span>' + t('catalog.loading', 'Loading catalog...') + '</span>' +
				'</div>';

			try {
				let items = [];
				let total = 0;

				if (state.provider === 'modrinth') {
					const typeMap = { mods: 'mod', resourcepacks: 'resourcepack', datapacks: 'datapack', shaders: 'shader', modpacks: 'modpack' };
					const projType = typeMap[state.category] || 'mod';
					const facets = [['project_type:' + projType]];

					if (state.gameVersion) facets.push(['versions:' + state.gameVersion]);
					if (state.loader) facets.push(['categories:' + state.loader]);
					if (state.tag) facets.push(['categories:' + state.tag]);

					const sortMap = { relevance: 'relevance', downloads: 'downloads', updated: 'updated', newest: 'newest' };
					const index = sortMap[state.sort] || 'relevance';

					const url = '/v2/search?query=' + encodeURIComponent(state.query) +
						'&facets=' + encodeURIComponent(JSON.stringify(facets)) +
						'&index=' + index +
						'&limit=20&offset=' + (state.page * 20);

					const res = await fetch(url);
					if (!res.ok) throw new Error('Modrinth API response failed');
					const data = await res.json();
					total = data.total_hits || 0;
					items = (data.hits || []).map(h => ({
						id: h.project_id || h.slug,
						slug: h.slug,
						title: h.title,
						author: h.author,
						description: h.description,
						icon_url: h.icon_url,
						downloads: h.downloads,
						follows: h.follows,
						date_modified: h.date_modified,
						loaders: (h.categories || []).filter(c => ['fabric', 'forge', 'neoforge', 'quilt'].includes(c)),
						categories: h.categories || []
					}));
				} else {
					// CurseForge Provider
					const classMap = { mods: 6, resourcepacks: 12, datapacks: 17, shaders: 6552, modpacks: 4471 };
					const loaderMap = { forge: 1, fabric: 4, quilt: 5, neoforge: 6 };
					const sortMap = { relevance: 1, downloads: 5, updated: 3, newest: 2 };

					const classId = classMap[state.category] || 6;
					const loaderId = loaderMap[state.loader] || 0;
					const cfSort = sortMap[state.sort] || 1;

					const url = '/api/v1/curseforge/search?searchFilter=' + encodeURIComponent(state.query) +
						'&classId=' + classId +
						'&gameVersion=' + encodeURIComponent(state.gameVersion) +
						'&modLoaderType=' + loaderId +
						'&sortField=' + cfSort +
						'&pageSize=20&index=' + (state.page * 20);

					const res = await fetch(url);
					if (!res.ok) throw new Error('CurseForge API response failed');
					const data = await res.json();
					const rawItems = data.data || [];
					total = (data.pagination && data.pagination.totalCount) || rawItems.length;

					items = rawItems.map(item => {
						const loadersSet = new Set();
						(item.latestFilesIndexes || []).forEach(idx => {
							if (idx.modLoader === 1) loadersSet.add('forge');
							if (idx.modLoader === 4) loadersSet.add('fabric');
							if (idx.modLoader === 5) loadersSet.add('quilt');
							if (idx.modLoader === 6) loadersSet.add('neoforge');
						});
						return {
							id: item.id,
							title: item.name,
							author: item.authors && item.authors[0] ? item.authors[0].name : 'Author',
							description: item.summary,
							icon_url: item.logo ? item.logo.thumbnailUrl : null,
							downloads: item.downloadCount,
							follows: item.thumbsUpCount || 0,
							date_modified: item.dateModified,
							loaders: Array.from(loadersSet),
							categories: (item.categories || []).map(c => c.name)
						};
					});
				}

				state.totalHits = total;
				countEl.textContent = formatNumber(total) + ' results';

				if (items.length === 0) {
					container.innerHTML = '<div class="text-center py-24 text-zinc-500 text-xs">' + t('catalog.empty', 'No results found matching your filters') + '</div>';
					pagination.classList.add('hidden');
					return;
				}

				renderCards(items);

				pagination.classList.remove('hidden');
				document.getElementById('pageIndicator').textContent = 'Page ' + (state.page + 1) + ' of ' + Math.max(1, Math.ceil(total / 20));
				document.getElementById('btnPrevPage').disabled = state.page === 0;
				document.getElementById('btnNextPage').disabled = (state.page + 1) * 20 >= total;
			} catch (err) {
				console.error(err);
				container.innerHTML = '<div class="text-center py-20 text-red-400 text-xs">Failed to load content from ' + state.provider + '. Please try again.</div>';
			}
		}

		let _lastCatalogItems = [];

		window.setCatalogLayout = function(layout) {
			localStorage.setItem('macros_layout_mods', layout);
			const btnRows = document.getElementById('btnCatalogLayoutRows');
			const btnGrid = document.getElementById('btnCatalogLayoutGrid');
			if (btnRows && btnGrid) {
				if (layout === 'grid') {
					btnGrid.className = 'p-1.5 rounded-lg text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 transition cursor-pointer';
					btnRows.className = 'p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition cursor-pointer';
				} else {
					btnRows.className = 'p-1.5 rounded-lg text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 transition cursor-pointer';
					btnGrid.className = 'p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition cursor-pointer';
				}
			}
			if (_lastCatalogItems && _lastCatalogItems.length > 0) {
				renderCards(_lastCatalogItems);
			}
		};

		function renderCards(items) {
			_lastCatalogItems = items;
			const container = document.getElementById('resultsContainer');
			container.innerHTML = '';
			const layout = localStorage.getItem('macros_layout_mods') || 'rows';

			const btnRows = document.getElementById('btnCatalogLayoutRows');
			const btnGrid = document.getElementById('btnCatalogLayoutGrid');
			if (btnRows && btnGrid) {
				if (layout === 'grid') {
					btnGrid.className = 'p-1.5 rounded-lg text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 transition cursor-pointer';
					btnRows.className = 'p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition cursor-pointer';
				} else {
					btnRows.className = 'p-1.5 rounded-lg text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 transition cursor-pointer';
					btnGrid.className = 'p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition cursor-pointer';
				}
			}

			if (layout === 'grid') {
				container.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]';
				items.forEach(item => {
					const card = document.createElement('div');
					card.className = 'oled-card p-5 rounded-2xl flex flex-col justify-between gap-4 group transition cursor-pointer hover:border-zinc-700 hover:bg-[#0c0c0f]';
					card.onclick = () => {
						window.location.href = '/mod/' + encodeURIComponent(item.id) + '?provider=' + state.provider;
					};

					const top = document.createElement('div');
					top.className = 'space-y-3 min-w-0';

					const head = document.createElement('div');
					head.className = 'flex items-center gap-3.5 min-w-0';

					const icon = document.createElement('div');
					icon.className = 'w-12 h-12 rounded-xl bg-[#141418] border border-zinc-800/80 flex items-center justify-center shrink-0 overflow-hidden shadow-sm group-hover:border-zinc-700 transition';
					if (item.icon_url) {
						icon.innerHTML = '<img src="' + item.icon_url + '" alt="' + item.title + '" class="w-full h-full object-cover">';
					} else {
						icon.innerHTML = '<svg class="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>';
					}
					head.appendChild(icon);

					const titles = document.createElement('div');
					titles.className = 'min-w-0 flex-1';
					titles.innerHTML = '<a href="/mod/' + encodeURIComponent(item.id) + '?provider=' + state.provider + '" class="text-base font-bold text-white group-hover:text-emerald-400 transition truncate block hover:underline">' + item.title + '</a>' +
						'<span class="text-xs text-zinc-400 font-normal truncate block">by ' + item.author + '</span>';
					head.appendChild(titles);
					top.appendChild(head);

					const desc = document.createElement('p');
					desc.className = 'text-xs text-zinc-300 line-clamp-3 leading-relaxed';
					desc.textContent = item.description || '';
					top.appendChild(desc);

					const badges = document.createElement('div');
					badges.className = 'flex flex-wrap items-center gap-1.5 pt-1 select-none';
					if (item.categories && item.categories.length > 0) {
						const catBadge = document.createElement('span');
						catBadge.className = 'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#18181c] border border-white/5 text-zinc-300 capitalize';
						catBadge.textContent = item.categories[0];
						badges.appendChild(catBadge);
					}
					(item.loaders || []).slice(0, 3).forEach(l => {
						const b = document.createElement('span');
						b.className = 'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#18181c] border border-white/5 text-zinc-300 capitalize';
						b.textContent = l;
						badges.appendChild(b);
					});
					top.appendChild(badges);
					card.appendChild(top);

					const bottom = document.createElement('div');
					bottom.className = 'pt-3 border-t border-zinc-900/80 flex items-center justify-between text-xs select-none';
					bottom.innerHTML = '<span class="flex items-center gap-1 font-mono font-semibold text-zinc-300">' +
						'<svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>' +
						formatNumber(item.downloads) + '</span>' +
						'<span class="text-[11px] text-zinc-500">' + formatRelativeDate(item.date_modified) + '</span>';
					card.appendChild(bottom);

					container.appendChild(card);
				});
			} else {
				container.className = 'flex flex-col gap-3.5 min-h-[400px]';
				items.forEach(item => {
					const card = document.createElement('div');
					card.className = 'oled-card p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group transition cursor-pointer hover:border-zinc-700 hover:bg-[#0c0c0f]';
					card.onclick = () => {
						window.location.href = '/mod/' + encodeURIComponent(item.id) + '?provider=' + state.provider;
					};

					const left = document.createElement('div');
					left.className = 'flex items-start gap-4 sm:gap-5 min-w-0 flex-1';

					const icon = document.createElement('div');
					icon.className = 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#141418] border border-zinc-800/80 flex items-center justify-center shrink-0 overflow-hidden shadow-sm group-hover:border-zinc-700 transition';
					if (item.icon_url) {
						icon.innerHTML = '<img src="' + item.icon_url + '" alt="' + item.title + '" class="w-full h-full object-cover">';
					} else {
						icon.innerHTML = '<svg class="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>';
					}
					left.appendChild(icon);

					const info = document.createElement('div');
					info.className = 'min-w-0 flex-1';

					const titleRow = document.createElement('div');
					titleRow.className = 'flex flex-wrap items-baseline gap-2';
					titleRow.innerHTML = '<a href="/mod/' + encodeURIComponent(item.id) + '?provider=' + state.provider + '" class="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-400 transition truncate hover:underline">' + item.title + '</a>' +
						'<span class="text-sm text-zinc-400 font-normal">by ' + item.author + '</span>';
					info.appendChild(titleRow);

					const desc = document.createElement('p');
					desc.className = 'text-sm text-zinc-300 line-clamp-2 mt-1.5 leading-relaxed';
					desc.textContent = item.description || '';
					info.appendChild(desc);

					const badges = document.createElement('div');
					badges.className = 'flex flex-wrap items-center gap-2 mt-3 select-none';

					// Environment tag
					const envBadge = document.createElement('span');
					envBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#18181c] border border-white/5 text-zinc-300';
					envBadge.innerHTML = '<svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>Client or server';
					badges.appendChild(envBadge);

					// Primary Category tag
					if (item.categories && item.categories.length > 0) {
						const catBadge = document.createElement('span');
						catBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#18181c] border border-white/5 text-zinc-300 capitalize';
						catBadge.innerHTML = '<svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>' + item.categories[0];
						badges.appendChild(catBadge);
					}

					// Loaders (clean subtle gray)
					(item.loaders || []).forEach(l => {
						const b = document.createElement('span');
						b.className = 'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#18181c] border border-white/5 text-zinc-300 capitalize';
						b.textContent = l;
						badges.appendChild(b);
					});

					info.appendChild(badges);
					left.appendChild(info);
					card.appendChild(left);

					// Right Stats (exact match of Modrinth media_1789238281400.png)
					const right = document.createElement('div');
					right.className = 'flex md:flex-col items-end justify-between md:justify-center self-stretch shrink-0 gap-3 text-right select-none md:min-w-[150px] pt-3 md:pt-0 border-t md:border-t-0 border-zinc-900';

					const topStats = document.createElement('div');
					topStats.className = 'flex items-center gap-3.5 text-sm font-semibold text-zinc-300 font-mono';
					topStats.innerHTML = '<span class="flex items-center gap-1.5" title="Downloads">' +
						'<svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>' +
						formatNumber(item.downloads) + '</span>' +
						'<span class="flex items-center gap-1.5" title="Followers">' +
						'<svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>' +
						formatNumber(item.follows || Math.round((item.downloads || 0) * 0.00018)) + '</span>';
					right.appendChild(topStats);

					const bottomStats = document.createElement('div');
					bottomStats.className = 'flex items-center gap-1.5 text-xs text-zinc-400 font-medium';
					bottomStats.innerHTML = '<svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
						'<span>' + formatRelativeDate(item.date_modified) + '</span>';
					right.appendChild(bottomStats);

					card.appendChild(right);
					container.appendChild(card);
				});
			}
		}

		// Mod Details Modal functions
		const modalEl = document.getElementById('modModal');
		const modalIcon = document.getElementById('modalIcon');
		const modalTitle = document.getElementById('modalTitle');
		const modalAuthor = document.getElementById('modalAuthor');
		const modalSummary = document.getElementById('modalSummary');
		const modalProviderBadge = document.getElementById('modalProviderBadge');
		const modalDownloads = document.getElementById('modalDownloads');
		const modalFollows = document.getElementById('modalFollows');
		const modalUpdated = document.getElementById('modalUpdated');
		const modalDownloadBtn = document.getElementById('modalDownloadBtn');
		const modalLauncherBtn = document.getElementById('modalLauncherBtn');
		const modalVersionsCount = document.getElementById('modalVersionsCount');
		const modalTabDesc = document.getElementById('modalTabDesc');
		const modalTabVersions = document.getElementById('modalTabVersions');
		const modalTabGallery = document.getElementById('modalTabGallery');
		const modalTabDescBtn = document.getElementById('modalTabDescBtn');
		const modalTabVersionsBtn = document.getElementById('modalTabVersionsBtn');
		const modalTabGalleryBtn = document.getElementById('modalTabGalleryBtn');

		function switchModalTab(tab) {
			modalTabDescBtn.className = 'px-4 py-1.5 rounded-xl text-xs font-semibold ' + (tab === 'desc' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800') + ' transition';
			modalTabVersionsBtn.className = 'px-4 py-1.5 rounded-xl text-xs font-semibold ' + (tab === 'versions' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800') + ' transition flex items-center gap-1.5';
			modalTabGalleryBtn.className = 'px-4 py-1.5 rounded-xl text-xs font-semibold ' + (tab === 'gallery' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800') + ' transition';

			if (tab === 'desc') {
				modalTabDesc.classList.remove('hidden');
				modalTabVersions.classList.add('hidden');
				modalTabGallery.classList.add('hidden');
			} else if (tab === 'versions') {
				modalTabDesc.classList.add('hidden');
				modalTabVersions.classList.remove('hidden');
				modalTabGallery.classList.add('hidden');
			} else {
				modalTabDesc.classList.add('hidden');
				modalTabVersions.classList.add('hidden');
				modalTabGallery.classList.remove('hidden');
			}
		}

		modalTabDescBtn.onclick = () => switchModalTab('desc');
		modalTabVersionsBtn.onclick = () => switchModalTab('versions');
		modalTabGalleryBtn.onclick = () => switchModalTab('gallery');

		function closeModModal() {
			modalEl.classList.add('hidden');
			document.body.style.overflow = '';
		}

		document.getElementById('modalCloseBtn').onclick = closeModModal;
		modalEl.onclick = (e) => {
			if (e.target === modalEl) closeModModal();
		};
		window.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && !modalEl.classList.contains('hidden')) {
				closeModModal();
			}
		});

		async function openModModal(id, provider, initialCardItem) {
			document.body.style.overflow = 'hidden';
			modalEl.classList.remove('hidden');
			switchModalTab('desc');

			// Populate initial header data from card item
			if (initialCardItem) {
				modalTitle.textContent = initialCardItem.title;
				modalAuthor.textContent = 'by ' + initialCardItem.author;
				modalSummary.textContent = initialCardItem.description || '';
				modalIcon.src = initialCardItem.icon_url || '/assets/logo.png';
				modalDownloads.textContent = formatNumber(initialCardItem.downloads);
				modalFollows.textContent = formatNumber(initialCardItem.follows);
				modalUpdated.textContent = formatRelativeDate(initialCardItem.date_modified);
			}

			if (provider === 'modrinth') {
				modalProviderBadge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-semibold provider-badge-modrinth';
				modalProviderBadge.textContent = 'Modrinth';
			} else {
				modalProviderBadge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-semibold provider-badge-curseforge';
				modalProviderBadge.textContent = 'CurseForge';
			}

			// Download & In Launcher buttons
			modalDownloadBtn.href = '/api/v1/' + provider + '/download/' + encodeURIComponent(id) +
				'?gameVersion=' + encodeURIComponent(state.gameVersion) +
				'&loader=' + encodeURIComponent(state.loader);
			modalLauncherBtn.href = 'macros://install/' + provider + '/' + encodeURIComponent(id);

			modalTabDesc.innerHTML = '<div class="py-12 text-center text-zinc-500 text-xs flex flex-col items-center gap-3">' +
				'<svg class="w-6 h-6 animate-spin text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path></svg>' +
				'<span>' + t('catalog.modal.loading', 'Loading project details...') + '</span>' +
				'</div>';

			document.getElementById('modalVersionsList').innerHTML = '';
			modalTabGallery.innerHTML = '';
			modalTabGalleryBtn.classList.add('hidden');

			try {
				if (provider === 'modrinth') {
					// Fetch Modrinth project and versions in parallel
					const [projRes, versRes] = await Promise.all([
						fetch('/v2/project/' + encodeURIComponent(id)),
						fetch('/v2/project/' + encodeURIComponent(id) + '/version')
					]);

					if (projRes.ok) {
						const proj = await projRes.json();
						modalTitle.textContent = proj.title;
						modalAuthor.textContent = 'by ' + (proj.team || initialCardItem?.author || 'Creator');
						modalSummary.textContent = proj.description || '';
						if (proj.icon_url) modalIcon.src = proj.icon_url;
						modalDownloads.textContent = formatNumber(proj.downloads);
						modalFollows.textContent = formatNumber(proj.followers);
						modalUpdated.textContent = formatRelativeDate(proj.updated);

						// Render body markdown
						modalTabDesc.innerHTML = renderMarkdown(proj.body);

						// Render gallery if available
						if (proj.gallery && proj.gallery.length > 0) {
							modalTabGalleryBtn.classList.remove('hidden');
							modalTabGallery.innerHTML = proj.gallery.map(g => {
								return '<div class="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 group relative">' +
									'<img src="' + g.url + '" alt="' + (g.title || '') + '" class="w-full h-48 object-cover group-hover:scale-105 transition duration-300">' +
									(g.title ? '<div class="p-2 text-xs font-medium text-zinc-300 truncate bg-zinc-900/90">' + g.title + '</div>' : '') +
									'</div>';
							}).join('');
						}
					}

					if (versRes.ok) {
						const versions = await versRes.json();
						modalVersionsCount.textContent = String(versions.length);
						renderVersionsTable(versions, 'modrinth');
					}
				} else {
					// CurseForge Provider
					const [modRes, descRes, filesRes] = await Promise.all([
						fetch('/api/v1/curseforge/mod/' + encodeURIComponent(id)),
						fetch('/api/v1/curseforge/mod/' + encodeURIComponent(id) + '/description'),
						fetch('/api/v1/curseforge/mod/' + encodeURIComponent(id) + '/files')
					]);

					if (modRes.ok) {
						const modData = await modRes.json();
						const mod = modData.data || {};
						modalTitle.textContent = mod.name || initialCardItem?.title || '';
						modalAuthor.textContent = 'by ' + (mod.authors && mod.authors[0] ? mod.authors[0].name : 'Author');
						modalSummary.textContent = mod.summary || '';
						if (mod.logo && mod.logo.url) modalIcon.src = mod.logo.url;
						modalDownloads.textContent = formatNumber(mod.downloadCount);
						modalFollows.textContent = formatNumber(mod.thumbsUpCount || 0);
						modalUpdated.textContent = formatRelativeDate(mod.dateModified);

						// Screenshots
						if (mod.screenshots && mod.screenshots.length > 0) {
							modalTabGalleryBtn.classList.remove('hidden');
							modalTabGallery.innerHTML = mod.screenshots.map(s => {
								return '<div class="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 group relative">' +
									'<img src="' + s.url + '" alt="' + (s.title || '') + '" class="w-full h-48 object-cover group-hover:scale-105 transition duration-300">' +
									(s.title ? '<div class="p-2 text-xs font-medium text-zinc-300 truncate bg-zinc-900/90">' + s.title + '</div>' : '') +
									'</div>';
							}).join('');
						}
					}

					if (descRes.ok) {
						const descData = await descRes.json();
						const descHtml = descData.data || '';
						if (descHtml.trim()) {
							modalTabDesc.innerHTML = '<div class="curseforge-content">' + descHtml + '</div>';
						} else {
							modalTabDesc.innerHTML = '<p class="text-zinc-500 italic">' + t('catalog.modal.no_description', 'No description provided.') + '</p>';
						}
					}

					if (filesRes.ok) {
						const filesData = await filesRes.json();
						const files = filesData.data || [];
						modalVersionsCount.textContent = String(files.length);
						renderVersionsTable(files, 'curseforge', id);
					}
				}
			} catch (err) {
				console.error(err);
				modalTabDesc.innerHTML = '<p class="text-red-400 text-xs">Failed to load details.</p>';
			}
		}

		function renderVersionsTable(versions, provider, modId) {
			const container = document.getElementById('modalVersionsList');
			container.innerHTML = '';

			if (!versions || versions.length === 0) {
				container.innerHTML = '<div class="text-center py-12 text-zinc-500 text-xs">' + t('catalog.modal.no_versions', 'No versions found') + '</div>';
				return;
			}

			versions.forEach(v => {
				const row = document.createElement('div');
				row.className = 'p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700/80 transition';

				let verName = '';
				let typeBadge = '';
				let gameVers = [];
				let loaders = [];
				let sizeText = '';
				let dateText = '';
				let dlUrl = '';

				if (provider === 'modrinth') {
					verName = v.name || v.version_number;
					const type = v.version_type || 'release';
					if (type === 'release') typeBadge = '<span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Release</span>';
					else if (type === 'beta') typeBadge = '<span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">Beta</span>';
					else typeBadge = '<span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">Alpha</span>';

					gameVers = v.game_versions || [];
					loaders = v.loaders || [];
					const primFile = (v.files || []).find(f => f.primary) || (v.files && v.files[0]);
					if (primFile) {
						sizeText = formatFileSize(primFile.size);
						dlUrl = primFile.url;
					}
					dateText = formatRelativeDate(v.date_published);
				} else {
					verName = v.displayName || v.fileName;
					const rType = v.releaseType;
					if (rType === 1) typeBadge = '<span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Release</span>';
					else if (rType === 2) typeBadge = '<span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">Beta</span>';
					else typeBadge = '<span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">Alpha</span>';

					gameVers = (v.gameVersions || []).filter(g => /^\d+\.\d+/.test(g));
					loaders = (v.gameVersions || []).filter(g => ['fabric', 'forge', 'neoforge', 'quilt'].includes(g.toLowerCase()));
					sizeText = formatFileSize(v.fileLength);
					dateText = formatRelativeDate(v.fileDate);
					dlUrl = '/api/v1/curseforge/download/' + encodeURIComponent(modId) + '?fileId=' + encodeURIComponent(v.id);
				}

				const left = document.createElement('div');
				left.className = 'flex flex-col gap-1 min-w-0 flex-1';
				left.innerHTML = '<div class="flex flex-wrap items-center gap-2">' +
					'<span class="text-xs sm:text-sm font-bold text-white truncate">' + verName + '</span>' +
					typeBadge +
					'</div>' +
					'<div class="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 mt-1">' +
					(gameVers.length > 0 ? '<span class="text-zinc-300 font-mono">' + gameVers.slice(0, 4).join(', ') + (gameVers.length > 4 ? ' +' + (gameVers.length - 4) : '') + '</span>' : '') +
					(loaders.length > 0 ? '<span class="text-zinc-600">•</span><span class="text-zinc-400">' + loaders.join(', ') + '</span>' : '') +
					(sizeText ? '<span class="text-zinc-600">•</span><span>' + sizeText + '</span>' : '') +
					(dateText ? '<span class="text-zinc-600">•</span><span>' + dateText + '</span>' : '') +
					'</div>';
				row.appendChild(left);

				const dl = document.createElement('a');
				dl.href = dlUrl || '#';
				dl.target = '_blank';
				dl.className = 'px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black font-semibold text-xs transition flex items-center gap-1.5 border border-emerald-500/20 shrink-0 active:scale-95';
				dl.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>' +
					'<span>' + t('catalog.btn.download', 'Download') + '</span>';
				row.appendChild(dl);

				container.appendChild(row);
			});
		}

		// Provider Switcher handlers
		const btnModrinth = document.getElementById('btnProviderModrinth');
		const btnCurseforge = document.getElementById('btnProviderCurseforge');
		const providerTag = document.getElementById('activeProviderTag');

		function setProvider(prov) {
			state.provider = prov;
			state.page = 0;
			if (prov === 'modrinth') {
				btnModrinth.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 provider-badge-modrinth shadow-sm';
				btnCurseforge.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 text-zinc-400 hover:text-zinc-200';
				providerTag.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-semibold provider-badge-modrinth';
				providerTag.textContent = 'Modrinth';
			} else {
				btnCurseforge.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 provider-badge-curseforge shadow-sm';
				btnModrinth.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 text-zinc-400 hover:text-zinc-200';
				providerTag.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-semibold provider-badge-curseforge';
				providerTag.textContent = 'CurseForge';
			}
			fetchCatalog();
		}

		if (btnModrinth) btnModrinth.onclick = () => setProvider('modrinth');
		if (btnCurseforge) btnCurseforge.onclick = () => setProvider('curseforge');

		// Category pills handlers
		document.querySelectorAll('.cat-pill').forEach(pill => {
			pill.onclick = () => {
				document.querySelectorAll('.cat-pill').forEach(p => {
					p.className = 'cat-pill px-5 py-2 rounded-full text-sm font-medium bg-[#141418] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer';
				});
				pill.className = 'cat-pill px-5 py-2 rounded-full text-sm font-semibold bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 transition cursor-pointer';
				state.category = pill.getAttribute('data-category') || 'mods';
				state.page = 0;
				fetchCatalog();
			};
		});

		// Search input with debounce and clear button
		let searchTimer = null;
		const searchInput = document.getElementById('catalogSearchInput');
		const searchClear = document.getElementById('catalogSearchClear');
		if (searchInput) {
			searchInput.addEventListener('input', (e) => {
				const val = e.target.value.trim();
				if (searchClear) searchClear.classList.toggle('hidden', !val);
				clearTimeout(searchTimer);
				searchTimer = setTimeout(() => {
					state.query = val;
					state.page = 0;
					fetchCatalog();
				}, 350);
			});
		}
		if (searchClear) {
			searchClear.onclick = () => {
				if (searchInput) searchInput.value = '';
				searchClear.classList.add('hidden');
				state.query = '';
				state.page = 0;
				fetchCatalog();
			};
		}

		// Custom OLED Sort Dropdown
		const sortMenuBtn = document.getElementById('sortMenuBtn');
		const sortMenuDropdown = document.getElementById('sortMenuDropdown');
		const sortMenuChevron = document.getElementById('sortMenuChevron');
		const sortMenuCurrent = document.getElementById('sortMenuCurrent');

		if (sortMenuBtn && sortMenuDropdown) {
			sortMenuBtn.onclick = (e) => {
				e.stopPropagation();
				const isHidden = sortMenuDropdown.classList.contains('hidden');
				sortMenuDropdown.classList.toggle('hidden', !isHidden);
				if (sortMenuChevron) sortMenuChevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
			};

			document.querySelectorAll('.sort-option').forEach(opt => {
				opt.onclick = () => {
					const s = opt.getAttribute('data-sort');
					state.sort = s;
					state.page = 0;
					if (sortMenuCurrent) {
						const labelSpan = opt.querySelector('span:first-child');
						sortMenuCurrent.textContent = labelSpan ? labelSpan.textContent : s;
					}
					document.querySelectorAll('.sort-option').forEach(o => {
						const chk = o.querySelector('.sort-check');
						if (chk) chk.classList.toggle('hidden', o.getAttribute('data-sort') !== s);
					});
					sortMenuDropdown.classList.add('hidden');
					if (sortMenuChevron) sortMenuChevron.style.transform = 'rotate(0deg)';
					fetchCatalog();
				};
			});

			document.addEventListener('click', () => {
				if (!sortMenuDropdown.classList.contains('hidden')) {
					sortMenuDropdown.classList.add('hidden');
					if (sortMenuChevron) sortMenuChevron.style.transform = 'rotate(0deg)';
				}
			});
		}

		// Sidebar Section Collapse Toggles
		function setupCollapseToggle(btnId, bodyId, chevId) {
			const btn = document.getElementById(btnId);
			const body = document.getElementById(bodyId);
			const chev = document.getElementById(chevId);
			if (btn && body) {
				btn.onclick = () => {
					const isHidden = body.classList.contains('hidden');
					body.classList.toggle('hidden', !isHidden);
					if (chev) chev.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
				};
			}
		}
		setupCollapseToggle('toggleVersionSec', 'versionSecBody', 'chevronVersion');
		setupCollapseToggle('toggleLoaderSec', 'loaderSecBody', 'chevronLoader');
		setupCollapseToggle('toggleCategorySec', 'categorySecBody', 'chevronCategory');

		// Loader filter buttons (clean, no radio dots!)
		document.querySelectorAll('.loader-filter-btn').forEach(btn => {
			btn.onclick = () => {
				const l = btn.getAttribute('data-loader') || '';
				state.loader = (state.loader === l && l !== '') ? '' : l;
				state.page = 0;

				document.querySelectorAll('.loader-filter-btn').forEach(b => {
					const isSel = (b.getAttribute('data-loader') || '') === state.loader;
					b.className = 'loader-filter-btn w-full px-3 py-1.5 rounded-xl text-left font-medium transition flex items-center justify-between ' +
						(isSel ? 'bg-zinc-800 text-white font-semibold border border-zinc-700' : 'text-zinc-400 hover:text-white hover:bg-zinc-850');
					const chk = b.querySelector('.loader-check');
					if (chk) chk.classList.toggle('hidden', !isSel);
				});

				fetchCatalog();
			};
		});

		// Tag / Category filter buttons (clean, no radio dots!)
		document.querySelectorAll('.tag-filter-btn').forEach(btn => {
			btn.onclick = () => {
				const tVal = btn.getAttribute('data-tag') || '';
				state.tag = (state.tag === tVal && tVal !== '') ? '' : tVal;
				state.page = 0;

				document.querySelectorAll('.tag-filter-btn').forEach(b => {
					const isSel = (b.getAttribute('data-tag') || '') === state.tag;
					b.className = 'tag-filter-btn w-full px-3 py-1.5 rounded-xl text-left font-medium transition flex items-center justify-between ' +
						(isSel ? 'bg-zinc-800 text-white font-semibold border border-zinc-700' : 'text-zinc-400 hover:text-white hover:bg-zinc-850');
					const chk = b.querySelector('.tag-check');
					if (chk) chk.classList.toggle('hidden', !isSel);
				});

				fetchCatalog();
			};
		});

		// Version filter search input
		const verInput = document.getElementById('versionSearchInput');
		if (verInput) {
			verInput.addEventListener('input', (e) => {
				populateVersionsList(e.target.value);
			});
		}

		// Reset filters button
		const resetBtn = document.getElementById('btnResetFilters');
		if (resetBtn) {
			resetBtn.onclick = () => {
				state.gameVersion = '';
				state.loader = '';
				state.tag = '';
				state.query = '';
				state.sort = 'relevance';
				state.page = 0;
				if (searchInput) searchInput.value = '';
				if (searchClear) searchClear.classList.add('hidden');
				if (verInput) verInput.value = '';
				if (sortMenuCurrent) sortMenuCurrent.textContent = t('catalog.sort.relevance', 'Relevance');

				document.querySelectorAll('.loader-filter-btn').forEach(b => {
					const isSel = (b.getAttribute('data-loader') || '') === '';
					b.className = 'loader-filter-btn w-full px-3 py-1.5 rounded-xl text-left font-medium transition flex items-center justify-between ' +
						(isSel ? 'bg-zinc-800 text-white font-semibold border border-zinc-700' : 'text-zinc-400 hover:text-white hover:bg-zinc-850');
					const chk = b.querySelector('.loader-check');
					if (chk) chk.classList.toggle('hidden', !isSel);
				});

				document.querySelectorAll('.tag-filter-btn').forEach(b => {
					const isSel = (b.getAttribute('data-tag') || '') === '';
					b.className = 'tag-filter-btn w-full px-3 py-1.5 rounded-xl text-left font-medium transition flex items-center justify-between ' +
						(isSel ? 'bg-zinc-800 text-white font-semibold border border-zinc-700' : 'text-zinc-400 hover:text-white hover:bg-zinc-850');
					const chk = b.querySelector('.tag-check');
					if (chk) chk.classList.toggle('hidden', !isSel);
				});

				populateVersionsList();
				fetchCatalog();
			};
		}

		// Pagination buttons
		document.getElementById('btnPrevPage').onclick = () => {
			if (state.page > 0) {
				state.page--;
				fetchCatalog();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		};
		document.getElementById('btnNextPage').onclick = () => {
			if ((state.page + 1) * 20 < state.totalHits) {
				state.page++;
				fetchCatalog();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		};

		populateVersionsList();
		fetchLiveVersions();
		fetchCatalog();
	})();
	</script>
	${renderNavbarUserScript()}
	${renderCreateProjectModalHtml()}
</body>
</html>`
}

export function renderModPageHtml(modId: string, provider: string, user?: any): string {
	const safeModId = encodeURIComponent(modId)
	return `<!DOCTYPE html>
<html lang="ru" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title id="pageTitle">MacrosApp | Minecraft Project</title>
	<link rel="icon" type="image/png" href="/assets/favicon.png">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
	<script src="https://cdn.tailwindcss.com"></script>
	<script>
		tailwind.config = {
			darkMode: 'class',
			theme: {
				extend: {
					fontFamily: {
						sans: ['Inter', 'system-ui', 'sans-serif'],
					}
				}
			}
		}
	</script>
	${THEME_HEAD_SCRIPT}
	<style>
		${OLED_SCROLLBAR_CSS}
		${THEME_CSS}

		body { background-color: var(--theme-bg-page, #000000); color: var(--theme-text-primary, #f4f4f5); font-family: 'Inter', sans-serif; }
		.oled-card {
			background: #09090b;
			border: 1px solid rgba(255, 255, 255, 0.08);
			transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		}
		.provider-badge-modrinth {
			background: rgba(16, 185, 129, 0.12);
			color: #10b981;
			border: 1px solid rgba(16, 185, 129, 0.3);
		}
		.provider-badge-curseforge {
			background: rgba(241, 100, 54, 0.12);
			color: #f16436;
			border: 1px solid rgba(241, 100, 54, 0.3);
		}
		.prose-desc h1 { font-size: 1.4rem; font-weight: 700; color: #ffffff; margin-top: 1.5rem; margin-bottom: 0.6rem; }
		.prose-desc h2 { font-size: 1.25rem; font-weight: 700; color: #ffffff; margin-top: 1.25rem; margin-bottom: 0.5rem; }
		.prose-desc h3 { font-size: 1.1rem; font-weight: 600; color: #ffffff; margin-top: 1rem; margin-bottom: 0.4rem; }
		.prose-desc p { margin-top: 0.6rem; margin-bottom: 0.6rem; line-height: 1.7; color: #d4d4d8; font-size: 0.925rem; }
		.prose-desc a { color: #10b981; text-decoration: underline; text-underline-offset: 2px; }
		.prose-desc a:hover { color: #34d399; }
		.prose-desc ul, .prose-desc ol { margin-left: 1.25rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
		.prose-desc li { margin-bottom: 0.35rem; color: #d4d4d8; font-size: 0.925rem; }
		.prose-desc img { max-width: 100%; border-radius: 0.75rem; margin: 1rem 0; border: 1px solid rgba(255, 255, 255, 0.08); }
		.prose-desc pre { background: #0c0c0e; border: 1px solid #27272a; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; margin: 1rem 0; }
		.prose-desc code { font-family: monospace; font-size: 0.85em; background: #18181b; padding: 0.15rem 0.35rem; border-radius: 0.35rem; color: #10b981; }
		.prose-desc pre code { background: transparent; padding: 0; color: #e4e4e7; }
		.prose-desc blockquote { border-left: 3px solid #10b981; padding-left: 1rem; color: #a1a1aa; font-style: italic; margin: 1rem 0; }
	</style>
</head>
<body class="min-h-screen flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
	<!-- Top Bar -->
	<header class="border-b border-zinc-900 sticky top-0 z-40 bg-[#000000]/80 backdrop-blur-xl">
		<div class="max-w-[1440px] mx-auto px-6 sm:px-8 h-16 flex items-center justify-between gap-6">
			<div class="flex items-center gap-8">
				<a href="/" class="flex items-center gap-2.5 group shrink-0">
					<img src="/assets/logo.png" alt="MacrosApp" class="w-8 h-8 rounded-lg object-contain group-hover:scale-105 transition-transform">
					<span class="text-base font-bold tracking-tight text-white">MacrosApp</span>
				</a>

				<nav class="hidden md:flex items-center gap-6 text-sm text-zinc-400">
					<a href="/catalog" data-i18n="nav.catalog" class="text-white font-semibold transition">Discover</a>
					<a href="/#features" data-i18n="nav.features" class="hover:text-white transition">Features</a>
					<a href="/download" data-i18n="nav.download" class="hover:text-white transition">Download</a>
					<a href="https://github.com/nnnegrvpeni-lang/MacrosApp" target="_blank" data-i18n="nav.github" class="hover:text-white transition flex items-center gap-1.5">GitHub</a>
				</nav>
			</div>

			<div id="navUserSlot" class="flex items-center gap-3 shrink-0">
				${renderNavbarUserHtml(user)}
			</div>
		</div>
	</header>

	<!-- Breadcrumb -->
	<div class="max-w-[1440px] mx-auto px-6 sm:px-8 pt-6 pb-2 w-full">
		<a href="/catalog" class="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition group">
			<svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
			<span data-i18n="mod.back">Discover content</span>
		</a>
	</div>

	<!-- Project Hero Header (Authentic Modrinth media_1789237299262.png) -->
	<div class="max-w-[1440px] mx-auto px-6 sm:px-8 py-4 w-full">
		<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
			<!-- Left Icon & Info -->
			<div class="flex items-start gap-5 min-w-0">
				<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden shadow-xl">
					<img id="heroIcon" src="/assets/logo.png" alt="Mod Icon" class="w-full h-full object-cover">
				</div>

				<div class="min-w-0 flex-1">
					<div class="flex flex-wrap items-center gap-3">
						<h1 id="heroTitle" class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight truncate">Loading...</h1>
						<span id="heroProviderBadge" class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider provider-badge-modrinth">Modrinth</span>
					</div>

					<p id="heroSummary" class="text-xs sm:text-sm text-zinc-300 mt-1.5 line-clamp-2 leading-relaxed max-w-2xl"></p>

					<div class="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-400 font-medium">
						<div class="flex items-center gap-1.5">
							<svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
							<span id="heroDownloads" class="font-mono text-zinc-200">0</span>
							<span data-i18n="catalog.stats.downloads">downloads</span>
						</div>
						<span class="text-zinc-700">•</span>
						<div class="flex items-center gap-1.5">
							<svg class="w-3.5 h-3.5 text-rose-500/80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
							<span id="heroFollowers" class="font-mono text-zinc-200">0</span>
							<span data-i18n="catalog.stats.follows">followers</span>
						</div>
						<span class="text-zinc-700">•</span>
						<span id="heroCategoryPill" class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300">Mod</span>
					</div>
				</div>
			</div>

			<!-- Right Action Buttons -->
			<div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
				<a id="heroDownloadBtn" href="#" target="_blank" class="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
					<span data-i18n="catalog.btn.download">Download</span>
				</a>
				<a id="heroLauncherBtn" href="#" class="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 hover:text-white font-medium text-xs transition flex items-center gap-1.5 active:scale-95" title="Install in MacrosApp launcher">
					<svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
					<span data-i18n="catalog.btn.install_launcher">In Launcher</span>
				</a>
				<button type="button" id="heroShareBtn" class="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition active:scale-95" title="Share link">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
				</button>
			</div>
		</div>

		<!-- Nav Tabs Row (matching Modrinth) -->
		<div class="flex items-center gap-2 pt-4 select-none">
			<button type="button" id="tabBtnDesc" class="px-5 py-1.5 rounded-full text-xs font-semibold bg-emerald-600/90 text-white shadow-sm transition">
				<span data-i18n="mod.tab.description">Description</span>
			</button>
			<button type="button" id="tabBtnChangelog" class="px-5 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition">
				<span>Changelog</span>
			</button>
			<button type="button" id="tabBtnVersions" class="px-5 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition flex items-center gap-1.5">
				<span data-i18n="mod.tab.versions">Versions</span>
				<span id="tabVersionsBadge" class="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400 font-mono">0</span>
			</button>
			<button type="button" id="tabBtnGallery" class="hidden px-5 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition">
				<span data-i18n="mod.tab.gallery">Gallery</span>
			</button>
		</div>
	</div>

	<!-- Main 2-Column Content Grid -->
	<main class="flex-1 max-w-[1440px] mx-auto px-6 sm:px-8 py-6 w-full flex flex-col lg:flex-row gap-8 items-start">
		<!-- Left Main Content Column (70%) -->
		<div class="w-full lg:w-[70%] min-w-0 flex flex-col gap-6">
			<!-- Tab 1: Description -->
			<section id="paneDesc" class="oled-card rounded-2xl p-6 sm:p-8">
				<div id="descBody" class="prose-desc leading-relaxed">
					<div class="flex items-center justify-center py-20 text-zinc-500 text-xs">
						<svg class="w-6 h-6 animate-spin text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path></svg>
						<span>Loading project description...</span>
					</div>
				</div>
			</section>

			<!-- Tab 2: Changelog -->
			<section id="paneChangelog" class="hidden oled-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
				<h2 class="text-lg font-bold text-white mb-2">Changelog</h2>
				<div id="changelogBody" class="flex flex-col gap-4 text-xs text-zinc-400">
					<p class="text-zinc-500 italic">No changelog entries available.</p>
				</div>
			</section>

			<!-- Tab 3: Versions (Authentic Modrinth Versions Table) -->
			<section id="paneVersions" class="hidden flex flex-col gap-4">
				<!-- Filter Bar for Versions -->
				<div class="oled-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
					<div class="flex flex-wrap items-center gap-3">
						<!-- Game Version Filter -->
						<div class="flex items-center gap-2">
							<span class="text-xs text-zinc-400 font-medium">Minecraft:</span>
							<select id="selVerGame" class="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition">
								<option value="">All versions</option>
							</select>
						</div>

						<!-- Loader Filter -->
						<div class="flex items-center gap-2">
							<span class="text-xs text-zinc-400 font-medium">Loader:</span>
							<select id="selVerLoader" class="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition">
								<option value="">All loaders</option>
								<option value="fabric">Fabric</option>
								<option value="forge">Forge</option>
								<option value="neoforge">NeoForge</option>
								<option value="quilt">Quilt</option>
							</select>
						</div>

						<!-- Channel Filter -->
						<div class="flex items-center gap-2">
							<span class="text-xs text-zinc-400 font-medium">Channel:</span>
							<select id="selVerChannel" class="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition">
								<option value="">All channels</option>
								<option value="release">Release</option>
								<option value="beta">Beta</option>
								<option value="alpha">Alpha</option>
							</select>
						</div>
					</div>

					<span id="verResultsCount" class="text-xs text-zinc-500 font-mono"></span>
				</div>

				<!-- Versions Table / List -->
				<div id="versionsListContainer" class="flex flex-col gap-2.5">
					<div class="flex items-center justify-center py-20 text-zinc-500 text-xs">
						<svg class="w-6 h-6 animate-spin text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path></svg>
						<span>Loading versions...</span>
					</div>
				</div>
			</section>

			<!-- Tab 4: Gallery -->
			<section id="paneGallery" class="hidden oled-card rounded-2xl p-6 sm:p-8">
				<h2 class="text-lg font-bold text-white mb-4">Gallery</h2>
				<div id="galleryGrid" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
			</section>
		</div>

		<!-- Right Meta Sidebar (30%) (matching Modrinth media_1789237299262.png) -->
		<aside class="w-full lg:w-[30%] shrink-0 flex flex-col gap-4 select-none">
			<!-- Compatibility Card -->
			<div class="oled-card p-5 rounded-2xl flex flex-col gap-3.5">
				<h3 data-i18n="mod.compatibility" class="text-sm font-bold text-white">Compatibility</h3>
				<div>
					<div class="text-xs text-zinc-400 mb-2">Minecraft: Java Edition</div>
					<div id="sideCompatVersions" class="flex flex-wrap gap-1.5">
						<!-- Dynamically populated version pills -->
					</div>
				</div>

				<div class="border-t border-zinc-900 pt-3">
					<div data-i18n="mod.platforms" class="text-xs text-zinc-400 mb-2">Platforms</div>
					<div id="sidePlatforms" class="flex flex-wrap gap-1.5">
						<!-- Dynamically populated loader pills -->
					</div>
				</div>

				<div class="border-t border-zinc-900 pt-3">
					<div data-i18n="mod.environments" class="text-xs text-zinc-400 mb-2">Supported environments</div>
					<div id="sideEnvironments" class="flex flex-wrap gap-1.5 text-[11px] font-medium">
						<span class="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center gap-1.5">
							<svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
							Client-side
						</span>
						<span class="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center gap-1.5">
							<svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>
							Server-side
						</span>
					</div>
				</div>
			</div>

			<!-- Links Card -->
			<div id="sideLinksCard" class="oled-card p-5 rounded-2xl flex flex-col gap-2.5">
				<h3 data-i18n="mod.links" class="text-sm font-bold text-white mb-1">Links</h3>
				<div id="sideLinksList" class="flex flex-col gap-1.5 text-xs">
					<!-- Dynamically populated links -->
				</div>
			</div>

			<!-- Tags Card -->
			<div class="oled-card p-5 rounded-2xl flex flex-col gap-2.5">
				<h3 data-i18n="mod.tags" class="text-sm font-bold text-white mb-1">Tags</h3>
				<div id="sideTagsList" class="flex flex-wrap gap-1.5">
					<!-- Dynamically populated tags -->
				</div>
			</div>

			<!-- Creators Card -->
			<div class="oled-card p-5 rounded-2xl flex flex-col gap-3">
				<h3 data-i18n="mod.creators" class="text-sm font-bold text-white">Creators</h3>
				<div id="sideCreatorsList" class="flex flex-col gap-2.5">
					<!-- Dynamically populated creators -->
				</div>
			</div>
		</aside>
	</main>

	<!-- Footer -->
	<footer class="border-t border-zinc-900 py-8 text-center text-xs text-zinc-500">
		<div class="max-w-[1440px] mx-auto px-6 sm:px-8 flex items-center justify-between">
			<span>MacrosApp &copy; 2026</span>
			<a href="/" data-i18n="download.back_home" class="hover:text-zinc-300 transition">Back to home</a>
		</div>
	</footer>

	<!-- Toast Notification -->
	<div id="toastNotification" class="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl text-xs font-semibold text-white transition-all transform translate-y-24 opacity-0 flex items-center gap-2">
		<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
		<span id="toastMessage">Notification</span>
	</div>

	<script>
	(function() {
		const MOD_ID = '${safeModId}';
		const PROVIDER = '${provider}';
		let allVersions = [];
		let projectData = null;

		function showToast(msg) {
			const toast = document.getElementById('toastNotification');
			const label = document.getElementById('toastMessage');
			if (!toast || !label) return;
			label.textContent = msg;
			toast.classList.remove('translate-y-24', 'opacity-0');
			setTimeout(() => {
				toast.classList.add('translate-y-24', 'opacity-0');
			}, 3000);
		}

		document.getElementById('heroShareBtn').onclick = () => {
			navigator.clipboard.writeText(window.location.href);
			showToast('Link copied to clipboard!');
		};

		// Tabs Switching
		const tabBtnDesc = document.getElementById('tabBtnDesc');
		const tabBtnChangelog = document.getElementById('tabBtnChangelog');
		const tabBtnVersions = document.getElementById('tabBtnVersions');
		const tabBtnGallery = document.getElementById('tabBtnGallery');

		const paneDesc = document.getElementById('paneDesc');
		const paneChangelog = document.getElementById('paneChangelog');
		const paneVersions = document.getElementById('paneVersions');
		const paneGallery = document.getElementById('paneGallery');

		function selectTab(tab) {
			const activeClasses = 'px-5 py-1.5 rounded-full text-xs font-semibold bg-emerald-600/90 text-white shadow-sm transition';
			const inactiveClasses = 'px-5 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition';

			tabBtnDesc.className = tab === 'desc' ? activeClasses : inactiveClasses;
			tabBtnChangelog.className = tab === 'changelog' ? activeClasses : inactiveClasses;
			tabBtnVersions.className = (tab === 'versions' ? activeClasses : inactiveClasses) + ' flex items-center gap-1.5';
			tabBtnGallery.className = tab === 'gallery' ? activeClasses : inactiveClasses;

			paneDesc.classList.toggle('hidden', tab !== 'desc');
			paneChangelog.classList.toggle('hidden', tab !== 'changelog');
			paneVersions.classList.toggle('hidden', tab !== 'versions');
			paneGallery.classList.toggle('hidden', tab !== 'gallery');
		}

		tabBtnDesc.onclick = () => selectTab('desc');
		tabBtnChangelog.onclick = () => selectTab('changelog');
		tabBtnVersions.onclick = () => selectTab('versions');
		tabBtnGallery.onclick = () => selectTab('gallery');

		function formatNumber(num) {
			if (!num) return '0';
			if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
			if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
			return String(num);
		}

		function formatFileSize(bytes) {
			if (!bytes) return '';
			if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
			if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
			return bytes + ' B';
		}

		function formatRelativeDate(dateStr) {
			if (!dateStr) return '';
			try {
				const d = new Date(dateStr);
				const diffDays = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
				if (diffDays < 1) return 'Today';
				if (diffDays === 1) return 'Yesterday';
				if (diffDays < 30) return diffDays + ' days ago';
				const months = Math.floor(diffDays / 30);
				return months + ' months ago';
			} catch (e) {
				return '';
			}
		}

		function renderMarkdown(md) {
			if (!md) return '<p class="text-zinc-500 italic">No description provided.</p>';
			let html = md
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
			html = html.replace(new RegExp('\\\\x60{3}([a-z]*)\\\\n([\\\\s\\\\S]*?)\\\\x60{3}', 'g'), '<pre class="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono overflow-x-auto text-zinc-300 my-3"><code>$2</code></pre>');
			html = html.replace(new RegExp('\\\\x60([^\\\\x60]+)\\\\x60', 'g'), '<code class="bg-zinc-900 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
			html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-white mt-4 mb-2">$1</h3>');
			html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-white mt-5 mb-2">$1</h2>');
			html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-white mt-6 mb-3">$1</h1>');
			html = html.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong class="font-bold text-white">$1</strong>');
			html = html.replace(/\\*([^*]+)\\*/g, '<em class="italic text-zinc-300">$1</em>');
			html = html.replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<img src="$2" alt="$1" class="rounded-xl my-3 max-w-full border border-zinc-800 shadow-md">');
			html = html.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-emerald-400 hover:underline font-medium">$1</a>');
			html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-emerald-500/50 pl-4 py-1 text-zinc-400 italic my-2">$1</blockquote>');
			html = html.replace(/^\\s*[-*]\\s+(.*$)/gim, '<li class="ml-4 list-disc text-zinc-300 my-1">$1</li>');
			html = html.replace(/\\n\\n+/g, '</p><p class="my-2 leading-relaxed text-zinc-300">');
			return '<p class="my-2 leading-relaxed text-zinc-300">' + html + '</p>';
		}

		async function loadProjectData() {
			try {
				if (PROVIDER === 'modrinth') {
					const [pRes, vRes] = await Promise.all([
						fetch('/v2/project/' + MOD_ID),
						fetch('/v2/project/' + MOD_ID + '/version')
					]);
					if (!pRes.ok) throw new Error('Failed to load project from Modrinth');
					const proj = await pRes.json();
					projectData = proj;

					document.getElementById('pageTitle').textContent = proj.title + ' | MacrosApp';
					document.getElementById('heroTitle').textContent = proj.title;
					document.getElementById('heroSummary').textContent = proj.description || '';
					if (proj.icon_url) document.getElementById('heroIcon').src = proj.icon_url;
					document.getElementById('heroDownloads').textContent = formatNumber(proj.downloads);
					document.getElementById('heroFollowers').textContent = formatNumber(proj.followers);
					if (proj.categories && proj.categories[0]) {
						document.getElementById('heroCategoryPill').textContent = proj.categories[0].charAt(0).toUpperCase() + proj.categories[0].slice(1);
					}

					document.getElementById('heroLauncherBtn').href = 'macros://install/modrinth/' + MOD_ID;

					// Description markdown
					document.getElementById('descBody').innerHTML = renderMarkdown(proj.body);

					// Gallery
					if (proj.gallery && proj.gallery.length > 0) {
						tabBtnGallery.classList.remove('hidden');
						document.getElementById('galleryGrid').innerHTML = proj.gallery.map(g => {
							return '<div class="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 group relative">' +
								'<img src="' + g.url + '" alt="' + (g.title || '') + '" class="w-full h-52 object-cover group-hover:scale-105 transition duration-300">' +
								(g.title ? '<div class="p-3 text-xs font-medium text-zinc-300 truncate bg-zinc-900/90">' + g.title + '</div>' : '') +
								'</div>';
						}).join('');
					}

					// Sidebar: Compatibility
					const sideCompat = document.getElementById('sideCompatVersions');
					sideCompat.innerHTML = (proj.game_versions || []).slice(0, 16).map(v => {
						return '<span class="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 text-[11px] font-mono">' + v + '</span>';
					}).join('') + ((proj.game_versions || []).length > 16 ? '<span class="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-500 border border-zinc-800 text-[11px]">+' + (proj.game_versions.length - 16) + '</span>' : '');

					const sidePlatforms = document.getElementById('sidePlatforms');
					sidePlatforms.innerHTML = (proj.loaders || []).map(l => {
						return '<span class="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-200 border border-zinc-800 text-xs font-semibold uppercase tracking-wider">' + l + '</span>';
					}).join('');

					// Sidebar: Links
					const sideLinks = document.getElementById('sideLinksList');
					let linksHtml = '';
					if (proj.issues_url) linksHtml += '<a href="' + proj.issues_url + '" target="_blank" rel="noopener" class="flex items-center justify-between p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition"><span>Report issues</span><span class="text-zinc-500">↗</span></a>';
					if (proj.source_url) linksHtml += '<a href="' + proj.source_url + '" target="_blank" rel="noopener" class="flex items-center justify-between p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition"><span>View source</span><span class="text-zinc-500">↗</span></a>';
					if (proj.wiki_url) linksHtml += '<a href="' + proj.wiki_url + '" target="_blank" rel="noopener" class="flex items-center justify-between p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition"><span>Visit wiki</span><span class="text-zinc-500">↗</span></a>';
					if (proj.discord_url) linksHtml += '<a href="' + proj.discord_url + '" target="_blank" rel="noopener" class="flex items-center justify-between p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition"><span>Join Discord server</span><span class="text-zinc-500">↗</span></a>';
					if (linksHtml) {
						sideLinks.innerHTML = linksHtml;
					} else {
						document.getElementById('sideLinksCard').classList.add('hidden');
					}

					// Sidebar: Tags
					const sideTags = document.getElementById('sideTagsList');
					sideTags.innerHTML = (proj.categories || []).map(c => {
						return '<span class="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-medium capitalize">' + c + '</span>';
					}).join('');

					// Sidebar: Creators / Team
					const sideCreators = document.getElementById('sideCreatorsList');
					if (proj.team) {
						fetch('/v2/team/' + proj.team + '/members')
							.then(r => r.ok ? r.json() : [])
							.then(members => {
								if (members.length > 0) {
									sideCreators.innerHTML = members.map(m => {
										const u = m.user || {};
										const avatar = u.avatar_url
											? '<img src="' + u.avatar_url + '" class="w-8 h-8 rounded-full object-cover">'
											: '<div class="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-xs font-bold text-white">' + (u.username ? u.username.charAt(0).toUpperCase() : 'U') + '</div>';
										return '<div class="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-zinc-900/60 transition">' +
											avatar +
											'<div class="min-w-0 flex-1">' +
											'<div class="text-xs font-bold text-white truncate flex items-center gap-1.5">' +
											(u.username || 'Member') +
											(m.role === 'Owner' ? '<span title="Owner">👑</span>' : '') +
											'</div>' +
											'<span class="text-[11px] text-zinc-500">' + (m.role || 'Member') + '</span>' +
											'</div>' +
											'</div>';
									}).join('');
								} else {
									sideCreators.innerHTML = '<span class="text-xs text-zinc-500">Community author</span>';
								}
							})
							.catch(() => {
								sideCreators.innerHTML = '<span class="text-xs text-zinc-500">Community author</span>';
							});
					}

					// Versions
					if (vRes.ok) {
						allVersions = await vRes.json();
						document.getElementById('tabVersionsBadge').textContent = String(allVersions.length);
						populateVersionFilters(allVersions);
						renderVersionsTable(allVersions);

						// Hook up hero download button to latest primary file
						if (allVersions.length > 0) {
							const latest = allVersions[0];
							const prim = (latest.files || []).find(f => f.primary) || (latest.files && latest.files[0]);
							if (prim && prim.url) {
								document.getElementById('heroDownloadBtn').href = prim.url;
							}
						}
					}
				} else {
					// CurseForge Provider
					const [mRes, dRes, fRes] = await Promise.all([
						fetch('/api/v1/curseforge/mod/' + MOD_ID),
						fetch('/api/v1/curseforge/mod/' + MOD_ID + '/description'),
						fetch('/api/v1/curseforge/mod/' + MOD_ID + '/files')
					]);
					if (!mRes.ok) throw new Error('Failed to load project from CurseForge');
					const modData = await mRes.json();
					const mod = modData.data || {};
					projectData = mod;

					document.getElementById('pageTitle').textContent = mod.name + ' — MacrosApp';
					document.getElementById('heroTitle').textContent = mod.name;
					document.getElementById('heroSummary').textContent = mod.summary || '';
					if (mod.logo && mod.logo.url) document.getElementById('heroIcon').src = mod.logo.url;
					document.getElementById('heroDownloads').textContent = formatNumber(mod.downloadCount);
					document.getElementById('heroFollowers').textContent = formatNumber(mod.thumbsUpCount || 0);

					const badge = document.getElementById('heroProviderBadge');
					badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider provider-badge-curseforge';
					badge.textContent = 'CurseForge';

					if (mod.categories && mod.categories[0]) {
						document.getElementById('heroCategoryPill').textContent = mod.categories[0].name;
					}

					document.getElementById('heroLauncherBtn').href = 'macros://install/curseforge/' + MOD_ID;

					if (dRes.ok) {
						const descData = await dRes.json();
						document.getElementById('descBody').innerHTML = descData.data || '<p class="text-zinc-500 italic">No description provided.</p>';
					}

					if (mod.screenshots && mod.screenshots.length > 0) {
						tabBtnGallery.classList.remove('hidden');
						document.getElementById('galleryGrid').innerHTML = mod.screenshots.map(s => {
							return '<div class="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 group relative">' +
								'<img src="' + s.url + '" alt="' + (s.title || '') + '" class="w-full h-52 object-cover group-hover:scale-105 transition duration-300">' +
								(s.title ? '<div class="p-3 text-xs font-medium text-zinc-300 truncate bg-zinc-900/90">' + g.title + '</div>' : '') +
								'</div>';
						}).join('');
					}

					// Sidebar: Links
					const sideLinks = document.getElementById('sideLinksList');
					let linksHtml = '';
					if (mod.links) {
						if (mod.links.issuesUrl) linksHtml += '<a href="' + mod.links.issuesUrl + '" target="_blank" rel="noopener" class="flex items-center justify-between p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition"><span>Report issues</span><span class="text-zinc-500">↗</span></a>';
						if (mod.links.sourceUrl) linksHtml += '<a href="' + mod.links.sourceUrl + '" target="_blank" rel="noopener" class="flex items-center justify-between p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition"><span>View source</span><span class="text-zinc-500">↗</span></a>';
						if (mod.links.wikiUrl) linksHtml += '<a href="' + mod.links.wikiUrl + '" target="_blank" rel="noopener" class="flex items-center justify-between p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition"><span>Visit wiki</span><span class="text-zinc-500">↗</span></a>';
					}
					if (linksHtml) sideLinks.innerHTML = linksHtml;
					else document.getElementById('sideLinksCard').classList.add('hidden');

					// Sidebar: Tags
					document.getElementById('sideTagsList').innerHTML = (mod.categories || []).map(c => {
						return '<span class="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-medium capitalize">' + c.name + '</span>';
					}).join('');

					// Sidebar: Creators
					document.getElementById('sideCreatorsList').innerHTML = (mod.authors || []).map(a => {
						return '<div class="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-zinc-900/60 transition">' +
							'<div class="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-xs font-bold text-white">' + a.name.charAt(0).toUpperCase() + '</div>' +
							'<div class="min-w-0 flex-1">' +
							'<div class="text-xs font-bold text-white truncate">' + a.name + '</div>' +
							'<span class="text-[11px] text-zinc-500">Author</span>' +
							'</div>' +
							'</div>';
					}).join('');

					// Versions / Files
					if (fRes.ok) {
						const fData = await fRes.json();
						allVersions = fData.data || [];
						document.getElementById('tabVersionsBadge').textContent = String(allVersions.length);
						populateVersionFilters(allVersions);
						renderVersionsTable(allVersions);

						if (allVersions.length > 0) {
							document.getElementById('heroDownloadBtn').href = '/api/v1/curseforge/download/' + MOD_ID + '?fileId=' + allVersions[0].id;
						}
					}
				}
			} catch (err) {
				console.error(err);
				document.getElementById('descBody').innerHTML = '<div class="text-center py-20 text-red-400 text-xs">Failed to load project details. Please try refreshing.</div>';
			}
		}

		function populateVersionFilters(versions) {
			const gameSet = new Set();
			versions.forEach(v => {
				if (PROVIDER === 'modrinth') {
					(v.game_versions || []).forEach(g => gameSet.add(g));
				} else {
					(v.gameVersions || []).filter(g => /^\\d+\\.\\d+/.test(g)).forEach(g => gameSet.add(g));
				}
			});

			const selGame = document.getElementById('selVerGame');
			selGame.innerHTML = '<option value="">All versions</option>' +
				Array.from(gameSet).slice(0, 30).map(g => '<option value="' + g + '">' + g + '</option>').join('');

			selGame.onchange = applyVersionFilters;
			document.getElementById('selVerLoader').onchange = applyVersionFilters;
			document.getElementById('selVerChannel').onchange = applyVersionFilters;
		}

		function applyVersionFilters() {
			const filterGame = document.getElementById('selVerGame').value.toLowerCase();
			const filterLoader = document.getElementById('selVerLoader').value.toLowerCase();
			const filterChannel = document.getElementById('selVerChannel').value.toLowerCase();

			const filtered = allVersions.filter(v => {
				if (PROVIDER === 'modrinth') {
					if (filterGame && !(v.game_versions || []).some(g => g.toLowerCase().includes(filterGame))) return false;
					if (filterLoader && !(v.loaders || []).includes(filterLoader)) return false;
					if (filterChannel && (v.version_type || 'release') !== filterChannel) return false;
				} else {
					const gameVers = (v.gameVersions || []).filter(g => /^\\d+\\.\\d+/.test(g)).map(g => g.toLowerCase());
					const loaders = (v.gameVersions || []).filter(g => ['fabric', 'forge', 'neoforge', 'quilt'].includes(g.toLowerCase())).map(g => g.toLowerCase());
					const chMap = { 1: 'release', 2: 'beta', 3: 'alpha' };
					const ch = chMap[v.releaseType] || 'release';

					if (filterGame && !gameVers.some(g => g.includes(filterGame))) return false;
					if (filterLoader && !loaders.includes(filterLoader)) return false;
					if (filterChannel && ch !== filterChannel) return false;
				}
				return true;
			});

			renderVersionsTable(filtered);
		}

		function renderVersionsTable(versions) {
			const container = document.getElementById('versionsListContainer');
			const countEl = document.getElementById('verResultsCount');
			countEl.textContent = versions.length + ' versions';
			container.innerHTML = '';

			if (!versions || versions.length === 0) {
				container.innerHTML = '<div class="oled-card p-12 text-center text-zinc-500 text-xs rounded-2xl">No compatible versions found with selected filters.</div>';
				return;
			}

			versions.forEach(v => {
				const row = document.createElement('div');
				row.className = 'oled-card p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700/80 transition';

				let cleanName = '';
				let typeBadge = '';
				let gameVers = [];
				let loaders = [];
				let sizeText = '';
				let dateText = '';
				let dlUrl = '';
				let fileId = '';

				if (PROVIDER === 'modrinth') {
					cleanName = v.version_number || v.name;
					cleanName = cleanName.replace(/^\\[[^\\]]+\\]\\s*/, '');
					const type = v.version_type || 'release';
					if (type === 'release') typeBadge = '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Release</span>';
					else if (type === 'beta') typeBadge = '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">Beta</span>';
					else typeBadge = '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">Alpha</span>';

					gameVers = v.game_versions || [];
					loaders = v.loaders || [];
					const primFile = (v.files || []).find(f => f.primary) || (v.files && v.files[0]);
					if (primFile) {
						sizeText = formatFileSize(primFile.size);
						dlUrl = primFile.url;
					}
					dateText = formatRelativeDate(v.date_published);
					fileId = v.id;
				} else {
					cleanName = v.displayName || v.fileName;
					const rType = v.releaseType;
					if (rType === 1) typeBadge = '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Release</span>';
					else if (rType === 2) typeBadge = '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">Beta</span>';
					else typeBadge = '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">Alpha</span>';

					gameVers = (v.gameVersions || []).filter(g => /^\\d+\\.\\d+/.test(g));
					loaders = (v.gameVersions || []).filter(g => ['fabric', 'forge', 'neoforge', 'quilt'].includes(g.toLowerCase()));
					sizeText = formatFileSize(v.fileLength);
					dateText = formatRelativeDate(v.fileDate);
					dlUrl = '/api/v1/curseforge/download/' + MOD_ID + '?fileId=' + v.id;
					fileId = String(v.id);
				}

				const left = document.createElement('div');
				left.className = 'flex flex-col gap-1.5 min-w-0 flex-1';

				const verHeader = document.createElement('div');
				verHeader.className = 'flex flex-wrap items-center gap-2.5';
				verHeader.innerHTML = typeBadge + '<span class="text-sm font-bold text-white font-mono truncate">' + cleanName + '</span>';
				left.appendChild(verHeader);

				const metaRow = document.createElement('div');
				metaRow.className = 'flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-0.5';

				if (gameVers.length > 0) {
					metaRow.innerHTML += '<div class="flex items-center gap-1 font-mono text-zinc-300">' +
						gameVers.slice(0, 3).map(g => '<span class="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[11px]">' + g + '</span>').join('') +
						(gameVers.length > 3 ? '<span class="text-[10px] text-zinc-500">+' + (gameVers.length - 3) + '</span>' : '') +
						'</div>';
				}

				if (loaders.length > 0) {
					metaRow.innerHTML += '<span class="text-zinc-700">•</span>' +
						'<div class="flex items-center gap-1 uppercase tracking-wider font-semibold text-[10px] text-zinc-400">' +
						loaders.join(', ') +
						'</div>';
				}

				if (sizeText) {
					metaRow.innerHTML += '<span class="text-zinc-700">•</span><span class="font-mono text-zinc-400">' + sizeText + '</span>';
				}

				if (dateText) {
					metaRow.innerHTML += '<span class="text-zinc-700">•</span><span class="text-zinc-500 text-[11px]">' + dateText + '</span>';
				}

				left.appendChild(metaRow);
				row.appendChild(left);

				const right = document.createElement('div');
				right.className = 'flex items-center gap-2 shrink-0';

				const dlBtn = document.createElement('a');
				dlBtn.href = dlUrl || '#';
				dlBtn.target = '_blank';
				dlBtn.className = 'px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/10 active:scale-95';
				dlBtn.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>' +
					'<span data-i18n="catalog.btn.download">Download</span>';
				right.appendChild(dlBtn);

				const instBtn = document.createElement('a');
				instBtn.href = 'macros://install/' + PROVIDER + '/' + MOD_ID + (fileId ? '?version=' + fileId : '');
				instBtn.className = 'px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white font-medium text-xs transition flex items-center gap-1.5 active:scale-95';
				instBtn.title = 'Install in Launcher';
				instBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
				right.appendChild(instBtn);

				row.appendChild(right);
				container.appendChild(row);
			});
		}

		loadProjectData();
	})();
	</script>
	${renderNavbarUserScript()}
	${renderCreateProjectModalHtml()}
</body>
</html>`
}
