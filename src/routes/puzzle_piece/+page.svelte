<script lang="ts">
	import LevelSelect from "$lib/components/LevelSelect.svelte";
	import { LocalStorage } from "$lib/storage.svelte";
	import { onMount } from "svelte";
	import type { PageProps } from "./$types";
	import { DateTime } from "luxon";

	let { data }: PageProps = $props();

	let tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const localStorage = new LocalStorage("puzzle_piece", {
		today: new Date().toLocaleDateString(),
		guesses: [],
		stats: {
			wins: [0, 0, 0, 0, 0, 0],
			losses: 0,
		},
	} as { today: string; guesses: { level: string; correct: boolean }[]; stats: { wins: number[]; losses: number } });

	type GameState = "playing" | "win" | "lose";
	let gameState: GameState = $state(evaluateState());

	function evaluateState(): GameState {
		if (localStorage.current.guesses.length > 0 && localStorage.current.guesses.at(-1)!.correct) {
			return "win";
		} else if (localStorage.current.guesses.length >= 6) {
			return "lose";
		}

		return "playing";
	}

	async function guess(level: string) {
		if (gameState != "playing") return;

		const res = await fetch(`/api/puzzle_piece?tz=${tz}&guess=${level}`);
		const { pretty, correct } = await res.json();
		localStorage.current.guesses.push({
			level: pretty,
			correct,
		});

		gameState = evaluateState();

		switch (gameState) {
			case "win":
				console.log("YAY");
				localStorage.current.stats.wins[localStorage.current.guesses.length - 1]++;
				break;
			case "lose":
				console.log("game over :(");
				localStorage.current.stats.losses++;
				break;
		}
	}

	onMount(() => {
		const date = DateTime.now().setZone(tz).toISODate();

		if (date != localStorage.current.today) {
			localStorage.current.today = date;
			localStorage.current.guesses = [];
		}
	});
</script>

<div class="bg-red-500/20 px-3 py-1 text-center">
	<h2>Guess today's Puzzle Piece</h2>
	<span>Below is a puzzle piece found in a specific level in Braid. You have 6 attempts to guess which level the piece is from.</span>
</div>

<div class="relative flex h-60 items-center justify-center bg-red-500/20">
	<span class="absolute top-2 right-4">Guesses: {localStorage.current.guesses.length}/6</span>
	<img src={data.piece} alt="" class="size-45" />
</div>

<LevelSelect onSelect={(level: string) => guess(level)} hasPieces />

{#if localStorage.current.guesses.length > 0}
	<div class="flex flex-col-reverse gap-5 text-center">
		{#each localStorage.current.guesses as guess}
			<div class="{guess.correct ? 'bg-green-400' : 'bg-red-400'} p-2">
				<h3>{guess.level}</h3>
			</div>
		{/each}
	</div>
{/if}

<div class="flex flex-col bg-red-500/20 p-5">
	<h3>Stats</h3>
	<div class="flex justify-between">
		<span>Days played</span>
		<span>{(localStorage.current.stats.wins as number[]).reduce((a, b) => a + b) + localStorage.current.stats.losses}</span>
	</div>
	<div class="flex justify-between">
		<span>Wins</span>
		<span>{localStorage.current.stats.wins}</span>
	</div>
	<div class="flex justify-between">
		<span>Losses</span>
		<span>{localStorage.current.stats.losses}</span>
	</div>
</div>
