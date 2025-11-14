import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

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

interface TaxComplianceData {
	period: string; // e.g., "Jan 2024", "Q1 2024"
	taxWithheld: number; // Total amount of tax withheld
	taxPaidOut: number; // Amount of tax actually paid out
}

export function TaxWithheldVsPaidOutChart({
	item,
}: {
	item: DashboardItem<Array<TaxComplianceData>>;
}) {
	// Pre-process data to calculate the 'remaining' amount
	const chartData = fakeTaxComplianceData.map((item) => ({
		...item,
		taxRemaining: item.taxWithheld - item.taxPaidOut,
	}));

	return (
		<Card className="flex flex-col justify-between border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_2] @2xl:[grid-column:span_1]">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent className="">
				<ChartContainer
					className="min-h-[200px] w-full" // Increased height for better visibility
					config={{}}
				>
					<AreaChart
						data={chartData}
						margin={{
							top: 0,
							right: 0,
							left: 0,
							bottom: 0,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

						<XAxis
							dataKey="period"
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
							tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`} // Assuming values in thousands PHP
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
							content={<ChartTooltipContent />}
							itemStyle={{
								color: "#374151",
							}}
						/>

						<Legend
							wrapperStyle={{
								paddingTop: "20px",
								color: "var(--foreground)",
							}}
						/>

						<Area
							type="monotone"
							dataKey="taxPaidOut"
							stackId="a"
							stroke="var(--chart-2)" // Tailwind emerald-500
							fill="var(--chart-2)"
							fillOpacity={0.7}
							name="Tax Paid Out"
						/>

						<Area
							type="monotone"
							dataKey="taxRemaining"
							stackId="a"
							stroke="var(--chart-5)" // Tailwind orange-500
							fill="var(--chart-5)"
							fillOpacity={0.7}
							name="Tax Remaining"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

const fakeTaxComplianceData: TaxComplianceData[] = [
	{ period: "Jan 2024", taxWithheld: 500000, taxPaidOut: 480000 },
	{ period: "Feb 2024", taxWithheld: 550000, taxPaidOut: 530000 },
	{ period: "Mar 2024", taxWithheld: 600000, taxPaidOut: 590000 },
	{ period: "Apr 2024", taxWithheld: 520000, taxPaidOut: 500000 },
	{ period: "May 2024", taxWithheld: 650000, taxPaidOut: 600000 }, // Higher remaining
	{ period: "Jun 2024", taxWithheld: 700000, taxPaidOut: 690000 },
	{ period: "Jul 2024", taxWithheld: 620000, taxPaidOut: 600000 },
	{ period: "Aug 2024", taxWithheld: 680000, taxPaidOut: 680000 }, // Fully compliant
	{ period: "Sep 2024", taxWithheld: 720000, taxPaidOut: 700000 },
	{ period: "Oct 2024", taxWithheld: 750000, taxPaidOut: 720000 }, // Another higher remaining
	{ period: "Nov 2024", taxWithheld: 700000, taxPaidOut: 700000 },
	{ period: "Dec 2024", taxWithheld: 800000, taxPaidOut: 780000 },
];
