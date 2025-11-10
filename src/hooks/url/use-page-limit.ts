import { parseAsInteger, useQueryState } from "nuqs";

const PAGE_LIMIT_KEY = "limit";

export const usePageLimit = () =>
	useQueryState(
		PAGE_LIMIT_KEY,
		parseAsInteger.withDefault(10).withOptions({
			clearOnDefault: false,
			history: "push",
			shallow: true,
		}),
	);
