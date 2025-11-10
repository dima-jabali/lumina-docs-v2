import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const chartData = [
	{ month: "January", tenure: 10 },
	{ month: "February", tenure: 15 },
	{ month: "March", tenure: 20 },
	{ month: "April", tenure: 25 },
	{ month: "May", tenure: 30 },
	{ month: "June", tenure: 35 },
];

const chartConfig = {
	tenure: {
		color: "hsl(var(--chart-1))",
		label: "Tenure (months)",
	},
} satisfies ChartConfig;

export function EmploymentTenureScore() {
	return (
		<Card className="flex flex-col border shadow-none justify-between">
			<CardHeader>
				<CardTitle>Employment Tenure Score</CardTitle>

				<CardDescription>Job stability for salaried borrowers</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer config={chartConfig} className="h-[150px] w-full">
					<LineChart
						margin={{ top: 5, right: 5, left: -35, bottom: 0 }}
						accessibilityLayer
						data={chartData}
					>
						<CartesianGrid />

						<YAxis />

						<XAxis
							dataKey="month"
							tickMargin={10}
							tickFormatter={(value) => value.slice(0, 3)}
						/>

						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />

						{/* Custom markers for tenure ranges */}

						<Line dataKey="tenure" type="monotone" dot={{ r: 2 }} />
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
