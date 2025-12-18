import { browser } from '$app/environment';

class PreferencesStore {
	defaultFrequency = $state(98.0);

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('defaultFrequency');
			if (saved) this.defaultFrequency = parseFloat(saved);
		}
	}

	setDefaultFrequency(freq: number) {
		this.defaultFrequency = freq;
		if (browser) {
			localStorage.setItem('defaultFrequency', freq.toString());
		}
	}
}

export const preferences = new PreferencesStore();