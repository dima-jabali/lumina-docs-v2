import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { DashboardItem } from "@/contexts/luminaStore";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { formatCurrency } from "./utils";

export const Stacked: React.FC<{ item: DashboardItem }> = ({ item }) => {
	return (
		<Card className="flex flex-col border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_2]">
			<CardHeader className="">
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

				<ChartContainer config={item.chartConfig} className="min-h-[400px]">
					<BarChart
						margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
						accessibilityLayer
						data={item.data}
					>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />

						<XAxis
							dataKey="costCenter"
							textAnchor="end"
							tickLine={false}
							axisLine={false}
							angle={-45}
							height={70}
						/>

						<YAxis
							tickFormatter={(value) => formatCurrency.format(value)}
							tickLine={false}
							axisLine={false}
						/>

						<ChartTooltip
							content={
								<ChartTooltipContent indicator="dashed" cursor={false} />
							}
						/>

						<Bar dataKey="labor" stackId="a" fill="var(--color-labor)" />

						<Bar
							dataKey="equipment"
							stackId="a"
							fill="var(--color-equipment)"
						/>

						<Bar
							dataKey="services"
							stackId="a"
							fill="var(--color-services)"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
