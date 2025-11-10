import {
	approvedButUnpaidAmounts,
	boxPlots,
	countsAtEachStage,
	fakeDataForGroupedBarChart,
	histogramData,
	paretoData,
	potentialDuplicates,
	spendData,
	stackedVarianceData,
} from "@/components/charts/data";
import { HistoricalPaymentBehaviorScatterplot } from "@/components/charts/HistoricalPaymentBehaviorScatterplot";
import {
	makeDashboardItemUuid,
	makeDashboardProjectUuid,
} from "@/helpers/utils";
import { ChartType } from "@/types/general-enums";
import {
	customerData,
	customerPaymentRiskHeatmapData,
	sampleAgingData,
	sampleForecastData,
	samplePaymentData,
	sampleRegionRiskData,
	sampleRiskyCustomers,
} from "./chart-fake-data";
import { DepartmentRegionDefaultRisk } from "@/components/charts/DepartmentRegionDefaultRisk";
import { ProjectedDefaultLoss } from "@/components/charts/ProjectedDefaultLoss";
import { UnpaidAmountsAgingPieChart } from "@/components/charts/UnpaidAmountsAgingPieChart";
import { Top10RiskiestCustomers } from "@/components/charts/Top10RiskiestCustomers";
import { CustomerRiskScoreTrendLine } from "@/components/charts/CustomerRiskScoreTrendLine";
import { CustomerPaymentRiskHeatmap } from "@/components/charts/CustomerPaymentRiskHeatmap";
import type { DashboardProject } from "@/contexts/luminaStore";

