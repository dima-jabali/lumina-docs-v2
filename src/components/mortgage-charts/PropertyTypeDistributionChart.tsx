// components/average-ltv-by-property-type-chart.tsx
import type { DashboardItem } from "@/contexts/luminaStore";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface LTVData {
	name: string;
	houseAndLot: number;
	condo: number;
	vacantLot: number;
}

export function PropertyTypeDistributionChart({
	item,
}: {
	item: DashboardItem;
}) {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_1] justify-between">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<BarChart
						data={fakeLTVData}
						margin={{
							top: 0,
							right: 0,
							left: -20,
							bottom: 0,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
						<XAxis
							dataKey="name"
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
						/>
						<YAxis
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
						/>
						<ChartTooltip
							contentStyle={{
								backgroundColor: "var(--popover)",
								borderColor: "var(--border)",
								borderRadius: "0.5rem",
							}}
							labelStyle={{
								color: "var(--foreground)",
							}}
							itemStyle={{
								color: "var(--foreground)",
							}}
							cursor={{
								fill: "var(--muted)",
								opacity: 0.2,
							}}
							content={<ChartTooltipContent />}
						/>
						<Legend
							wrapperStyle={{
								paddingTop: "20px",
								color: "var(--foreground)",
							}}
							iconType="circle"
						/>
						<Bar
							dataKey="houseAndLot"
							fill="var(--chart-2)"
							radius={[4, 4, 0, 0]}
							name="House & Lot"
						/>
						<Bar
							dataKey="condo"
							fill="var(--chart-3)"
							radius={[4, 4, 0, 0]}
							name="Condo"
						/>
						<Bar
							dataKey="vacantLot"
							fill="var(--chart-5)"
							radius={[4, 4, 0, 0]}
							name="Vacant Lot"
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>

			<div></div>
		</Card>
	);
}

const fakeLTVData: LTVData[] = [
	{ name: "2022", houseAndLot: 0.75, condo: 0.8, vacantLot: 0.65 },
	{ name: "2023", houseAndLot: 0.78, condo: 0.82, vacantLot: 0.68 },
	{ name: "2024", houseAndLot: 0.76, condo: 0.81, vacantLot: 0.67 },
];
