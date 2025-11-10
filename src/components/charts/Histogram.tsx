"use client";

import {
	BarChart,
	Bar as BarRecharts,
	CartesianGrid,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import type { DashboardItem } from "@/contexts/luminaStore";

export const Histogram: React.FC<{ item: DashboardItem }> = ({ item }) => {
	// Check if data has target property (for SLA line)
	const hasSlaTarget =
		item.data && item.data.length > 0 && "target" in item.data[0];
	const targetValue = hasSlaTarget ? item.data[0].target : null;

	// Calculate total invoices
	const totalInvoices = Array.isArray(item.data)
		? item.data.reduce(
				(sum, dataItem) =>
					sum + (typeof dataItem.count === "number" ? dataItem.count : 0),
				0,
			)
		: 0;

	return (
		<Card className="flex flex-col justify-between border border-border-smooth/40 shadow-sm shadow-border-smooth/30">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<style>
				{/* Changing bg color on hover on a chart on lumina docs */}
				{`
.recharts-rectangle.recharts-tooltip-cursor {
	fill: rgb(0 0 0 / 10%);
}`}
			</style>

			<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
				<BarChart
					margin={{ top: 20, right: 20, bottom: 40 }}
					accessibilityLayer
					data={item.data}
				>
					<CartesianGrid vertical={false} />

					<XAxis
						dataKey="days"
						tickLine={false}
						axisLine={false}
						tickMargin={10}
					/>

					<YAxis tickLine={false} axisLine={false} tickMargin={10} />

					<ChartTooltip content={<ChartTooltipContent />} />

					<BarRecharts
						fill={item.chartConfig?.count?.color || "#4D55CC"}
						radius={[4, 4, 0, 0]}
						dataKey="count"
					/>

					{hasSlaTarget && (
						<ReferenceLine
							strokeDasharray="5 5"
							y={targetValue}
							stroke="black"
							label={{
								position: "insideBottomRight",
								value: "Target SLA",
								className: "top-4",
								fill: "black",
								fontSize: 10,
							}}
						/>
					)}
				</BarChart>
			</ChartContainer>

			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					86% of invoices exceed the target SLA
				</div>

				<div className="leading-none text-muted-foreground">
					Based on {totalInvoices} invoices processed
				</div>
			</CardFooter>
		</Card>
	);
};
