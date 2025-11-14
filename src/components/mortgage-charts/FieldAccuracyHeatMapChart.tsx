// components/top-ocr-error-sources-chart.tsx
import type { DashboardItem } from "@/contexts/luminaStore";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface OCRErrorSourceData {
	source: string; // Name of the OCR error source
	count: number; // Number of occurrences or percentage
}

interface TopOcrErrorSourcesChartProps {
	data: OCRErrorSourceData[];
	title?: string;
}

export function FieldAccuracyHeatMapChart({
	item,
}: {
	item: DashboardItem<TopOcrErrorSourcesChartProps>;
}) {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_1] justify-between">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<BarChart data={fakeOcrErrorSourcesData}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
						<XAxis
							dataKey="source"
							stroke="var(--foreground)"
							// tickLine={false}
							// axisLine={false}
							className="text-xs text-muted-foreground"
						/>
						<YAxis
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
							label={{
								value: "Number of Errors", // Or 'Percentage'
								angle: -90,
								position: "insideLeft",
								style: {
									textAnchor: "middle",
									fill: "var(--foreground)",
									fontSize: "12px",
								},
							}}
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
							// formatter={(value: number) => [`${value}`, 'Errors']}
							cursor={{
								fill: "var(--muted)",
								opacity: 0.2,
							}}
							content={<ChartTooltipContent />}
						/>
						<Legend
							wrapperStyle={{
								paddingTop: "20px",
								color: "var(--foreground)",
							}}
							iconType="circle"
						/>
						<Bar
							dataKey="count"
							fill="var(--chart-4)" // Tailwind purple-500
							radius={[4, 4, 0, 0]}
							name="Error Count"
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>

			<div></div>
		</Card>
	);
}

const fakeOcrErrorSourcesData: OCRErrorSourceData[] = [
	{ source: "Blurry Images", count: 120 },
	{ source: "Poor Lighting", count: 95 },
	{ source: "Handwriting", count: 80 },
	{ source: "Complex Layouts", count: 60 },
	{ source: "Missing Fields", count: 45 },
	{ source: "Skewed Documents", count: 30 },
	{ source: "Low Resolution", count: 25 },
];
