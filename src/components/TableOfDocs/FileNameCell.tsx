import { Download } from "lucide-react";
import { memo, useState } from "react";
import { toast } from "sonner";

import { useFetchDocumentBlobUrl } from "@/hooks/fetch/use-fetch-document-blob-url";
import type { TableCellProps } from "@/types/document";
import { tryGetDocumentMimeType } from "../Document/utils";
import { hasErrorMessage } from "@/lib/utils";
import { Button } from "../ui/button";

const memoCellCompareFunction = (
	prev: TableCellProps,
	next: TableCellProps,
) => {
	const { file_name: prevFileName, id: prevId } = prev.row.original;
	const { file_name: nextFileName, id: nextId } = next.row.original;

	return prevId === nextId && prevFileName === nextFileName;
};

const DOWNLOAD_ICON = <Download className="size-3" />;

export const FileNameCell: React.FC<TableCellProps> = memo(
	function FileNameCell({ cell }) {
		const [canDownload, setCanDownload] = useState(false);

		const doc = cell.row.original;
		const fileName = doc.file_name;

		const fileBlobUrlQuery = useFetchDocumentBlobUrl({
			documentUuid: doc.file_uuid,
			documentFileType: canDownload
				? tryGetDocumentMimeType(doc.file_name)
				: undefined,
			enabled: canDownload,
		});

		const handleDownloadFileBlob = async (
			e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		) => {
			e.stopPropagation();

			setCanDownload(true);

			try {
				const fileBlobUrl = await fileBlobUrlQuery.promise;

				const a = document.createElement("a");
				a.download = `${fileName}`;
				a.href = fileBlobUrl;

				document.body.appendChild(a);

				a.click();

				// clean up "a" element & remove ObjectURL
				document.body.removeChild(a);

				toast(`File "${fileName}" downloaded successfully!`);
			} catch (error) {
				toast(`Error downloading file "${fileName}"`, {
					description: hasErrorMessage(error) ? error.message : undefined,
				});
			}
		};

		return (
			<div className="relative items-center justify-start w-full p-4 border-x-border-smooth flex flex-wrap gap-4 h-full group/file-name-cell">
				<span className="truncate max-w-[80%]">{fileName}</span>

				<Button
					className="invisible group-hover/file-name-cell:visible p-0 rounded-full size-5 aspect-square data-[is-loading=true]:visible hover:text-white"
					loaderClassNames="border-t-primary size-3"
					isLoading={fileBlobUrlQuery.isLoading}
					onClick={handleDownloadFileBlob}
					title="Download file"
					icon={DOWNLOAD_ICON}
					variant="ghost"
					size="lg"
				/>
			</div>
		);
	},
	memoCellCompareFunction,
);
