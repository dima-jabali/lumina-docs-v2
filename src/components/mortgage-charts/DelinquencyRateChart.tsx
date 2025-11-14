import type { DashboardItem } from "@/contexts/luminaStore";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface VintageData {
	name: string; // e.g., "Month 1", "Month 3", "Month 6"
	"2020 Vintage"?: number;
	"2021 Vintage"?: number;
	"2022 Vintage"?: number;
	"2023 Vintage"?: number;
	"2024 Vintage"?: number;
}

const LINE_COLORS = ["#2563eb", "#16a34a", "#ca8a04", "#dc2626", "#7c3aed"];

export function DelinquencyRateChart({
	item,
}: {
	item: DashboardItem<VintageData>;
}) {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_1] justify-between">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<LineChart
						data={fakeVintageData}
						margin={{
							top: 0,
							right: 0,
							left: 0,
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
							tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
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
						/>
						<Legend
							wrapperStyle={{
								paddingTop: "20px",
								color: "var(--foreground)",
							}}
						/>
						{Object.keys(fakeVintageData[0] || {})
							.filter((key) => key !== "name")
							.map((key, index) => (
								<Line
									key={key}
									type="monotone"
									dataKey={key}
									stroke={LINE_COLORS[index % LINE_COLORS.length]}
									strokeWidth={2}
									dot={{ strokeWidth: 2, r: 4 }}
									activeDot={{ r: 6, strokeWidth: 2 }}
									name={key}
								/>
							))}
					</LineChart>
				</ChartContainer>
			</CardContent>

			<div></div>
		</Card>
	);
}

const fakeVintageData: VintageData[] = [
	{
		name: "Month 1",
		"2020 Vintage": 0.005,
		"2021 Vintage": 0.004,
		"2022 Vintage": 0.006,
		"2023 Vintage": 0.005,
		"2024 Vintage": 0.004,
	},
	{
		name: "Month 3",
		"2020 Vintage": 0.015,
		"2021 Vintage": 0.012,
		"2022 Vintage": 0.018,
		"2023 Vintage": 0.015,
		"2024 Vintage": 0.013,
	},
	{
		name: "Month 6",
		"2020 Vintage": 0.03,
		"2021 Vintage": 0.025,
		"2022 Vintage": 0.035,
		"2023 Vintage": 0.03,
		"2024 Vintage": 0.028,
	},
	{
		name: "Month 9",
		"2020 Vintage": 0.045,
		"2021 Vintage": 0.038,
		"2022 Vintage": 0.05,
		"2023 Vintage": 0.045,
		"2024 Vintage": 0.042,
	},
	{
		name: "Month 12",
		"2020 Vintage": 0.055,
		"2021 Vintage": 0.048,
		"2022 Vintage": 0.06,
		"2023 Vintage": 0.055,
		"2024 Vintage": 0.05,
	},
	{
		name: "Month 18",
		"2020 Vintage": 0.06,
		"2021 Vintage": 0.052,
		"2022 Vintage": 0.065,
		"2023 Vintage": 0.058,
		"2024 Vintage": undefined,
	},
	{
		name: "Month 24",
		"2020 Vintage": 0.062,
		"2021 Vintage": 0.054,
		"2022 Vintage": 0.067,
		"2023 Vintage": undefined,
		"2024 Vintage": undefined,
	},
	{
		name: "Month 36",
		"2020 Vintage": 0.063,
		"2021 Vintage": 0.055,
		"2022 Vintage": undefined,
		"2023 Vintage": undefined,
		"2024 Vintage": undefined,
	},
];
