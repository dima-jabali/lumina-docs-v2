import { Bar, BarChart, Legend, XAxis, YAxis } from "recharts";
import { useState } from "react";

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

const data = [
	{ name: "Intake", applications: 1000 },
	{ name: "KYC", applications: 850 },
	{ name: "Underwriting", applications: 700 },
	{ name: "Approved", applications: 550 },
	{ name: "Booked", applications: 480 },
];

export function ApplicationFunnelChart({ item }: { item: DashboardItem }) {
	const [{ margin }] = useState({
		margin: { top: 20, right: 30, left: 23, bottom: 5 },
	});

	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_1]">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<BarChart layout="vertical" margin={margin} data={data}>
						<XAxis type="number" />

						<YAxis dataKey="name" type="category" />

						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />

						<Legend iconType="plainline" />

						<Bar
							name="Number of Applications"
							dataKey="applications"
							radius={[0, 4, 4, 0]}
							fill="var(--chart-2)"
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
