import { matchIcon } from "@/helpers/matchIcon";
import type { TableCellProps } from "@/types/document";

export const FileTypeCell: React.FC<TableCellProps> = ({ cell }) => {
	return (
		<div className="relative items-center justify-start w-full p-4 border-x-border-smooth flex flex-wrap gap-1 h-full">
			{matchIcon(cell.getValue() as string)}
		</div>
	);
};
