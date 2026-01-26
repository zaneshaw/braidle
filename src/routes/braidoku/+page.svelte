<script lang="ts">
	async function loadBoard() {
		const res = await fetch("http://127.0.0.1:3000/braidoku/board?tz=Australia/Melbourne");

		if (res.ok) {
			const data = await res.json();
			return data;
		} else {
			throw new Error(`${res.statusText} (${res.status})`);
		}
	}
</script>

{#snippet gridSquare(index: number)}
	<button class="aspect-square cursor-pointer bg-[url(/images/box.png)] bg-contain bg-center bg-no-repeat">
		<span class="text-2xl">{index}</span>
	</button>
{/snippet}

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
				<span>Guesses: 0 / 9</span>
				<span>Grade: S</span>
			</div>
			<div class="flex h-2.5 gap-1 overflow-hidden rounded-full">
				<div class="grow bg-green-400"></div>
				<div class="grow bg-green-400"></div>
				<div class="grow bg-red-400"></div>
				<div class="grow bg-green-400"></div>
				<div class="grow bg-neutral-600"></div>
				<div class="grow bg-neutral-600"></div>
				<div class="grow bg-neutral-600"></div>
				<div class="grow bg-neutral-600"></div>
				<div class="grow bg-neutral-600"></div>
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

<div class="bg-box flex flex-col gap-2 px-5 py-3">
	<h3 class="text-center">Stats</h3>
	<div class="flex gap-2">
		{#each [{ letter: "S", tip: "No fails" }, { letter: "A", tip: "1-3 fails" }, { letter: "B", tip: "4-6 fails" }, { letter: "C", tip: "7-8 fails" }, { letter: "F", tip: "9 fails" }] as grade}
			<div class="flex aspect-square grow flex-col bg-neutral-600 p-1">
				<span title={grade.tip} class="cursor-help bg-neutral-700 text-center text-lg leading-5">{grade.letter}</span>
				<span class="flex grow items-center justify-center text-2xl">1</span>
			</div>
		{/each}
	</div>
	<div class="flex justify-between bg-neutral-600 px-3 py-1.5">
		<span>Days played: 10</span>
		<span>Wins: 10</span>
		<span>Losses: 10</span>
	</div>
</div>
