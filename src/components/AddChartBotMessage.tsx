import { Bot } from "lucide-react";
import { useEffect, useState } from "react";

import { RenderChartItem } from "@/app-ui/AsideTabs/views/Dashboard/RenderChartItem";
import { makeDashboardItemUuid } from "@/helpers/utils";
import { useLuminaDashboardUuid } from "@/hooks/url/use-lumina-dashboard-uuid";
import { DocumentProcessingVolumeChart } from "./Document/CommissionSteps/charts/DocumentProcessingVolumeChart";
import { FakeAIStream } from "./FakeAIStream";
import { LOADER } from "./Loader";
import { MessageFooter } from "./MessageFooter";
import { AMOUNT_SUBSTRING, LOAN_RISK_SUBSTRING } from "./MessageInput";
import { MortgageLoanRiskExposureByRegion } from "./mortgage-charts/MortgageLoanRiskExposureByRegion";
import type { Message } from "@/types/organization";
import { ChartType } from "@/types/general-enums";
import { outstandingAmountsData } from "@/lib/chart-fake-data";
import { globalStore, type DashboardItem } from "@/contexts/luminaStore";

type Props = {
	message: Message;
};

enum Step {
	FakingMessage,
	InitialLoad,
	Finished,
}

const loanRiskDashboardItem: DashboardItem = {
	name: "Mortgage Loan Risk Exposure by Region",
	chart: MortgageLoanRiskExposureByRegion,
	uuid: makeDashboardItemUuid(),
	description: "",
	chartConfig: {},
	data: [],
};

const volumeDashboardItem: DashboardItem = {
	name: "Volume of Documents Processed per Period (Manual vs. IDP)",
	chart: DocumentProcessingVolumeChart,
	description: "See IDP scalability",
	uuid: makeDashboardItemUuid(),
	chartConfig: {},
	data: [],
};

const amountDashboardItem: DashboardItem = {
	name: "Outstanding Amounts by Department",
	chartType: ChartType.StackedMixed,
	uuid: makeDashboardItemUuid(),
	data: outstandingAmountsData,
	description: "",
	chartConfig: {
		sales: {
			label: "Sales",
			color: "#211C84",
		},
		marketing: {
			label: "Marketing",
			color: "#4D55CC",
		},
		engineering: {
			label: "Engineering",
			color: "#7A73D1",
		},
		support: {
			label: "Support",
			color: "#B5A8D5",
		},
	},
};

export function AddChartBotMessage({ message }: Props) {
	const [step, setStep] = useState(Step.InitialLoad);

	const [luminaDashboardUuid] = useLuminaDashboardUuid();

	const chart = message.text.includes(LOAN_RISK_SUBSTRING)
		? loanRiskDashboardItem
		: message.text.includes(AMOUNT_SUBSTRING)
			? amountDashboardItem
			: volumeDashboardItem;

	useEffect(() => {
		const timeoutToFakeMessage = setTimeout(() => {
			setStep(Step.FakingMessage);
		}, 3_000);
		const timeoutToFinish = setTimeout(
			() => {
				setStep(Step.Finished);
			},
			message.text.includes(LOAN_RISK_SUBSTRING) ? 18_000 : 12_000,
		);

		return () => {
			clearTimeout(timeoutToFakeMessage);
			clearTimeout(timeoutToFinish);
		};
	}, [message.text]);

	const handleAddChart = () => {
		if (!luminaDashboardUuid) return;

		globalStore.setState((prev) => {
			const dashboardProjectIndex = prev.dashboardList.findIndex(
				(d) => d.uuid === luminaDashboardUuid,
			);
			const dashboardProject = prev.dashboardList[dashboardProjectIndex];

			if (!dashboardProject) return prev;

			const nextDashboardProject = { ...dashboardProject };

			const next: Partial<typeof prev> = {
				dashboardList: [...prev.dashboardList],
			};

			next.dashboardList![dashboardProjectIndex] = nextDashboardProject;

			nextDashboardProject.items = [...nextDashboardProject.items, chart];

			return next;
		});
	};

	const date = new Date(message.createdAt);
	const minutes = `${date.getMinutes()}`.padStart(2, "0");
	const utcDate = date.toUTCString();
	const hour = date.getHours();

	return (
		<article
			className="flex w-full max-w-full group list-none gap-2.5 word-break pr-2.5 min-w-24"
			data-uuid={message.uuid}
			contentEditable={false}
			title="AI Response"
			data-ai-response
		>
			<div className="size-8 rounded-full bg-indigo-800 p-1.5">
				<Bot className="size-5 text-white" />
			</div>

			{step === Step.InitialLoad ? (
				<div className="rounded-lg w-fit h-fit flex items-center justify-center my-auto">
					{LOADER}
				</div>
			) : (
				<div
					className="flex w-full flex-col gap-1 max-w-full simple-scrollbar"
					contentEditable={false}
				>
					<section
						className="flex items-center gap-2"
						aria-label="Name and hour"
						contentEditable={false}
					>
						<p className="text-sm font-bold" contentEditable={false}>
							Bot
						</p>

						<p
							className="text-xs tabular-nums text-primary"
							contentEditable={false}
							title={utcDate}
						>
							{hour}:{minutes}
						</p>
					</section>

					{step === Step.FakingMessage ? (
						<FakeAIStream
							className="min-h-5 font-var-inter whitespace-pre-wrap break-words"
							fullText={message.text}
							characterPerStep={2}
							key={message.uuid}
							startFaking
							speed={20}
						/>
					) : null}

					{step === Step.Finished ? (
						<>
							<pre className="font-var-inter whitespace-pre-wrap break-words mb-4">
								{message.text}
							</pre>

							<div className="flex-none flex w-full">
								<RenderChartItem
									className="[grid-column:span_1] max-w-full simple-scrollbar"
									key={chart.uuid}
									item={chart}
								/>
							</div>

							<button
								className="rounded-lg p-2 hover:bg-green-200 active:bg-green-300 bg-green-100 border border-green-300 w-fit text-xs text-green-600 font-semibold active:text-green-900 active:border-green-900 mb-4"
								onClick={handleAddChart}
							>
								Add to dashboard
							</button>

							<MessageFooter />
						</>
					) : null}
				</div>
			)}
		</article>
	);
}
