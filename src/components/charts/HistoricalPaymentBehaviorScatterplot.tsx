"use client";

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";

import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import type { DashboardItem } from "@/contexts/luminaStore";

export interface PaymentData {
	invoiceAmount: number;
	daysPaidLate: number;
	customer: string;
}

const customerColors: { [key: string]: string } = {
	"Alpha Industries": "var(--chart-1)",
	"Gamma Solutions": "var(--chart-3)",
	"Delta Systems": "var(--chart-4)",
	"Epsilon Group": "var(--chart-5)",
	"Beta Corp": "var(--chart-2)",
};

const usdAmountFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export const HistoricalPaymentBehaviorScatterplot: React.FC<{
	item: DashboardItem<Array<PaymentData>>;
}> = ({ item }) => {
	return (
		<Card className="border border-border-smooth/40 shadow-sm shadow-border-smooth/30">
			<CardHeader>
				<CardTitle>{item.name}</CardTitle>

				<CardDescription>{item.description}</CardDescription>
			</CardHeader>

			<ChartContainer config={item.chartConfig}>
				<ScatterChart margin={{ top: 20, right: 50, bottom: 20, left: 30 }}>
					<CartesianGrid strokeDasharray="3 3" />

					<XAxis
						tickFormatter={(value) => usdAmountFormatter.format(value)}
						dataKey="invoiceAmount"
						name="Invoice Amount"
						type="number"
						dy={10}
					/>

					<YAxis
						tickFormatter={(value) => `${value} `}
						dataKey="daysPaidLate"
						name="Days Paid Late"
						type="number"
						unit="days"
						dx={-10}
					/>

					<ChartTooltip
						content={
							<ChartTooltipContent
								labelFormatter={(_, payload) => payload[0]?.payload?.customer}
							/>
						}
					/>

					{Object.keys(
						item.data.reduce(
							(acc, curr) => ({ ...acc, [curr.customer]: true }),
							{},
						),
					).map((customer) => (
						<Scatter
							data={item.data.filter((item) => item.customer === customer)}
							fill={customerColors[customer] || "#000"}
							name={customer}
							key={customer}
							shape="circle"
						/>
					))}
				</ScatterChart>
			</ChartContainer>
		</Card>
	);
};
