<script lang="ts">
	import type { Game } from "$lib/game.svelte";

	let { game }: { game: Game } = $props();
</script>

<div class="flex flex-col bg-neutral-500 p-5">
	<h3>Stats</h3>
	<div class="flex justify-between">
		<span>Days played</span>
		<span>{game.daysPlayed}</span>
	</div>
	<div class="flex justify-between">
		<span>Wins</span>
		<span>{game.data.stats.wins}</span>
	</div>
	<div class="flex justify-between">
		<span>Losses</span>
		<span>{game.data.stats.losses}</span>
	</div>
</div>
