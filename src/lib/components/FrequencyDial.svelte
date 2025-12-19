<script lang="ts">
	import { audio } from '$lib/stores/audio.svelte';
  	import type { Station } from '$lib/tower/type';
	import Modal from './Modal.svelte';


	let { isOpen = $bindable(false), discoveredStation, audioElement }: { isOpen: boolean, discoveredStation: Station[]|null, audioElement: HTMLAudioElement } = $props();
	

	function handleSelection(station: Station) {
		audio.station = station;
		audio.setStationURL(station);
		audio.togglePlay()

		if (audio.isPlaying) {
			audio.resumeAudioContext();
			if (!audio.audioContext && audioElement) {
				audio.initAudioContext(audioElement);
			}
		}
	}


</script>

<Modal bind:isOpen title="Select Station">
	<div class="space-y-6">
		<div class="text-center">
			<div class="text-4xl font-bold text-accent">{audio.station?.name}</div>
			<div class="text-sm text-secondary">FM MHz</div>
		</div>

		{#if discoveredStation}
			<div class="max-h-64 overflow-y-auto overflow-x-hidden space-y-4 
			[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
				{#each discoveredStation as station}
					<button
						onclick={() => handleSelection(station)}
						class="w-full glass rounded-2xl px-4 py-3 text-left hover:bg-white/20"
					>
						<div class="font-semibold">{station.name}</div>
						<div class="text-sm text-secondary">{station.url}</div>
					</button>
				{/each}
			</div>
		{:else}
			<p>Stations Not Found. Try Different Country</p>
		{/if}

		<button
			onclick={() => isOpen = false}
			class="w-full glass rounded-2xl py-3 font-semibold hover:bg-white/20"
		>
			Done
		</button>
	</div>
</Modal>
