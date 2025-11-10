"use client"; // This directive is necessary for client-side components in Next.js App Router

import {
	Bar,
	BarChart, // Added Legend to differentiate years
	CartesianGrid,
	Legend,
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

// Define the shape of our raw expiry data point
interface ExpiryDataPoint {
	year: number;
	month: number; // 1-12
	count: number; // Number of documents expiring in this month/year
}

// Define the shape of the data for the grouped bar chart
interface GroupedExpiryData {
	month: string; // e.g., "Jan", "Feb"
	[year: number]: number; // Dynamic keys for each year, holding the count
}

const monthNames = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

/**
 * Generates fake ID/Document expiry data.
 * Data is randomized with some seasonality (e.g., more expirations around year-end).
 * @returns {ExpiryDataPoint[]} An array of expiry data points.
 */
const generateFakeExpiryData = (): ExpiryDataPoint[] => {
	const data: ExpiryDataPoint[] = [];
	const currentYear = new Date().getFullYear();
	const years = [currentYear, currentYear + 1, currentYear + 2]; // e.g., 2025, 2026, 2027

	years.forEach((year) => {
		for (let month = 1; month <= 12; month++) {
			let count = Math.floor(Math.random() * 50) + 10; // Base count: 10-60 documents
			// Introduce some peaks for demonstration (e.g., end of year, start of year)
			if (month === 1 || month === 12) {
				count += Math.floor(Math.random() * 30); // Add more expirations
			} else if (month >= 4 && month <= 6) {
				// Mid-year dip
				count -= Math.floor(Math.random() * 15);
				if (count < 10) count = 10;
			}
			data.push({ year, month, count });
		}
	});
	return data;
};

/**
 * Transforms the flat expiry data into a grouped format suitable for a BarChart.
 * @param flatData The array of raw expiry data points.
 * @returns {GroupedExpiryData[]} An array of grouped expiry data.
 */
const transformDataForGroupedBarChart = (
	flatData: ExpiryDataPoint[],
): GroupedExpiryData[] => {
	const groupedData: GroupedExpiryData[] = [];
	const years = Array.from(new Set(flatData.map((d) => d.year))).sort(
		(a, b) => a - b,
	);

	monthNames.forEach((monthName, index) => {
		const monthData: GroupedExpiryData = { month: monthName };
		years.forEach((year) => {
			const dataPoint = flatData.find(
				(d) => d.year === year && d.month === index + 1,
			);
			monthData[year] = dataPoint ? dataPoint.count : 0; // Assign count or 0 if no data
		});
		groupedData.push(monthData);
	});
	return groupedData;
};

/**
 * A React component that visualizes ID/Document expiry distribution as a grouped bar chart.
 */
export function IDDocumentExpiryHeatMapChart({
	item,
}: { item: DashboardItem }) {
	const flatData = generateFakeExpiryData();
	const data = transformDataForGroupedBarChart(flatData);
	const years = Array.from(new Set(flatData.map((d) => d.year))).sort(
		(a, b) => a - b,
	);

	// Define colors for each year's bars
	const yearColors = [
		"var(--chart-2)", // Primary color for current year
		"var(--chart-3)", // Secondary for next year
		"var(--accent)", // Accent for the year after
		"var(--muted-foreground)", // Fallback for more years
	];

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
							left: 0,
							bottom: 0,
						}}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="var(--muted-foreground)"
							opacity={0.5}
						/>
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							className="text-sm"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) => `${value}`}
							className="text-sm"
							label={{
								value: "Number of Documents",
								angle: -90,
								position: "insideLeft",
								dy: 50,
								fill: "var(--foreground)",
								fontSize: 12,
							}}
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
						<Legend
							verticalAlign="top"
							height={36}
							iconType="circle"
							formatter={(value) => `Year ${value}`}
						/>
						{years.map((year, index) => (
							<Bar
								key={year}
								dataKey={year}
								fill={yearColors[index % yearColors.length]}
								radius={[4, 4, 0, 0]}
								// Set minBarSize to ensure visibility of small values
								minPointSize={3}
							/>
						))}
					</BarChart>
				</ChartContainer>
			</CardContent>

			<div></div>
		</Card>
	);
}
