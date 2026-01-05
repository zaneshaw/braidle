<script lang="ts">
	import { createSelect, melt } from "@melt-ui/svelte";
	import { onMount } from "svelte";

	let { onSelect } = $props();

	let worlds: any[] = $state([]);

	const {
		elements: { trigger, menu, option },
		states: { open, selected },
	} = createSelect<string>({
		positioning: {
			placement: "bottom",
			fitViewport: true,
			sameWidth: true,
		},
	});

	selected.subscribe((option) => {
		if (option) {
			onSelect(option.value);
			selected.set(undefined);
		}
	});

	onMount(async () => {
		const res = await fetch("/api/levels?groupByWorld");
		worlds = await res.json();
	});
</script>

<div class="flex w-full items-center justify-center">
	<button use:melt={$trigger} class="flex h-10 grow items-center justify-between bg-red-500/20">Select a level</button>
	{#if $open}
		<div use:melt={$menu} class="z-10 flex max-h-0 flex-col overflow-y-auto bg-white shadow">
			{#each worlds, i}
				<div>
					<div class="pt-3 pr-4 pl-2 text-neutral-500">World {i}</div>
					{#each worlds[i] as item}
						<div use:melt={$option({ value: `${item.world}-${item.level}` })} class="relative cursor-pointer py-1 pr-4 pl-6 text-neutral-800 hover:bg-cyan-100 hover:text-cyan-800 focus:z-10">
							{item.world}-{item.level}{item.name && `: ${item.name}`}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>
