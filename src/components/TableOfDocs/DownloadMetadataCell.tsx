import { FileJson } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";

import { hasErrorMessage } from "@/lib/utils";
import type { TableCellProps } from "@/types/document";

const memoCellCompareFunction = (
	prev: TableCellProps,
	next: TableCellProps,
) => {
	const { file_uuid: prevFileUuid } = prev.row.original;
	const { file_uuid: nextFileUuid } = next.row.original;

	return prevFileUuid === nextFileUuid;
};

const FILE_JSON_ICON = <FileJson className="size-4 stroke-1 text-primary" />;

export const DownloadMetadataCell: React.FC<TableCellProps> = memo(
	function DownloadMetadataCell({ cell }) {
		const handleDownloadFileMetadata = async (
			e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		) => {
			e.stopPropagation();

			const fileName = `${cell.row.original.file_name ?? "?"}`;

			try {
				const blob = new Blob([JSON.stringify(cell.row.original, null, 2)], {
					type: "application/json",
				});

				const url = URL.createObjectURL(blob);

				const a = document.createElement("a");
				a.download = `${cell.row.original.file_name}-metadata.json`;
				a.href = url;

				document.body.appendChild(a);

				a.click();

				// clean up "a" element & remove ObjectURL
				document.body.removeChild(a);
				URL.revokeObjectURL(url);

				toast(`File metada of "${fileName}" downloaded successfully!`);
			} catch (error) {
				toast(`Error downloading metadata of file "${fileName}"`, {
					description: hasErrorMessage(error) ? error.message : undefined,
				});
			}
		};

		return (
			<div className="items-center justify-center w-full flex h-full">
				<button
					className="button-hover rounded-full p-2 flex items-center justify-center"
					title="Download file metadata as JSON"
					onClick={handleDownloadFileMetadata}
				>
					{FILE_JSON_ICON}
				</button>
			</div>
		);
	},
	memoCellCompareFunction,
);
