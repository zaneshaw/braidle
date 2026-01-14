<script lang="ts">
	import { onMount } from "svelte";

	let { onSelect, hasPieces = false, disabled = false }: { onSelect: (level: string) => void; hasPieces?: boolean; disabled?: boolean } = $props();

	let worlds: any[] = $state([]);

	let isOpen = $state(false);
	let dropdownParent: HTMLElement;
	let dropdown: HTMLElement;

	onMount(async () => {
		const searchParams = new URLSearchParams();
		searchParams.append("groupByWorld", "true");
		if (hasPieces) searchParams.append("hasPieces", "true");

		const res = await fetch(`/api/levels${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`);

		worlds = await res.json();
	});

	$effect(() => {
		if (isOpen) {
			dropdown.style.height = `${window.innerHeight - dropdown.getBoundingClientRect().y - 10}px`;
			dropdown.scrollTop = 0;
		}
	});

	function documentOnClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (isOpen && !dropdownParent.contains(target)) {
			isOpen = false;
		}
	}
</script>

<svelte:document onclick={documentOnClick} />

<div bind:this={dropdownParent} class="relative flex w-full items-center justify-center">
	<button
		onclick={() => {
			if (!disabled) isOpen = !isOpen;
		}}
		class="flex h-10 grow cursor-pointer items-center bg-neutral-500 px-5"><span>Select a level ▼</span></button
	>
	<div bind:this={dropdown} class="absolute bottom-0 left-0 z-50 size-20 max-h-max w-full translate-y-full flex-col overflow-y-auto bg-white shadow {isOpen ? 'flex' : 'hidden'}">
		{#each worlds as world, i}
			{#if world.length > 0}
				<div>
					<div class="pt-3 pr-4 pl-2 text-neutral-500">World {i}</div>
					{#each world as level}
						<button
							onclick={() => {
								isOpen = false;
								onSelect(`${level.world}-${level.level}`);
							}}
							class="flex w-full cursor-pointer py-1 pr-4 pl-6 text-neutral-800 hover:bg-cyan-100 hover:text-cyan-800"
						>
							{level.world}-{level.level}{level.name && `: ${level.name}`}
						</button>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</div>
