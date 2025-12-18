import { browser } from '$app/environment';

class AudioStore {
	frequency = $state(98.0);
	isPlaying = $state(false);
	volume = $state(0.7);
	searchQuery = $state('');
	
	// Audio context for visualization
	audioContext: AudioContext | null = null;
	analyser: AnalyserNode | null = null;
	sourceNode: MediaElementAudioSourceNode | null = null;
	audioElement: HTMLAudioElement | null = null;

	// Derived stream URL
	streamUrl = $derived("");

	setStationURL(url: string) {
		this.streamUrl = url
	}

	togglePlay() {
		this.isPlaying = !this.isPlaying;
	}

	setVolume(vol: number) {
		this.volume = Math.max(0, Math.min(1, vol));
	}

	setSearchQuery(query: string) {
		this.searchQuery = query;
	}

	// Initialize Web Audio API
	initAudioContext(audioEl: HTMLAudioElement) {
		if (!browser || this.audioContext) return;

		try {
			this.audioElement = audioEl;
			this.audioContext = new AudioContext();
			this.analyser = this.audioContext.createAnalyser();
			this.analyser.fftSize = 2048;
			this.analyser.smoothingTimeConstant = 0.8;

			this.sourceNode = this.audioContext.createMediaElementSource(audioEl);
			this.sourceNode.connect(this.analyser);
			this.analyser.connect(this.audioContext.destination);
		} catch (error) {
			console.error('Failed to initialize audio context:', error);
		}
	}

	// Resume audio context (required after user interaction)
	async resumeAudioContext() {
		if (this.audioContext?.state === 'suspended') {
			await this.audioContext.resume();
		}
	}

	// Clean up
	destroy() {
		this.sourceNode?.disconnect();
		this.analyser?.disconnect();
		this.audioContext?.close();
	}
}

export const audio = new AudioStore();