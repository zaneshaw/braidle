<script>
	import GameSelectButton from "$lib/components/GameSelectButton.svelte";
</script>

<div class="flex flex-col gap-3">
	<GameSelectButton href="/level" iconSrc="/images/temp_door.png" label="Level" description="Guess the level from a cropped image." />
	<GameSelectButton href="/puzzle_piece" iconSrc="/images/temp_door.png" label="Puzzle Piece" description="Guess the level from a puzzle piece." />
	<GameSelectButton href="/elements" iconSrc="/images/temp_door.png" label="Elements" description="Guess the level from a list of elements." />
</div>
