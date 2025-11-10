"use client";

import { useState } from "react";
import {
	Area,
	Bar,
	CartesianGrid,
	ComposedChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import type { DashboardItem } from "@/contexts/luminaStore";

// Prepare data for Pareto chart
const prepareParetoData = (data: { name: string; amount: number }[]) => {
	// Sort data in descending order
	const sortedData = data.toSorted((a, b) => b.amount - a.amount);

	// Calculate total amount
	const totalAmount = sortedData.reduce((sum, item) => sum + item.amount, 0);

	// Calculate percentage and cumulative percentage
	let cumulativePercentage = 0;

	return sortedData.map((item) => {
		const percentage = (item.amount / totalAmount) * 100;

		cumulativePercentage += percentage;

		return {
			cumulativePercentage,
			amount: item.amount,
			name: item.name,
			percentage,
		};
	});
};

export const Pareto: React.FC<{ item: DashboardItem }> = ({ item }) => {
	const [dataType] = useState<"vendor" | "category">("vendor");

	const data = prepareParetoData(
		dataType === "vendor" ? item.data.vendor : item.data.category,
	);

	// Find the 80% threshold index
	const eightyPercentIndex = data.findIndex(
		(item) => item.cumulativePercentage >= 80,
	);
	const paretoRatio = ((eightyPercentIndex + 1) / data.length) * 100;

	return (
		<Card className="flex flex-col border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_2]">
			<CardHeader className="">
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="mb-8 text-sm text-muted-foreground">
					<span className="font-medium text-foreground">
						{Math.round(paretoRatio)}%
					</span>{" "}
					of {dataType}s account for 80% of total spend
				</div>

				<ChartContainer config={item.chartConfig}>
					<ResponsiveContainer width="100%" height="100%">
						<ComposedChart
							margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
							data={data}
						>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />

							<XAxis
								tick={{ fontSize: 12 }}
								textAnchor="end"
								dataKey="name"
								interval={0}
								angle={-45}
							/>

							<YAxis
								tickFormatter={(value) => `$${value.toLocaleString()}`}
								orientation="left"
								yAxisId="left"
							/>

							<YAxis
								tickFormatter={(value) => `${value}%`}
								orientation="right"
								domain={[0, 100]}
								yAxisId="right"
							/>

							<ChartTooltip
								content={
									<ChartTooltipContent indicator="line" cursor={false} />
								}
							/>

							<Bar
								fill="var(--color-amount)"
								radius={[4, 4, 0, 0]}
								name="Spend Amount"
								dataKey="amount"
								yAxisId="left"
							/>

							<Area
								stroke="var(--color-cumulative)"
								fill="var(--color-cumulative)"
								dataKey="cumulativePercentage"
								name="Cumulative %"
								fillOpacity={0.2}
								type="monotone"
								yAxisId="right"
							/>

							<Area
								// 80% threshold line
								strokeDasharray="3 3"
								name="80% Threshold"
								dataKey={() => 80}
								stroke="#FF0000"
								type="monotone"
								yAxisId="right"
								fill="none"
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
