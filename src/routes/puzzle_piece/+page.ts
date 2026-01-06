import type { PageLoad } from "./$types";

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch(`/api/puzzle_piece?tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
	const piece = await res.json();

	return { piece };
};
