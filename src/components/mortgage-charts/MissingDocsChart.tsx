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

interface MissingDocsData {
	name: string; // e.g., Document Type or Time Period
	percentage: number; // Percentage of applications with missing docs (0 to 1)
}

interface ApplicationsMissingDocsChartProps {
	data: MissingDocsData[];
	title?: string;
}

export function MissingDocsChart({
	item,
}: {
	item: DashboardItem<ApplicationsMissingDocsChartProps>;
}) {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_1] justify-between">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<BarChart data={fakeMissingDocsData}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
						<XAxis
							dataKey="name"
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-xs text-muted-foreground"
						/>
						<YAxis
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
							tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
							label={{
								value: "Percentage",
								angle: -90,
								position: "insideLeft",
								style: {
									textAnchor: "middle",
									fill: "var(--foreground)",
									fontSize: "0.75rem",
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
							cursor={{
								fill: "var(--muted)",
								opacity: 0.2,
							}}
							formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
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
							dataKey="percentage"
							fill="var(--chart-3)" // Tailwind gray-500
							radius={[4, 4, 0, 0]}
							name="% Missing"
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>

			<div></div>
		</Card>
	);
}

const fakeMissingDocsData: MissingDocsData[] = [
	{ name: "Application Form", percentage: 0.15 },
	{ name: "ID Document", percentage: 0.05 },
	{ name: "Proof of Address", percentage: 0.1 },
	{ name: "Income Statement", percentage: 0.2 },
	{ name: "Other", percentage: 0.08 },
];
