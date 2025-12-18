<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { audio } from '$lib/stores/audio.svelte';

	let canvas: HTMLCanvasElement;
	let animationId: number;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx || !audio.analyser) return;

		const bufferLength = audio.analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		function draw() {
			if (!ctx || !audio.analyser) return;

			animationId = requestAnimationFrame(draw);

			audio.analyser.getByteFrequencyData(dataArray);

			// Clear canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw waveform bars
			const barWidth = canvas.width / bufferLength * 2.5;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
				
				// Gradient based on height
				const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
				gradient.addColorStop(0, audio.isPlaying ? '#ff6666' : '#666666');
				gradient.addColorStop(1, audio.isPlaying ? '#ff4444' : '#444444');
				
				ctx.fillStyle = gradient;
				ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

				x += barWidth;
			}
		}

		draw();
	});

	onDestroy(() => {
		if (animationId) cancelAnimationFrame(animationId);
	});
</script>

<canvas
	bind:this={canvas}
	width="800"
	height="200"
	class="w-full h-full rounded-2xl glass"
></canvas>