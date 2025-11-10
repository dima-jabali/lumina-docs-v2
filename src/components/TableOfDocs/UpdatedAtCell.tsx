import { memo } from "react";

import { shortMonthWithHourDateFormatter } from "@/helpers/utils";
import type { TableCellProps } from "@/types/document";

const memoCellCompareFunction = (
	prev: TableCellProps,
	next: TableCellProps,
) => {
	const { updated_at: prevUpdatedAt } = prev.row.original;
	const { updated_at: nextUpdatedAt } = next.row.original;

	return prevUpdatedAt === nextUpdatedAt;
};

export const UpdatedAtCell: React.FC<TableCellProps> = memo(
	function UpdatedAtCell({ cell }) {
		const updatedAt = cell.getValue() as string | null;
		const updatedAtFormatted = updatedAt
			? shortMonthWithHourDateFormatter.format(new Date(updatedAt))
			: "—";

		return (
			<div className="relative items-center justify-start w-full p-4 text-sm text-muted-foreground border-x-border-smooth flex flex-wrap gap-1 h-full">
				{updatedAtFormatted}
			</div>
		);
	},
	memoCellCompareFunction,
);
