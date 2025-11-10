import { parseAsInteger, useQueryState } from "nuqs";

const PAGE_OFFSET_KEY = "offset";

export const usePageOffset = () =>
	useQueryState(
		PAGE_OFFSET_KEY,
		parseAsInteger.withDefault(0).withOptions({
			clearOnDefault: false,
			history: "push",
			shallow: true,
		}),
	);
