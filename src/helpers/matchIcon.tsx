import { File, Image } from "lucide-react";

import { CsvIcon } from "@/lib/icons/CsvIcon";
import { PdfIcon } from "@/lib/icons/PdfIcon";

export const matchIcon = (value: string | null) => {
	if (!value) {
		return <File className="size-6 flex-none" />;
	}

	if (value.startsWith("image/")) {
		// eslint-disable-next-line jsx-a11y/alt-text
		return <Image className="size-6 flex-none" />;
	}

	switch (value) {
		case "text/csv":
			return <CsvIcon className="size-6 flex-none" />;

		case "application/pdf":
			return <PdfIcon className="size-6 flex-none fill-destructive" />;

		default:
			return <File className="size-6 flex-none" />;
	}
};
