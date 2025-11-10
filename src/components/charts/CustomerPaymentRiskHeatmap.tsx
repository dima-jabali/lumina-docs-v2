/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
	CartesianGrid,
	Rectangle,
	Scatter,
	ScatterChart,
	Tooltip,
	XAxis,
	YAxis,
	type TooltipProps,
} from "recharts";
import type {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer } from "../ui/chart";
import type { DashboardItem } from "@/contexts/luminaStore";

// Define types for our data
interface DataPoint {
	customerName: string;
	agingBucket: number;
	bucketName: string;
	customer: number;
	value: number;
}

// Define types for our custom shape props
interface CustomShapeProps {
	[key: string]: any;
	height?: number;
	width?: number;
	value?: number;
	x?: number;
	y?: number;
	xAxis?: any; // Add type for xAxis
	yAxis?: any; // Add type for yAxis
	payload?: DataPoint; // Add type for payload
}

// Sample data - replace with your actual customer payment data
const customers = [
	"Acme Corp",
	"Globex Inc",
	"Initech LLC",
	"Umbrella Co",
	"Stark Industries",
	"Wayne Enterprises",
	"Cyberdyne Systems",
	"Oscorp Industries",
];

const agingBuckets = ["0-30 days", "31-60 days", "61-90 days", "90+ days"];

// Generate sample data
const generateData = (): DataPoint[] => {
	const data: DataPoint[] = [];

	for (let i = 0; i < customers.length; i++) {
		for (let j = 0; j < agingBuckets.length; j++) {
			// Random value between 0 and 20 representing number of invoices
			const value = Math.floor(Math.random() * 20);
			data.push({
				customer: i,
				agingBucket: j,
				value,
				// Custom data for tooltip
				customerName: customers[i]!,
				bucketName: agingBuckets[j]!,
			});
		}
	}

	return data;
};

const CustomizedShape = (props: CustomShapeProps): React.ReactNode | null => {
	if (
		!props ||
		typeof props.x !== "number" ||
		typeof props.y !== "number" ||
		!props.xAxis ||
		!props.yAxis ||
		!props.payload
	) {
		return null;
	}

	const { payload, xAxis, yAxis } = props;
	const value = payload?.value as number | undefined;
	const dataX = payload.agingBucket;
	const dataY = payload.customer;

	const xRange = xAxis.scale.range();
	const yRange = yAxis.scale.range();

	const xDomain = xAxis.domain;
	const yDomain = yAxis.domain;

	const cellWidth = (xRange[1] - xRange[0]) / (xDomain[1] - xDomain[0]);
	const cellHeight = (yRange[1] - yRange[0]) / (yDomain[1] - yDomain[0]);

	// Calculate the top-left corner of the cell
	const cellStartX = xRange[0] + (dataX - xDomain[0]) * cellWidth;
	const cellStartY = yRange[0] + (dataY - yDomain[0]) * cellHeight;

	// Calculate the center coordinates of the cell
	const textX = cellStartX + cellWidth / 2;
	const textY = cellStartY + cellHeight / 2;

	const safeValue = typeof value === "number" ? value : 0;

	// Calculate color based on value
	const normalizedValue = Math.min(safeValue / 20, 1);
	const r = Math.floor(normalizedValue * 255);
	const g = Math.floor((1 - normalizedValue) * 255);
	const b = 0;
	const cellColor = `rgb(${r}, ${g}, ${b})`;
	const opacity = 0.7 + normalizedValue * 0.3;

	// Determine text color based on normalizedValue
	const textColor = normalizedValue > 0.4 ? "#fff" : "#333"; // Adjust the threshold (0.6) as needed

	return (
		<g>
			<Rectangle
				fillOpacity={opacity}
				height={cellHeight}
				width={cellWidth}
				fill={cellColor}
				strokeWidth={1}
				stroke="#fff"
				x={cellStartX}
				y={cellStartY}
			/>

			<text
				fontWeight="bold"
				x={textX}
				y={textY}
				textAnchor="middle"
				dominantBaseline="central"
				fill={textColor} // Use the dynamically determined text color
				fontSize={12} // Adjust font size as needed
			>
				{safeValue}
			</text>
		</g>
	);
};

export const CustomerPaymentRiskHeatmap: React.FC<{ item: DashboardItem }> = ({
	item,
}) => {
	const [data] = useState<DataPoint[]>(generateData());

	// Custom tooltip content as a function (not a component)
	const renderTooltip = (
		props: TooltipProps<ValueType, NameType>,
	): React.ReactNode | null => {
		const { active, payload } = props || {};

		if (
			active &&
			payload &&
			payload.length > 0 &&
			payload[0] &&
			payload[0].payload
		) {
			const dataPoint = payload[0].payload as DataPoint;
			return (
				<div className="rounded-lg border bg-white p-2 shadow-sm">
					<div className="grid grid-cols-2 gap-2">
						<div className="font-medium">Customer:</div>
						<div>{dataPoint.customerName}</div>
						<div className="font-medium">Aging Bucket:</div>
						<div>{dataPoint.bucketName}</div>
						<div className="font-medium">Invoices late:</div>
						<div>{dataPoint.value}</div>
					</div>
				</div>
			);
		}
		return null;
	};

	return (
		<Card className="flex flex-col border border-border-smooth/40 shadow-sm shadow-border-smooth/30 justify-between gap-6">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<ChartContainer
				config={{}}
				className="min-h-[400px] overflow-hidden max-w-[calc(100%-30px)]"
			>
				<ScatterChart margin={{ top: 20, right: 50, bottom: 10, left: 40 }}>
					<CartesianGrid strokeDasharray="3 3" />

					<XAxis
						tickFormatter={(value) => agingBuckets[value] || ""}
						domain={[0, agingBuckets.length - 1]}
						tickCount={agingBuckets.length}
						dataKey="agingBucket"
						name="Aging Bucket"
						type="number"
						dy={10}
					/>

					<YAxis
						tickFormatter={(value) => customers[value] || ""}
						domain={[0, customers.length]}
						tickCount={customers.length}
						alignmentBaseline="middle"
						dataKey="customer"
						name="Customer"
						type="number"
						dx={-10}
					/>

					<Tooltip content={renderTooltip} />

					<Scatter data={data} shape={<CustomizedShape />} />
				</ScatterChart>
			</ChartContainer>

			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="text-sm font-medium">Risk Level:</div>

				<div className="flex h-2 w-48 overflow-hidden rounded">
					<div className="h-full w-full bg-gradient-to-r from-green-500 to-red-500"></div>
				</div>

				<div className="flex w-48 justify-between text-xs">
					<span>Low Risk</span>
					<span>High Risk</span>
				</div>
			</CardFooter>
		</Card>
	);
};
