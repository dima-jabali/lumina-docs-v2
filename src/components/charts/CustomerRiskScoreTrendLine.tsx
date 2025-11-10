"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import type { DashboardItem } from "@/contexts/luminaStore";

interface RiskScoreDataPoint {
	timePeriod: string;
	riskScore: number;
}

export interface CustomerRiskScoreData {
	data: RiskScoreDataPoint[];
	customerName: string;
}

export const CustomerRiskScoreTrendLine: React.FC<{
	item: DashboardItem<CustomerRiskScoreData>;
}> = ({ item }) => {
	const { data: riskScoreData } = item.data;

	const latestRiskScore =
		riskScoreData.length > 0
			? riskScoreData[riskScoreData.length - 1]!.riskScore
			: 0;
	const previousRiskScore =
		riskScoreData.length > 1
			? riskScoreData[riskScoreData.length - 2]!.riskScore
			: 0;
	const trendPercentage =
		riskScoreData.length > 1
			? ((latestRiskScore - previousRiskScore) / previousRiskScore) * 100
			: 0;
	const trendingUp = latestRiskScore > previousRiskScore;

	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 justify-between flex flex-col gap-6">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<ChartContainer config={item.chartConfig}>
				<LineChart
					data={riskScoreData}
					margin={{ right: 50, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" />

					<XAxis dataKey="timePeriod" dy={10} />

					<YAxis dx={-10} tickFormatter={(value) => `${value}%`} />

					<ChartTooltip cursor={false} content={<ChartTooltipContent />} />

					<Line
						stroke="var(--chart-1)"
						activeDot={{ r: 8 }}
						dataKey="riskScore"
						type="monotone"
						dot={{ r: 5 }} // Add dots to the line
					/>
				</LineChart>
			</ChartContainer>

			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					Risk Score Trend: {trendingUp ? "Trending Up" : "Trending Down"} by{" "}
					{trendPercentage.toFixed(2)}%
					{trendingUp ? (
						<TrendingUp className="h-4 w-4" />
					) : (
						<TrendingDown className="h-4 w-4" />
					)}
				</div>

				<div className="leading-none text-muted-foreground">
					Showing data for the last {riskScoreData.length} periods
				</div>
			</CardFooter>
		</Card>
	);
};
