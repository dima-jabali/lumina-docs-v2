import { Card, Title, BarChart, Text } from "@tremor/react";

interface VendorSpendParetoProps {
	data: {
		vendor: string;
		amount: number;
		runningTotal: number;
		percentage: number;
	}[];
}

export const VendorSpendPareto: React.FC<VendorSpendParetoProps> = ({
	data,
}) => {
	// Convert data for chart
	const chartData = data.map((item) => ({
		vendor: item.vendor,
		amount: item.amount,
		percentage: item.percentage,
	}));

	return (
		<Card className="w-full">
			<Title>Vendor Spend Analysis (80/20 Pareto)</Title>
			<Text>Spend by vendor with cumulative percentage</Text>
			<div className="mt-6 h-80">
				<BarChart
					data={chartData}
					index="vendor"
					categories={["amount"]}
					colors={["blue"]}
					valueFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
					showLegend={false}
					showAnimation={true}
					showYAxis={true}
					showXAxis={true}
					showGridLines={true}
					showTooltip={true}
					layout="vertical"
					yAxisWidth={162}
					barCategoryGap="20%"
					customTooltip={({ payload }) => {
						const payloadData = payload?.[0]?.payload;
						if (!payloadData) return null;
						return (
							<div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
								<p className="font-medium text-gray-900 dark:text-gray-50">
									{payloadData.vendor}
								</p>
								<p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
									${(payloadData.amount / 1000).toFixed(1)}k
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
									{payloadData.percentage}% of total spend
								</p>
							</div>
						);
					}}
				/>
			</div>
		</Card>
	);
};
