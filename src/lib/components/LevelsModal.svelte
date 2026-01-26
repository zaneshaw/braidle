<script lang="ts">
	import Modal from "./Modal.svelte";

	let { onSelect = () => {}, beforeClose = () => {} }: { onSelect?: (world: number, level: number) => void; beforeClose?: () => void } = $props();

	let modal: Modal;

	export function getModal() {
		return modal;
	}

	async function getLevels() {
		const res = await fetch(`http://127.0.0.1:3000/levels`);
		const data = await res.json();

		return data;
	}
</script>

{#snippet worldLevelButtons(world: any)}
	<div>
		<h4 class="text-nowrap">{world.title}</h4>
		{#each world.levels as level}
			<button
				onclick={() => {
					onSelect(world.world, level.level);

					modal.close();
				}}
				class="flex w-full cursor-pointer items-center gap-1.5 p-1 text-nowrap hover:bg-neutral-600"
			>
				<div class="size-6 bg-neutral-500"></div>
				<span>{world.world}-{level.level}{level.name ? `: ${level.name}` : ""}</span>
			</button>
		{/each}
	</div>
{/snippet}

<Modal bind:this={modal} {beforeClose} duckable class="p-5">
	{#await getLevels()}
		<h3>Loading levels...</h3>
	{:then data}
		<div class="flex flex-col gap-5">
			<h2 class="text-center">Make Your Guess</h2>
			<div class="flex gap-10">
				<div class="flex flex-col gap-5">
					{@render worldLevelButtons(data.levels[0])}
					{@render worldLevelButtons(data.levels[1])}
				</div>
				<div class="flex flex-col gap-5">
					{@render worldLevelButtons(data.levels[2])}
					{@render worldLevelButtons(data.levels[3])}
				</div>
				<div class="flex flex-col gap-5">
					{@render worldLevelButtons(data.levels[4])}
					{@render worldLevelButtons(data.levels[5])}
					{@render worldLevelButtons(data.levels[6])}
				</div>
			</div>
		</div>
	{/await}
</Modal>
