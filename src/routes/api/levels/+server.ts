import { json } from "@sveltejs/kit";
import { hasPieces, levels, type Level } from "../stuff";

export async function GET({ url }) {
	const groupByWorldParam = url.searchParams.get("groupByWorld") == "true" || false;
	const hasPiecesParam = url.searchParams.get("hasPieces") == "true" || false;

	const filtered = hasPiecesParam ? hasPieces(levels) : levels;

	if (groupByWorldParam) {
		const highestWorld = Math.max(...filtered.map((level) => level.world));
		const grouped: Level[][] = new Array(highestWorld + 1).fill(0).map(() => []);

		for (const level of filtered) {
			grouped[level.world].push(level);
		}

		return json(grouped);
	} else {
		return json(filtered);
	}
}
