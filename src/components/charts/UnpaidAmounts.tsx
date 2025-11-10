import { Card, Title, LineChart, Text } from "@tremor/react";

import type { ExtendedTooltipProps } from "./ChartTooltip";

interface UnpaidAmountsProps {
	data: {
		date: string;
		amount: number;
	}[];
}

export const UnpaidAmounts: React.FC<UnpaidAmountsProps> = ({ data }) => {
	// Adicionar dados para o tooltip
	const enhancedData = data.map((item) => {
		const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
		const percentage =
			totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0;

		return {
			...item,
			dueDate: item.date, // For better visualization in the tooltip
			percentage: percentage,
		};
	});

	return (
		<Card className="w-full">
			<Title>Approved But Unpaid Amounts</Title>
			<Text>Cumulative values by due date over the next 60 days</Text>
			<LineChart
				className="mt-6 h-72"
				data={enhancedData}
				index="date"
				categories={["amount"]}
				colors={["violet"]}
				valueFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
				showLegend={false}
				showAnimation={true}
				curveType="monotone"
				showXAxis={true}
				showYAxis={true}
				yAxisWidth={72}
				customTooltip={({ active, payload }: ExtendedTooltipProps) => {
					if (!active || !payload || payload.length === 0) return null;

					const payloadData = payload[0]?.payload;
					if (!payloadData) return null;

					return (
						<div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
							<p className="font-medium text-gray-900 dark:text-gray-50">
								{payloadData.ageGroup}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-300">
								${(payloadData.amount / 1000).toFixed(1)}k
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{payloadData.invoiceCount} faturas ({payloadData.percentage}% do
								total)
							</p>
						</div>
					);
				}}
			/>
		</Card>
	);
};
