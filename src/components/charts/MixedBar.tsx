"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
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

export const MixedBar: React.FC<{ item: DashboardItem }> = ({ item }) => {
	return (
		<Card className="flex flex-col border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_2]">
			<CardHeader className="">
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer config={item.chartConfig}>
					<BarChart
						margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
						accessibilityLayer
						data={item.data}
					>
						<CartesianGrid vertical={false} />

						<XAxis
							dataKey="costCenter"
							textAnchor="end"
							tickLine={false}
							axisLine={false}
							angle={-45}
							height={70}
						/>

						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>

						<Bar dataKey="amount" fill="var(--color-amount)" radius={8}>
							<LabelList
								position="top"
								offset={12}
								className="fill-foreground"
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>

			<CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
				<div className="leading-none text-muted-foreground">
					Showing for the last 4 months
				</div>
			</CardFooter>
		</Card>
	);
};
