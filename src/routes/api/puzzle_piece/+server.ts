import { json } from "@sveltejs/kit";
import { hasPieces, levels } from "../stuff";

export async function GET() {
	const filtered = hasPieces(levels);

	const levelIndex = Math.floor(Math.random() * filtered.length);
	const pieceIndex = Math.floor(Math.random() * filtered[levelIndex].pieces!.length);

	return json(filtered[levelIndex].pieces![pieceIndex]);
}
