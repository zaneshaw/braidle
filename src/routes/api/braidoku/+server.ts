import { json } from "@sveltejs/kit";
import { ALL_CATEGORIES, type Category, levels } from "../stuff";
import random from "random";
import { DateTime } from "luxon";

function randomCategories(quantity: number): Category[] {
	const set = new Set<Category>();

	while (set.size < quantity) {
		set.add(ALL_CATEGORIES[random.int(0, ALL_CATEGORIES.length - 1)]);
	}

	return Array.from(set);
}

// todo: cache
function generate(): { columns: Category[]; rows: Category[]; grid: number[][][] } {
	const minLevelsPerCell = 2;
	const maxLevelsPerCell = 5;
	const maxLevelOccurrences = 4; // how many times a level can appear on the board

	let columns: Category[] = [];
	let rows: Category[] = [];
	let grid: number[][][] = [];

	generator: while (true) {
		// get 6 random unique categories and assign them to columns and rows
		const categories = randomCategories(6);
		columns = [categories[0], categories[1], categories[2]];
		rows = [categories[3], categories[4], categories[5]];

		// init a 3x3 array for the grid. indexed by rows
		grid = new Array(3).fill(0).map(() => new Array(3));

		// for every cell, find every level that matches the cell's categories
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				grid[row][col] = levels.filter((level) => level.categories.includes(columns[col]) && level.categories.includes(rows[row])).map((level) => levels.indexOf(level));
			}
		}

		// validation
		const counts: { [key: string]: number } = {};
		for (const cell of grid.flat()) {
			// if the cell has too little or too many levels, fail
			if (cell.length < minLevelsPerCell || cell.length > maxLevelsPerCell) {
				continue generator;
			}

			// add each of the cell's levels to a counting dictionary
			for (const levelIndex of cell) {
				counts[levelIndex] = counts[levelIndex] ? counts[levelIndex] + 1 : 1;

				// if a level's count exceeds the maximum, fail
				if (counts[levelIndex] > maxLevelOccurrences) {
					continue generator;
				}
			}
		}

		break;
	}

	return { columns, rows, grid };
}

export async function GET({ url }) {
	if (!url.searchParams.has("tz")) return new Response(null, { status: 400 });

	const date = DateTime.now()
		.setZone(url.searchParams.get("tz") as string)
		.toISODate();

	if (date == undefined) return new Response(null, { status: 500 });

	random.use(date);

	const board = generate();

	if (url.searchParams.has("guess")) {
		const [cellIndex, world, level] = url.searchParams
			.get("guess")!
			.split("-")
			.map((x) => parseInt(x));

		const correct = board.grid.flat()[cellIndex].some((levelIndex) => levels[levelIndex].world == world && levels[levelIndex].level == level);

		return json({ correct });
	} else {
		return json({ columns: board.columns, rows: board.rows });
	}
}
