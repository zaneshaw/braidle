import { browser } from "$app/environment";
import { DateTime } from "luxon";

interface GameGuess {
	guess: string;
	correct: boolean;
}

interface GameData {
	lastPlayed: string;
	todaysGuesses: GameGuess[];
	stats: {
		wins: number[];
		losses: number;
	};
}

type GameState = "playing" | "win" | "lose" | undefined;

export class Game {
	id: string;
	gameLength: number;
	state: GameState = $state();
	data: GameData = $state<GameData>({} as GameData);

	constructor(id: string, gameLength: number) {
		this.id = id;
		this.gameLength = gameLength;
		this.data = {
			lastPlayed: "0000-00-00",
			todaysGuesses: [],
			stats: { wins: new Array(gameLength).fill(0), losses: 0 },
		};

		if (browser) {
			this.load();

			this.state = this.evaluateState();

			this.refreshDay();
		}
	}

	load() {
		if (typeof localStorage == "undefined") return;

		const storage = localStorage.getItem(this.id);
		if (storage == undefined) {
			this.save();
			return;
		}

		this.data = JSON.parse(storage) as GameData;
	}

	save() {
		localStorage.setItem(this.id, JSON.stringify(this.data));
	}

	private evaluateState() {
		if (this.data.todaysGuesses.length > 0 && this.data.todaysGuesses.at(-1)!.correct) {
			return "win";
		} else if (this.data.todaysGuesses.length >= this.gameLength) {
			return "lose";
		}

		return "playing";
	}

	makeGuess(guess: GameGuess) {
		if (this.state != "playing") return;

		this.data.todaysGuesses.push(guess);

		this.state = this.evaluateState();

		switch (this.state) {
			case "win":
				this.win();
				break;
			case "lose":
				this.lose();
				break;
		}

		this.save();
	}

	get daysPlayed(): number {
		return (this.data.stats.wins as number[]).reduce((a, b) => a + b) + this.data.stats.losses;
	}

	win() {
		console.log("YAY");
		this.data.stats.wins[this.data.todaysGuesses.length - 1]++;
		this.save();
	}

	lose() {
		console.log("game over :(");
		this.data.stats.losses++;
		this.save();
	}

	refreshDay() {
		const date = DateTime.now().setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).toISODate();

		if (date != this.data.lastPlayed) {
			this.data.lastPlayed = date as string;
			this.data.todaysGuesses = [];
			this.save();
		}
	}
}
