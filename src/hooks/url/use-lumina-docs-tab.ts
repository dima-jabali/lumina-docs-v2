import { createParser, parseAsString, useQueryState } from "nuqs";

export const LUMINA_DOCS_TAB_KEY = "lumina-docs-tab";

export enum LuminaDocsTab {
	FilesTable = "Document Management",
	Dashboard = "Analytics",
	Admin = "Admin",
}

export const LUMINA_DOCS_TABS = Object.values(LuminaDocsTab);

const parseAsLuminaDocsTab = createParser({
	parse: (value) => parseAsString.parse(value) as LuminaDocsTab,
	serialize: (value) => `${value}`,
});

export const useLuminaDocsTab = () =>
	useQueryState(
		LUMINA_DOCS_TAB_KEY,
		parseAsLuminaDocsTab.withDefault(LuminaDocsTab.FilesTable).withOptions({
			clearOnDefault: false,
			history: "push",
			shallow: true,
		}),
	);
