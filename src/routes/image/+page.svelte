<script lang="ts">
	import LevelSelect from "$lib/components/LevelDropdown.svelte";
</script>

<div class="bg-box px-3 py-1 text-center">
	<h2>Guess today's Image</h2>
	<span>Below is a snippet of a level from Braid. Try to guess which level it's from. After 4 failed guesses, the world will be revealed.</span>
</div>

<div class="h-60 bg-box"></div>

<LevelSelect onSelect={(a: any) => console.log(a)} />
