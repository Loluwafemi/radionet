<script lang="ts">
	import { preferences } from '$lib/stores/preferences.svelte';
	import { goto } from '$app/navigation';
	
	let frequency = $state(preferences.defaultFrequency);
	let showEmbedCode = $state(false);
	let embedCode = $derived(`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed.js?freq=${frequency}"><\/script>`);

	function saveSettings() {
		preferences.setDefaultFrequency(frequency);
		goto('/');
	}

	function copyEmbedCode() {
		navigator.clipboard.writeText(embedCode);
		alert('Embed code copied to clipboard!');
	}
</script>

<svelte:head>
	<title>Settings - Radio Player</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-2xl">
	<!-- Header -->
	<div class="flex items-center justify-between mb-8">
		<button
			onclick={() => goto('/')}
			class="glass rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/20"
			aria-label="Back"
		>
			←
		</button>
		<h1 class="text-2xl font-bold">Settings</h1>
		<div class="w-10"></div>
	</div>

	<!-- Default Frequency -->
	<div class="glass rounded-3xl p-6 mb-6">
		<h2 class="text-lg font-semibold mb-4">Default Frequency</h2>
		<div class="space-y-4">
			<input
				type="number"
				min="87.5"
				max="108.0"
				step="0.1"
				bind:value={frequency}
				class="w-full glass rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent/50"
			/>
			<p class="text-sm text-secondary">Set your preferred starting frequency (87.5 - 108.0 MHz)</p>
		</div>
	</div>

	<!-- Embed API -->
	<div class="glass rounded-3xl p-6 mb-6">
		<h2 class="text-lg font-semibold mb-4">Embed Player</h2>
		<p class="text-sm text-secondary mb-4">
			Generate an embed code to add this radio player to your website
		</p>
		<button
			onclick={() => showEmbedCode = !showEmbedCode}
			class="w-full glass rounded-2xl py-3 font-semibold hover:bg-white/20 mb-4"
		>
			{showEmbedCode ? 'Hide' : 'Show'} Embed Code
		</button>

		{#if showEmbedCode}
			<div class="space-y-2">
				<pre class="glass rounded-2xl p-4 text-sm overflow-x-auto">{embedCode}</pre>
				<button
					onclick={copyEmbedCode}
					class="w-full glass rounded-2xl py-2 text-sm hover:bg-white/20"
				>
					Copy to Clipboard
				</button>
			</div>
		{/if}
	</div>

	<!-- Save Button -->
	<button
		onclick={saveSettings}
		class="w-full glass rounded-2xl py-4 font-semibold text-lg hover:bg-white/20 bg-accent/20"
	>
		Save & Return
	</button>
</div>