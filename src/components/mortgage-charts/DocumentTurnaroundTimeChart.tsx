// components/average-document-turnaround-time-chart.tsx
import type { DashboardItem } from "@/contexts/luminaStore";
import { quantile } from "d3-array";
import { useMemo } from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	RectangleProps,
	Scatter,
	XAxis,
	YAxis,
	ZAxis,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

// Original data of boxplot graph (input format for processing)
export type DocumentTurnaroundRawInput = {
	docType: string; // Document Type
	turnaroundTimes: number[]; // Array of individual turnaround times in minutes
};

// Internal representation of boxplot stats calculated from raw data
type BoxPlotStats = {
	approver: string; // Corresponds to docType
	min: number;
	lowerQuartile: number;
	median: number;
	upperQuartile: number;
	max: number;
	average?: number;
};

// Data structure used directly by Recharts for stacked bars
type BoxPlotChartData = {
	min: number; // Base for stack
	approver: string;
	bottomWhisker: number; // Q1 - min
	bottomBox: number; // Median - Q1
	topBox: number; // Q3 - Median
	topWhisker: number; // max - Q3
	average?: number;
	size: number; // For average dot size
};

// Custom shape for horizontal lines (median, min, max)
const HorizonBar = (props: RectangleProps) => {
	const { x, y, width } = props;

	if (x == null || y == null || width == null) {
		return null;
	}

	return (
		<line
			x1={x}
			y1={y}
			x2={x + width}
			y2={y}
			stroke={"#000"} // Black for lines
			strokeWidth={1}
		/>
	);
};

// Custom shape for vertical lines (whiskers)
const DotBar = (props: RectangleProps) => {
	const { x, y, width, height } = props;

	if (x == null || y == null || width == null || height == null) {
		return null;
	}

	return (
		<line
			x1={x + width / 2}
			y1={y + height}
			x2={x + width / 2}
			y2={y}
			stroke={"#100e0e"} // Darker black for whiskers
			strokeWidth={1}
			strokeDasharray={"5"} // Dashed line for whiskers
		/>
	);
};

// Helper to calculate the 5-number summary and average from raw data
const calculateFullBoxPlotStats = (data: number[]): BoxPlotStats | null => {
	if (data.length === 0) return null;
	const sortedData = [...data].sort((a, b) => a - b);
	const min = sortedData[0]!;
	const max = sortedData[sortedData.length - 1]!;
	const median = quantile(sortedData, 0.5) || 0;
	const q1 = quantile(sortedData, 0.25) || 0;
	const q3 = quantile(sortedData, 0.75) || 0;
	const sum = sortedData.reduce((acc, val) => acc + val, 0);
	const average = sum / sortedData.length;

	return {
		approver: "", // Placeholder, will be filled with docType later
		min,
		lowerQuartile: q1,
		median,
		upperQuartile: q3,
		max,
		average,
	};
};

// Hook to transform calculated stats into Recharts-compatible stacked bar data
const useBoxPlotDataTransform = (
	boxPlots: BoxPlotStats[],
): BoxPlotChartData[] => {
	const data = useMemo(
		() =>
			boxPlots.map((v) => {
				return {
					approver: v.approver,
					min: v.min,
					bottomWhisker: v.lowerQuartile - v.min,
					bottomBox: v.median - v.lowerQuartile,
					topBox: v.upperQuartile - v.median,
					topWhisker: v.max - v.upperQuartile,
					average: v.average,
					size: 250, // Arbitrary size for the average dot
				};
			}),
		[boxPlots],
	);

	return data;
};

interface AverageDocumentTurnaroundTimeChartProps {
	data: DocumentTurnaroundRawInput[];
	title?: string;
}

