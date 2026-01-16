<script lang="ts">
	import LevelSelect from "$lib/components/LevelDropdown.svelte";
	import { Game } from "$lib/game.svelte";
	import { onMount } from "svelte";
	import type { PageProps } from "./$types";
	import Stats from "$lib/components/Stats.svelte";

	let { data }: PageProps = $props();

	const game = new Game("puzzle_piece", 6, true);

	function evaluateState() {
		if (game.data.todaysGuesses.length > 0 && game.data.todaysGuesses.at(-1)!.correct) {
			return "win";
		} else if (game.data.todaysGuesses.length >= game.gameLength) {
			return "lose";
		}

		return "playing";
	}

	async function guess(level: string) {
		if (game.state != "playing") return;

		const res = await fetch(`/api/puzzle_piece?tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}&guess=${level}`);
		const { pretty, correct } = await res.json();
		game.makeGuess({
			guess: pretty,
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
	})
</script>

<div class="bg-box px-3 py-1 text-center">
	<h2>Guess today's Puzzle Piece</h2>
	<span>Below is a puzzle piece found in a specific level in Braid. You have 6 attempts to guess which level the piece is from.</span>
</div>

{#if data.status == "good"}
	<div class="relative flex h-60 items-center justify-center bg-box">
		<span class="absolute top-2 right-4">Guesses: {game.data.todaysGuesses.length}/{game.gameLength}</span>
		<img src={data.piece} alt="" class="size-45" />
	</div>
{/if}

<LevelSelect onSelect={(level: string) => guess(level)} hasPieces disabled={game.state != "playing"} />

{#if game.data.todaysGuesses.length > 0}
	<div class="flex flex-col-reverse gap-5 text-center">
		{#each game.data.todaysGuesses as guess}
			<div class="{guess.correct ? 'bg-green-400' : 'bg-red-400'} p-2">
				<h3>{guess.guess}</h3>
			</div>
		{/each}
	</div>
{/if}

<Stats {game} />
