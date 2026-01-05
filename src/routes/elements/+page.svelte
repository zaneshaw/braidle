<script lang="ts">
	import LevelSelect from "$lib/components/LevelSelect.svelte";
</script>

<div class="bg-red-500/20 px-3 py-1 text-center">
	<h2>Guess today's Elements</h2>
	<span>Below are some elements from a specific Braid level. There is only 1 level that matches. After 4 failed guesses, the world will be revealed.</span>
</div>

<div class="h-60 bg-red-500/20"></div>

<LevelSelect onSelect={(a: any) => console.log(a)} />
