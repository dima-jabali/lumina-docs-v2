import { cn } from "@/lib/utils";
import {
	LineChart,
	BarChart,
	AreaChart,
	DonutChart,
	Text,
} from "@tremor/react";
import { CustomChartTooltip, CustomDonutTooltip } from "./ChartTooltip";

interface DynamicChartProps {
	className?: string;
	chartType: string;
	title: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any[];
}

// Interface for the quarterly grouped data object
interface QuarterData {
	value: number;
	name: string;
}

export const DynamicChart: React.FC<DynamicChartProps> = ({
	data,
	chartType,
	className,
}) => {
	// For monthly quickbooks data specifically
	if (
		Array.isArray(data) &&
		data.length > 0 &&
		"month" in data[0] &&
		"amount" in data[0]
	) {
		switch (chartType.toLowerCase()) {
			case "line":
				return (
					<LineChart
						className={cn("mt-6 h-72", className)}
						data={data}
						index="month"
						categories={["amount"]}
						colors={["emerald"]}
						valueFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
						showXAxis={true}
						showYAxis={true}
						showLegend={false}
						showAnimation={true}
						curveType="monotone"
						customTooltip={CustomChartTooltip}
					/>
				);
			case "bar":
				return (
					<BarChart
						className={cn(
							"mt-6 h-72 border-none ring-0 [svg]:text-red!",
							className,
						)}
						data={data}
						index="month"
						categories={["amount"]}
						colors={["blue"]}
						valueFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
						showXAxis={true}
						showYAxis={true}
						showLegend={false}
						showAnimation={true}
						customTooltip={CustomChartTooltip}
					/>
				);
			case "area":
				return (
					<AreaChart
						className={cn("mt-6 h-72", className)}
						data={data}
						index="month"
						categories={["amount"]}
						colors={["indigo"]}
						valueFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
						showXAxis={true}
						showYAxis={true}
						showLegend={false}
						showAnimation={true}
						curveType="monotone"
						customTooltip={CustomChartTooltip}
					/>
				);
			case "donut": {
				// Convert monthly data to a format suitable for donut chart
				// We'll group data by quarters for better visualization
				const groupedData = data.reduce<QuarterData[]>((acc, item) => {
					const month = item.month.split(" ")[0];
					const year = item.month.split(" ")[1];
					let quarter = "";

					if (["Jan", "Feb", "Mar"].includes(month)) quarter = `Q1 ${year}`;
					else if (["Apr", "May", "Jun"].includes(month))
						quarter = `Q2 ${year}`;
					else if (["Jul", "Aug", "Sep"].includes(month))
						quarter = `Q3 ${year}`;
					else quarter = `Q4 ${year}`;

					const existingQuarter = acc.find(
						(q: QuarterData) => q.name === quarter,
					);
					if (existingQuarter) {
						existingQuarter.value += item.amount;
					} else {
						acc.push({ name: quarter, value: item.amount });
					}

					return acc;
				}, []);

				return (
					<div className="mt-6">
						<Text>Quarterly breakdown (aggregated data)</Text>
						<DonutChart
							className="h-72 mt-2"
							data={groupedData}
							category="value"
							index="name"
							colors={[
								"emerald",
								"indigo",
								"blue",
								"amber",
								"rose",
								"cyan",
								"violet",
							]}
							valueFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
							showLabel={true}
							showAnimation={true}
							customTooltip={CustomDonutTooltip}
						/>
					</div>
				);
			}
			default:
				return (
					<LineChart
						className={cn("mt-6 h-72", className)}
						data={data}
						index="month"
						categories={["amount"]}
						colors={["emerald"]}
						valueFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
						showXAxis={true}
						showYAxis={true}
						showLegend={false}
						showAnimation={true}
						customTooltip={CustomChartTooltip}
					/>
				);
		}
	}

	// For other types of data - try to determine the structure and render appropriately
	if (Array.isArray(data) && data.length > 0) {
		// Extract first item keys for column detection
		const keys = Object.keys(data[0]);

		// If we have a common data structure with a categorical field and numeric field
		if (keys.length >= 2) {
			const possibleCategoryField = keys.find(
				(key) => typeof data[0][key] === "string",
			);
			const possibleValueField = keys.find(
				(key) => typeof data[0][key] === "number",
			);

			if (possibleCategoryField && possibleValueField) {
				return (
					<BarChart
						className={cn("mt-6 h-72", className)}
						data={data}
						index={possibleCategoryField}
						categories={[possibleValueField]}
						colors={["blue"]}
						showAnimation={true}
						customTooltip={CustomChartTooltip}
						valueFormatter={(value) => `${value}`}
					/>
				);
			}
		}
	}

	// Fallback for unknown data structure
	return (
		<div className="mt-6 h-72 overflow-auto">
			<Text>Data preview (no suitable visualization found)</Text>

			<pre className="text-xs mt-2 p-4 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 rounded-md">
				{JSON.stringify(data, null, 2)}
			</pre>
		</div>
	);
};
