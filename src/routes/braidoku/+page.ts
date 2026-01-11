import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch(`/api/braidoku?tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`);

	if (res.ok) {
		const { columns, rows, grid } = await res.json();

		return { status: "good", columns, rows, grid };
	} else {
		return { status: "bad" };
	}
};
