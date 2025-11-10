import { useMemo } from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	RectangleProps,
	Scatter,
	XAxis,
	YAxis,
	ZAxis,
} from "recharts";

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import type { DashboardItem } from "@/contexts/luminaStore";

// Original data of boxplot graph
export type BoxPlot = {
	min: number;
	approver: string;
	lowerQuartile: number;
	median: number;
	upperQuartile: number;
	max: number;
	average?: number;
};

// Used in stacked bar graph
type BoxPlotData = {
	min: number;
	approver: string;
	bottomWhisker: number;
	bottomBox: number;
	topBox: number;
	topWhisker: number;
	average?: number;
	size: number; // for average dot size
};

const HorizonBar = (props: RectangleProps) => {
	const { x, y, width, height } = props;

	if (x == null || y == null || width == null || height == null) {
		return null;
	}

	return (
		<line x1={x} y1={y} x2={x + width} y2={y} stroke={"#000"} strokeWidth={1} />
	);
};

const DotBar = (props: RectangleProps) => {
	const { x, y, width, height } = props;

	if (x == null || y == null || width == null || height == null) {
		return null;
	}

	return (
		<line
			x1={x + width / 2}
			y1={y + height}
			x2={x + width / 2}
			y2={y}
			stroke={"#100e0e"}
			strokeWidth={1}
			strokeDasharray={"5"}
		/>
	);
};

const useBoxPlot = (boxPlots: BoxPlot[]): BoxPlotData[] => {
	const data = useMemo(
		() =>
			boxPlots.map((v) => {
				return {
					approver: v.approver,
					min: v.min,
					bottomWhisker: v.lowerQuartile - v.min,
					bottomBox: v.median - v.lowerQuartile,
					topBox: v.upperQuartile - v.median,
					topWhisker: v.max - v.upperQuartile,
					average: v.average,
					size: 250,
				};
			}),
		[boxPlots],
	);

	return data;
};

export const BoxPlot: React.FC<{ item: DashboardItem }> = ({ item }) => {
	const data = useBoxPlot(item.data);

	return (
		<Card className="flex flex-col justify-between border border-border-smooth/40 shadow-sm shadow-border-smooth/30">
			<CardHeader className="pb-0">
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<ChartContainer config={item.chartConfig}>
				<ComposedChart
					margin={{ top: 30, right: 40, bottom: 20, left: 10 }}
					data={data}
				>
					<CartesianGrid strokeDasharray="3 3" />

					<Bar stackId={"a"} dataKey={"min"} fill={"none"} />

					<Bar stackId={"a"} dataKey={"bar"} shape={<HorizonBar />} />

					<Bar stackId={"a"} dataKey={"bottomWhisker"} shape={<DotBar />} />

					<Bar stackId={"a"} dataKey={"bottomBox"} fill={"#8884d8"} />

					<Bar stackId={"a"} dataKey={"bar"} shape={<HorizonBar />} />

					<Bar stackId={"a"} dataKey={"topBox"} fill={"#8884d8"} />

					<Bar stackId={"a"} dataKey={"topWhisker"} shape={<DotBar />} />

					<Bar stackId={"a"} dataKey={"bar"} shape={<HorizonBar />} />

					<ZAxis type="number" dataKey="size" range={[0, 50]} />

					<Scatter
						dataKey="average"
						fill={"var(--color-destructive)"}
						stroke={"#FFF"}
					/>

					<XAxis dataKey="approver" dy={10} />

					<YAxis
						label={{
							style: { textAnchor: "middle" },
							value: "Approval Time (hours)",
							angle: -90,
							dx: -10,
						}}
					/>

					<ChartTooltip content={<ChartTooltipContent />} />
				</ComposedChart>
			</ChartContainer>

			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="leading-none text-muted-foreground">
					Showing for the last 4 months
				</div>
			</CardFooter>
		</Card>
	);
};
