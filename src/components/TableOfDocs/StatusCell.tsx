"use client";

import { titleCase } from "scule";
import { memo } from "react";

import type { TableCellProps } from "@/types/document";
import type { GeneralIndexStatus } from "@/types/general-enums";
import { matchStatusClassName } from "@/helpers/utils";
import { Badge } from "../ui/badge";

const memoCellCompareFunction = (
	prev: TableCellProps,
	next: TableCellProps,
) => {
	const { status: prevStatus } = prev.row.original;
	const { status: nextStatus } = next.row.original;

	return prevStatus === nextStatus;
};

export const StatusCell: React.FC<TableCellProps> = memo(function StatusCell({
	cell,
}) {
	const status = cell.getValue() as GeneralIndexStatus | null;

	return (
		<div
			className="relative items-center justify-start w-full p-4 border-x-border-smooth flex flex-wrap gap-1 h-full font-normal capitalize text-sm"
		>
			<Badge className={matchStatusClassName(status)}>

			{titleCase(status?.toLowerCase() ?? "")}
			</Badge>
		</div>
	);
}, memoCellCompareFunction);
