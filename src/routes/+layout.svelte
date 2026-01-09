<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme.svelte';
	import { onMount } from 'svelte';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';


	let { children } = $props();

	onMount(() => {
		// Apply theme on mount
		theme.isDark;
	});


	injectSpeedInsights();
	injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>



<div class="min-h-screen transition-colors duration-300">
	<button
		onclick={() => theme.toggle()}
		class="fixed top-4 right-4 z-50 glass rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/20"
		aria-label="Toggle theme"
	>
		{#if theme.isDark}
			☀️
		{:else}
			🌙
		{/if}
	</button>

	{@render children()}
</div>