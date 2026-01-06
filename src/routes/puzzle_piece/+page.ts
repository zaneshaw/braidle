import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch("/api/puzzle_piece");
	const piece = await res.json();

	return { piece };
};