export const FAKE_INVOICE_DASHBOARD_CHARTS: Array<DashboardProject> = [
	{
		uuid: makeDashboardProjectUuid(),
		name: "Invoices",
		items: [
			{
				chartType: ChartType.GroupedBarChart,
				description: "January - April 2024",
				data: fakeDataForGroupedBarChart,
				uuid: makeDashboardItemUuid(),
				name: "Invoice Analysis",
				chartConfig: {
					invoicesReceived: {
						label: "Invoices Received",
						color: "var(--chart-1)",
					},
					pendingValidation: {
						label: "Pending Validation",
						color: "var(--chart-2)",
					},
					pendingApproval: {
						label: "Pending Approval",
						color: "var(--chart-3)",
					},
					sentToQuickbook: {
						label: "Sent to Quickbook",
						color: "var(--chart-5)",
					},
				},
			},
			{
				description: "Current number of invoices at each stage",
				uuid: makeDashboardItemUuid(),
				name: "Counts at Each Stage",
				chartType: ChartType.Pie,
				data: countsAtEachStage,
				chartConfig: {
					stage: {
						label: "Stage",
					},
					count: {
						label: "Count",
					},
					Upload: {
						label: "Upload",
						color: "var(--chart-1)",
					},
					Validation: {
						label: "Validation",
						color: "var(--chart-2)",
					},
					"Waiting for Approval": {
						label: "Waiting for Approval",
						color: "var(--chart-3)",
					},
					Plaid: {
						label: "Plaid",
						color: "var(--chart-4)",
					},
				},
			},
			{
				description: "Cycle-time histogram (days from receipt to payment)",
				uuid: makeDashboardItemUuid(),
				name: "Cycle Time with SLA",
				chartType: ChartType.Histogram,
				data: histogramData,
				chartConfig: {
					days: {
						label: "Days Range",
					},
					count: {
						label: "Number of Invoices",
						color: "var(--chart-2)",
					},
					range: {
						label: "Range in Days",
					},
					target: {
						label: "Target SLA",
						color: "var(--chart-red)",
					},
				},
			},
			{
				description: "Median & outliers for approval time",
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.BoxPlot,
				name: "Approval Time",
				data: boxPlots,
				chartConfig: {
					boxplot: {
						label: "Approval Time",
						color: "var(--chart-1)",
					},
					average: {
						label: "Average",
						color: "var(--chart-2)",
					},
				},
			},
		],
	},
	{
		uuid: makeDashboardProjectUuid(),
		name: "Vendors",
		items: [
			{
				description:
					"Scatter plot (amount vs. frequency) with anomalies highlighted",
				uuid: makeDashboardItemUuid(),
				name: "Potential duplicates",
				chartType: ChartType.Scatter,
				data: potentialDuplicates,
				chartConfig: {},
			},
			{
				description:
					"Cumulative validated amounts that are pending approval by due date over the next 60 days",
				name: "Validated but Pending Approval",
				data: approvedButUnpaidAmounts,
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.Line,
				chartConfig: {
					amount: {
						label: "Amount",
					},
				},
			},
			{
				description: "Pareto analysis (80/20 rule) of spending by",
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.Pareto,
				name: "Spend Distribution",
				data: paretoData,
				chartConfig: {
					amount: {
						color: "var(--chart-1)",
						label: "Amount",
					},
					cumulative: {
						label: "Cumulative %",
						color: "var(--chart-4)",
					},
				},
			},
			{
				description:
					"Positive values represent favorable variances (under budget), while negative values represent unfavorable variances (overbudget)",
				name: "Variance Breakdown by Cost Center",
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.Stacked,
				data: stackedVarianceData,
				chartConfig: {
					labor: {
						color: "var(--chart-1)",
						label: "Labor",
					},
					equipment: {
						label: "Equipment",
						color: "var(--chart-2)",
					},
					services: {
						label: "Services",
						color: "var(--chart-3)",
					},
				},
			},
			{
				name: "Total Spend By Cost Center/Department",
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.MixedBar,
				data: spendData,
				description: "",
				chartConfig: {
					costCenter: {
						label: "Cost Center",
						color: "var(--chart-1)",
					},
					amount: {
						color: "var(--chart-2)",
						label: "Amount",
					},
				},
			},
		],
	},
	{
		uuid: makeDashboardProjectUuid(),
		name: "Customer Risk",
		items: [
			{
				description:
					"Instantly see which customers are becoming risky over time. Redder means more overdue invoices, greener means timely payments.",
				name: "Customer Payment Risk Heatmap",
				data: customerPaymentRiskHeatmapData,
				chart: CustomerPaymentRiskHeatmap,
				uuid: makeDashboardItemUuid(),
				chartConfig: {},
			},
			{
				description:
					"Shows deterioration or improvement at a glance for Acme Corp.",
				name: "Customer Risk Score Trend Line",
				chart: CustomerRiskScoreTrendLine,
				uuid: makeDashboardItemUuid(),
				data: customerData,
				chartConfig: {
					riskScore: {
						label: "Risk Score",
					},
				},
			},
			{
				description: "Quickly identify 'problem accounts'.",
				name: "Top 10 Riskiest Customers",
				chart: Top10RiskiestCustomers,
				uuid: makeDashboardItemUuid(),
				data: sampleRiskyCustomers,
				chartConfig: {
					riskScore: {
						label: "Risk Score",
					},
				},
			},
			{
				description: "How much money is at risk and aging.",
				chart: UnpaidAmountsAgingPieChart,
				uuid: makeDashboardItemUuid(),
				name: "Unpaid Amounts Aging",
				data: sampleAgingData,
				chartConfig: {
					name: {
						label: "Name",
					},
					value: {
						label: "Value",
					},
					"0-30 days": {
						label: "0-30 days",
						color: "var(--chart-1)",
					},
					"31-60 days": {
						label: "31-60 days",
						color: "var(--chart-2)",
					},
					"61-90 days": {
						label: "61-90 days",
						color: "var(--chart-3)",
					},
					"90+ days": {
						label: "90+ days",
						color: "var(--chart-4)",
					},
				},
			},
			{
				description: "Visually shows abnormal payment patterns.",
				name: "Historical Payment Behavior Scatterplot",
				chart: HistoricalPaymentBehaviorScatterplot,
				uuid: makeDashboardItemUuid(),
				data: samplePaymentData,
				chartConfig: {},
			},
			{
				description: "Default Risk of missing payments by region.",
				chart: DepartmentRegionDefaultRisk,
				name: "Default Risk by Region",
				uuid: makeDashboardItemUuid(),
				data: sampleRegionRiskData,
				chartConfig: {
					"North America": {
						label: "North America",
						color: "var(--chart-1)",
					},
					Europe: {
						label: "Europe",
						color: "var(--chart-2)",
					},
					Asia: {
						label: "Asia",
						color: "var(--chart-3)",
					},
					Africa: {
						label: "Africa",
						color: "var(--chart-4)",
					},
					"South America": {
						label: "Africa",
						color: "var(--chart-0)",
					},
					defaultRisk: {
						label: "Default risk",
					},
				},
			},
			{
				description:
					"Estimated default risk if current payment patterns continue.",
				name: "Projected Default Loss",
				uuid: makeDashboardItemUuid(),
				chart: ProjectedDefaultLoss,
				data: sampleForecastData,
				chartConfig: {
					projectedLoss: {
						label: "Projected Loss",
					},
				},
			},
		],
	},
];
