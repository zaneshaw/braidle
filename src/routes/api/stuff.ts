export const ALL_CATEGORIES = ["puzzleboard", "goomba", "rabbit", "key", "green piece", "green key", "cloud", "firepit", "lever", "flagpole", "trellis", "2+ ladders", "1 piece", "no piece", "vertical platform", "plant", "star", "world 1", "world 2", "world 3", "world 4", "world 5", "world 6"] as const;
export type Category = (typeof ALL_CATEGORIES)[number];

export interface Level {
	name?: string;
	world: number;
	level: number;
	categories: Category[];
	pieces?: string[];
}

export const levels: Level[] = [
	{
		world: 0,
		level: 0,
		categories: [],
	},
	{
		name: "Epilogue",
		world: 0,
		level: 8,
		categories: ["no piece", "key", "flagpole", "2+ ladders", "cloud", "lever"],
	},
	{
		name: "Braid",
		world: 1,
		level: 1,
		categories: ["star", "trellis", "2+ ladders", "goomba", "vertical platform", "firepit", "plant", "no piece", "lever", "world 1"],
	},
	{
		world: 1,
		level: 2,
		categories: ["goomba", "no piece", "firepit", "2+ ladders", "world 1"],
	},
	{
		world: 1,
		level: 3,
		categories: ["goomba", "no piece", "firepit", "world 1"],
	},
	{
		world: 1,
		level: 4,
		categories: ["goomba", "no piece", "firepit", "world 1"],
	},
	{
		name: "Three Easy Pieces",
		world: 2,
		level: 1,
		categories: ["trellis", "goomba", "2+ ladders", "firepit", "world 2"],
		pieces: ["/images/pieces/2-1-1.webp", "/images/pieces/2-1-2.webp", "/images/pieces/2-1-3.webp"],
	},
	{
		name: "The Cloud Bridge",
		world: 2,
		level: 2,
		categories: ["firepit", "goomba", "puzzleboard", "cloud", "key", "star", "world 2"],
		pieces: ["/images/pieces/2-2-1.webp", "/images/pieces/2-2-2.webp", "/images/pieces/2-2-3.webp", "/images/pieces/2-2-4.webp"],
	},
	{
		name: "Hunt!",
		world: 2,
		level: 3,
		categories: ["goomba", "1 piece", "2+ ladders", "world 2"],
		pieces: ["/images/pieces/2-3-1.webp"],
	},
	{
		name: "Leap of Faith",
		world: 2,
		level: 4,
		categories: ["2+ ladders", "goomba", "flagpole", "flagpole", "lever", "firepit", "world 2"],
		pieces: ["/images/pieces/2-4-1.webp", "/images/pieces/2-4-2.webp", "/images/pieces/2-4-3.webp", "/images/pieces/2-4-4.webp"],
	},
	{
		name: "The Pit",
		world: 3,
		level: 1,
		categories: ["green key", "goomba", "no piece", "key", "world 3"],
	},
	{
		name: "There and Back Again",
		world: 3,
		level: 2,
		categories: ["trellis", "1 piece", "goomba", "vertical platform", "key", "green key", "world 3"],
		pieces: ["/images/pieces/3-2-1.webp"],
	},
	{
		name: "Phase",
		world: 3,
		level: 3,
		categories: ["cloud", "trellis", "world 3"],
		pieces: ["/images/pieces/3-3-1.webp", "/images/pieces/3-3-2.webp"],
	},
	{
		name: "The Ground Beneath Her Feet",
		world: 3,
		level: 4,
		categories: ["green piece", "goomba", "key", "lever", "firepit", "2+ ladders", "world 3"],
		pieces: ["/images/pieces/3-4-1.webp", "/images/pieces/3-4-2.webp"],
	},
	{
		name: "Tight Channels",
		world: 3,
		level: 5,
		categories: ["rabbit", "2+ ladders", "plant", "firepit", "world 3"],
		pieces: ["/images/pieces/3-5-1.webp", "/images/pieces/3-5-2.webp"],
	},
	{
		name: "Irreversible",
		world: 3,
		level: 6,
		categories: ["vertical platform", "rabbit", "plant", "goomba", "firepit", "puzzleboard", "2+ ladders", "green key", "key", "world 3"],
		pieces: ["/images/pieces/3-6-1.webp", "/images/pieces/3-6-2.webp", "/images/pieces/3-6-3.webp"],
	},
	{
		name: "Lair",
		world: 3,
		level: 7,
		categories: ["no piece", "trellis", "goomba", "firepit", "key", "green key", "world 3"],
	},
	{
		name: "A Tingling",
		world: 3,
		level: 8,
		categories: ["flagpole", "vertical platform", "key", "goomba", "2+ ladders", "trellis", "firepit", "rabbit", "lever", "green piece", "world 3"],
		pieces: ["/images/pieces/3-8-1.webp", "/images/pieces/3-8-2.webp"],
	},
];

export const hasPieces = (levels: Level[]) => levels.filter((level) => level.pieces);
