import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch(`/api/braidoku?tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`);

	if (res.ok) {
		const { columns, rows } = await res.json();

		return { status: "good", columns, rows };
	} else {
		return { status: "bad" };
	}
};
