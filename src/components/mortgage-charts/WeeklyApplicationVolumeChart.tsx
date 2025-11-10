/* eslint-disable @typescript-eslint/no-explicit-any */

import { addWeeks, format } from "date-fns";
import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";

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

// Function to calculate 4-week moving average
const calculateMovingAverage = (data: any[], windowSize: number) => {
	if (data.length < windowSize) {
		return data.map((item) => ({ ...item, movingAverage: null })); // Not enough data for MA
	}

	return data.map((item, index, array) => {
		if (index < windowSize - 1) {
			return { ...item, movingAverage: null }; // Not enough past data for MA
		} else {
			const sum = array
				.slice(index - windowSize + 1, index + 1)
				.reduce((acc, curr) => acc + curr.volume, 0);

			return { ...item, movingAverage: sum / windowSize };
		}
	});
};

const generateWeeklyData = (startDate: string | Date, numWeeks: number) => {
	const data = [];

	let currentDate = new Date(startDate);

	for (let i = 0; i < numWeeks; i++) {
		data.push({
			volume: Math.floor(Math.random() * (250 - 150 + 1)) + 150, // Believable application volume
			week: format(currentDate, "MMM dd"),
			date: structuredClone(currentDate), // Store full date for potential future use or more precise tooltips
		});

		currentDate = addWeeks(currentDate, 1);
	}

	return data;
};

// Generate data for 20 weeks starting from a believable date
const rawData = generateWeeklyData("2025-01-06", 20);
const chartData = calculateMovingAverage(rawData, 4); // Calculate 4-week MA

export function WeeklyApplicationVolumeChart({
	item,
}: { item: DashboardItem }) {
	const [{ margin }] = useState({
		margin: { top: 20, right: 30, left: 20, bottom: 5 },
	});

	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30 [grid-column:span_1]">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer className="min-h-24 min-w-24" config={item.chartConfig}>
					<LineChart data={chartData} margin={margin}>
						<CartesianGrid strokeDasharray="3 3" />

						<XAxis
							tickFormatter={(value) => value} // Use the formatted week string
							interval="preserveStartEnd"
							dataKey="week"
						/>

						<YAxis />

						<ChartTooltip
							content={<ChartTooltipContent />}
							labelFormatter={(label) => `Week of ${label}`}
						/>

						<Legend />

						<Line
							type="monotone"
							dataKey="volume"
							stroke="#8884d8"
							name="Weekly Volume"
							activeDot={{ r: 8 }}
						/>

						<Line
							type="monotone"
							dataKey="movingAverage"
							stroke="#82ca9d"
							name="4-Week MA"
							dot={false}
							strokeDasharray="5 5"
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
