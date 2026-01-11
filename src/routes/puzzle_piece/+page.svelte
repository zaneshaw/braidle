<script lang="ts">
	import LevelSelect from "$lib/components/LevelSelect.svelte";
	import { Game } from "$lib/game.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	const game = new Game("puzzle_piece", 6);

	async function guess(level: string) {
		if (game.state != "playing") return;

		const res = await fetch(`/api/puzzle_piece?tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}&guess=${level}`);
		const { pretty, correct } = await res.json();
		game.makeGuess({
			guess: pretty,
			correct,
		});
	}
</script>

<div class="bg-red-500/20 px-3 py-1 text-center">
	<h2>Guess today's Puzzle Piece</h2>
	<span>Below is a puzzle piece found in a specific level in Braid. You have 6 attempts to guess which level the piece is from.</span>
</div>

{#if data.status == "good"}
	<div class="relative flex h-60 items-center justify-center bg-red-500/20">
		<span class="absolute top-2 right-4">Guesses: {game.data.todaysGuesses.length}/6</span>
		<img src={data.piece} alt="" class="size-45" />
	</div>

	<LevelSelect onSelect={(level: string) => guess(level)} hasPieces />

	{#if game.data.todaysGuesses.length > 0}
		<div class="flex flex-col-reverse gap-5 text-center">
			{#each game.data.todaysGuesses as guess}
				<div class="{guess.correct ? 'bg-green-400' : 'bg-red-400'} p-2">
					<h3>{guess.guess}</h3>
				</div>
			{/each}
		</div>
	{/if}

	<div class="flex flex-col bg-red-500/20 p-5">
		<h3>Stats</h3>
		<div class="flex justify-between">
			<span>Days played</span>
			<span>{game.daysPlayed}</span>
		</div>
		<div class="flex justify-between">
			<span>Wins</span>
			<span>{game.data.stats.wins}</span>
		</div>
		<div class="flex justify-between">
			<span>Losses</span>
			<span>{game.data.stats.losses}</span>
		</div>
	</div>
{/if}
