<script>
	import GameButton from "$lib/components/GameButton.svelte";
</script>

<div class="flex flex-col gap-3">
	<GameButton href="/braidoku" iconSrc="/images/icons/braidoku.png" label="Braidoku" description="Guess the levels from their categories." />
	<GameButton href="/puzzle_piece" iconSrc="/images/icons/puzzle_piece.png" label="Puzzle Piece" description="Guess the level from a puzzle piece." />
	<GameButton href="/image" iconSrc="/images/icons/image.png" label="Image" description="Guess the level from a cropped image." disabled />
	<GameButton href="/elements" iconSrc="/images/icons/elements.png" label="Elements" description="Guess the level from its elements." disabled />
</div>
