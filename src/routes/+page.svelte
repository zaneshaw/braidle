<script>
	import GameButton from "$lib/components/GameButton.svelte";
</script>

<div class="flex flex-col gap-3">
	<GameButton href="/image" iconSrc="/images/temp_door.png" label="Image" description="Guess the level from a cropped image." disabled />
	<GameButton href="/puzzle_piece" iconSrc="/images/temp_door.png" label="Puzzle Piece" description="Guess the level from a puzzle piece." />
	<GameButton href="/braidoku" iconSrc="/images/temp_door.png" label="Braidoku" description="Guess the levels from their categories." disabled />
	<GameButton href="/elements" iconSrc="/images/temp_door.png" label="Elements" description="Guess the level from its count of elements." disabled />
</div>
