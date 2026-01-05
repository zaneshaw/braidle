import { json } from "@sveltejs/kit";
import { ALL_CATEGORIES, type Categories, levels, type Level } from "../stuff";

function randomInts(quantity: number, max: number): number[] {
	const set = new Set<number>();

	while (set.size < quantity) {
		set.add(Math.floor(Math.random() * (max + 1)));
	}

	return Array.from(set);
}

// todo: only 1 allowed solution even though there might be multiple valid solutions
function generate(): { columns: Categories[]; rows: Categories[]; cells: Level[][] } {
	let columns: Categories[] = [];
	let rows: Categories[] = [];
	let cells: Level[][] = [];

	let success = false;
	while (!success) {
		success = true;

		const randomIndexes = randomInts(6, ALL_CATEGORIES.length - 1);
		columns = [ALL_CATEGORIES[randomIndexes[0]], ALL_CATEGORIES[randomIndexes[1]], ALL_CATEGORIES[randomIndexes[2]]];
		rows = [ALL_CATEGORIES[randomIndexes[3]], ALL_CATEGORIES[randomIndexes[4]], ALL_CATEGORIES[randomIndexes[5]]];
		cells = new Array(3).fill(0).map(() => new Array(3));

		outerLoop: for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				const matches = levels.filter((level) => level.categories.includes(columns[col]) && level.categories.includes(rows[row]));
				const matchesIndex = Math.floor(Math.random() * matches.length);

				if (matches.length > 0 && !cells.flat().some((cell) => cell.level == matches[matchesIndex].level && cell.world == matches[matchesIndex].world)) {
					cells[col][row] = matches[matchesIndex];
				} else {
					success = false;
					break outerLoop;
				}
			}
		}
	}

	return { columns, rows, cells };
}

export async function GET() {
	const board = generate();

	return json(board);
}
