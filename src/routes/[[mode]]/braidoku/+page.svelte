<script lang="ts">
	import { PUBLIC_BACKEND_URL } from "$env/static/public";
	import GameHeader from "$lib/components/GameHeader.svelte";
	import LevelsModal from "$lib/components/LevelsModal.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { braidokuPersisted } from "$lib/stores/persist.js";
	import { GameMode, type BraidokuGuess } from "$lib/types.js";
	import { onMount } from "svelte";

	const unlimitedSeed = Math.random().toString(36).substring(2, 12);
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	let { data } = $props();

	type Grade = "S" | "A" | "B" | "C" | "F";

	let levelsModal: LevelsModal;
	let selectedCell: number | undefined = $state();

	let endModal: Modal;

	let gameState: "playing" | "win" | "lose" = $state("playing");

	let guesses: BraidokuGuess[] = $state([]);
	let totalCorrect = $derived(guesses.reduce((prev, curr) => prev + (curr.correct ? 1 : 0), 0));
	let totalIncorrect = $derived(guesses.reduce((prev, curr) => prev + (curr.correct ? 0 : 1), 0));
	let grade: Grade = $derived(getGrade(totalIncorrect));

	async function loadBoard() {
		const url = new URL(`${PUBLIC_BACKEND_URL}/braidoku/board`);
		url.searchParams.append("tz", timezone);
		if (data.mode == GameMode.unlimited) url.searchParams.append("seed", unlimitedSeed);

		const res = await fetch(url);

		if (res.ok) {
			const resData = await res.json();
			return resData;
		} else {
			throw new Error(`${res.statusText} (${res.status})`);
		}
	}

	async function makeGuess(cellIndex: number, world: number, level: number) {
		const url = new URL(`${PUBLIC_BACKEND_URL}/braidoku/guess`);
		url.searchParams.append("tz", timezone);
		url.searchParams.append("index", `${cellIndex}`);
		url.searchParams.append("world", `${world}`);
		url.searchParams.append("level", `${level}`);
		if (data.mode == GameMode.unlimited) url.searchParams.append("seed", unlimitedSeed);

		const res = await fetch(url);

		const resData = await res.json();

		if (canGuess(cellIndex)) {
			const guess = {
				index: cellIndex,
				world,
				level,
				correct: resData.correct,
			};

			guesses = [...guesses, guess];
			if (data.mode == undefined) {
				$braidokuPersisted.guesses = guesses;
			}
		}

		const newState = evaluateState();

		if (resData.mode == undefined && newState != "playing") {
			$braidokuPersisted.incorrectHistory = [...$braidokuPersisted.incorrectHistory, totalIncorrect];
		}
	}

	function canGuess(cellIndex: number) {
		return gameState == "playing" && guesses.length < 9 && guesses.find((x) => x.index == cellIndex && x.correct) == undefined;
	}

	function evaluateState() {
		if (guesses.length == 9) {
			if (totalCorrect == 9) {
				gameState = "win";
			} else {
				gameState = "lose";
			}

			endModal.open();
		}

		return gameState;
	}

	function getGrade(incorrectGuesses: number) {
		const grades = ["S", "A", "A", "B", "B", "B", "C", "C", "C"];

		return (grades[incorrectGuesses] || "F") as Grade;
	}

	onMount(() => {
		if (data.mode == undefined) {
			const today = new Date().toISOString().split("T")[0];

			if ($braidokuPersisted.today == undefined && $braidokuPersisted.today != today) {
				$braidokuPersisted.today = today;

				$braidokuPersisted.guesses = [];
			}

			guesses = $braidokuPersisted.guesses;

			evaluateState();
		}
	});
</script>

