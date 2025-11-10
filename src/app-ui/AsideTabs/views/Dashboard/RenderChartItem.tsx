"use client";

import type { ComponentProps } from "react";

import { Bar } from "@/components/charts/Bar";
import { BoxPlot } from "@/components/charts/BoxPlot";
import { GroupedBarChart } from "@/components/charts/GroupedBarChart";
import { Histogram } from "@/components/charts/Histogram";
import { Line } from "@/components/charts/Line";
import { MixedBar } from "@/components/charts/MixedBar";
import { Pareto } from "@/components/charts/Pareto";
import { Pie } from "@/components/charts/Pie";
import { Scatter } from "@/components/charts/Scatter";
import { Stacked } from "@/components/charts/Stacked";
import { StackedMixed } from "@/components/charts/StackedMixed";
import { ChartType } from "@/types/general-enums";
import type { DashboardItem } from "@/contexts/luminaStore";

export const RenderChartItem: React.FC<
	{ item: DashboardItem } & ComponentProps<"div">
> = ({ item, ...props }) => {
	if (item.chart) return <item.chart item={item} />;

	switch (item.chartType) {
		case ChartType.Bar:
			return <Bar key={item.uuid} item={item} {...props} />;

		case ChartType.GroupedBarChart:
			return <GroupedBarChart key={item.uuid} item={item} {...props} />;

		case ChartType.Pie:
			return <Pie key={item.uuid} item={item} {...props} />;

		case ChartType.Line:
			return <Line key={item.uuid} item={item} {...props} />;

		case ChartType.Scatter:
			return <Scatter key={item.uuid} item={item} {...props} />;

		case ChartType.Pareto:
			return <Pareto key={item.uuid} item={item} {...props} />;

		case ChartType.Stacked:
			return <Stacked key={item.uuid} item={item} {...props} />;

		case ChartType.MixedBar:
			return <MixedBar key={item.uuid} item={item} {...props} />;

		case ChartType.StackedMixed:
			return <StackedMixed key={item.uuid} item={item} {...props} />;

		case ChartType.BoxPlot:
			return <BoxPlot key={item.uuid} item={item} {...props} />;

		case ChartType.Histogram:
			return <Histogram key={item.uuid} item={item} {...props} />;

		default:
			return null;
	}
};
