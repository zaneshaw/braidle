export enum GameMode {
	unlimited = "unlimited",
}

export type BraidokuGuess = {
	index: number;
	world: number;
	level: number;
	correct: boolean;
};

export type PuzzlePieceGuess = {
	world: number;
	level: number;
	correct: boolean;
};
