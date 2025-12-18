import { browser } from '$app/environment';

class ThemeStore {
	isDark = $state(false);

	constructor() {
		if (browser) {
			// Load saved theme or detect system preference
			const saved = localStorage.getItem('theme');
			this.isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
			this.applyTheme();
		}
	}

	toggle() {
		this.isDark = !this.isDark;
		this.applyTheme();
		if (browser) {
			localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
		}
	}

	private applyTheme() {
		if (browser) {
			document.documentElement.classList.toggle('dark', this.isDark);
		}
	}
}

export const theme = new ThemeStore();