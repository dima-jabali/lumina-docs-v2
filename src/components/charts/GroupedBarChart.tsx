"use client";

import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis } from "recharts";

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import type { DashboardItem } from "@/contexts/luminaStore";

export const GroupedBarChart: React.FC<{ item: DashboardItem }> = ({
	item,
}) => {
	const [bars] = useState(
		Object.entries(item.chartConfig).map(([dataKey, value], index) => (
			<Bar key={index} dataKey={dataKey} fill={value.color} radius={4} />
		)),
	);

	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 justify-between flex flex-col">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<ChartContainer
				className="min-h-24 min-w-24 h-full"
				config={item.chartConfig}
			>
				<BarChart
					margin={{ top: 20, right: 40, bottom: 40, left: 30 }}
					accessibilityLayer
					data={item.data}
				>
					<CartesianGrid vertical={false} />

					<XAxis
						tickFormatter={(value) => value.slice(0, 3)}
						tickLine={false}
						axisLine={false}
						dataKey="month"
						tickMargin={10}
					/>

					<ChartTooltip
						content={<ChartTooltipContent indicator="dashed" />}
						cursor={false}
					/>

					{bars}

					<Legend
						wrapperStyle={{
							paddingTop: "20px",
							color: "var(--foreground)",
						}}
						iconType="circle"
					/>
				</BarChart>
			</ChartContainer>

			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
				</div>

				<div className="leading-none text-muted-foreground">
					Showing for the last {bars.length} months
				</div>
			</CardFooter>
		</Card>
	);
};
