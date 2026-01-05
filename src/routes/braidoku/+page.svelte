<script lang="ts">
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<div class="bg-red-500/20 px-3 py-1 text-center">
	<h2>Guess today's Braidoku</h2>
	<span>Fill each grid square with a level that falls under the stated categories.</span>
</div>

<div class="bg-red-500/20">
	<div class="grid size-full grid-cols-4 grid-rows-[1fr_2fr_2fr_2fr] gap-2 *:flex *:size-full *:items-center *:justify-center *:text-center">
		<div></div>
		<span class="braidoku-grid-header">{data.columns[0]}</span>
		<span class="braidoku-grid-header">{data.columns[1]}</span>
		<span class="braidoku-grid-header">{data.columns[2]}</span>

		<span class="braidoku-grid-header">{data.rows[0]}</span>
		<span class="braidoku-grid-square">{data.grid[0][0].world}-{data.grid[0][0].level}</span>
		<span class="braidoku-grid-square">{data.grid[1][0].world}-{data.grid[1][0].level}</span>
		<span class="braidoku-grid-square">{data.grid[2][0].world}-{data.grid[2][0].level}</span>

		<span class="braidoku-grid-header">{data.rows[1]}</span>
		<span class="braidoku-grid-square">{data.grid[0][1].world}-{data.grid[0][1].level}</span>
		<span class="braidoku-grid-square">{data.grid[1][1].world}-{data.grid[1][1].level}</span>
		<span class="braidoku-grid-square">{data.grid[2][1].world}-{data.grid[2][1].level}</span>

		<span class="braidoku-grid-header">{data.rows[2]}</span>
		<span class="braidoku-grid-square">{data.grid[0][2].world}-{data.grid[0][2].level}</span>
		<span class="braidoku-grid-square">{data.grid[1][2].world}-{data.grid[1][2].level}</span>
		<span class="braidoku-grid-square">{data.grid[2][2].world}-{data.grid[2][2].level}</span>
	</div>
</div>
