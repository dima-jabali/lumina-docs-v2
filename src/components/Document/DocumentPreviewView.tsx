"use client";

import type { MimeType } from "@/helpers/utils";
import { useFetchDocumentBlobUrl } from "@/hooks/fetch/use-fetch-document-blob-url";
import type { DocumentUuid } from "@/types/document";
import { DocumentPreview } from "../DocumentPreview";
import { LOADER } from "../Loader";
import { getSubFileType, tryGetDocumentMimeType } from "./utils";
import type { SupportedDocTypes } from "@/types/general-enums";

export const DocumentPreviewView: React.FC<{
	fileMetadata: { file_name: string | null; file_uuid: DocumentUuid };
	docType?: SupportedDocTypes | null;
}> = ({ fileMetadata, docType }) => {
	const mimeType = tryGetDocumentMimeType(fileMetadata.file_name);

	const fileblobUrlQuery = useFetchDocumentBlobUrl({
		documentUuid: fileMetadata.file_uuid,
		documentFileType: mimeType,
		subFile:
			!!fileMetadata && !!docType
				? {
						file_name: fileMetadata.file_name,
						file_uuid: fileMetadata.file_uuid,
						type: getSubFileType(docType),
					}
				: undefined,
	});

	if (fileblobUrlQuery.isError) {
		throw fileblobUrlQuery.error;
	}

	if (!mimeType) {
		throw new Error("Unable to determine file mime type");
	}

	return fileblobUrlQuery.data ? (
		<DocumentPreview
			className="simple-scrollbar min-h-[500px]"
			fileBlobUrl={fileblobUrlQuery.data}
			mimeType={mimeType as MimeType}
		/>
	) : fileblobUrlQuery.isPending ? (
		<div className="flex flex-col items-center justify-center w-full h-full text-xs gap-2 min-h-[500px]">
			{LOADER}

			<span>Downloading document...</span>
		</div>
	) : null;
};
