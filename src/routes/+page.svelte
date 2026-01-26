<script lang="ts">
	import GameButton from "$lib/components/MenuGameButton.svelte";
	import { GameMode } from "$lib/types";

	let mode: GameMode | undefined;
</script>

<div class="flex text-white">
	<button
		onclick={() => (mode = undefined)}
		class:active={mode == undefined}
		class="grow basis-0 cursor-pointer rounded-l bg-neutral-400 py-1 text-neutral-600 [.active]:bg-green-700 [.active]:text-white">Daily Mode</button
	>
	<button
		onclick={() => (mode = GameMode.unlimited)}
		class:active={mode == GameMode.unlimited}
		class="grow basis-0 cursor-pointer rounded-r bg-neutral-400 py-1 text-neutral-600 [.active]:bg-green-700 [.active]:text-white">Unlimited Mode</button
	>
</div>

<div class="flex flex-col gap-3">
	<GameButton href="/braidoku" iconSrc="/images/icons/braidoku.png" label="Braidoku" description="Guess the levels from their categories." {mode} />
	<GameButton href="/puzzle_piece" iconSrc="/images/icons/puzzle_piece.png" label="Puzzle Piece" description="Guess the level from a puzzle piece." {mode} />
	<GameButton href="/image" iconSrc="/images/icons/image.png" label="Image" description="Guess the level from a cropped image." {mode} disabled />
	<GameButton href="/elements" iconSrc="/images/icons/elements.png" label="Elements" description="Guess the level from its elements." {mode} disabled />
</div>
