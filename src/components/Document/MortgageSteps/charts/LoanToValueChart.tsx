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
import {
	Bar,
	CartesianGrid, // For markers
	ComposedChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";

// Define your fake data
const fakeBulletChartData = [
	{
		name: "Debt-to-Income Ratio",
		current: 75, // Bank's current REL percentage
		maxRange: 100, // Max value for the X-axis / chart range
	},
];

// Define thresholds for visual zones (e.g., green, orange, red)
const thresholds = {
	good: 80, // Up to this is 'good' (e.g., green)
	warning: 90, // Above 'good' and up to this is 'warning' (e.g., orange)
	critical: 100, // Above 'warning' and up to this is 'critical' (e.g., red)
};

// Define chart colors (use your actual Shadcn CSS variables)
const chartColors = {
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
		icon: () => "🏦",
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

export function LoanToValueChart() {
	const data = fakeBulletChartData[0]!; // We only have one data point for the bullet chart

	const { current, maxRange } = data;

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

	return (
		<Card className="border shadow-none w-full gap-6">
			<CardHeader>
				<CardTitle>Loan-to-Value (LTV)</CardTitle>

				<CardDescription className="font-semibold text-left p-0">
					Leverage against collateral
				</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="h-[60px] min-w-full" config={chartConfig}>
					<ComposedChart
						margin={{ top: 0, right: 0, left: 10, bottom: 0 }}
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
							hide // Hide the Y-axis label for a cleaner bullet chart look
						/>
						<XAxis
							type="number"
							domain={[0, maxRange]} // Dynamic max domain
							tickFormatter={(value) => `${value}%`}
							axisLine={false}
							tickLine={false}
							tick={{ fill: "hsl(var(--foreground))" }} // Ensure tick color is visible
							dy={10}
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
							radius={[0, 4, 4, 0]}
						/>

						<ReferenceLine
							x={current} // The bank's current REL
							stroke={chartColors.currentExposureBar} // Your desired color (black/dark is fine)
							strokeWidth={1} // Make it thicker to stand out as the current marker
							strokeDasharray="0 0" // Solid line
							label={{
								value: `(LTV: ${current}%)`,
								position: "bottom", // Position the label below the line
								fill: chartColors.currentExposureBar,
								fontSize: 12,
								offset: 3, // Adjust offset if needed
							}}
						/>
					</ComposedChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
