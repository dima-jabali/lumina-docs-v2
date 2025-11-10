import { Card, Title, BarChart, Text } from "@tremor/react";

import type { ExtendedTooltipProps } from "./ChartTooltip";
import { cn } from "@/lib/utils";

interface ApproverBoxPlotProps {
	data: {
		outliers: number[];
		approver: string;
		median: number;
		count?: number; // Total approvals, optional
		min: number;
		max: number;
		q1: number;
		q3: number;
	}[];
}

const COLOR_SCHEME: Record<string, string> = {
	Q3: "bg-emerald-500 dark:bg-emerald-500",
	Min: "bg-violet-500 dark:bg-violet-500",
	Median: "bg-blue-500 dark:bg-blue-500",
	Max: "bg-amber-500 dark:bg-amber-500",
	Q1: "bg-gray-500 dark:bg-gray-500",
};

export const ApproverBoxPlot: React.FC<ApproverBoxPlotProps> = ({ data }) => {
	// Transform data for visualization
	const chartData = data.map((item) => ({
		approver: item.approver,
		count: item.count || 0,
		Median: item.median,
		median: item.median,
		name: item.approver,
		Min: item.min,
		min: item.min,
		Max: item.max,
		max: item.max,
		Q1: item.q1,
		q1: item.q1,
		Q3: item.q3,
		q3: item.q3,
	}));

	return (
		<Card className="w-full">
			<Title>Approver Processing Times</Title>
			<Text>Median & distribution of approval times in days per approver</Text>
			<BarChart
				colors={["violet", "gray", "blue", "emerald", "amber"]}
				categories={["Min", "Q1", "Median", "Q3", "Max"]}
				valueFormatter={(value) => `${value} days`}
				className="mt-6 h-72"
				showAnimation={true}
				layout="vertical"
				showLegend={true}
				data={chartData}
				yAxisWidth={72}
				stack={false}
				index="name"
				customTooltip={({ active, payload }: ExtendedTooltipProps) => {
					if (!active || !payload || payload.length === 0) return null;

					return (
						<div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-md">
							{/* Header with the approver name */}
							{payload[0]?.payload.approver && (
								<div className="font-medium text-gray-900 dark:text-gray-50 mb-1">
									{payload[0].payload.approver}
								</div>
							)}

							{/* List of values for each category */}
							<div className="space-y-1">
								{payload.map((entry, index) => (
									<div
										key={`item-${index}`}
										className="flex items-center justify-between gap-2"
									>
										<div className="flex items-center gap-1">
											<span
												className={cn(
													"h-2.5 w-2.5 rounded-sm fill",
													COLOR_SCHEME[`${entry.name}`],
												)}
											/>

											<span className="text-gray-600 dark:text-gray-300">
												{entry.name}:
											</span>
										</div>

										<span className="font-medium text-gray-900 dark:text-gray-50 ml-2">
											{entry.value} days
										</span>
									</div>
								))}
							</div>
						</div>
					);
				}}
			/>
		</Card>
	);
};
