import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch("/api/braidoku");
	const { columns, rows, cells } = await res.json();

	return { columns, rows, cells };
};
