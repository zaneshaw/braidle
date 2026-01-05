<script>
	import GameButton from "$lib/components/GameButton.svelte";
</script>

<div class="flex flex-col gap-3">
	<GameButton href="/level" iconSrc="/images/temp_door.png" label="Level" description="Guess the level from a cropped image." />
	<GameButton href="/puzzle_piece" iconSrc="/images/temp_door.png" label="Puzzle Piece" description="Guess the level from a puzzle piece." />
	<GameButton href="/elements" iconSrc="/images/temp_door.png" label="Elements" description="Guess the level from a list of elements." />
</div>
