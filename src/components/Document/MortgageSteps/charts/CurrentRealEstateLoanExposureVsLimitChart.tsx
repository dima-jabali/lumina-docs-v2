import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	ReferenceLine,
	Scatter, // For markers
	ComposedChart, // Potentially useful if mixing Bar and Scatter
} from "recharts";

// Define your fake data
const fakeBulletChartData = [
	{
		name: "Real Estate Exposure",
		current: 22.5, // Bank's current REL percentage
		previous: 20.0, // Previous quarter's REL percentage
		industryAvg: 23.5, // Industry average REL percentage
		bspLimit: 25, // BSP Prudential Limit
		maxRange: 30, // Max value for the X-axis / chart range
	},
];

// Define thresholds for visual zones (e.g., green, orange, red)
const thresholds = {
	good: 22, // Up to this is 'good' (e.g., green)
	warning: 24, // Above 'good' and up to this is 'warning' (e.g., orange)
	critical: 25, // Above 'warning' and up to this is 'critical' (e.g., red)
};

// Define chart colors (use your actual Shadcn CSS variables)
const chartColors = {
	// Use HSL values that match your Shadcn theme for --chart-1, etc.
	// For demo, I'll use direct HSL for clarity. Replace with var() if needed.
	// Example Shadcn default colors:
	// --chart-1: 222.2 47.4% 11.2%; (dark blue/purple)
	// --chart-2: 217.2 91.2% 59.8%; (light blue)
	// --chart-3: 177 90% 40%; (teal)
	// --chart-4: 20 90% 50%; (orange)

	baseRange: "var(--muted)", // Light grey for the full range background
	goodZone: "hsl(142.1 76.2% 36.3%)", // Green
	warningZone: "hsl(38 92% 50%)", // Orange
	criticalZone: "hsl(0 84.2% 60.2%)", // Red
	currentExposureBar: "var(--primary)", // Your primary brand color
	bspLimitLine: "var(--destructive)", // Red for emphasis
	markerPrevious: "var(--secondary)", // Grey for previous
	markerIndustry: "var(--accent)", // Yellow/Gold for industry average
};

const chartConfig = {
	currentValue: {
		label: "Current Exposure",
		color: chartColors.currentExposureBar,
	},
	good: { label: "Good Zone", color: chartColors.goodZone },
	warning: { label: "Warning Zone", color: chartColors.warningZone },
	critical: { label: "Critical Zone", color: chartColors.criticalZone },
	overCritical: { label: "Over Limit", color: chartColors.criticalZone }, // Re-using critical color
	// Add configs for your scatter markers if you want their labels in the main tooltip
	// You might also define these directly in the Scatter's tooltip content.
	// previous: { label: "Previous Quarter", color: chartColors.markerPrevious },
	// industryAvg: { label: "Industry Average", color: chartColors.markerIndustry },
};

