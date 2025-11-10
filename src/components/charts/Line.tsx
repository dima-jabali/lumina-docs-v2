"use client";

import { TrendingUp } from "lucide-react";
import {
	CartesianGrid,
	LineChart,
	Line as LineRecharts,
	XAxis,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import type { DashboardItem } from "@/contexts/luminaStore";

export const Line: React.FC<{ item: DashboardItem }> = ({ item }) => {
	return (
		<Card className="flex flex-col border border-border-smooth/40 shadow-sm shadow-border-smooth/30 justify-between">
			<CardHeader className="">
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer config={item.chartConfig}>
					<LineChart
						accessibilityLayer
						data={item.data}
						margin={{ left: 12, right: 12 }}
					>
						<CartesianGrid vertical={false} />

						<XAxis
							tickLine={false}
							axisLine={false}
							dataKey="month"
							tickMargin={8}
						/>

						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />

						<LineRecharts
							dot={{ fill: "#211C84" }}
							activeDot={{ r: 6 }}
							stroke="#B5A8D5"
							dataKey="amount"
							strokeWidth={2}
							type="natural"
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>

			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					Trending up by 3.3% this month <TrendingUp className="h-4 w-4" />
				</div>

				<div className="leading-none text-muted-foreground">
					Showing for the last 4 months
				</div>
			</CardFooter>
		</Card>
	);
};
