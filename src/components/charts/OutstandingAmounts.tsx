import { Card, Title, BarChart, Text } from "@tremor/react";

import type { ExtendedTooltipProps } from "./ChartTooltip";

interface OutstandingAmountsProps {
	data: {
		period: string;
		amount: number;
	}[];
}

export const OutstandingAmounts: React.FC<OutstandingAmountsProps> = ({
	data,
}) => {
	// Adicionar dados para o tooltip
	const enhancedData = data.map((item) => {
		const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
		const percentage =
			totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0;

		return {
			...item,
			ageRange: item.period, // For better visualization in the tooltip
			percentage: percentage,
		};
	});

	return (
		<Card className="w-full">
			<Title>Outstanding Amounts by Age</Title>
			<Text>Values bucketed by days outstanding</Text>
			<BarChart
				className="mt-6 h-72"
				data={enhancedData}
				index="period"
				categories={["amount"]}
				colors={["blue"]}
				valueFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
				showLegend={false}
				showAnimation={true}
				yAxisWidth={72}
				customTooltip={({ active, payload }: ExtendedTooltipProps) => {
					if (!active || !payload || payload.length === 0) return null;

					const payloadData = payload[0]?.payload;
					if (!payloadData) return null;

					return (
						<div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
							<p className="font-medium text-gray-900 dark:text-gray-50">
								{payloadData.date}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-300">
								${(payloadData.amount / 1000).toFixed(1)}k
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{payloadData.invoiceCount} outstanding invoices
							</p>
						</div>
					);
				}}
			/>
		</Card>
	);
};
