"use client";

import { TrendingUp } from "lucide-react";
import { Legend, PieChart, Pie as PieRecharts } from "recharts";

import type { DashboardItem } from "@/contexts/luminaStore";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

export const Pie: React.FC<{ item: DashboardItem }> = ({ item }) => {
	return (
		<Card className="flex flex-col justify-between border border-border-smooth/40 shadow-sm shadow-border-smooth/30">
			<CardHeader className="pb-0">
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<ChartContainer
				className="mx-auto aspect-square min-h-48 min-w-48 w-2/3 h-2/3 [&_.recharts-text]:fill-background"
				config={item.chartConfig}
			>
				<PieChart>
					<ChartTooltip
						content={<ChartTooltipContent nameKey="count" hideLabel />}
					/>

					<PieRecharts nameKey="stage" data={item.data} dataKey="count">
						{/* <LabelList
							formatter={(value: keyof typeof item.chartConfig) => value}
							className="fill-black"
							dataKey="stage"
							stroke="none"
							fontSize={12}
							position="inside"
						/> */}
					</PieRecharts>

					<Legend
						verticalAlign="bottom" // Align legend in the middle vertically
						wrapperStyle={{
							paddingLeft: "20px", // Add some padding
						}}
					/>
				</PieChart>
			</ChartContainer>

			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					Trending up by 2.1% this month <TrendingUp className="h-4 w-4" />
				</div>

				<div className="leading-none text-muted-foreground">
					Showing for the last 4 months
				</div>
			</CardFooter>
		</Card>
	);
};
