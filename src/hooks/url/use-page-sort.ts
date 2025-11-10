import { parseAsString, useQueryStates } from "nuqs";

export const usePageSort = () =>
	useQueryStates({
		sort: parseAsString.withOptions({
			clearOnDefault: true,
			history: "push",
			shallow: true,
		}),
		sort_direction: parseAsString.withOptions({
			clearOnDefault: true,
			history: "push",
			shallow: true,
		}),
	});
