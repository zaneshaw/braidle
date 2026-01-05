<script lang="ts">
	import LevelSelect from "$lib/components/LevelSelect.svelte";
</script>

<div class="bg-red-500/20 px-3 py-1 text-center">
	<h2>Guess today's Puzzle Piece</h2>
	<span>Below is a puzzle piece found in a specific level in Braid. You have 6 attempts to guess which level the piece is from.</span>
</div>

<div class="h-60 bg-red-500/20"></div>

<LevelSelect onSelect={(a: any) => console.log(a)} />
