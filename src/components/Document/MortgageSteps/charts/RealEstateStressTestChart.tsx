import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	ReferenceLine,
} from "recharts";

// --- Fake Data ---
const fakeStressTestData = {
	currentCAR: 15.2, // Bank's actual Current Capital Adequacy Ratio
	postStressCAR: 12.0, // CAR after simulated 25% real estate write-off
	minRegulatoryCAR: 10.0, // BSP's minimum regulatory CAR (e.g., 10%)
	targetCAR: 15.0, // An aspirational internal target (e.g., higher than min)
	maxChartValue: 20.0, // Max value for the X-axis, should be greater than any CAR
};

// --- Chart Colors ---
const chartColors = {
	// Replace these HSL values with your actual Shadcn CSS variables if desired
	primaryBar: "var(--chart-2)", // E.g., a primary brand color
	postStressBar: "var(--chart-4)", // E.g., a secondary color for post-stress
	minRegulatoryLine: "var(--destructive)", // Red for critical minimum
	targetLine: "var(--attention)", // Orange/yellow for warning/target
	gridLine: "#a8a8a8", // Lighter grid lines
	axisText: "var(--muted-foreground)", // Axis label color
};

// --- Component ---
export function RealEstateStressTestChart() {
	const {
		currentCAR,
		postStressCAR,
		minRegulatoryCAR,
		targetCAR,
		maxChartValue,
	} = fakeStressTestData;

	// --- Status Logic for CardDescription ---
	let statusText = "Adequate Capital";
	let statusColorClass = "text-green-600"; // Default to green

	if (postStressCAR < minRegulatoryCAR) {
		statusText = "Below Minimum Regulatory CAR! (Critical)";
		statusColorClass = "text-red-600";
	} else if (postStressCAR < targetCAR) {
		statusText = "Approaching Internal Target (Monitor Closely)";
		statusColorClass = "text-attention";
	}
	// Otherwise, it remains "Adequate Capital" (green)

	// Data for the BarChart: Each object represents a bar.
	// We explicitly define their values and colors.
	const chartData = [
		{
			name: "Current CAR",
			value: currentCAR,
			color: chartColors.primaryBar, // Directly assign color
		},
		{
			name: "Post-Stress CAR",
			value: postStressCAR,
			color: chartColors.postStressBar, // Directly assign color
		},
	];

	// Config for Shadcn ChartContainer - defines labels and colors for tooltips
	const chartConfig = {
		"Current CAR": { label: "Current CAR", color: chartColors.primaryBar },
		"Post-Stress CAR": {
			label: "Post-Stress CAR",
			color: chartColors.postStressBar,
		},
	};

	return (
		<Card className="border-none p-0 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="text-muted">
					Real Estate Stress Test (REST) Status
				</CardTitle>

				<CardDescription className={`font-semibold ${statusColorClass}`}>
					Status: {statusText}
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col items-center justify-center p-0">
				<ChartContainer config={chartConfig} className="w-full">
					<BarChart
						margin={{ top: 50, right: 0, left: 0, bottom: 20 }}
						accessibilityLayer
						layout="vertical" // Horizontal bars
						data={chartData}
					>
						<CartesianGrid
							horizontal={false}
							stroke={chartColors.gridLine}
							strokeDasharray="3 3"
						/>

						{/* YAxis for the labels of Current CAR and Post-Stress CAR */}
						<YAxis
							dataKey="name"
							type="category"
							axisLine={false}
							tickLine={false}
							tick={{ fill: chartColors.axisText }}
							width={129} // Sufficient width for labels
						/>

						{/* XAxis for the percentage values */}
						<XAxis
							type="number"
							domain={[0, maxChartValue]} // Set the domain of the X-axis
							tickFormatter={(value) => `${value}%`}
							axisLine={false}
							tickLine={false}
							tick={{ fill: chartColors.axisText }}
							label={{
								value: "Capital Adequacy Ratio (%)",
								position: "insideBottom",
								offset: -10,
								fill: chartColors.axisText,
								fontSize: 12,
							}}
						/>

						{/* Tooltip for hover details */}
						<ChartTooltip
							cursor={false} // No intrusive cursor line/box
							content={<ChartTooltipContent indicator="dot" />}
						/>

						{/* Bar for each CAR value */}
						<Bar
							dataKey="value" // The value to plot from chartData
							fill={chartColors.primaryBar} // Use the color directly from chartData
							barSize={40} // Thicker bars for prominence
							radius={[0, 4, 4, 0]} // Rounded ends on the right for a modern look
							isAnimationActive={true}
							animationDuration={800}
							animationEasing="ease-out"
							label={{
								position: "right", // Label at the end of the bar
								// formatter: (val) => `${val.toFixed(1)}%`, // Format to one decimal place
								fontSize: 14, // Larger font for bar labels
								fontWeight: "bold", // Bold text for emphasis
								fill: "hsl(var(--foreground))",
								offset: 10, // Offset from the bar
							}}
						/>

						{/* Reference Line for Minimum Regulatory CAR (Red and prominent) */}
						<ReferenceLine
							x={minRegulatoryCAR}
							stroke={chartColors.minRegulatoryLine}
							strokeWidth={1} // Make it thicker
							strokeDasharray="6 6" // More spaced dashed line
							label={{
								value: `Min Reg: ${minRegulatoryCAR}%`,
								position: "top", // Position the label clearly above the line
								fill: chartColors.minRegulatoryLine,
								fontSize: 13,
								offset: 5,
							}}
						/>

						{/* Optional: Reference Line for Internal Target CAR (Yellow/Orange) */}
						{targetCAR > minRegulatoryCAR && ( // Only show if target is higher than min
							<ReferenceLine
								x={targetCAR}
								stroke={chartColors.targetLine}
								strokeWidth={1} // Slightly thinner than min reg line
								strokeDasharray="4 4"
								label={{
									value: `Target: ${targetCAR}%`,
									position: "top",
									fill: chartColors.targetLine,
									fontSize: 12,
									offset: 20, // Offset from min reg line to avoid overlap
								}}
							/>
						)}
					</BarChart>
				</ChartContainer>

				{/* Textual summary below the chart for redundancy and detail */}
				<CardFooter className="mt-6 flex-col text-left items-start p-0 w-full text-sm text-muted-foreground">
					<p>
						Bank&apos;s Current CAR:{" "}
						<span className="font-bold">{currentCAR}%</span>
					</p>
					<p>
						Post-Stress CAR: <span className="font-bold">{postStressCAR}%</span>
					</p>
					<p>
						Minimum Regulatory CAR:{" "}
						<span className="font-bold">{minRegulatoryCAR}%</span>
					</p>
					{targetCAR > minRegulatoryCAR && (
						<p>
							Internal Target CAR:{" "}
							<span className="font-bold">{targetCAR}%</span>
						</p>
					)}
					<p className="mt-4 text-xs">
						*Simulated 25% Real Estate Write-off Scenario. CAR values are
						indicative.
					</p>
				</CardFooter>
			</CardContent>
		</Card>
	);
}
