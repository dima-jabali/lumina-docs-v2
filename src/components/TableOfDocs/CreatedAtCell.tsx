import { memo } from "react";

import { shortMonthWithHourDateFormatter } from "@/helpers/utils";
import type { TableCellProps } from "@/types/document";

const memoCellCompareFunction = (
	prev: TableCellProps,
	next: TableCellProps,
) => {
	const { created_at: prevCreatedAt } = prev.row.original;
	const { created_at: nextCreatedAt } = next.row.original;

	return prevCreatedAt === nextCreatedAt;
};

export const CreateAtCell: React.FC<TableCellProps> = memo(
	function CreateAtCell({ cell }) {
		const createdAt = cell.getValue() as string | null;
		const createdAtFormatted = createdAt
			? shortMonthWithHourDateFormatter.format(new Date(createdAt))
			: "—";

		return (
			<div className="relative items-center justify-start w-full p-4 text-sm text-muted-foreground border-x-border-smooth flex flex-wrap gap-1 h-full">
				{createdAtFormatted}
			</div>
		);
	},
	memoCellCompareFunction,
);
