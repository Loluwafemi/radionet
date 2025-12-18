/**
 * Audio utility functions for Web Audio API
 * Following MDN 2025 best practices
 */

export interface AudioVisualizerConfig {
	fftSize: number;
	smoothingTimeConstant: number;
	minDecibels: number;
	maxDecibels: number;
}

export const DEFAULT_VISUALIZER_CONFIG: AudioVisualizerConfig = {
	fftSize: 2048, // Power of 2, balance between frequency resolution and performance
	smoothingTimeConstant: 0.8, // Smooth transitions between frames
	minDecibels: -90,
	maxDecibels: -10
};

/**
 * Create and configure an AnalyserNode for audio visualization
 */
export function createAnalyser(
	audioContext: AudioContext,
	config: Partial<AudioVisualizerConfig> = {}
): AnalyserNode {
	const analyser = audioContext.createAnalyser();
	const fullConfig = { ...DEFAULT_VISUALIZER_CONFIG, ...config };

	analyser.fftSize = fullConfig.fftSize;
	analyser.smoothingTimeConstant = fullConfig.smoothingTimeConstant;
	analyser.minDecibels = fullConfig.minDecibels;
	analyser.maxDecibels = fullConfig.maxDecibels;

	return analyser;
}

/**
 * Connect audio element to analyser for visualization
 */
export function connectAudioSource(
	audioContext: AudioContext,
	audioElement: HTMLAudioElement,
	analyser: AnalyserNode
): MediaElementAudioSourceNode {
	const source = audioContext.createMediaElementSource(audioElement);
	source.connect(analyser);
	analyser.connect(audioContext.destination);
	return source;
}

/**
 * Resume audio context (required after user interaction in many browsers)
 */
export async function resumeAudioContext(audioContext: AudioContext): Promise<void> {
	if (audioContext.state === 'suspended') {
		try {
			await audioContext.resume();
		} catch (error) {
			console.error('Failed to resume audio context:', error);
		}
	}
}

/**
 * Suspend audio context to save resources
 */
export async function suspendAudioContext(audioContext: AudioContext): Promise<void> {
	if (audioContext.state === 'running') {
		try {
			await audioContext.suspend();
		} catch (error) {
			console.error('Failed to suspend audio context:', error);
		}
	}
}

/**
 * Handle visibility change to suspend/resume audio context
 */
export function handleVisibilityChange(audioContext: AudioContext): () => void {
	const handler = () => {
		if (document.hidden) {
			suspendAudioContext(audioContext);
		} else {
			resumeAudioContext(audioContext);
		}
	};

	document.addEventListener('visibilitychange', handler);

	// Return cleanup function
	return () => {
		document.removeEventListener('visibilitychange', handler);
	};
}

/**
 * Get frequency data from analyser
 */
export function getFrequencyData(analyser: AnalyserNode): Uint8Array {
	const bufferLength = analyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);
	analyser.getByteFrequencyData(dataArray);
	return dataArray;
}

/**
 * Get time domain data (waveform) from analyser
 */
export function getTimeDomainData(analyser: AnalyserNode): Uint8Array {
	const bufferLength = analyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);
	analyser.getByteTimeDomainData(dataArray);
	return dataArray;
}

/**
 * Calculate average volume level from frequency data
 */
export function calculateAverageVolume(data: Uint8Array): number {
	const sum = data.reduce((acc, val) => acc + val, 0);
	return sum / data.length / 255; // Normalize to 0-1
}

/**
 * Cleanup audio resources
 */
export function cleanupAudioResources(
	audioContext: AudioContext | null,
	sourceNode: MediaElementAudioSourceNode | null,
	analyser: AnalyserNode | null
): void {
	try {
		sourceNode?.disconnect();
		analyser?.disconnect();
		audioContext?.close();
	} catch (error) {
		console.error('Error cleaning up audio resources:', error);
	}
}

/**
 * Generate stream URL based on frequency
 */
export function generateStreamUrl(frequency: number, baseUrl: string = 'https://stream.example.com/fm'): string {
	return `${baseUrl}/${frequency.toFixed(1)}`;
}

/**
 * Validate frequency range (FM radio: 87.5 - 108.0 MHz)
 */
export function validateFrequency(freq: number): boolean {
	return freq >= 87.5 && freq <= 108.0;
}

/**
 * Format frequency for display
 */
export function formatFrequency(freq: number): string {
	return `${freq.toFixed(1)} MHz`;
}

/**
 * Parse frequency from string
 */
export function parseFrequency(input: string): number | null {
	const cleaned = input.replace(/[^\d.]/g, '');
	const parsed = parseFloat(cleaned);
	
	if (isNaN(parsed) || !validateFrequency(parsed)) {
		return null;
	}
	
	return Math.round(parsed * 10) / 10; // Round to 1 decimal
}