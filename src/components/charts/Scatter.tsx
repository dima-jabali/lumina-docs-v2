"use client";

import { AlertCircle } from "lucide-react";
import {
	CartesianGrid,
	ResponsiveContainer,
	ScatterChart,
	Scatter as ScatterRecharts,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import type { DashboardItem } from "@/contexts/luminaStore";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

// Custom tooltip component that highlights anomalies
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
	if (active && payload && payload.length) {
		const data = payload[0].payload;

		return (
			<div className="rounded-lg border bg-white p-2 shadow-sm">
				<div className="grid grid-cols-2 gap-2">
					<div className="flex flex-col">
						<span className="text-xs text-muted-foreground">Amount</span>

						<span className="font-bold">{data.amount}</span>
					</div>

					<div className="flex flex-col">
						<span className="text-xs text-muted-foreground">Frequency</span>

						<span className="font-bold">{data.frequency}</span>
					</div>
				</div>

				{data.isAnomaly && (
					<div className="mt-2 flex items-center gap-1 text-red-500">
						<AlertCircle className="h-3 w-3" />

						<span className="text-xs font-medium">Anomaly detected</span>
					</div>
				)}
			</div>
		);
	}

	return null;
};

export const Scatter: React.FC<{ item: DashboardItem }> = ({ item }) => {
	return (
		<Card className="flex flex-col border border-border-smooth/40 shadow-sm shadow-border-smooth/30 text-xs">
			<CardHeader className="">
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<ResponsiveContainer width="100%" height="100%">
				<ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 30 }}>
					<CartesianGrid strokeDasharray="3 3" />

					<XAxis
						label={{
							value: "Amount",
							position: "insideBottomRight",
							offset: -5,
						}}
						dataKey="amount"
						type="number"
						name="Amount"
					/>

					<YAxis
						label={{ value: "Frequency", angle: -90, position: "insideLeft" }}
						dataKey="frequency"
						name="Frequency"
						type="number"
					/>

					<Tooltip content={<CustomTooltip />} />

					<ScatterRecharts
						data={item.data.filter(
							(item: { isAnomaly: boolean }) => !item.isAnomaly,
						)}
						fill="var(--color-positive)"
						name="Normal Data"
					/>

					<ScatterRecharts
						data={item.data.filter(
							(item: { isAnomaly: boolean }) => item.isAnomaly,
						)}
						fill="var(--color-destructive)"
						name="Anomalies"
						shape="circle"
					/>
				</ScatterChart>
			</ResponsiveContainer>
		</Card>
	);
};
