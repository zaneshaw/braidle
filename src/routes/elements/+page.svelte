<script lang="ts">
	import LevelSelect from "$lib/components/LevelDropdown.svelte";
</script>

<div class="bg-box px-3 py-1 text-center">
	<h2>Guess today's Elements</h2>
	<span>Below are some elements from a specific Braid level. There is only 1 level that matches. After 4 failed guesses, the world will be revealed.</span>
</div>

<div class="h-60 bg-box"></div>

<LevelSelect onSelect={(a: any) => console.log(a)} />
