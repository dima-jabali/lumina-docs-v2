import type { AnyColumn, AnyHeaderContext } from "@/lib/table-utils";
import { cn } from "@/lib/utils";
import type { SortDirection } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { memo, useState, useTransition } from "react";
import { Input, InputWithIcons } from "../ui/input";
import { Loader, LOADER } from "../Loader";
import { SORT_ICONS } from "../SORT_ICONS";

type FilterType = "range" | undefined;

type TableHeaderContentProps = {
	isSorted: false | SortDirection;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	columnFilterValue: any;
	isFiltered: boolean;
	canFilter: boolean;
	column: AnyColumn;
	canSort: boolean;
	colSpan: number;
	width: number;

	filterType: FilterType;
	headerName: string;
	className?: string;
};

export type HeaderMetaProps = {
	filterType?: FilterType;
	className?: string;
	headerName: string;
};

type RangeFilter = [number | undefined, number | undefined];

const TableHeaderContent: React.FC<TableHeaderContentProps> = memo(
	function TableHeaderContent({
		columnFilterValue,
		headerName,
		filterType,
		isFiltered,
		className,
		canFilter,
		isSorted,
		canSort,
		colSpan,
		column,
		width,
	}) {
		const [placeholder] = useState(
			`Search ${headerName}. Press Escape to cancel.`,
		);
		const [minFilterInputValue, setMinFilterInputValue] = useState(
			(columnFilterValue as RangeFilter)?.[0] ?? undefined,
		);
		const [maxFilterInputValue, setMaxFilterInputValue] = useState(
			(columnFilterValue as RangeFilter)?.[1] ?? undefined,
		);
		const [showFilterInput, setShowFilterInput] = useState(false);
		const [filterInputValue, setFilterInputValue] = useState("");

		const [isTransitioning, startTransition] = useTransition();

		// 	useEffect(() => {
		// 		const abortController = new AbortController();
		// 		const addEventListenerOptions: AddEventListenerOptions = {
		// 			signal: abortController.signal,
		// 		};
		//
		// 		const handleOnClearAllFilters = () => {
		// 			setShowFilterInput(false);
		// 		};
		//
		// 		window.addEventListener(
		// 			BankReconciliationEvents.ClearAllTableFiltersEventName,
		// 			handleOnClearAllFilters,
		// 			addEventListenerOptions,
		// 		);
		//
		// 		return () => {
		// 			abortController.abort();
		// 		};
		// 	}, []);

		const resetFilters = () => {
			setShowFilterInput(false);

			startTransition(() => {
				column.setFilterValue(undefined);
			});
		};

		const handleOnChangeFilterValue = (
			e: React.ChangeEvent<HTMLInputElement>,
		) => {
			const { value } = e.target;

			setFilterInputValue(value);

			startTransition(() => column.setFilterValue(value));
		};

		const handleOnChangeMinFilterValue = (
			e: React.ChangeEvent<HTMLInputElement>,
		) => {
			const { valueAsNumber } = e.target;

			setMinFilterInputValue(valueAsNumber);

			// Using nested startTransition to allow `handleOnBlur` to run.
			startTransition(() =>
				startTransition(() => {
					column.setFilterValue(
						(old: [number | undefined, number | undefined]) => [
							valueAsNumber,
							old?.[1],
						],
					);
				}),
			);
		};

		const handleOnChangeMaxFilterValue = (
			e: React.ChangeEvent<HTMLInputElement>,
		) => {
			const { valueAsNumber } = e.target;

			setMaxFilterInputValue(valueAsNumber);

			// Using nested startTransition to allow `handleOnBlur` to run.
			startTransition(() =>
				startTransition(() => {
					column.setFilterValue(
						(old: [number | undefined, number | undefined]) => [
							old?.[0],
							valueAsNumber,
						],
					);
				}),
			);
		};

		const handleOnKeyDownOnFilterInput = (
			e: React.KeyboardEvent<HTMLInputElement>,
		) => {
			if (e.key === "Escape" && (e.target as HTMLInputElement).value === "") {
				resetFilters();
			}
		};

		const handleEnableColumnFilter = (
			e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		) => {
			e.stopPropagation();
			e.preventDefault();

			setShowFilterInput(true);
		};

		const handleOnBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
			if (e.target.tagName === "INPUT") {
				const inputValue = (e.target as HTMLInputElement).value;

				requestAnimationFrame(() => {
					if (document.activeElement?.tagName === "INPUT") {
						return;
					}

					if (!inputValue) {
						resetFilters();
					}
				});
			}
		};

		return (
			<th
				aria-sort={
					isSorted === "asc"
						? "ascending"
						: isSorted === "desc"
							? "descending"
							: "none"
				}
				className="relative whitespace-nowrap"
				colSpan={colSpan}
				style={{ width }}
			>
				<div
					className={cn(
						"flex items-center px-2 h-full w-full gap-2",
						className,
					)}
				>
					<span
						className="truncate flex gap-2 pl-2 text-primary"
						title={headerName}
					>
						{headerName}
					</span>

					{showFilterInput ? (
						filterType === "range" ? (
							<div className="flex ml-auto" onBlur={handleOnBlur}>
								<Input
									className="flex h-8 w-full rounded-lg border border-border-smooth bg-secondary px-3 py-2 text-sm text-primary placeholder:font-normal focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring/20 flex-1 rounded-e-none data-[is-filtered=true]:border-border-smoot"
									placeholder="Minimum value. Press Escape to cancel."
									onKeyDown={handleOnKeyDownOnFilterInput}
									onChange={handleOnChangeMinFilterValue}
									aria-label={`${headerName} min`}
									data-is-filtered={isFiltered}
									value={minFilterInputValue}
									type="number"
									autoFocus
								/>
								<Input
									className="flex h-8 w-full rounded-lg border border-border-smooth bg-secondary px-3 py-2 text-sm text-primary placeholder:font-normal focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring/20 flex-1 rounded-s-none data-[is-filtered=true]:border-border-smoot"
									placeholder="Maximum value. Press Escape to cancel."
									onKeyDown={handleOnKeyDownOnFilterInput}
									onChange={handleOnChangeMaxFilterValue}
									aria-label={`${headerName} max`}
									data-is-filtered={isFiltered}
									value={maxFilterInputValue}
									type="number"
								/>
							</div>
						) : (
							<InputWithIcons
								wrapperProps={{
									className: `h-8 ${isFiltered ? "border-border-smoot" : ""} bg-secondary`,
								}}
								iconRight={
									isTransitioning ? (
										LOADER
									) : (
										<span className="size-4 flex-none"></span>
									)
								}
								onKeyDown={handleOnKeyDownOnFilterInput}
								onChange={handleOnChangeFilterValue}
								className="placeholder:font-normal"
								placeholder={placeholder}
								value={filterInputValue}
								onBlur={handleOnBlur}
								title={placeholder}
								type="search"
								autoFocus
							/>
						)
					) : (
						<div className="flex items-center ml-auto">
							{canFilter ? (
								<button
									className="flex items-center justify-center p-2 aspect-square button-hover rounded-sm"
									onClick={handleEnableColumnFilter}
									title="Local filter by"
									type="button"
								>
									<Search className="size-3.5 flex-none" />
								</button>
							) : null}

							{canSort ? (
								<SortButton isSorted={isSorted} column={column} />
							) : null}
						</div>
					)}
				</div>
			</th>
		);
	},
);

