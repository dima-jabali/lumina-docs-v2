"use client"; // This directive is necessary for client-side components in Next.js App Router

import { Bar, BarChart, ReferenceLine, XAxis, YAxis } from "recharts";

// Assuming you have shadcn/ui installed and configured,
// these imports would typically come from your components/ui directory.
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { DashboardItem } from "@/contexts/luminaStore";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

// Define the shape of our data for the chart
interface LTVBinData {
	range: string; // e.g., "0-10%", "10-20%"
	count: number; // Number of loans in this LTV range
}

/**
 * Generates fake LTV (Loan-to-Value) distribution data.
 * LTV data often shows clusters below common thresholds (e.g., 80% for no PMI, 90% for certain loan types).
 * @returns {LTVBinData[]} An array of LTV bin data.
 */
const generateFakeLTVData = (): LTVBinData[] => {
	const data: LTVBinData[] = [
		{
			range: "0-10%",
			count: 5,
		},
		{
			range: "10-20%",
			count: 10,
		},
		{
			range: "20-30%",
			count: 15,
		},
		{
			range: "30-40%",
			count: 25,
		},
		{
			range: "40-50%",
			count: 35,
		},
		{
			range: "50-60%",
			count: 45,
		},
		{
			range: "60-70%",
			count: 55,
		},
		{
			range: "70-80%",
			count: 70,
		}, // High concentration as many loans aim for <= 80% LTV
		{
			range: "80-90%",
			count: 50,
		}, // Still a significant portion, especially with PMI
		{
			range: "90-100%",
			count: 20,
		}, // Higher LTV loans, often with specific programs
		{
			range: "100%+",
			count: 5,
		}, // Very high LTV, less common
	];
	return data;
};

/**
 * A React component that renders an LTV distribution histogram with guideline bands.
 */
export function LoanToValueDistributionChart({
	item,
}: { item: DashboardItem }) {
	const data = generateFakeLTVData();

	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_1] justify-between">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<BarChart
						data={data}
						margin={{
							top: 5,
							right: 0,
							left: -20,
							bottom: 0,
						}}
					>
						<XAxis dataKey="range" className="text-sm" dy={10} />
						<YAxis
							tickFormatter={(value) => `${value}`}
							className="text-sm"
							dx={-5}
						/>
						<ChartTooltip
							cursor={{
								fill: "var(--muted)",
								opacity: 0.2,
							}}
							contentStyle={{
								backgroundColor: "var(--card)",
								borderColor: "var(--border)",
							}}
							labelStyle={{
								color: "var(--foreground)",
							}}
							itemStyle={{
								color: "var(--foreground)",
							}}
							content={<ChartTooltipContent />}
						/>
						<Bar
							dataKey="count"
							fill="var(--chart-5)"
							radius={[4, 4, 0, 0]} // Rounded corners at the top of bars
						/>
						{/* Reference Line for 80% LTV Guideline */}
						<ReferenceLine
							x="80-90%" // Places the line at the start of the "80-90%" bar
							stroke="var(--destructive)"
							strokeDasharray="3 3"
							label={{
								value: "80% Guideline",
								position: "insideTopLeft",
								fill: "var(--destructive)",
								offset: 0,
							}}
						/>
						{/* Reference Line for 90% LTV Guideline */}
						<ReferenceLine
							x="90-100%" // Places the line at the start of the "90-100%" bar
							stroke="var(--attention)"
							strokeDasharray="3 3"
							label={{
								value: "90% Guideline",
								position: "insideTopRight",
								fill: "var(--attention)",
								offset: 20,
							}}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>

			<div></div>
		</Card>
	);
}
