<script lang="ts">
	import LevelSelect from "$lib/components/LevelSelect.svelte";
	import { Game } from "$lib/game.svelte";
	import { onMount, type SvelteComponent } from "svelte";
	import type { PageProps } from "./$types";
	import Modal from "$lib/components/Modal.svelte";
	import Stats from "$lib/components/Stats.svelte";

	let { data }: PageProps = $props();

	const game = new Game("braidoku", 9);

	let modal: SvelteComponent;
	let selectedCell = -1;

	function evaluateState() {
		if (game.data.todaysGuesses.length >= game.gameLength) {
			if (game.data.todaysGuesses.some((guess) => !guess.correct)) {
				return "lose";
			} else {
				return "win";
			}
		}

		return "playing";
	}

	async function guess(cellIndex: number, level: string) {
		if (game.state != "playing") return;

		const res = await fetch(`/api/braidoku?tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}&guess=${cellIndex}-${level}`);
		const { correct } = await res.json();
		game.makeGuess({
			cellIndex,
			level,
			correct,
		});

		game.state = evaluateState();

		switch (game.state) {
			case "win":
				game.win();
				break;
			case "lose":
				game.lose();
				break;
		}

		game.save();
	}

	onMount(() => {
		game.state = evaluateState();
	});
</script>

{#snippet gridSquare(index: number)}
	{@const guess = game.data.todaysGuesses.toReversed().find((guess) => guess.cellIndex == index)}

	<button
		aria-label="aga"
		onclick={() => {
			selectedCell = index;
			modal.open();
		}}
		class="braidoku-grid-square {guess ? (guess?.correct ? 'bg-[url(/images/box_green.png)]!' : 'bg-[url(/images/box_red.png)]!') : ''}"
	>
		<span class="text-2xl">{guess?.level ?? ""}</span>
	</button>
{/snippet}

<Modal bind:this={modal}>
	<div class="w-150 bg-white p-10">
		<LevelSelect
			onSelect={(level: string) => {
				guess(selectedCell, level);
				modal.close();
				selectedCell = -1;
			}}
		/>
	</div>
</Modal>

<div class="bg-neutral-500 px-3 py-1 text-center">
	<h2>Solve today's Braidoku</h2>
	<span>Fill each grid square with a level that falls under the stated categories.</span>
</div>

<div class="flex flex-col bg-neutral-500">
	{#if data.status == "good"}
		<span class="mx-auto mt-2">Guesses: {game.data.todaysGuesses.length}/{game.gameLength}</span>
		<div class="grid size-full grid-cols-4 grid-rows-[1fr_2fr_2fr_2fr] gap-2 *:flex *:size-full *:items-center *:justify-center *:text-center">
			<div></div>
			<span class="braidoku-grid-header">{data.columns[0]}</span>
			<span class="braidoku-grid-header">{data.columns[1]}</span>
			<span class="braidoku-grid-header">{data.columns[2]}</span>

			<span class="braidoku-grid-header">{data.rows[0]}</span>
			{@render gridSquare(0)}
			{@render gridSquare(1)}
			{@render gridSquare(2)}

			<span class="braidoku-grid-header">{data.rows[1]}</span>
			{@render gridSquare(3)}
			{@render gridSquare(4)}
			{@render gridSquare(5)}

			<span class="braidoku-grid-header">{data.rows[2]}</span>
			{@render gridSquare(6)}
			{@render gridSquare(7)}
			{@render gridSquare(8)}
		</div>
	{/if}
</div>

<Stats {game} />
