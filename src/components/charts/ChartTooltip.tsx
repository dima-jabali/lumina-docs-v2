import { type CustomTooltipProps } from "@tremor/react";

export interface ExtendedTooltipProps extends CustomTooltipProps {
	valueFormatter?: (value: number) => string;
}

export const CustomChartTooltip = ({
	active,
	payload,
	label,
}: ExtendedTooltipProps) => {
	if (!active || !payload || payload.length === 0) return null;

	return (
		<div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-md">
			{/* Cabeçalho com o label (normalmente a data/categoria) */}
			{label && (
				<div className="font-medium text-gray-900 dark:text-gray-50 mb-1">
					{label.toString()}
				</div>
			)}

			{/* Lista de valores para cada série */}
			<div className="space-y-1">
				{payload.map((entry, index) => (
					<div
						key={`item-${index}`}
						className="flex items-center justify-between gap-2"
					>
						<div className="flex items-center gap-1">
							<span
								className="h-2.5 w-2.5 rounded-sm"
								style={{ backgroundColor: entry.color }}
							/>
							<span className="text-gray-600 dark:text-gray-300">
								{entry.name}:
							</span>
						</div>
						<span className="font-medium text-gray-900 dark:text-gray-50 ml-2">
							{typeof entry.value === "number"
								? `$${(entry.value / 1000).toFixed(1)}k`
								: entry.value}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export const CustomDonutTooltip = ({
	active,
	payload,
}: ExtendedTooltipProps) => {
	if (!active || !payload || payload.length === 0) return null;

	const entry = payload[0];
	if (!entry) return null;

	return (
		<div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-md">
			<div className="flex items-center gap-1 mb-1">
				<span
					className="h-2.5 w-2.5 rounded-sm"
					style={{ backgroundColor: entry.color }}
				/>
				<span className="font-medium text-gray-900 dark:text-gray-50">
					{entry.name}
				</span>
			</div>
			<div className="text-gray-600 dark:text-gray-300">
				{typeof entry.value === "number"
					? `$${(entry.value / 1000).toFixed(1)}k`
					: entry.value}
			</div>
		</div>
	);
};