export function CurrentRealEstateLoanExposureVsLimitChart() {
	const data = fakeBulletChartData[0]; // We only have one data point for the bullet chart

	if (
		!data ||
		typeof data.current !== "number" ||
		typeof data.bspLimit !== "number" ||
		typeof data.maxRange !== "number"
	) {
		console.error("Invalid or missing data for RealEstateBulletChart.");
		return (
			<Card className="[grid-column:span_2]">
				<CardHeader>
					<CardTitle>Real-Estate-Portfolio Limit Buffer</CardTitle>
					<CardDescription className="text-red-500">
						Error: Chart data is missing or invalid.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	const { current, previous, industryAvg, bspLimit, maxRange } = data;

	const isOverLimit = current > bspLimit;
	const isApproachingLimit = current >= bspLimit * 0.9 && !isOverLimit;

	let statusText = "Within Limits";
	let statusColor = "text-green-600";
	if (isOverLimit) {
		statusText = "Exceeding Limit!";
		statusColor = "text-red-600";
	} else if (isApproachingLimit) {
		statusText = "Approaching Limit (Monitor Closely)";
		statusColor = "text-attention";
	}

	// Prepare data for layered bars (background zones)
	const zoneData = [
		{
			name: "Zones", // A single category for horizontal layout
			good: Math.min(thresholds.good, maxRange),
			warning: Math.min(thresholds.warning, maxRange) - thresholds.good, // Portion from good to warning
			critical: Math.min(thresholds.critical, maxRange) - thresholds.warning, // Portion from warning to critical
			overCritical: maxRange - thresholds.critical, // Portion beyond critical
			currentValue: current, // Value for the actual data bar
		},
	];

	// Prepare data for Scatter markers (Previous Quarter, Industry Average)
	const markerData = [
		{
			value: previous,
			label: "Previous Quarter",
			yOffset: -10,
			color: chartColors.markerPrevious,
		},
		{
			value: industryAvg,
			label: "Industry Average",
			yOffset: 10,
			color: chartColors.markerIndustry,
		},
	].filter((marker) => typeof marker.value === "number" && marker.value >= 0); // Filter out invalid marker data

	return (
		<Card className="border-none shadow-none px-0">
			<CardHeader className="px-0">
				<CardTitle className="text-muted">
					Current Real Estate Loan Exposure Vs Limit
				</CardTitle>

				<CardDescription className={`font-semibold text-left ${statusColor}`}>
					Status: {statusText}
				</CardDescription>
			</CardHeader>

			<CardContent className="px-0">
				<ChartContainer
					className="h-[100px] w-full" // Increased height for better visibility
					config={chartConfig}
				>
					<ComposedChart
						margin={{ top: 20, right: 0, left: 10, bottom: 0 }}
						accessibilityLayer
						layout="vertical" // For horizontal bars
						data={zoneData} // Base chart on zone data for background bars
					>
						<CartesianGrid horizontal={false} strokeDasharray="3 3" />
						<YAxis
							dataKey="name" // "Zones" will be the Y-axis label
							type="category"
							axisLine={false}
							tickLine={false}
							width={100}
							hide // Hide the Y-axis label for a cleaner bullet chart look
						/>
						<XAxis
							type="number"
							domain={[0, maxRange]} // Dynamic max domain
							tickFormatter={(value) => `${value}%`}
							axisLine={false}
							tickLine={false}
							tick={{ fill: "hsl(var(--foreground))" }} // Ensure tick color is visible
						/>
						<ChartTooltip
							cursor={false} // Hide cursor on bullet charts
							content={<ChartTooltipContent />}
						/>

						{/* Layered Background Bars for Zones */}
						<Bar
							dataKey="good"
							stackId="zones"
							fill={chartColors.goodZone}
							barSize={20}
						/>
						<Bar
							dataKey="warning"
							stackId="zones"
							fill={chartColors.warningZone}
							barSize={20}
						/>
						<Bar
							dataKey="critical"
							stackId="zones"
							fill={chartColors.criticalZone}
							barSize={20}
						/>
						<Bar
							dataKey="overCritical"
							stackId="zones"
							fill={chartColors.criticalZone}
							radius={[0, 4, 4, 0]}
							barSize={20}
						/>

						<ReferenceLine
							x={current} // The bank's current REL
							stroke={chartColors.currentExposureBar} // Your desired color (black/dark is fine)
							strokeWidth={1} // Make it thicker to stand out as the current marker
							strokeDasharray="0 0" // Solid line
							label={{
								value: `(Current)`,
								position: "bottom", // Position the label below the line
								fill: chartColors.currentExposureBar,
								fontSize: 12,
								offset: 10, // Adjust offset if needed
							}}
						/>

						{/* BSP Limit Reference Line */}
						<ReferenceLine
							x={bspLimit}
							stroke={chartColors.bspLimitLine}
							strokeWidth={1}
							strokeDasharray="5 5"
							label={{
								value: `BSP Limit: ${bspLimit}%`,
								position: "top",
								fill: chartColors.bspLimitLine,
								fontSize: 12,
								offset: 5,
							}}
						/>

						{/* Markers for Previous Quarter and Industry Average */}
						{markerData.map((marker, index) => (
							<Scatter
								key={index}
								data={[
									{
										x: marker.value,
										y: "Real Estate Exposure",
										fill: marker.color,
									},
								]}
								fill={marker.color}
								shape="diamond" // Or "circle", "triangle"
								line={false}
								name={marker.label}
							>
								<ChartTooltip
									content={
										<ChartTooltipContent
											formatter={(value) => [`${value}%`, marker.label]}
										/>
									}
								/>
							</Scatter>
						))}
					</ComposedChart>
				</ChartContainer>
			</CardContent>

			<CardFooter className="flex-col items-start gap-2 px-0 text-sm">
				<div className="text-left text-sm text-muted-foreground">
					<p>
						<span className="font-semibold">Bank&apos;s Current REL:</span>{" "}
						<span>{current}%</span>
						<br />
						<span className="font-semibold">BSP Prudential Limit:</span>{" "}
						<span>{bspLimit}%</span>
					</p>

					<p className="mt-2 text-xs">
						Based on BSP Circular No. 1098, s. 2020 (Amended Real Estate Loan
						Limit).
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}
