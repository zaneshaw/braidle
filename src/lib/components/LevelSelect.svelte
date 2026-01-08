<script lang="ts">
	import { createSelect, melt } from "@melt-ui/svelte";
	import { onMount } from "svelte";

	let { onSelect, hasPieces = false } = $props();

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
		const searchParams = new URLSearchParams();
		searchParams.append("groupByWorld", "true");
		if (hasPieces) searchParams.append("hasPieces", "true");

		const res = await fetch(`/api/levels${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`);

		worlds = await res.json();
	});
</script>

<div class="flex w-full items-center justify-center">
	<button use:melt={$trigger} class="flex h-10 grow cursor-pointer items-center justify-between bg-red-500/20 px-5"><span>Select a level ▼</span></button>
	{#if $open}
		<div use:melt={$menu} class="z-10 flex max-h-0 flex-col overflow-y-auto bg-white shadow">
			{#each worlds as world, i}
				{#if world.length > 0}
					<div>
						<div class="pt-3 pr-4 pl-2 text-neutral-500">World {i}</div>
						{#each world as level}
							<div use:melt={$option({ value: `${level.world}-${level.level}` })} class="relative cursor-pointer py-1 pr-4 pl-6 text-neutral-800 hover:bg-cyan-100 hover:text-cyan-800 focus:z-10">
								{level.world}-{level.level}{level.name && `: ${level.name}`}
							</div>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
