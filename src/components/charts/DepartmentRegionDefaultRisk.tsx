"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import type { DashboardItem } from "@/contexts/luminaStore";

export interface RegionRiskData {
	defaultRisk: number;
	region: string;
	fill: string;
}

const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

export const DepartmentRegionDefaultRisk: React.FC<{
	item: DashboardItem<Array<RegionRiskData>>;
}> = ({ item }) => {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30">
			<style>
				{/* Changing bg color on hover on a chart on lumina docs */}
				{`
.recharts-rectangle.recharts-tooltip-cursor {
	fill: rgb(0 0 0 / 10%);
}`}
			</style>

			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
				<BarChart
					data={item.data}
					margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" />

					<XAxis dataKey="region" dy={10} />

					<YAxis
						label={{ text: "Default Risk", angle: -90, position: "left" }}
						tickFormatter={formatPercentage}
						dx={-10}
					/>

					<ChartTooltip
						content={<ChartTooltipContent indicator="line" />}
						cursor={false}
					/>

					<Bar
						dataKey="defaultRisk"
						fill="var(--chart-1)"
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ChartContainer>

			<div className="size-6"></div>
		</Card>
	);
};
