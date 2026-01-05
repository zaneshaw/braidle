import { json } from "@sveltejs/kit";
import { ALL_CATEGORIES, type Category, levels, type Level } from "../stuff";

function randomCategories(quantity: number): Category[] {
	const set = new Set<Category>();

	while (set.size < quantity) {
		set.add(ALL_CATEGORIES[Math.floor(Math.random() * ALL_CATEGORIES.length)]);
	}

	return Array.from(set);
}

// todo: only 1 allowed solution even though there might be multiple valid solutions
function generate(): { columns: Category[]; rows: Category[]; grid: Level[][] } {
	let columns: Category[] = [];
	let rows: Category[] = [];
	let grid: Level[][] = [];

	let success = false;
	while (!success) {
		success = true;

		// get 6 random unique categories and assign them to columns and rows
		const categories = randomCategories(6);
		columns = [categories[0], categories[1], categories[2]];
		rows = [categories[3], categories[4], categories[5]];

		// initialise a 3x3 array for the grid. indexed by row then column
		grid = new Array(3).fill(0).map(() => new Array(3));

		outerLoop: for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				// get an array of levels that match both categories
				const matches = levels.filter((level) => level.categories.includes(columns[col]) && level.categories.includes(rows[row]));

				// if there are no matches, break out of the loop and start over
				if (matches.length == 0) {
					success = false;
					break outerLoop;
				}

				// pick a random matching level as the correct answer (not good. should rank them instead and allow all matches as answers.)
				const matchesIndex = Math.floor(Math.random() * matches.length);

				// true if this level isn't an answer on the grid yet
				const isUnique = !grid.flat().some((cell) => cell.level == matches[matchesIndex].level && cell.world == matches[matchesIndex].world);

				// if the match is unique, add it to the grid. else break out of the loop and start over
				if (isUnique) {
					grid[col][row] = matches[matchesIndex];
				} else {
					success = false;
					break outerLoop;
				}
			}
		}
	}

	return { columns, rows, grid };
}

export async function GET() {
	const board = generate();

	return json(board);
}
