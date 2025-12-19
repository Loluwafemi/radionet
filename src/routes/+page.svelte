<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { audio } from '$lib/stores/audio.svelte';
	import { preferences } from '$lib/stores/preferences.svelte';
	import Visualizer from '$lib/components/Visualizer.svelte';
	import FrequencyDial from '$lib/components/FrequencyDial.svelte';
	import VolumeControl from '$lib/components/VolumeControl.svelte';
  	import type { CustomActionResult, Station } from '$lib/tower/type';
  import { invalidateAll } from '$app/navigation';
  import { countries } from '$lib/tower/countries';
	
	
	let audioElement: HTMLAudioElement = $state<HTMLAudioElement>(null!);
	let showFrequencyModal = $state(false);
	let showVolumeModal = $state(false);

	function handlePlayPause() {
		audio.togglePlay();

			if (audio.isPlaying) {
				audio.resumeAudioContext();
				handleAudioLoaded()
				audioElement.play();
			} else {
				audioElement.pause();
			}
	}

	function handleAudioLoaded() {
		if (!audio.audioContext && audioElement) {
			audio.initAudioContext(audioElement);
		}
	}

	onDestroy(() => {
		audio.destroy();
	});

	let stationResult = $state<Station[]|null>(null)

	async function handleSubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
		event.preventDefault();

		let data = new FormData(event.currentTarget, event.submitter);

		const countryCode = data.get('country')?.toString().split('.')[0]
		const language = data.get('country')?.toString().split('.')[1]
		const tagList = data.get('tags')?.toString().split(',')

		let Jsondata = {
			language,
			tagList,
			countryCode
		}

		const response = await fetch(`${event.currentTarget.action}tower`, {
			method: 'POST',
			body: JSON.stringify(Jsondata)
		});

		const result: CustomActionResult = await response.json()


		if (!result.status) {
			// rerun all `load` functions, following the successful update
			await invalidateAll();
		}
		stationResult = result.stations!

		if (stationResult) {
			const firstStation = stationResult[0]
			audio.setStationURL(firstStation);
			audio.station = firstStation;
			audio.togglePlay()

			if (audio.isPlaying) {
				audio.resumeAudioContext();
				handleAudioLoaded()
			}

		}
	}
	
</script>

<svelte:head>
	<title>Radio Player - Stream Your Favorite Stations</title>
	<meta name="description" content="Modern glassmorphic radio player with real-time visualization" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-2xl">
	<!-- Header -->
	<div class="flex items-center justify-between mb-8">
		<h1 class="text-2xl font-bold">Radio Player</h1>
		<a
			href="/settings"
			class="glass rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/20"
			aria-label="Settings"
		>
			⚙️
		</a>
	</div>


	<form  method="POST" onsubmit={handleSubmit} class="mb-8">

		<!-- Search Country -->
		<div class="mb-6">		
			<select name="country" id="" class="w-full glass rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent/50 focus:dark:bg-black focus:bg-gray-200">
				{#each countries as country}
					<option class="text-foreground" value={`${country.code}.${country.name}`}>{country.name}</option>
				{/each}
			</select>
		</div>

		<!-- Search Tag -->
		<div class="mb-6">
			<input
				name="tags"
				type="text"
				placeholder="optional: blues, jazz, afro, ...."
				value={audio.searchQuery}
				oninput={(e) => audio.setSearchQuery(e.currentTarget.value)}
				class="w-full glass rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent/50"
			/>
		</div>

		<!-- Search Tag -->
		<div class="mb-6">
			<button class="w-full glass rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent/50" type="submit">Search Station</button>
		</div>
	</form>

	{#if stationResult}
		<div class="m-3 text-lg font-bold">
			<span>{stationResult?.length} Stations Found</span>
		</div>

		<!-- Visualizer -->
			<div class="mb-8 h-48 rounded-2xl border">
				{#if audio.isPlaying}
					<Visualizer />
				{/if}
			</div>

			<!-- Frequency Display -->
			<div class="text-center mb-8">
				<div class="text-5xl font-bold text-accent mb-2">
					<p>{audio.station?.name}</p>
					<p>{audio.station?.country}</p>
				</div>
				<div class="text-sm text-secondary">FM MHz</div>
			</div>

			<!-- Controls -->
			<div class="flex justify-center items-center gap-4 mb-8">
				<button
					onclick={() => showVolumeModal = true}
					class="glass rounded-full w-14 h-14 flex items-center justify-center hover:bg-white/20"
					aria-label="Volume"
				>
					🔊
				</button>

				<button
					onclick={handlePlayPause}
					class="glass rounded-full w-20 h-20 flex items-center justify-center hover:bg-white/20 text-3xl"
					aria-label={audio.isPlaying ? 'Pause' : 'Play'}
				>
					{#if audio.isPlaying}
						⏸
					{:else}
						▶️
					{/if}
				</button>

				<button
					onclick={() => showFrequencyModal = true}
					class="glass rounded-full w-14 h-14 flex items-center justify-center hover:bg-white/20"
					aria-label="Change frequency"
				>
					📻
				</button>
			</div>

			<!-- Hidden audio element -->
			<audio
				bind:this={audioElement}
				src={audio.streamUrl}
				bind:volume={audio.volume}
				onloadeddata={handleAudioLoaded}
				preload="none"
				crossorigin="anonymous"
			></audio>

			<!-- Modals -->
			<FrequencyDial audioElement={audioElement} discoveredStation={stationResult} bind:isOpen={showFrequencyModal} />
			<VolumeControl bind:isOpen={showVolumeModal} />
	
	{:else}	
		<div class="container mx-auto px-4 py-8 max-w-2xl">
			<p class="text-center text-secondary">Discover Stations in Countries. Select A Country</p>
		</div>
	{/if}
	
</div>