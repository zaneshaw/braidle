import type { BraidokuGuess } from "$lib/types";
import { persisted } from "svelte-persisted-store";

export const braidokuStorage = persisted("braidoku", {
	today: undefined,
	guesses: [],
	incorrectHistory: [],
} as { today?: string; guesses: BraidokuGuess[]; incorrectHistory: number[] });
