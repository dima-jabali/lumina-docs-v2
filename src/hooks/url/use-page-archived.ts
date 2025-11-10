"use client";

import { createParser, parseAsString, useQueryState } from "nuqs";

import { FILTER_ARCHIVED_OPTIONS, FilterArchived } from "@/types/general-enums";
import { usePageOffset } from "./use-page-offset";
import { usePageSort } from "./use-page-sort";

const parseAsFilterArchived = createParser({
	parse: (value) => {
		const parsed = parseAsString.parse(value) as FilterArchived;

		return FILTER_ARCHIVED_OPTIONS.includes(parsed)
			? parsed
			: FilterArchived.ALL;
	},
	serialize: (value) =>
		FILTER_ARCHIVED_OPTIONS.includes(value) ? value : FilterArchived.ALL,
});

export const usePageArchived = () => {
	const [originalPageArchived, originalSetPageArchived] = useQueryState(
		"archived",
		parseAsFilterArchived
			.withDefault(FilterArchived.ONLY_NON_ARCHIVED)
			.withOptions({
				clearOnDefault: false,
				history: "push",
				shallow: true,
			}),
	);

	const [, setPageOffset] = usePageOffset();
	const [, setPageSort] = usePageSort();

	const setPageArchived: typeof originalSetPageArchived = (nextArchived) => {
		return originalSetPageArchived((prevArchived) => {
			if (typeof nextArchived === "function") {
				throw new Error("setPageArchived argument should not be a function!");
			}

			const hasArchivedChanged = nextArchived !== prevArchived;

			if (hasArchivedChanged) {
				(async () => {
					await Promise.allSettled([
						setPageOffset(0),
						setPageSort({
							sort_direction: null,
							sort: null,
						}),
					]);
				})();
			}

			return nextArchived;
		});
	};

	return [originalPageArchived, setPageArchived] as const;
};