export function DocumentTurnaroundTimeChart({
	item,
}: { item: DashboardItem<AverageDocumentTurnaroundTimeChartProps> }) {
	// Process raw input data to get BoxPlotStats
	const processedBoxPlots: BoxPlotStats[] = fakeDocumentTurnaroundData
		.map((item) => {
			const stats = calculateFullBoxPlotStats(item.turnaroundTimes);
			return stats ? { ...stats, approver: item.docType } : null;
		})
		.filter(Boolean) as BoxPlotStats[];

	// Transform stats into Recharts-friendly data
	const chartData = useBoxPlotDataTransform(processedBoxPlots);

	// Determine Y-axis range
	const allValues = processedBoxPlots.flatMap((d) => [d.min, d.max]);
	const yMin =
		allValues.length > 0 ? Math.floor(Math.min(...allValues) / 5) * 5 : 0;
	const yMax =
		allValues.length > 0 ? Math.ceil(Math.max(...allValues) / 5) * 5 : 30;

	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_1] justify-between">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<ComposedChart
						margin={{
							top: 0,
							right: 0,
							bottom: 0,
							left: 0,
						}}
						data={chartData}
					>
						<CartesianGrid strokeDasharray="3 3" />

						{/* This empty bar acts as the base for the stack, pushing other bars up */}
						<Bar stackId={"a"} dataKey={"min"} fill={"none"} />

						{/* Bottom Whisker Line */}
						<Bar stackId={"a"} dataKey={"bottomWhisker"} shape={<DotBar />} />

						{/* Bottom Box (Q1 to Median) */}
						<Bar
							stackId={"a"}
							dataKey={"bottomBox"}
							fill="var(--chart-2)" // indigo-600
						/>

						{/* Median Line */}
						<Bar stackId={"a"} dataKey={"bar"} shape={<HorizonBar />} />

						{/* Top Box (Median to Q3) */}
						<Bar
							stackId={"a"}
							dataKey={"topBox"}
							fill="var(--chart-2)" // indigo-600
						/>

						{/* Top Whisker Line */}
						<Bar stackId={"a"} dataKey={"topWhisker"} shape={<DotBar />} />

						{/* Max Line (represented by a HorizonBar at the top of the stack) */}
						<Bar stackId={"a"} dataKey={"bar"} shape={<HorizonBar />} />

						<ZAxis type="number" dataKey="size" range={[0, 50]} />

						<Scatter
							dataKey="average"
							fill="#ef4444" // red-500
							stroke="#FFF"
						/>

						<XAxis
							dataKey="approver"
							dy={10}
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-xs text-muted-foreground"
						/>

						<YAxis
							label={{
								style: {
									textAnchor: "middle",
									fill: "var(--foreground)",
									fontSize: "0.75rem",
								},
								value: "Turnaround Time (minutes)",
								angle: -90,
								dx: -10,
							}}
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
							domain={[yMin, yMax]}
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
							content={<ChartTooltipContent />}
							formatter={(value: number, name: string, props) => {
								const payload = props.payload;
								if (!payload) return null;

								if (name === "min")
									return [`Min: ${payload.min.toFixed(1)} min`];
								if (name === "bottomWhisker")
									return [
										`Q1: ${(payload.min + payload.bottomWhisker).toFixed(1)} min`,
									];
								if (name === "bottomBox")
									return [
										`Median: ${(payload.min + payload.bottomWhisker + payload.bottomBox).toFixed(1)} min`,
									];
								if (name === "topBox")
									return [
										`Q3: ${(payload.min + payload.bottomWhisker + payload.bottomBox + payload.topBox).toFixed(1)} min`,
									];
								if (name === "topWhisker")
									return [
										`Max: ${(payload.min + payload.bottomWhisker + payload.bottomBox + payload.topBox + payload.topWhisker).toFixed(1)} min`,
									];
								if (name === "average")
									return [`Avg: ${payload.average?.toFixed(1)} min`];

								// Fallback for other data keys if needed
								return [`${value.toFixed(1)}`, name];
							}}
						/>
					</ComposedChart>
				</ChartContainer>
			</CardContent>

			<div></div>
		</Card>
	);
}

// Example Usage with Fake Data
const fakeDocumentTurnaroundData: DocumentTurnaroundRawInput[] = [
	{
		docType: "Application Form",
		turnaroundTimes: [
			5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
		],
	},
	{
		docType: "ID Document",
		turnaroundTimes: [
			1, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 2, 3, 4, 5, 3, 4, 5, 6, 7, 8,
		],
	},
	{
		docType: "Proof of Address",
		turnaroundTimes: [
			8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 9, 10, 11, 12, 13, 14, 15, 16,
			17, 18,
		],
	},
	{
		docType: "Income Statement",
		turnaroundTimes: [
			15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 16, 17, 18, 19, 20, 21, 22,
			23, 24, 25,
		],
	},
];
