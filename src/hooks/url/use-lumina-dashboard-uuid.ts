import type { DashboardProjectUuid } from "@/contexts/luminaStore";
import {
	createParser,
	parseAsString,
	useQueryState,
	type ParserBuilder,
} from "nuqs";

const LUMINA_DOCS_DASHBOARD_ID_KEY = "lumina-docs-dashboard-uuid";

const parseAsDashboardProjectUuid: ParserBuilder<DashboardProjectUuid> =
	createParser({
		serialize: (value) => `${value}`,

		parse: (value) => {
			if (!value) return null;

			return parseAsString.parse(value) as DashboardProjectUuid;
		},
	});

export const useLuminaDashboardUuid = () =>
	useQueryState(
		LUMINA_DOCS_DASHBOARD_ID_KEY,
		parseAsDashboardProjectUuid.withOptions({
			clearOnDefault: false,
			history: "push",
			shallow: true,
		}),
	);
