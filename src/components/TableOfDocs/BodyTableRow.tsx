"use client";

import type { VirtualItem } from "@tanstack/react-virtual";
import { type PropsWithChildren, memo } from "react";

import { globalStore } from "@/contexts/luminaStore";
import type { DocumentRow } from "@/types/document";
import { View } from "@/types/general-enums";

type Props = {
	ref: React.Ref<HTMLTableRowElement>;
	virtualRow: VirtualItem;
	row: DocumentRow;
};

const memoCellCompareFunction = (prev: Props, next: Props) => {
	return (
		prev.virtualRow.index === next.virtualRow.index &&
		prev.virtualRow.start === next.virtualRow.start &&
		prev.row.id === next.row.id
	);
};

export const BodyTableRow = memo(
	({ virtualRow, children, row, ref }: PropsWithChildren<Props>) => {
		const { index, start } = virtualRow;

		const handleOpenDocument = () => {
			globalStore.setState({
				fileMetadataUuid: row.original.file_uuid,
				view: View.Document,
			});
		};

		const isEven = index % 2 === 0;

		return (
			<tr
				className="group absolute w-full grid grid-flow-col min-h-[70px] hover:bg-black/5 active:bg-black/10 border-b border-border-smooth/70"
				style={{ transform: `translateY(${start}px)` }}
				onClick={handleOpenDocument}
				data-tr-id={row.id}
				data-even={isEven}
				data-index={index} // needed for dynamic row height measurement
				ref={ref}
			>
				{children}
			</tr>
		);
	},
	memoCellCompareFunction,
);

BodyTableRow.displayName = "BodyTableRow";
