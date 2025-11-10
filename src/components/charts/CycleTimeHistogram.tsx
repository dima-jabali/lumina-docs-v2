import { Card, Title, AreaChart, Text } from "@tremor/react";
import type { ExtendedTooltipProps } from "./ChartTooltip";

interface CycleTimeHistogramProps {
	data: {
		target: number;
		count: number;
		days: string;
	}[];
}

export const CycleTimeHistogram: React.FC<CycleTimeHistogramProps> = ({
	data,
}) => {
	// Add data for the tooltip
	const enhancedData = data.map((item) => {
		const totalCount = data.reduce((sum, d) => sum + d.count, 0);
		const percentage =
			totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;

		return {
			...item,
			percentage: percentage,
			range: item.days, // Alias creation for clarity in the tooltip
		};
	});

	return (
		<Card className="w-full">
			<Title>Invoice Cycle Time</Title>

			<Text>Days from receipt to payment (with SLA target line)</Text>

			<AreaChart
				className="mt-6 h-72 [&_svg]:text-muted"
				valueFormatter={(value) => `${value}`}
				categories={["count", "target"]}
				colors={["blue", "amber"]}
				showAnimation={true}
				data={enhancedData}
				showLegend={true}
				index="days"
				customTooltip={({ active, payload }: ExtendedTooltipProps) => {
					if (!active || !payload || payload.length === 0) return null;

					const payloadData = payload[0]?.payload;
					if (!payloadData) return null;

					return (
						<div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
							<p className="font-medium text-gray-900 dark:text-gray-50">
								{payloadData.range} days
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-300">
								{payloadData.count} invoices
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{payloadData.percentage}% of total
							</p>
						</div>
					);
				}}
			/>
		</Card>
	);
};
