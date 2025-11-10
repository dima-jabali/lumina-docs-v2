import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
	{ segment: "Employed", percentage: 40 },
	{ segment: "Self-employed", percentage: 25 },
	{ segment: "OFW", percentage: 20 },
	{ segment: "Professionals", percentage: 15 },
];

export function BorrowerSegmentMixChart({ item }: { item: DashboardItem }) {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_1]">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<BarChart data={data} layout="vertical">
						<XAxis
							tickFormatter={(value) => `${value}%`}
							domain={[0, 100]}
							type="number"
						/>

						<YAxis
							dataKey="segment"
							type="category"
							width={100} // Adjust width as needed for longer segment names
						/>

						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />

						<Bar
							dataKey="percentage"
							stackId="a"
							fill="#8884d8"
							radius={[0, 4, 4, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
