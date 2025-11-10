"use client"; // This directive is necessary for client-side components in Next.js App Router

import {
	CartesianGrid,
	ReferenceLine,
	Scatter,
	ScatterChart,
	XAxis,
	YAxis,
} from "recharts";

// Assuming you have shadcn/ui installed and configured
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { DashboardItem } from "@/contexts/luminaStore";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

// Define the shape of a single data point for income discrepancy
interface IncomeDiscrepancyData {
	id: string; // Unique identifier for the case/individual
	declaredIncome: number; // Income declared by the individual
	extractedIncome: number; // Income extracted from documents/other sources
	discrepancyPercentage: number; // ((extractedIncome - declaredIncome) / declaredIncome) * 100
}

/**
 * Generates fake data for Extracted-vs-Declared Income Discrepancy.
 * Simulates varying declared incomes and calculates discrepancies,
 * with most discrepancies being small, but some larger positive or negative ones.
 * @param numPoints The number of data points (cases) to generate.
 * @returns {IncomeDiscrepancyData[]} An array of income discrepancy data points.
 */
const generateFakeIncomeDiscrepancyData = (
	numPoints: number = 50,
): IncomeDiscrepancyData[] => {
	const data: IncomeDiscrepancyData[] = [];
	for (let i = 0; i < numPoints; i++) {
		const declared = parseFloat((Math.random() * 100000 + 20000).toFixed(0)); // Income between $20,000 and $120,000

		let extracted: number;
		const discrepancyScenario = Math.random();

		if (discrepancyScenario < 0.7) {
			// 70% have small discrepancy (within -2% to +3%)
			extracted = declared * (1 + (Math.random() * 0.05 - 0.02));
		} else if (discrepancyScenario < 0.9) {
			// 20% have moderate positive discrepancy (3% to 10%)
			extracted = declared * (1 + (Math.random() * 0.07 + 0.03));
		} else {
			// 10% have larger discrepancy (can be positive or negative, up to +/-15%)
			extracted = declared * (1 + (Math.random() * 0.3 - 0.15)); // -15% to +15%
		}
		extracted = parseFloat(extracted.toFixed(0));

		const discrepancy = ((extracted - declared) / declared) * 100;

		data.push({
			id: `case-${i + 1}`,
			declaredIncome: declared,
			extractedIncome: extracted,
			discrepancyPercentage: parseFloat(discrepancy.toFixed(2)), // Round to 2 decimal places
		});
	}
	return data;
};

/**
 * A React component that renders an Extracted-vs-Declared Income Discrepancy scatter plot.
 */
export function IncomeDiscrepancyChart({ item }: { item: DashboardItem }) {
	const data = generateFakeIncomeDiscrepancyData();

	// Find max/min discrepancy for dynamic Y-axis domain
	const maxDiscrepancy = Math.max(...data.map((d) => d.discrepancyPercentage));
	const minDiscrepancy = Math.min(...data.map((d) => d.discrepancyPercentage));
	const yAxisDomain = [
		Math.floor(minDiscrepancy / 5) * 5,
		Math.ceil(maxDiscrepancy / 5) * 5,
	]; // Round to nearest 5% interval

	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_1] justify-between">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<ScatterChart
						margin={{
							top: 0,
							right: 0,
							bottom: 0,
							left: -20,
						}}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="var(--muted-foreground)"
							opacity={0.5}
						/>
						<XAxis
							type="number"
							dataKey="declaredIncome"
							name="Declared Income"
							unit="$"
							className="text-sm"
						/>
						<YAxis
							type="number"
							dataKey="discrepancyPercentage"
							name="Discrepancy"
							unit="%"
							domain={yAxisDomain}
							className="text-sm"
						/>
						<ChartTooltip
							cursor={{
								strokeDasharray: "3 3",
								stroke: "var(--muted)",
								opacity: 0.2,
							}}
							content={<ChartTooltipContent />}
						/>
						<Scatter
							name="Discrepancy Data"
							data={data}
							fill="var(--chart-2)"
							opacity={0.7}
						/>

						{/* Reference Line for 0% Discrepancy */}
						<ReferenceLine
							y={0}
							stroke="var(--destructive)"
							strokeDasharray="3 3"
							label={{
								value: "0% Discrepancy",
								position: "bottom",
								fill: "var(--destructive)",
								offset: 10,
								fontSize: 12,
							}}
						/>
						{/* Reference Line for 5% Discrepancy Threshold */}
						<ReferenceLine
							y={5}
							stroke="var(--attention)"
							strokeDasharray="3 3"
							label={{
								value: "5% Threshold",
								position: "top",
								fill: "var(--attention)",
								offset: 10,
								fontSize: 12,
							}}
						/>
					</ScatterChart>
				</ChartContainer>
			</CardContent>

			<div></div>
		</Card>
	);
}

export default IncomeDiscrepancyChart;
