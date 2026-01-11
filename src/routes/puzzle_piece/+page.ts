import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch(`/api/puzzle_piece?tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`);

	if (res.ok) {
		const piece = await res.json();

		return { status: "good", piece };
	} else {
		return { status: "bad" };
	}
};
