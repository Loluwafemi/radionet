<script lang="ts">
	import { audio } from '$lib/stores/audio.svelte';
	import Modal from './Modal.svelte';

	let { isOpen = $bindable(false) }: { isOpen: boolean } = $props();

	function handleVolumeChange(e: Event) {
		const target = e.target as HTMLInputElement;
		audio.setVolume(parseFloat(target.value));
	}
</script>

<Modal bind:isOpen title="Volume">
	<div class="space-y-6">
		<div class="text-center">
			<div class="text-4xl font-bold">{Math.round(audio.volume * 100)}%</div>
		</div>

		<div class="space-y-2">
			<input
				type="range"
				min="0"
				max="1"
				step="0.01"
				value={audio.volume}
				oninput={handleVolumeChange}
				class="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10"
				style="accent-color: var(--accent);"
			/>
			<div class="flex justify-between text-xs text-secondary">
				<span>Mute</span>
				<span>Max</span>
			</div>
		</div>

		<button
			onclick={() => isOpen = false}
			class="w-full glass rounded-2xl py-3 font-semibold hover:bg-white/20"
		>
			Done
		</button>
	</div>
</Modal>