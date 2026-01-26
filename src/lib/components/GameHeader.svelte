<script lang="ts">
	import { GameMode } from "$lib/types";
	import { CircleQuestionMarkIcon } from "lucide-svelte";

	let { title, instructions, mode }: { title: string; instructions: string; mode: GameMode } = $props();
</script>

{#if mode == GameMode.unlimited}
	<div class="relative bg-yellow-500 p-2 text-center">
		<h3>UNLIMITED MODE</h3>
		<span title="The game is randomised every time you load the page.&#013;Your progress is lost when you reload or leave!" class="absolute top-1/2 right-3 -translate-y-1/2 cursor-help">
			<CircleQuestionMarkIcon class="stroke-white drop-shadow-[1.5px_1.25px_black]" />
		</span>
	</div>
{/if}

<div class="bg-box p-3 text-center">
	<h2>{title}</h2>
	<span>{instructions}</span>
</div>