{#snippet gridSquare(index: number)}
	{@const guess = guesses.findLast((x) => x.index == index)}
	<button
		onclick={() => {
			if (canGuess(index)) {
				selectedCell = index;
				levelsModal.getModal().open();
			}
		}}
		class="aspect-square cursor-pointer bg-[url(/images/box.png)] bg-contain bg-center bg-no-repeat"
	>
		{#if guess}
			<div class:correct={guess.correct} class:incorrect={!guess.correct} class="flex size-15 items-center justify-center [.correct]:bg-green-400 [.incorrect]:bg-red-400">
				<span class="text-2xl">{guess.world}-{guess.level}</span>
			</div>
		{/if}
	</button>
{/snippet}

<GameHeader title="Solve today's Braidoku" instructions="Fill each grid square with any level that falls under the stated categories." mode={data.mode} />

<div class="bg-box flex flex-col gap-5 p-5">
	<div class="flex flex-col gap-0.5">
		<div class="flex items-center justify-between">
			<span>Guesses: {guesses.length} / 9</span>
			<span>Grade: {guesses.length == 0 ? "?" : grade}</span>
		</div>
		<div class="flex h-2.5 gap-1 overflow-hidden rounded-full">
			{#each { length: 9 } as _, i}
				<div class:correct={guesses.at(i)?.correct} class:incorrect={guesses.at(i)?.correct == false} class="grow bg-neutral-600 [.correct]:bg-green-400 [.incorrect]:bg-red-400"></div>
			{/each}
		</div>
	</div>
	{#await loadBoard()}
		<h3 class="text-center text-neutral-400!">Loading board...</h3>
	{:then data}
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
	{:catch err}
		<div class="text-center">
			<h3 class="text-red-700!">Failed to load board</h3>
			<span class="text-red-800!">{err}</span>
		</div>
	{/await}
</div>

{#if data.mode != GameMode.unlimited}
	{#snippet gradeStat(grade: Grade, tooltip: string)}
		<div title={tooltip} class="flex aspect-square grow basis-0 cursor-help flex-col items-center bg-neutral-600 p-1">
			<div class="flex h-5 w-full items-center justify-center bg-neutral-700">
				<span class=" text-lg leading-5">{grade}</span>
			</div>
			<span class="flex grow items-center justify-center text-2xl">
				{$braidokuPersisted.incorrectHistory.reduce((prev, curr) => prev + (getGrade(curr) == grade ? 1 : 0), 0)}
			</span>
		</div>
	{/snippet}

	<div class="bg-box flex flex-col gap-2 p-5">
		<h3 class="text-center">Stats</h3>
		<div class="flex gap-2">
			{@render gradeStat("S", "No incorrect guesses")}
			{@render gradeStat("A", "1-2 incorrect guesses")}
			{@render gradeStat("B", "3-5 incorrect guesses")}
			{@render gradeStat("C", "6-8 incorrect guesses")}
			{@render gradeStat("F", "9 incorrect guesses")}
		</div>
		<div class="flex justify-between bg-neutral-600 px-3 py-1.5">
			<span>Days played: {$braidokuPersisted.incorrectHistory.length}</span>
			<span>Wins: {$braidokuPersisted.incorrectHistory.filter((incorrectGuesses) => incorrectGuesses == 0).length}</span>
			<span>Losses: {$braidokuPersisted.incorrectHistory.filter((incorrectGuesses) => incorrectGuesses > 0).length}</span>
		</div>
	</div>
{/if}

<LevelsModal
	bind:this={levelsModal}
	onSelect={(world, level) => {
		if (selectedCell != undefined) {
			makeGuess(selectedCell, world, level);
		}
	}}
	beforeClose={() => (selectedCell = undefined)}
/>

<Modal bind:this={endModal} class="flex w-150! flex-col items-center p-5 text-center">
	{#if gameState == "win"}
		<h2>You Win!</h2>
		<h4>Your grade: <span class="text-green-400!">{grade}</span></h4>
		<p>Every guess you made was correct!</p>
	{:else if gameState == "lose"}
		<h2>Game Over!</h2>
		<h4>Your grade: <span class="text-red-400!">{grade}</span></h4>
		<p>
			You made <span class="text-red-400!">{totalIncorrect}</span> incorrect guesses and <span class="text-green-400!">{totalCorrect}</span> correct guesses across
			<span>{new Set(guesses.map((guess) => guess.index)).size}</span> grid squares.
		</p>
	{/if}
	{#if data.mode == GameMode.unlimited}
		<button onclick={() => location.reload()} class="btn">Generate a new board</button>
	{/if}
</Modal>
