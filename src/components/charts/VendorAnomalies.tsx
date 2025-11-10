import { Card, Title, ScatterChart, Text, Flex, Metric } from "@tremor/react";

import type { ExtendedTooltipProps } from "./ChartTooltip";

interface VendorAnomaliesProps {
	data: {
		vendor: string;
		amount: number;
		frequency: number;
		isAnomaly: boolean;
	}[];
}

export const VendorAnomalies: React.FC<VendorAnomaliesProps> = ({ data }) => {
	// Find potential duplicates (anomalies)
	const anomalyCount = data.filter((item) => item.isAnomaly).length;

	// Prepare the data with custom point sizes and colors
	const enhancedData = data.map((item) => ({
		...item,
		// Add these properties that will be used for styling
		pointSize: item.isAnomaly ? 3 : 2,
		pointColor: item.isAnomaly ? "amber" : "blue",
	}));

	return (
		<Card className="w-full">
			<Title>Vendor Transaction Analysis</Title>
			<Text>Amount vs. frequency with anomalies highlighted</Text>

			<div className="mt-6">
				<ScatterChart
					className="h-80"
					data={enhancedData}
					category="vendor"
					x="frequency"
					y="amount"
					size="pointSize"
					color="pointColor"
					valueFormatter={{
						x: (frequency) => `${frequency} invoices`,
						y: (amount) => `$${amount.toLocaleString()}`,
					}}
					showOpacity={true}
					showLegend={false}
					showAnimation={true}
					customTooltip={({ active, payload }: ExtendedTooltipProps) => {
						if (!active || !payload || payload.length === 0) return null;

						const payloadData = payload[0]?.payload;
						if (!payloadData) return null;
						console.log("Payload", payload);

						return (
							<div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
								<p className="font-medium text-gray-900 dark:text-gray-50">
									{payloadData.vendor}
								</p>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									Amount: ${(payloadData.amount / 1000).toFixed(1)}k
								</p>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									Invoices: {payloadData.frequency}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Anomaly: {payloadData.pointSize === 3 ? "Yes" : "No"}
								</p>
							</div>
						);
					}}
				/>
			</div>

			<Flex className="mt-4">
				<div>
					<Text>Potential Duplicates</Text>
					<Metric className="text-red-600">{anomalyCount}</Metric>
				</div>
			</Flex>
		</Card>
	);
};
