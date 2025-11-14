import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { DashboardItem } from "@/contexts/luminaStore";

interface CycleTimeDistributionData {
	week: string; // e.g., "Week 1", "Week 2"
	median: number; // Median cycle time in hours
	p75: number; // 75th percentile cycle time in hours
	max: number; // Maximum cycle time in hours
}

export function CommissionPayoutCycleTimeChart({
	item,
}: {
	item: DashboardItem<Array<CycleTimeDistributionData>>;
}) {
	return (
		<Card className="flex flex-col justify-between border border-border-smooth/40 shadow-sm shadow-border-smooth/30">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer
					className="min-h-[200px] w-full"
					config={item.chartConfig}
				>
					<LineChart data={fakeCommissionCycleTimeData}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

						<XAxis
							dataKey="week"
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
							dy={10}
						/>

						<YAxis
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
							dx={-10}
							label={{
								value: "Cycle Time (Hours)",
								angle: -90,
								position: "insideLeft",
								style: {
									textAnchor: "middle",
									fill: "var(--foreground)",
									fontSize: 12,
								},
							}}
						/>

						<ChartTooltip
							contentStyle={{
								backgroundColor: "#f9fafb",
								borderColor: "#e5e7eb",
								borderRadius: "0.5rem",
							}}
							labelStyle={{
								color: "#374151",
							}}
							itemStyle={{
								color: "#374151",
							}}
							content={<ChartTooltipContent />}
						/>

						<Legend
							wrapperStyle={{
								paddingTop: "20px",
								color: "var(--foreground)",
							}}
						/>

						<Line
							type="monotone"
							dataKey="median"
							stroke="#22c55e"
							strokeWidth={2}
							dot={{ strokeWidth: 2, r: 4 }}
							activeDot={{ r: 6, strokeWidth: 2 }}
							name="Median Cycle Time"
						/>

						<Line
							type="monotone"
							dataKey="p75"
							stroke="var(--chart-6)"
							strokeWidth={2}
							dot={{ strokeWidth: 2, r: 4 }}
							activeDot={{ r: 6, strokeWidth: 2 }}
							name="75th Percentile"
						/>

						<Line
							type="monotone"
							dataKey="max"
							stroke="var(--chart-1)"
							strokeWidth={2}
							dot={{ strokeWidth: 2, r: 4 }}
							activeDot={{ r: 6, strokeWidth: 2 }}
							name="Max Cycle Time"
						/>
					</LineChart>
				</ChartContainer>

				<div className="flex-col items-start gap-2 text-sm mt-4">
					<div className="leading-none text-muted-foreground">
						Helps Ops & Finance identify process bottlenecks and improvements by
						tracking distribution.
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

const fakeCommissionCycleTimeData: CycleTimeDistributionData[] = [
	{ week: "Week 1", median: 48, p75: 60, max: 75 },
	{ week: "Week 2", median: 45, p75: 58, max: 70 },
	{ week: "Week 3", median: 42, p75: 55, max: 68 },
	{ week: "Week 4", median: 40, p75: 52, max: 65 },
	{ week: "Week 5", median: 38, p75: 50, max: 62 },
	{ week: "Week 6", median: 36, p75: 48, max: 60 },
	{ week: "Week 7", median: 35, p75: 47, max: 58 },
	{ week: "Week 8", median: 33, p75: 45, max: 55 },
	{ week: "Week 9", median: 32, p75: 43, max: 52 },
	{ week: "Week 10", median: 30, p75: 40, max: 50 },
	{ week: "Week 11", median: 29, p75: 39, max: 48 },
	{ week: "Week 12", median: 28, p75: 38, max: 46 },
];
