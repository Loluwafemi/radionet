<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	let { isOpen = $bindable(false), title, children }: { isOpen: boolean; title: string; children: any } = $props();

	function close() {
		isOpen = false;
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		role="button"
		tabindex="0"
	>
		<div
			class="glass rounded-3xl p-6 w-full max-w-md"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-semibold">{title}</h2>
				<button
					onclick={close}
					class="glass rounded-full w-8 h-8 flex items-center justify-center hover:bg-white/20"
					aria-label="Close"
				>
					✕
				</button>
			</div>
			<div>
				{@render children()}
			</div>
		</div>
	</div>
{/if}