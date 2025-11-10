import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

import type { DashboardItem } from "@/contexts/luminaStore";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { pesoFormatter } from "@/lib/utils";

interface RegionRiskData {
	exposure: number; // Mortgage loan risk exposure amount (e.g., in millions USD)
	region: string; // Name of the region, e.g., "North America", "Europe", "APAC"
}

export function MortgageLoanRiskExposureByRegion({
	item,
}: { item: DashboardItem }) {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_2] @2xl:[grid-column:span_1] justify-between">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer
					className="min-h-60 min-w-60 max-w-full"
					config={item.chartConfig}
				>
					<BarChart
						data={fakeMortgageLoanRiskData}
						margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

						<XAxis
							className="text-xs text-muted-foreground"
							stroke="var(--foreground)"
							dataKey="region"
							tickLine={false}
							axisLine={false}
							dy={10}
						/>

						<YAxis
							stroke="var(--foreground)"
							tickLine={false}
							axisLine={false}
							className="text-sm text-muted-foreground"
							tickFormatter={(value) =>
								`${pesoFormatter.format(Math.trunc(value / 1_000_000_000)).replace(".00", "")}B`
							}
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
							formatter={(value: number) => [
								`${pesoFormatter.format(value)}`,
								" Exposure",
							]}
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
							radius={[4, 4, 0, 0]}
							fill="var(--chart-5)" // Tailwind fuchsia-700
							name="Loan Exposure"
							dataKey="exposure"
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>

			<div></div>
		</Card>
	);
}

const fakeMortgageLoanRiskData: RegionRiskData[] = [
	{ region: "National Capital Region (NCR)", exposure: 75000000000 }, // 75 Billion PHP
	{ region: "Calabarzon (Region IV-A)", exposure: 58000000000 }, // 58 Billion PHP
	{ region: "Central Luzon (Region III)", exposure: 42000000000 }, // 42 Billion PHP
	{ region: "Western Visayas (Region VI)", exposure: 25000000000 }, // 25 Billion PHP
	{ region: "Central Visayas (Region VII)", exposure: 33000000000 }, // 33 Billion PHP
	{ region: "Davao Region (Region XI)", exposure: 20000000000 }, // 20 Billion PHP
	{ region: "Northern Mindanao (Region X)", exposure: 15000000000 }, // 15 Billion PHP
	{ region: "Bicol Region (Region V)", exposure: 12000000000 }, // 12 Billion PHP
	{ region: "Soccsksargen (Region XII)", exposure: 10000000000 }, // 10 Billion PHP
	{ region: "Eastern Visayas (Region VIII)", exposure: 8000000000 }, // 8 Billion PHP
];
