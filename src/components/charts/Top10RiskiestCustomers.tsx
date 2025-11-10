"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import type { DashboardItem } from "@/contexts/luminaStore";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

export interface RiskyCustomerData {
	averageDaysOverdue?: number; // Optional: Use either riskScore or averageDaysOverdue
	riskScore: number;
	customer: string;
	fill: string;
}

export const Top10RiskiestCustomers: React.FC<{
	item: DashboardItem<RiskyCustomerData[]>;
}> = ({ item }) => {
	const sortedData = item.data
		.toSorted((a, b) =>
			a.averageDaysOverdue !== undefined && b.averageDaysOverdue !== undefined
				? b.averageDaysOverdue - a.averageDaysOverdue
				: (b.riskScore || 0) - (a.riskScore || 0),
		)
		.slice(0, 10);

	const valueAccessor = "riskScore";
	const valueLabel = "Risk Score";

	console.log({ sortedData });

	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 justify-between flex flex-col">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<ChartContainer config={item.chartConfig}>
				<BarChart data={sortedData} margin={{ top: 20, right: 30 }}>
					<CartesianGrid strokeDasharray="3 3" />

					<XAxis dataKey="customer" dy={10} />

					<YAxis
						label={{ text: valueLabel, angle: -90, position: "left" }}
						dx={-10}
					/>

					<ChartTooltip cursor={false} content={<ChartTooltipContent />} />

					<Bar
						dataKey={valueAccessor}
						fill="var(--chart-2)"
						radius={[4, 4, 0, 0]}
					>
						{sortedData.map((entry, index) => (
							<Cell key={index} fill={entry.fill} />
						))}
					</Bar>
				</BarChart>
			</ChartContainer>

			<div className="size-6"></div>
		</Card>
	);
};
