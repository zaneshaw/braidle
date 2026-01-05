import { json } from "@sveltejs/kit";
// import _ from "lodash";

interface Level {
	level: number;
	world: number;
	name?: string;
	// imageSrcs: string[];
}

const levels: Level[] = [
	{
		world: 0,
		level: 0,
	},
	{
		name: "Epilogue",
		world: 0,
		level: 8,
	},
	{
		name: "Braid",
		world: 1,
		level: 1,
	},
	{
		world: 1,
		level: 2,
	},
	{
		world: 1,
		level: 3,
	},
	{
		world: 1,
		level: 4,
	},
	{
		name: "Three Easy Pieces",
		world: 2,
		level: 1,
	},
	{
		name: "The Cloud Bridge",
		world: 2,
		level: 2,
	},
	{
		name: "Hunt!",
		world: 2,
		level: 3,
	},
	{
		name: "Leap of Faith",
		world: 2,
		level: 4,
	},
];

export async function GET({ url }) {
	const groupByWorld = url.searchParams.has("groupByWorld") || false;

	if (groupByWorld) {
		const highestWorld = Math.max(...levels.map((level) => level.world));
		const grouped: Level[][] = new Array(highestWorld + 1).fill(0).map(() => []);

		for (const level of levels) {
			grouped[level.world].push(level);
			// grouped[level.world].push(_.omit(level, "world"));
		}

		return json(grouped);
	} else {
		return json(levels);
	}
}
