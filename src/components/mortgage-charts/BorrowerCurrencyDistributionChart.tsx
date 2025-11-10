// components/exposure-by-borrower-currency-chart.tsx
import type { DashboardItem } from "@/contexts/luminaStore";
import { Cell, Legend, Pie, PieChart } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface CurrencyExposureData {
	name: string; // Currency name, e.g., "USD", "EUR", "BRL"
	value: number; // Exposure amount
}

export function BorrowerCurrencyDistributionChart({
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
					<PieChart margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
						<Pie
							data={fakeCurrencyExposureData}
							cx="50%"
							cy="50%"
							labelLine={false}
							outerRadius={100}
							fill="#8884d8"
							dataKey="value"
						>
							{fakeCurrencyExposureData.map((_, index) => (
								<Cell
									fill={`var(--chart-${index + 2})`}
									key={`cell-${index}`}
								/>
							))}
						</Pie>
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
								color: "hsl(var(--foreground))",
							}}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>

			<div></div>
		</Card>
	);
}

const fakeCurrencyExposureData: CurrencyExposureData[] = [
	{ name: "USD", value: 3000000 },
	{ name: "EUR", value: 2000000 },
	{ name: "PHP", value: 4500000 },
	{ name: "JPY", value: 1000000 },
	{ name: "GBP", value: 800000 },
];
