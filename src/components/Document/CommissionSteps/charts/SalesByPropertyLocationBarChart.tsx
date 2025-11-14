import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

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
import type { DashboardItem } from "@/contexts/luminaStore";

interface SalesData {
	region: string; // e.g., "National Capital Region", "Central Luzon"
	sales: number; // Total sales in that region
	marketingScore: number; // A score indicating marketing hotspot (higher = hotter)
}

export function SalesByPropertyLocationBarChart({
	item,
}: {
	item: DashboardItem<Array<SalesData>>;
}) {
	// Sort data by sales in descending order for better visualization
	const sortedData = fakeSalesData.sort((a, b) => b.sales - a.sales);

	return (
		<Card className="flex flex-col justify-between border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_2]">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer
					className="min-h-[200px] w-full"
					config={item.chartConfig}
				>
					<BarChart
						data={sortedData} // Use sorted data
						margin={{
							top: 0,
							right: 0,
							left: 40,
							bottom: 0,
						}}
						layout="vertical" // Use vertical layout for regions on Y-axis
					>
						<CartesianGrid className="stroke-muted" strokeDasharray="3 3" />

						<XAxis
							type="number" // X-axis is for sales (number)
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
							tickFormatter={(value) => `₱${(value / 1000000).toFixed(0)}M`}
							label={{
								value: "Total Sales (PHP)",
								position: "bottom",
								offset: -2,
								style: {
									textAnchor: "end",
									fill: "var(--foreground)",
									fontSize: 12,
								},
							}}
						/>

						<YAxis
							type="category" // Y-axis is for regions (category)
							dataKey="region"
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-xs text-muted-foreground"
							tickFormatter={(value) => value.split(" ")[0] + "..."}
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
							cursor={{
								fill: "var(--muted)",
								opacity: 0.2,
							}}
						/>

						<Legend
							wrapperStyle={{
								paddingTop: "20px",
								color: "var(--foreground)",
							}}
							iconType="circle"
						/>

						<Bar
							dataKey="sales"
							fill="var(--chart-3)" // Tailwind blue-500
							radius={[0, 4, 4, 0]} // Rounded corners on the right
							name="Sales"
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

// Example data (reusing the data structure from the previous turn, focused on Philippine regions)
const fakeSalesData: SalesData[] = [
	{
		region: "National Capital Region (NCR)",
		sales: 1200000000,
		marketingScore: 95,
	},
	{ region: "CALABARZON (Region IV-A)", sales: 950000000, marketingScore: 88 },
	{
		region: "Central Luzon (Region III)",
		sales: 780000000,
		marketingScore: 75,
	},
	{
		region: "Central Visayas (Region VII)",
		sales: 550000000,
		marketingScore: 62,
	},
	{ region: "Davao Region (Region XI)", sales: 420000000, marketingScore: 50 },
	{
		region: "Western Visayas (Region VI)",
		sales: 380000000,
		marketingScore: 45,
	},
	{
		region: "Northern Mindanao (Region X)",
		sales: 280000000,
		marketingScore: 38,
	},
	{ region: "Bicol Region (Region V)", sales: 180000000, marketingScore: 25 },
	{ region: "Soccsksargen (Region XII)", sales: 150000000, marketingScore: 18 },
	{
		region: "Eastern Visayas (Region VIII)",
		sales: 120000000,
		marketingScore: 12,
	},
];
