import type { BraidokuGuess, PuzzlePieceGuess } from "$lib/types";
import { persisted } from "svelte-persisted-store";

export const braidokuPersisted = persisted("braidoku", {
	today: undefined,
	guesses: [],
	incorrectHistory: [],
} as { today?: string; guesses: BraidokuGuess[]; incorrectHistory: number[] });

export const puzzlePiecePersisted = persisted("puzzle_piece", {
	today: undefined,
	guesses: [],
	incorrectHistory: [],
} as { today?: string; guesses: PuzzlePieceGuess[]; incorrectHistory: number[] });
