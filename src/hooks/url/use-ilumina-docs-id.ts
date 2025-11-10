import { parseAsInteger, useQueryState } from "nuqs";

const ILUMINA_DOCS_ID_KEY = "ilumina-docs-id";

export const useIluminaDocsId = () =>
	useQueryState(
		ILUMINA_DOCS_ID_KEY,
		parseAsInteger.withOptions({
			clearOnDefault: false,
			history: "push",
			shallow: true,
		}),
	);
