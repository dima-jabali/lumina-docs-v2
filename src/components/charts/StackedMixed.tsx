"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { DashboardItem } from "@/contexts/luminaStore";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { formatCurrency } from "./utils";

export const StackedMixed: React.FC<
	{ item: DashboardItem } & ComponentProps<"div">
> = ({ item, className, ...props }) => {
	return (
		<Card
			className={cn(
				"flex flex-col border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_2]",
				className,
			)}
			{...props}
		>
			<CardHeader className="">
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer config={item.chartConfig} className="min-h-[350px]">
					<AreaChart
						margin={{ bottom: 20, right: 30, left: 30, top: 10 }}
						accessibilityLayer
						data={item.data}
					>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />

						<XAxis
							dataKey="bucket"
							tickLine={false}
							axisLine={false}
							tickMargin={10}
						/>

						<YAxis
							tickFormatter={(value) => formatCurrency.format(value)}
							tickLine={false}
							axisLine={false}
							tickMargin={10}
						/>

						<ChartTooltip content={<ChartTooltipContent />} />

						<Area
							stroke="var(--color-support)"
							fill="var(--color-support)"
							fillOpacity={0.6}
							dataKey="support"
							type="monotone"
							stackId="1"
						/>

						<Area
							stroke="var(--color-engineering)"
							fill="var(--color-engineering)"
							dataKey="engineering"
							fillOpacity={0.6}
							type="monotone"
							stackId="1"
						/>

						<Area
							stroke="var(--color-marketing)"
							fill="var(--color-marketing)"
							dataKey="marketing"
							fillOpacity={0.6}
							type="monotone"
							stackId="1"
						/>

						<Area
							stroke="var(--color-sales)"
							fill="var(--color-sales)"
							fillOpacity={0.6}
							type="monotone"
							dataKey="sales"
							stackId="1"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
