import { json } from "@sveltejs/kit";
import { hasPieces, levels } from "../stuff";
import random from "random";
import { DateTime } from "luxon";

export async function GET({ url }) {
	if (!url.searchParams.has("tz")) return new Response(null, { status: 400 });

	const date = DateTime.now()
		.setZone(url.searchParams.get("tz") as string)
		.toISODate();

	if (date == undefined) return new Response(null, { status: 500 });

	random.use(date);

	const filtered = hasPieces(levels);
	const levelIndex = random.int(0, filtered.length - 1);
	const pieceIndex = random.int(0, filtered[levelIndex].pieces!.length - 1);

	if (url.searchParams.has("guess")) {
		const [world, level] = url.searchParams
			.get("guess")!
			.split("-")
			.map((x) => parseInt(x));

		const correct = filtered[levelIndex].world == world && filtered[levelIndex].level == level;
		const pretty = `${world}-${level}`;
		// const pretty = `${world}-${level}: name`;

		return json({ pretty, correct });
	} else {
		return json(filtered[levelIndex].pieces![pieceIndex]);
	}
}
