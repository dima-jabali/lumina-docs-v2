"use client";

export enum GeneralIndexStatus {
	NotStarted = "NOT_STARTED",
	InProgress = "IN_PROGRESS",
	TimedOut = "TIMED_OUT",
	Complete = "COMPLETE",
	Aborted = "ABORTED",
	Failed = "FAILED",
}

export enum FilterArchived {
	ONLY_NON_ARCHIVED = "False",
	ONLY_ARCHIVED = "True",
	ALL = "All",
}

export const FILTER_ARCHIVED_OPTIONS = Object.values(FilterArchived);

export enum View {
	TableOfDocs,
	Document,
}

export enum ChartType {
	GroupedBarChart = "grouped-bar",
	StackedMixed = "stacked-mixed",
	Histogram = "histogram",
	MixedBar = "mixed-bar",
	Quadrant = "quadrant",
	BoxPlot = "boxplot",
	Scatter = "scatter",
	Stacked = "stacked",
	Pareto = "pareto",
	Line = "line",
	Pie = "pie",

	Donut = "donut",
	Area = "area",
	Bar = "bar",
}

export enum SupportedDocTypes {
	EmploymentVerification = "Employment Verification",
	BankStatement = "Bank Statement",
	UtilityBill = "Utility Bill",
	Commission = "Commission",
	TaxReturn = "Tax Return",
	Mortgage = "Mortgage",
	Invoice = "Invoice",
	Receipt = "Receipt",
	Payslip = "Payslip",
	W2 = "W2",
}
