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

interface DocumentVolumeData {
	period: string; // e.g., "Week 1", "June 2024"
	manual: number; // Number of documents processed manually
	idp: number; // Number of documents processed with IDP
}

export function DocumentProcessingVolumeChart({
	item,
}: {
	item: DashboardItem<Array<DocumentVolumeData>>;
}) {
	const chartData = fakeDocumentVolumeData;

	return (
		<Card className="flex flex-col justify-between border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_2] @2xl:[grid-column:span_1]">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent className="">
				<ChartContainer className="min-h-[200px] w-full" config={{}}>
					<BarChart data={chartData}>
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
							tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} // Assuming values in thousands
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
							cursor={{
								fill: "var(--muted)",
								opacity: 0.2,
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
							iconType="circle"
						/>

						<Bar
							dataKey="manual"
							stackId="a"
							fill="var(--chart-1)" // Example color
							name="Manual Processing"
						/>

						<Bar
							dataKey="idp"
							stackId="a"
							fill="var(--chart-3)" // Example color
							name="IDP Processing"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

const fakeDocumentVolumeData: DocumentVolumeData[] = [
	{ period: "Jan", manual: 15000, idp: 50000 },
	{ period: "Feb", manual: 14000, idp: 55000 },
	{ period: "Mar", manual: 13000, idp: 60000 },
	{ period: "Apr", manual: 12000, idp: 65000 },
	{ period: "May", manual: 11000, idp: 70000 },
	{ period: "Jun", manual: 10000, idp: 75000 },
	{ period: "Jul", manual: 9000, idp: 80000 },
	{ period: "Aug", manual: 8000, idp: 85000 },
	{ period: "Sep", manual: 7000, idp: 90000 },
	{ period: "Oct", manual: 6000, idp: 95000 },
	{ period: "Nov", manual: 5000, idp: 100000 },
	{ period: "Dec", manual: 4000, idp: 105000 },
];
