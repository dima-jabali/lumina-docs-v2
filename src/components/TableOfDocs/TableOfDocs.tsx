import { useFetchDocumentMetadataList } from "@/hooks/fetch/use-fetch-document-metadata-list";
import {
	mapHeaderToCell,
	measureDynamicRowHeight,
	type AnyHeaderGroup,
} from "@/lib/table-utils";
import type { Document, DocumentCell } from "@/types/document";
import {
	flexRender,
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
	type OnChangeFn,
	type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import {
	memo,
	startTransition,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react";
import { TableHeader, type HeaderMetaProps } from "./TableHeader";
import { FileNameCell } from "./FileNameCell";
import { StatusCell } from "./StatusCell";
import { dateFilterFn } from "@/helpers/utils";
import { CreateAtCell } from "./CreatedAtCell";
import { UpdatedAtCell } from "./UpdatedAtCell";
import { DownloadMetadataCell } from "./DownloadMetadataCell";
import { BodyTableRow } from "./BodyTableRow";
import { LOADER } from "../Loader";
import { usePageLimit } from "@/hooks/url/use-page-limit";
import { isValidNumber } from "@/lib/utils";
import { globalStore } from "@/contexts/luminaStore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRowId = (row: any, index: number) => `${row.id}-${index}`;
const estimateSize = () => 70;

const mapRowToCells = (cell: DocumentCell) => (
	<td
		style={{ width: cell.column.getSize() }}
		className="relative"
		key={cell.id}
	>
		{flexRender(cell.column.columnDef.cell, cell.getContext())}
	</td>
);
const mapHeaderGroupToRows = (headerGroup: AnyHeaderGroup) => (
	<tr
		className="grid grid-flow-col h-10 w-full text-primary font-bold text-sm bg-gray-200 overflow-hidden"
		key={headerGroup.id}
	>
		{headerGroup.headers.map(mapHeaderToCell)}
	</tr>
);

export const TableOfDocs: React.FC = memo(function TableOfDocs() {
	const [columnOrder, setColumnOrder] = useState<Array<string>>([]);
	const [sorting, setSorting] = useState<SortingState>([]);

	const columnFilters = globalStore.use.columnFilters();
	const documentsQuery = useFetchDocumentMetadataList();

	const [setAllColumnFilters] = useState(
		(): OnChangeFn<ColumnFiltersState> => (updater) => {
			if (typeof updater === "function") {
				const oldValue = globalStore.getState().columnFilters;
				const newValue = updater(oldValue);

				globalStore.setState({ columnFilters: newValue });
			}
		},
	);

	const { columns, data, allFetchedDocuments, totalNumberOfProjects } =
		useMemo(() => {
			const allFetchedDocuments =
				documentsQuery.data?.pages.flatMap((page) => page.results) || [];
			const totalNumberOfProjects =
				documentsQuery.data?.pages.at(-1)?.num_results ?? 0;

			const columns: Array<ColumnDef<Document>> = [
				{
					accessorKey: "file_type",
					header: TableHeader,
					cell: () => null,
					id: "file_type",
					minSize: 50,
					meta: {
						headerName: "File Type",
					} satisfies HeaderMetaProps,
				},
				{
					accessorKey: "file_name",
					header: TableHeader,
					cell: FileNameCell,
					id: "file_name",
					minSize: 370,
					meta: {
						headerName: "Name",
					} satisfies HeaderMetaProps,
				},
				{
					accessorKey: "status",
					header: TableHeader,
					cell: StatusCell,
					id: "status",
					minSize: 200,
					meta: {
						headerName: "Status",
					} satisfies HeaderMetaProps,
				},
				{
					accessorKey: "created_at",
					filterFn: dateFilterFn,
					header: TableHeader,
					cell: CreateAtCell,
					id: "created_at",
					minSize: 250,
					meta: {
						headerName: "Created at",
					} satisfies HeaderMetaProps,
				},
				{
					accessorKey: "updated_at",
					filterFn: dateFilterFn,
					cell: UpdatedAtCell,
					header: TableHeader,
					id: "updated_at",
					minSize: 250,
					meta: {
						headerName: "Updated at",
					} satisfies HeaderMetaProps,
				},
				{
					cell: DownloadMetadataCell,
					enableColumnFilter: false,
					id: "download-metadata",
					enableSorting: false,
					header: TableHeader,
					size: 50,
					meta: {
						headerName: "",
					} satisfies HeaderMetaProps,
				},
			];

			return {
				columns,
				data: allFetchedDocuments,
				allFetchedDocuments,
				totalNumberOfProjects,
			};
		}, [documentsQuery.data?.pages]);

	const table = useReactTable({
		columnResizeMode: "onChange",
		enableColumnResizing: false,
		enableSortingRemoval: true,
		columns,
		data,
		state: {
			// rowSelection: selectedRows ?? fallbackSelectedRows,
			columnFilters: columnFilters,
			columnVisibility: {
				file_type: false,
			},

			columnOrder,
			sorting,
		},
		// onRowSelectionChange: setSelectedRows ?? setFallbackSelectedRows,
		// Column Faceting is a feature that allows you to generate lists of values for a given column from that column's data. For example, a list of unique values in a column can be generated from all rows in that column to be used as search suggestions in an autocomplete filter component. Or, a tuple of minimum and maximum values can be generated from a column of numbers to be used as a range for a range slider filter component.
		getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
		getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
		getFilteredRowModel: getFilteredRowModel(), //client-side filtering
		getFacetedRowModel: getFacetedRowModel(), // client-side faceting
		// onColumnVisibilityChange: setColumnVisibility,
		onColumnFiltersChange: setAllColumnFilters,
		getSortedRowModel: getSortedRowModel(),
		onColumnOrderChange: setColumnOrder,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getRowId,
	});

	const bodyRef = useRef<HTMLTableSectionElement>(null);
	// The scrollable element for your list
	const parentRef = useRef<HTMLDivElement>(null);

	const [getScrollElement] = useState(() => () => parentRef.current);

	const { rows } = table.getRowModel();

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		overscan: 20,
		measureElement: measureDynamicRowHeight,
		getScrollElement,
		estimateSize,
	});

	const mapRows = useCallback(
		(virtualRow: VirtualItem) => {
			const row = rows[virtualRow.index]!;

			return (
				<BodyTableRow
					key={`${row.id}${virtualRow.index}`} // This dynamic key is needed for measuring heights correctly when filtering.
					ref={rowVirtualizer.measureElement} // measure dynamic row height.
					virtualRow={virtualRow}
					row={row}
				>
					{row.getVisibleCells().map(mapRowToCells)}
				</BodyTableRow>
			);
		},
		[rowVirtualizer.measureElement, rows],
	);

	return documentsQuery.isLoading ? (
		<div className="flex h-full w-full min-h-96 items-center justify-center">
			{LOADER}
		</div>
	) : (
		<div className="border rounded-lg overflow-hidden">
			<section
				className="grid max-w-full grid-cols-1 overflow-hidden"
				aria-label="Table"
			>
				<div
					className="relative simple-scrollbar h-[65vh]" // should be a fixed height
					ref={parentRef}
				>
					<table
						/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */
						className="grid table-fixed"
						cellPadding="0"
						cellSpacing="0"
					>
						<thead className="grid sticky top-0 z-10 shadow-sm shadow-black/10 rounded">
							{table.getHeaderGroups().map(mapHeaderGroupToRows)}
						</thead>

						<tbody // tells scrollbar how big the table is:
							style={{ height: rowVirtualizer.getTotalSize() }}
							className="grid relative"
							ref={bodyRef}
						>
							{rows.length > 0 ? (
								<>
									{/* <RangeSelectionListener bodyRef={bodyRef} table={table} key="static" /> */}

									{rowVirtualizer.getVirtualItems().map(mapRows)}
								</>
							) : (
								<tr>
									<td
										className="h-24 text-center flex items-center justify-center font-bold"
										colSpan={table.getAllColumns().length}
									>
										No documents found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</section>

			<Footer
				isFetchingNextPage={documentsQuery.isFetchingNextPage}
				totalNumberOfProjects={totalNumberOfProjects}
				fetchNextPage={documentsQuery.fetchNextPage}
				allFetchedDocuments={allFetchedDocuments}
			/>
		</div>
	);
});

const Footer: React.FC<{
	allFetchedDocuments: Array<Document>;
	totalNumberOfProjects: number;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
}> = memo(function Footer({
	totalNumberOfProjects,
	allFetchedDocuments,
	isFetchingNextPage,
	fetchNextPage,
}) {
	const [pageLimit, setPageLimit] = usePageLimit();

	const handleLoadMore = () => {
		fetchNextPage();
	};

	const isNewPageLimitValid = (limit: number) => {
		return isValidNumber(limit) && limit > 0 && limit <= 2_000;
	};

	const handleCurrentPageLimitInputEnterPressed = (
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Enter") {
			const input = e.target as HTMLInputElement;

			const { valueAsNumber } = input;

			if (isNewPageLimitValid(valueAsNumber)) {
				startTransition(async () => {
					await setPageLimit(valueAsNumber);
				});
			} else {
				input.value = `${pageLimit}`;
			}
		}
	};

	const handleCurrentPageLimitInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const { valueAsNumber } = e.target;

		if (isNewPageLimitValid(valueAsNumber)) {
			startTransition(async () => {
				await setPageLimit(valueAsNumber);
			});
		} else {
			e.target.value = `${pageLimit}`;
		}
	};

	return (
		<footer
			className="flex w-full items-center justify-center p-5 border-t"
			aria-label="Documents table pagination"
		>
			{allFetchedDocuments.length > 0 ? (
				<nav className="flex w-full items-center justify-between">
					<span className="text-sm tabular-nums text-muted">
						Showing{" "}
						<span className="font-semibold">
							1-{allFetchedDocuments.length}
						</span>{" "}
						of <span className="font-semibold">{totalNumberOfProjects}</span>
					</span>

					<section className="flex gap-6 items-center">
						<div className="inline-flex h-8 gap-4 text-sm font-bold leading-8">
							<input
								className="aspect-square rounded-md border border-border-smooth  text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
								onKeyUp={handleCurrentPageLimitInputEnterPressed}
								onBlur={handleCurrentPageLimitInputChange}
								defaultValue={pageLimit}
								key={pageLimit}
								type="number"
								max={2_000}
								min={1}
							/>

							<span>items per load</span>
						</div>

						<div className="inline-flex h-8 gap-4 text-sm font-bold leading-8">
							<button
								className="flex h-8 items-center justify-center rounded-lg border gap-3 border-border-smooth px-3 leading-tight text-primary button-hover disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={
									allFetchedDocuments.length === totalNumberOfProjects ||
									totalNumberOfProjects === 0
								}
								onClick={handleLoadMore}
							>
								{isFetchingNextPage ? LOADER : null}

								<span>
									Load{isFetchingNextPage ? "ing" : ""} more
									{isFetchingNextPage ? "..." : ""}
								</span>
							</button>
						</div>
					</section>
				</nav>
			) : null}
		</footer>
	);
});