const SortButton: React.FC<{
	isSorted: false | SortDirection;
	column: AnyColumn;
}> = ({ column, isSorted }) => {
	const [isTransitioning, startTransition] = useTransition();

	const handleSortOnKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		// Enhanced keyboard handling for sorting
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();

			startTransition(() => column.getToggleSortingHandler()?.(e));
		}
	};

	return (
		<button
			className="flex items-center justify-center px-2 border border-border-smooth aspect-square button-hover rounded-sm data-[is-sorted=false]:border-transparent"
			onClick={(e) =>
				startTransition(() => {
					column.getToggleSortingHandler()?.(e);
				})
			}
			title="Sort ascending/descending"
			onKeyDown={handleSortOnKeyDown}
			data-is-sorted={isSorted}
			type="button"
		>
			{isTransitioning ? (
				<Loader className="size-3 border-t-primary" />
			) : (
				SORT_ICONS[`${isSorted}`]
			)}
		</button>
	);
};

export const TableHeader: React.FC<AnyHeaderContext> = ({ column, header }) => {
	const columnMeta = column.columnDef.meta as HeaderMetaProps | undefined;
	const { filterType, headerName, className } = columnMeta ?? {};
	const columnFilterValue = column.getFilterValue();
	const isFiltered = column.getIsFiltered();
	const canFilter = column.getCanFilter();
	const isSorted = column.getIsSorted();
	const canSort = column.getCanSort();
	const width = column.getSize();
	const colSpan = header.colSpan;

	return (
		<TableHeaderContent
			columnFilterValue={columnFilterValue}
			headerName={headerName ?? ""}
			filterType={filterType}
			isFiltered={isFiltered}
			canFilter={canFilter}
			className={className}
			isSorted={isSorted}
			canSort={canSort}
			colSpan={colSpan}
			key={header.id}
			column={column}
			width={width}
		/>
	);
};
