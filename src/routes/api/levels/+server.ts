import { json } from "@sveltejs/kit";
import { levels, type Level } from "../stuff";

export async function GET({ url }) {
	const groupByWorld = url.searchParams.has("groupByWorld") || false;

	if (groupByWorld) {
		const highestWorld = Math.max(...levels.map((level) => level.world));
		const grouped: Level[][] = new Array(highestWorld + 1).fill(0).map(() => []);

		for (const level of levels) {
			grouped[level.world].push(level);
		}

		return json(grouped);
	} else {
		return json(levels);
	}
}
