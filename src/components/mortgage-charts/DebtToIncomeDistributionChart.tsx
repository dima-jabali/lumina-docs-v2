"use client";

import { Bar, BarChart, ReferenceLine, XAxis, YAxis } from "recharts";

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
interface DTIBinData {
	range: string; // e.g., "0-10%", "10-20%"
	count: number; // Number of individuals in this DTI range
}

/**
 * Generates fake DTI distribution data.
 * The data is designed to show higher counts around common DTI values
 * and tapering off at the extremes.
 * @returns {DTIBinData[]} An array of DTI bin data.
 */
const generateFakeDTIData = (): DTIBinData[] => {
	const data: DTIBinData[] = [
		{
			range: "0-10%",
			count: 15,
		},
		{
			range: "10-20%",
			count: 30,
		},
		{
			range: "20-30%",
			count: 60,
		}, // Many fall below 30%
		{
			range: "30-40%",
			count: 85,
		}, // Many fall between 30-40% (often a guideline)
		{
			range: "40-50%",
			count: 45,
		}, // Some fall above 40% (another guideline)
		{
			range: "50-60%",
			count: 20,
		},
		{
			range: "60-70%",
			count: 10,
		},
		{
			range: "70%+",
			count: 5,
		},
	];
	return data;
};

/**
 * A React component that renders a DTI distribution histogram with guideline bands.
 */
export function DebtToIncomeDistributionChart({
	item,
}: { item: DashboardItem }) {
	const data = generateFakeDTIData();

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
							top: 0,
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
							fill="var(--chart-4)"
							radius={[4, 4, 0, 0]} // Rounded corners at the top
							// Custom label for the bar if needed, otherwise default tooltip works
						/>

						{/* Reference Line for 30% DTI Guideline */}
						<ReferenceLine
							x="30-40%" // Places the line at the start of the "30-40%" bar
							stroke="var(--destructive)"
							strokeDasharray="3 3"
							label={{
								value: "30% Guideline",
								position: "insideTopLeft",
								fill: "var(--destructive)",
								// offset: 10
							}}
						/>

						{/* Reference Line for 40% DTI Guideline */}
						<ReferenceLine
							x="40-50%" // Places the line at the start of the "40-50%" bar
							stroke="var(--attention)"
							strokeDasharray="3 3"
							label={{
								value: "40% Guideline",
								position: "insideTopLeft",
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
