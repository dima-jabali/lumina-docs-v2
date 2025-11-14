import {
	CartesianGrid,
	Legend, // Changed from AreaChart
	Line,
	LineChart, // Changed from Area
	XAxis,
	YAxis,
} from "recharts";

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

interface ExceptionRateData {
	month: string; // e.g., "Jan 2024", "Feb 2024"
	exceptionRate: number; // Percentage as a decimal (e.g., 0.15 for 15%)
}

export function ExceptionRateOverTimeChart({
	item,
}: {
	item: DashboardItem<Array<ExceptionRateData>>;
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
					<LineChart // Changed from AreaChart
						data={fakeExceptionRateData}
						margin={{
							top: 0,
							right: 0,
							left: 0,
							bottom: 0,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

						<XAxis
							dataKey="month"
							stroke="hsl(var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
						/>

						<YAxis
							stroke="hsl(var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
							tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
							label={{
								value: "Exception Rate",
								angle: -90,
								position: "insideLeft",
								style: { textAnchor: "middle", fill: "hsl(var(--foreground)" },
							}}
							domain={[0, 0.3]} // Set a reasonable domain for percentages (0-30%)
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
							// formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'Exception Rate']}
							content={<ChartTooltipContent />}
						/>

						<Legend
							wrapperStyle={{
								paddingTop: "20px",
								color: "hsl(var(--foreground)",
							}}
							iconType="circle"
						/>

						<Line // Changed from Area
							type="monotone"
							dataKey="exceptionRate"
							stroke="var(--chart-4)"
							strokeWidth={2}
							dot={{ strokeWidth: 2, r: 4 }} // Added dots for individual data points
							activeDot={{ r: 6, strokeWidth: 2 }} // Added active dots on hover
							name="Exception Rate"
						/>
					</LineChart>
				</ChartContainer>

				<div className="flex-col items-start gap-2 text-sm mt-4">
					<div className="leading-none text-muted-foreground">
						Proves accuracy gains as model learns.
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

const fakeExceptionRateData: ExceptionRateData[] = [
	{ month: "Jan 2024", exceptionRate: 0.28 }, // 28%
	{ month: "Feb 2024", exceptionRate: 0.25 }, // 25%
	{ month: "Mar 2024", exceptionRate: 0.22 }, // 22%
	{ month: "Apr 2024", exceptionRate: 0.2 }, // 20%
	{ month: "May 2024", exceptionRate: 0.18 }, // 18%
	{ month: "Jun 2024", exceptionRate: 0.15 }, // 15%
	{ month: "Jul 2024", exceptionRate: 0.13 }, // 13%
	{ month: "Aug 2024", exceptionRate: 0.11 }, // 11%
	{ month: "Sep 2024", exceptionRate: 0.09 }, // 9%
	{ month: "Oct 2024", exceptionRate: 0.08 }, // 8%
	{ month: "Nov 2024", exceptionRate: 0.07 }, // 7%
	{ month: "Dec 2024", exceptionRate: 0.06 }, // 6%
];
