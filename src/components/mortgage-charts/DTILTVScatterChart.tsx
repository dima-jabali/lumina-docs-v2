"use client"; // This directive is necessary for client-side components in Next.js App Router

import {
	CartesianGrid,
	ReferenceLine,
	Scatter,
	ScatterChart,
	XAxis,
	YAxis,
} from "recharts";

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

// Define the shape of a single loan data point
interface LoanData {
	id: string; // Unique identifier for the loan/applicant
	dti: number; // Debt-to-Income percentage
	ltv: number; // Loan-to-Value percentage
}

/**
 * Generates fake loan data for a DTI vs LTV scatter plot.
 * The data is designed to simulate plausible distributions with some clustering
 * around common DTI and LTV ranges, reflecting typical lending patterns.
 * @param numPoints The number of data points (loans) to generate.
 * @returns {LoanData[]} An array of loan data points.
 */
const generateFakeLoanData = (numPoints: number = 50): LoanData[] => {
	const data: LoanData[] = [];
	for (let i = 0; i < numPoints; i++) {
		let dti: number;
		let ltv: number;

		// Simulate DTI distribution: mostly between 20-50%, with some outliers
		const dtiRandom = Math.random();
		if (dtiRandom < 0.6) {
			// 60% of data points in a 'good' DTI range
			dti = Math.random() * 20 + 20; // 20% to 40%
		} else if (dtiRandom < 0.9) {
			// 30% in a 'moderate' DTI range
			dti = Math.random() * 15 + 35; // 35% to 50%
		} else {
			// 10% in a 'higher' DTI range
			dti = Math.random() * 20 + 50; // 50% to 70%
		}

		// Simulate LTV distribution: mostly between 60-90%, with some outliers
		const ltvRandom = Math.random();
		if (ltvRandom < 0.7) {
			// 70% of data points in a 'good' LTV range
			ltv = Math.random() * 20 + 60; // 60% to 80%
		} else if (ltvRandom < 0.9) {
			// 20% in a 'moderate' LTV range
			ltv = Math.random() * 15 + 75; // 75% to 90%
		} else {
			// 10% in a 'higher' LTV range
			ltv = Math.random() * 10 + 90; // 90% to 100%
		}

		data.push({
			id: `loan-${i + 1}`,
			dti: parseFloat(dti.toFixed(1)), // Round to 1 decimal place for cleaner data
			ltv: parseFloat(ltv.toFixed(1)), // Round to 1 decimal place
		});
	}
	return data;
};

export function DTILTVScatterChart({ item }: { item: DashboardItem }) {
	const data = generateFakeLoanData();

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
							top: 20,
							right: 0,
							bottom: 0,
							left: -10,
						}}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="var(--muted-foreground)"
							opacity={0.5}
						/>
						<XAxis
							type="number"
							dataKey="dti"
							name="DTI"
							unit="%"
							domain={[0, 100]} // DTI typically ranges from 0 to 100
							className="text-sm"
						/>
						<YAxis
							type="number"
							dataKey="ltv"
							name="LTV"
							unit="%"
							domain={[0, 100]} // LTV typically ranges from 0 to 100
							className="text-sm"
						/>
						<ChartTooltip
							cursor={{
								strokeDasharray: "3 3",
								stroke: "var(--foreground)",
								opacity: 0.2,
							}}
							content={<ChartTooltipContent />}
						/>
						<Scatter
							name="Loan Data"
							data={data}
							fill="var(--chart-2)"
							opacity={0.7}
						/>

						{/* DTI Guideline Lines (Vertical) */}
						<ReferenceLine
							x={30}
							stroke="var(--destructive)"
							strokeDasharray="3 3"
							label={{
								value: "DTI 30%",
								position: "top", // Position label above the line
								fill: "var(--destructive)",
								offset: 3,
								fontSize: 12,
							}}
						/>
						<ReferenceLine
							x={40}
							stroke="var(--attention)"
							strokeDasharray="3 3"
							label={{
								value: "DTI 40%",
								position: "right",
								fill: "var(--attention)",
								offset: 5,
								fontSize: 12,
							}}
						/>

						{/* LTV Guideline Lines (Horizontal) */}
						<ReferenceLine
							y={80}
							stroke="var(--destructive)"
							strokeDasharray="3 3"
							label={{
								value: "LTV 80%",
								position: "insideTopRight", // Position label to the right of the line
								fill: "var(--destructive)",
								fontSize: 12,
							}}
						/>
						<ReferenceLine
							y={90}
							stroke="var(--attention)"
							strokeDasharray="3 3"
							label={{
								value: "LTV 90%",
								position: "insideBottomRight",
								fill: "var(--attention)",
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
