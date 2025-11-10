"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { DashboardItem } from "@/contexts/luminaStore";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

export interface ForecastData {
	projectedLoss: number;
	month: string;
}

const formatLoss = (value: number) => `$${value.toLocaleString()}`;

export const ProjectedDefaultLoss: React.FC<{
	item: DashboardItem<Array<ForecastData>>;
}> = ({ item }) => {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 justify-between flex flex-col">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<ChartContainer config={item.chartConfig}>
				<LineChart
					data={item.data}
					margin={{ top: 20, right: 50, left: 40, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" />

					<XAxis dataKey="month" dy={10} />

					<YAxis
						label={{ text: "Projected Loss", angle: -90, position: "left" }}
						tickFormatter={formatLoss}
						dx={-10}
					/>

					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent hideLabel />}
					/>

					<Line
						stroke="var(--chart-1)"
						dataKey="projectedLoss"
						type="monotone"
						strokeWidth={2}
						dot={{ r: 5 }}
					/>
				</LineChart>
			</ChartContainer>

			<CardFooter className="text-sm text-muted-foreground mt-6">
				Based on current payment trends.
			</CardFooter>
		</Card>
	);
};
