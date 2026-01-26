import { GameMode } from "$lib/types.js";
import { error } from "@sveltejs/kit";

export function load({ params }) {
	if (params.mode && !(params.mode in GameMode)) {
		error(404, "Game mode not found");
	}

	return {
		mode: GameMode[params.mode as keyof typeof GameMode],
	};
}
