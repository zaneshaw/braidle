<script lang="ts">
	import Modal from "$lib/components/Modal.svelte";
	import { braidokuStorage } from "$lib/stores/braidoku.js";
	import { GameMode } from "$lib/types.js";
	import { onMount } from "svelte";

	let { data } = $props();

	type Grade = "S" | "A" | "B" | "C" | "F";

	let guessModal: Modal;
	let selectedCell: number | undefined = $state();

	let endModal: Modal;

	let gameState: "playing" | "win" | "lose" = $state("playing");

	let guesses: { index: number; world: number; level: number; correct: boolean }[] = $state([]);
	let totalCorrect = $derived(guesses.reduce((prev, curr) => prev + (curr.correct ? 1 : 0), 0));
	let totalIncorrect = $derived(guesses.reduce((prev, curr) => prev + (curr.correct ? 0 : 1), 0));
	let grade: Grade = $derived(getGrade(totalIncorrect));

	async function loadBoard() {
		const res = await fetch("http://127.0.0.1:3000/braidoku/board?tz=Australia/Melbourne");

		if (res.ok) {
			const data = await res.json();
			return data;
		} else {
			throw new Error(`${res.statusText} (${res.status})`);
		}
	}

	async function makeGuess(cellIndex: number, world: number, level: number) {
		const res = await fetch(`http://127.0.0.1:3000/braidoku/guess?tz=Australia/Melbourne&index=${cellIndex}&world=${world}&level=${level}`);
		const data = await res.json();

		if (guesses.length < 9 && canGuess(cellIndex)) {
			const guess = {
				index: cellIndex,
				world,
				level,
				correct: data.correct,
			};

			guesses = [...guesses, guess];
			$braidokuStorage.guesses = guesses;
		}

		const newState = evaluateState();

		if (data.mode == undefined && newState != "playing") {
			$braidokuStorage.incorrectHistory = [...$braidokuStorage.incorrectHistory, totalIncorrect];
		}
	}

	async function getLevels() {
		const res = await fetch(`http://127.0.0.1:3000/levels`);
		const data = await res.json();

		return data;
	}

	function canGuess(cellIndex: number) {
		return guesses.find((x) => x.index == cellIndex && x.correct) == undefined;
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

	function getGrade(incorrectGuess: number) {
		const grades = ["S", "A", "A", "B", "B", "B", "C", "C", "C"];

		return (grades[incorrectGuess] || "F") as Grade;
	}

	onMount(() => {
		if (data.mode == undefined) {
			const today = new Date().toISOString().split("T")[0];
			if ($braidokuStorage.today == undefined || $braidokuStorage.today != today) {
				$braidokuStorage.today = today;

				$braidokuStorage.guesses = [];
			}

			guesses = $braidokuStorage.guesses;

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
				guessModal.open();
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

{#if data.mode == GameMode.unlimited}
	<div class="bg-yellow-500 p-2 text-center">
		<h3>UNLIMITED MODE</h3>
	</div>
{/if}

<div class="bg-box px-5 py-3 text-center">
	<h2>Solve today's Braidoku</h2>
	<span>Fill each grid square with any level that falls under the stated categories.</span>
</div>

<div class="bg-box flex flex-col gap-5 p-5">
	{#await loadBoard()}
		<h3 class="text-center text-neutral-400!">Loading board...</h3>
	{:then data}
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
				{$braidokuStorage.incorrectHistory.reduce((prev, curr) => prev + (getGrade(curr) == grade ? 1 : 0), 0)}
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
			<span>Days played: {$braidokuStorage.incorrectHistory.length}</span>
			<span>Wins: {$braidokuStorage.incorrectHistory.filter((incorrectGuesses) => incorrectGuesses == 0).length}</span>
			<span>Losses: {$braidokuStorage.incorrectHistory.filter((incorrectGuesses) => incorrectGuesses > 0).length}</span>
		</div>
	</div>
{/if}

{#snippet worldLevelButtons(world: any)}
	<div>
		<h4 class="text-nowrap">{world.title}</h4>
		{#each world.levels as level}
			<button
				onclick={() => {
					if (selectedCell != undefined) {
						makeGuess(selectedCell, world.world, level.level);
					}

					guessModal.close();
				}}
				class="flex w-full cursor-pointer items-center gap-1.5 p-1 text-nowrap hover:bg-neutral-600"
			>
				<div class="size-6 bg-neutral-500"></div>
				<span>{world.world}-{level.level}{level.name ? `: ${level.name}` : ""}</span>
			</button>
		{/each}
	</div>
{/snippet}

<Modal bind:this={guessModal} beforeClose={() => (selectedCell = undefined)} duckable class="p-5">
	{#await getLevels()}
		<span>loading...</span>
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

<Modal bind:this={endModal} class="flex w-150! flex-col p-5 text-center">
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
</Modal>
