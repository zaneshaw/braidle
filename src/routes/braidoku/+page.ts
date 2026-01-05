import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch("/api/braidoku");
	const { columns, rows, grid } = await res.json();

	return { columns, rows, grid };
};
