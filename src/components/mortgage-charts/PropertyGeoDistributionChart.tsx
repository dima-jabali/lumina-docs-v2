// components/property-geo-distribution-chart.tsx
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

// Define the shape of our data
interface PropertyData {
	name: string; // e.g., City or Province name
	properties: number; // Number of properties
}

export function PropertyGeoDistributionChart({
	item,
}: { item: DashboardItem }) {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_1] justify-between">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<BarChart
						data={fakeGeoDistributionData}
						margin={{
							top: 0,
							right: 0,
							left: -10,
							bottom: 0,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
						<XAxis
							dataKey="name"
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
						/>
						<YAxis
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
						/>
						<ChartTooltip
							contentStyle={{
								backgroundColor: "var(--popover)",
								borderColor: "var(--border)",
								borderRadius: "0.5rem",
							}}
							labelStyle={{
								color: "var(--foreground)",
							}}
							itemStyle={{
								color: "var(--foreground)",
							}}
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
							dataKey="properties"
							fill="var(--chart-2)"
							radius={[4, 4, 0, 0]}
							name="Number of Properties"
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>

			<div></div>
		</Card>
	);
}

// --- Example Usage with Fake Data ---
const fakeGeoDistributionData: PropertyData[] = [
	{ name: "Manila", properties: 800 },
	{ name: "Quezon City", properties: 950 },
	{ name: "Cebu City", properties: 600 },
	{ name: "Davao City", properties: 450 },
	{ name: "Baguio City", properties: 300 },
	{ name: "Iloilo City", properties: 380 },
	{ name: "Taguig City", properties: 700 },
];
