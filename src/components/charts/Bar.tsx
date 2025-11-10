"use client";

import {
	BarChart,
	Bar as BarRecharts,
	CartesianGrid,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import type { DashboardItem } from "@/contexts/luminaStore";

// Target SLA in days
const targetSLA = 7;

export const Bar: React.FC<{ item: DashboardItem }> = ({ item }) => {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_2]">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<style>
					{/* Changing bg color on hover on a chart on lumina docs */}
					{`
.recharts-rectangle.recharts-tooltip-cursor {
	fill: rgb(0 0 0 / 10%);
}`}
				</style>

				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<BarChart
						margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
						accessibilityLayer
						data={item.data}
					>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />

						<XAxis
							dataKey="days"
							label={{
								value: "Days from Receipt to Payment",
								position: "insideBottom",
								offset: -10,
							}}
						/>

						<YAxis
							label={{
								value: "Number of Invoices",
								position: "insideLeft",
								angle: -90,
							}}
						/>

						<ChartTooltip
							content={
								<ChartTooltipContent
									formatter={(value) => [`${value} invoices`]}
								/>
							}
						/>

						<BarRecharts
							dataKey="count"
							fill="var(--color-count)"
							radius={[4, 4, 0, 0]}
						/>

						<ReferenceLine
							x={targetSLA.toString()}
							strokeDasharray="3 3"
							strokeWidth={2}
							stroke="red"
							label={{
								value: "Target SLA",
								position: "top",
								fill: "red",
							}}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>

			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="leading-none text-muted-foreground">
					Showing number of invoices received
				</div>
			</CardFooter>
		</Card>
	);
};
