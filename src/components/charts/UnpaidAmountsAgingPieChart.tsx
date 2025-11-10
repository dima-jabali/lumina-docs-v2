"use client";

import { Cell, Legend, Pie, PieChart } from "recharts";

import type { DashboardItem } from "@/contexts/luminaStore";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer } from "../ui/chart";

export interface AgingData {
	value: number;
	name: string;
	fill: string;
}

export const UnpaidAmountsAgingPieChart: React.FC<{
	item: DashboardItem<Array<AgingData>>;
}> = ({ item }) => {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<ChartContainer config={item.chartConfig}>
				<PieChart>
					<Pie
						data={item.data}
						outerRadius={80}
						dataKey="value"
						nameKey="name"
						cx="50%"
						cy="50%"
						label
					>
						{item.data.map((entry, index) => (
							<Cell key={index} fill={entry.fill} />
						))}
					</Pie>

					<Legend />
				</PieChart>
			</ChartContainer>

			<div className="h-6"></div>
		</Card>
	);
};
