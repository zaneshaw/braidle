<script lang="ts">
	import { PUBLIC_BACKEND_URL } from "$env/static/public";
	import GameHeader from "$lib/components/GameHeader.svelte";
	import LevelsModal from "$lib/components/LevelsModal.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { puzzlePiecePersisted } from "$lib/stores/persist.js";
	import { GameMode, type PuzzlePieceGuess } from "$lib/types.js";
	import { onMount } from "svelte";

	const unlimitedSeed = Math.random().toString(36).substring(2, 12);
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	let { data } = $props();

	type Grade = "S" | "A" | "B" | "C" | "F";

	let levelsModal: LevelsModal;

	let endModal: Modal;

	let gameState: "playing" | "win" | "lose" = $state("playing");

	let guesses: PuzzlePieceGuess[] = $state([]);
	let totalIncorrect = $derived(guesses.reduce((prev, curr) => prev + (curr.correct ? 0 : 1), 0));
	let grade: Grade = $derived(getGrade(totalIncorrect));

	let imagePromise = $state<Promise<any>>();

	async function loadImage() {
		const url = new URL(`${PUBLIC_BACKEND_URL}/puzzle_piece/image`);
		url.searchParams.append("tz", timezone);
		if (data.mode == GameMode.unlimited) url.searchParams.append("seed", unlimitedSeed);

		const res = await fetch(url);

		if (res.ok) {
			const resData = await res.json();
			return resData.base64;
		} else {
			throw new Error(`${res.statusText} (${res.status})`);
		}
	}

	async function makeGuess(world: number, level: number) {
		const url = new URL(`${PUBLIC_BACKEND_URL}/puzzle_piece/guess`);
		url.searchParams.append("tz", timezone);
		url.searchParams.append("world", `${world}`);
		url.searchParams.append("level", `${level}`);
		if (data.mode == GameMode.unlimited) url.searchParams.append("seed", unlimitedSeed);

		const res = await fetch(url);

		const resData = await res.json();

		if (gameState == "playing" && guesses.length < 6) {
			const guess = {
				world,
				level,
				correct: resData.correct,
			};

			guesses = [...guesses, guess];
			if (data.mode == undefined) {
				$puzzlePiecePersisted.guesses = guesses;
			}
		}

		const newState = evaluateState();

		if (resData.mode == undefined && newState != "playing") {
			$puzzlePiecePersisted.incorrectHistory = [...$puzzlePiecePersisted.incorrectHistory, totalIncorrect];
		}
	}

	function evaluateState() {
		if (guesses.find((guess) => guess.correct)) {
			gameState = "win";
			endModal.open();
		} else if (guesses.length == 6) {
			gameState = "lose";
			endModal.open();
		}

		return gameState;
	}

	function getGrade(incorrectGuesses: number) {
		const grades = ["S", "A", "A", "B", "B", "C"];

		return (grades[incorrectGuesses] || "F") as Grade;
	}

	onMount(() => {
		if (data.mode == undefined) {
			const today = new Date().toISOString().split("T")[0];

			if ($puzzlePiecePersisted.today == undefined && $puzzlePiecePersisted.today != today) {
				$puzzlePiecePersisted.today = today;

				$puzzlePiecePersisted.guesses = [];
			}

			guesses = $puzzlePiecePersisted.guesses;

			evaluateState();
		}

		imagePromise = loadImage();
	});
</script>

<GameHeader
	title="Guess today's Puzzle Piece"
	instructions="Below is a puzzle piece found in a specific level in Braid. You have 6 attempts to guess which level the piece is from."
	mode={data.mode}
/>

<div class="bg-box flex flex-col gap-5 p-5">
	<div class="flex h-5 gap-1 overflow-hidden rounded-full">
		{#each { length: 6 } as _, i}
			{@const guess = guesses.at(i)}
			<div
				class:correct={guess?.correct}
				class:incorrect={guess?.correct == false}
				class="flex grow basis-0 items-center justify-center bg-neutral-600 [.correct]:bg-green-400 [.incorrect]:bg-red-400"
			>
				{#if guess}
					<span>{guess.world}-{guess.level}</span>
				{/if}
			</div>
		{/each}
	</div>
	{#if imagePromise}
		{#await imagePromise}
			<h3 class="text-center text-neutral-400!">Loading puzzle piece...</h3>
		{:then imageBase64}
			<div class="flex justify-center bg-neutral-600 py-5">
				<img src={imageBase64} alt="Braid puzzle piece" class="h-50" />
			</div>
			<button
				onclick={() => {
					if (gameState == "playing") {
						levelsModal.getModal().open();
					}
				}}
				class="btn w-full! bg-neutral-600!"
			>
				<span>Guess</span>
			</button>
		{:catch err}
			<div class="text-center">
				<h3 class="text-red-700!">Failed to puzzle piece</h3>
				<span class="text-red-800!">{err}</span>
			</div>
		{/await}
	{/if}
</div>

{#if data.mode != GameMode.unlimited}
	{#snippet gradeStat(grade: Grade, tooltip: string)}
		<div title={tooltip} class="flex aspect-square grow basis-0 cursor-help flex-col items-center bg-neutral-600 p-1">
			<div class="flex h-5 w-full items-center justify-center bg-neutral-700">
				<span class=" text-lg leading-5">{grade}</span>
			</div>
			<span class="flex grow items-center justify-center text-2xl">
				{$puzzlePiecePersisted.incorrectHistory.reduce((prev, curr) => prev + (getGrade(curr) == grade ? 1 : 0), 0)}
			</span>
		</div>
	{/snippet}

	<div class="bg-box flex flex-col gap-2 p-5">
		<h3 class="text-center">Stats</h3>
		<div class="flex gap-2">
			{@render gradeStat("S", "1st guess")}
			{@render gradeStat("A", "2nd or 3rd guess")}
			{@render gradeStat("B", "4th or 5th guess")}
			{@render gradeStat("C", "Last guess")}
			{@render gradeStat("F", "Incorrect")}
		</div>
		<div class="flex justify-between bg-neutral-600 px-3 py-1.5">
			<span>Days played: {$puzzlePiecePersisted.incorrectHistory.length}</span>
			<span>Wins: {$puzzlePiecePersisted.incorrectHistory.filter((incorrectGuesses) => incorrectGuesses == 0).length}</span>
			<span>Losses: {$puzzlePiecePersisted.incorrectHistory.filter((incorrectGuesses) => incorrectGuesses > 0).length}</span>
		</div>
	</div>
{/if}

<LevelsModal bind:this={levelsModal} onSelect={makeGuess} hasPieces />

<Modal bind:this={endModal} class="flex w-150! flex-col items-center p-5 text-center">
	{#if gameState == "win"}
		<h2>Correct!</h2>
		<h4>Your grade: <span class="text-green-400!">{grade}</span></h4>
		<p>You correctly guessed which level the puzzle piece is from in {guesses.length} {guesses.length == 1 ? "guess" : "guesses"}!</p>
	{:else if gameState == "lose"}
		<h2>Game Over!</h2>
		<h4>Your grade: <span class="text-red-400!">{grade}</span></h4>
		<p>You couldn't guess which level the puzzle piece was from within 6 guesses.</p>
	{/if}
	{#if data.mode == GameMode.unlimited}
		<button onclick={() => location.reload()} class="btn">Generate a new puzzle piece</button>
	{/if}
</Modal>
