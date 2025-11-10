import type { DashboardItem } from "@/contexts/luminaStore";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip } from "../ui/chart";

interface CycleTimeData {
	name: string; // e.g., "Jan", "Feb", "Mar", "Q1 2023"
	cycleTime: number; // Underwriting cycle time in days (or hours, depending on data scale)
}

interface UnderwritingCycleTimeChartProps {
	data: CycleTimeData[];
	title?: string;
}

export function UnderwritingCycleTimeChart({
	item,
}: { item: DashboardItem<UnderwritingCycleTimeChartProps> }) {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_1] justify-between">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<LineChart data={fakeUnderwritingCycleTimeData}>
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
							label={{
								value: "Days", // Or 'Hours', depending on your data
								angle: -90,
								position: "insideLeft",
								style: {
									textAnchor: "middle",
									fill: "var(--foreground)",
									fontSize: "12px",
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
							formatter={(value: number) => [
								`${value.toFixed(1)} days`,
								"Cycle Time",
							]}
						/>
						<Legend
							wrapperStyle={{
								paddingTop: "20px",
								color: "var(--foreground)",
							}}
						/>
						<Line
							type="monotone"
							dataKey="cycleTime"
							stroke="#0ea5e9" // Tailwind sky-500
							strokeWidth={1.5}
							dot={{ strokeWidth: 2, r: 4 }}
							activeDot={{ r: 6, strokeWidth: 2 }}
							name="Cycle Time"
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>

			<div></div>
		</Card>
	);
}

const fakeUnderwritingCycleTimeData: CycleTimeData[] = [
	{ name: "Jan 2024", cycleTime: 7.2 },
	{ name: "Feb 2024", cycleTime: 6.8 },
	{ name: "Mar 2024", cycleTime: 6.5 },
	{ name: "Apr 2024", cycleTime: 6.0 },
	{ name: "May 2024", cycleTime: 5.8 },
	{ name: "Jun 2024", cycleTime: 5.5 },
	{ name: "Jul 2024", cycleTime: 5.3 },
	{ name: "Aug 2024", cycleTime: 5.1 },
	{ name: "Sep 2024", cycleTime: 4.9 },
	{ name: "Oct 2024", cycleTime: 4.8 },
	{ name: "Nov 2024", cycleTime: 4.7 },
	{ name: "Dec 2024", cycleTime: 4.5 },
];
