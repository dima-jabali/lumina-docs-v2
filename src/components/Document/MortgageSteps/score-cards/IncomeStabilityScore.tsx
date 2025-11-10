import {
	CartesianGrid,
	LineChart,
	Line as LineRecharts,
	XAxis,
	YAxis,
} from "recharts";

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

export function IncomeStabilityScore() {
	const data = [
		{ name: "Jan", score: 10 },
		{ name: "Feb", score: 12 },
		{ name: "Mar", score: 15 },
		{ name: "Apr", score: 18 },
		{ name: "May", score: 22 },
	];
	const color = "green";

	return (
		<Card className="flex flex-col border shadow-none justify-between">
			<CardHeader>
				<CardTitle>Income-Stability Score</CardTitle>

				<CardDescription>
					Volatility of credits in bank statements
				</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="h-[150px] w-full" config={{}}>
					<LineChart
						margin={{ top: 0, right: 5, left: -35, bottom: 0 }}
						accessibilityLayer
						data={data}
					>
						<CartesianGrid strokeDasharray="3 3" />

						<XAxis dataKey="name" />
						<YAxis />

						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />

						<LineRecharts
							type="monotone"
							dataKey="score"
							stroke={color}
							activeDot={{ r: 8 }}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
