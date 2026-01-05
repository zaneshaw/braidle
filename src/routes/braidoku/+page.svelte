<script lang="ts">
	import LevelSelect from "$lib/components/LevelSelect.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<div class="bg-red-500/20 px-3 py-1 text-center">
	<h2>Guess today's Braidoku</h2>
	<span>Fill the Sudoku board with levels using the elements they have and the categories they fall under.</span>
</div>

<div class="h-60 bg-red-500/20">
	<div class="grid size-full grid-cols-4 grid-rows-[1fr_2fr_2fr_2fr] gap-2 *:flex *:size-full *:items-center *:justify-center">
		<span></span>
		<span>{data.columns[0]}</span>
		<span>{data.columns[1]}</span>
		<span>{data.columns[2]}</span>

		<span>{data.rows[0]}</span>
		<span class="bg-red-500/20">{data.cells[0][0].world}-{data.cells[0][0].level}</span>
		<span class="bg-red-500/20">{data.cells[1][0].world}-{data.cells[1][0].level}</span>
		<span class="bg-red-500/20">{data.cells[2][0].world}-{data.cells[2][0].level}</span>

		<span>{data.rows[1]}</span>
		<span class="bg-red-500/20">{data.cells[0][1].world}-{data.cells[0][1].level}</span>
		<span class="bg-red-500/20">{data.cells[1][1].world}-{data.cells[1][1].level}</span>
		<span class="bg-red-500/20">{data.cells[2][1].world}-{data.cells[2][1].level}</span>

		<span>{data.rows[2]}</span>
		<span class="bg-red-500/20">{data.cells[0][2].world}-{data.cells[0][2].level}</span>
		<span class="bg-red-500/20">{data.cells[1][2].world}-{data.cells[1][2].level}</span>
		<span class="bg-red-500/20">{data.cells[2][2].world}-{data.cells[2][2].level}</span>
	</div>
</div>
