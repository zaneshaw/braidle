/* eslint-disable @typescript-eslint/no-explicit-any */

import { browser } from "$app/environment";
import { DateTime } from "luxon";

interface GameData {
	lastPlayed: string;
	todaysGuesses: any[];
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

	makeGuess(guess: any) {
		if (this.state != "playing") return;

		this.data.todaysGuesses.push(guess);

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
