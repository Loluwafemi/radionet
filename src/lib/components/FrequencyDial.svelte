<script lang="ts">
	import { audio } from '$lib/stores/audio.svelte';
	import Modal from './Modal.svelte';

	let { isOpen = $bindable(false) }: { isOpen: boolean } = $props();
	
	let isDragging = $state(false);
	let dialElement: HTMLDivElement;

	const minFreq = 87.5;
	const maxFreq = 108.0;

	function handleDrag(e: MouseEvent | TouchEvent) {
		if (!isDragging || !dialElement) return;

		const rect = dialElement.getBoundingClientRect();
		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
		const newFreq = minFreq + percentage * (maxFreq - minFreq);
		
		audio.setFrequency(newFreq);
	}

	function startDrag() {
		isDragging = true;
	}

	function stopDrag() {
		isDragging = false;
	}

	// Position marker based on current frequency
	const markerPosition = $derived(
		((audio.frequency - minFreq) / (maxFreq - minFreq)) * 100
	);
</script>

<Modal bind:isOpen title="Select Frequency">
	<div class="space-y-6">
		<div class="text-center">
			<div class="text-4xl font-bold text-accent">{audio.frequency.toFixed(1)}</div>
			<div class="text-sm text-secondary">FM MHz</div>
		</div>

		<div
			bind:this={dialElement}
			class="relative h-32 glass rounded-2xl p-4 cursor-pointer"
			onmousedown={startDrag}
			onmousemove={handleDrag}
			onmouseup={stopDrag}
			onmouseleave={stopDrag}
			ontouchstart={startDrag}
			ontouchmove={handleDrag}
			ontouchend={stopDrag}
			role="slider"
			tabindex="0"
			aria-valuemin={minFreq}
			aria-valuemax={maxFreq}
			aria-valuenow={audio.frequency}
		>
			<!-- Frequency markers -->
			<div class="flex justify-between h-full">
				{#each [88, 92, 96, 100, 104, 108] as freq}
					<div class="flex flex-col items-center justify-between">
						<div class="h-8 w-0.5 bg-white/30"></div>
						<span class="text-xs text-secondary">{freq}</span>
					</div>
				{/each}
			</div>

			<!-- Current position marker -->
			<div
				class="absolute top-4 w-1 h-12 bg-accent rounded-full shadow-lg"
				style="left: {markerPosition}%; transition: left 0.1s;"
			></div>
		</div>

		<button
			onclick={() => isOpen = false}
			class="w-full glass rounded-2xl py-3 font-semibold hover:bg-white/20"
		>
			Done
		</button>
	</div>
</Modal>

<svelte:window onmouseup={stopDrag} ontouchend={stopDrag} />