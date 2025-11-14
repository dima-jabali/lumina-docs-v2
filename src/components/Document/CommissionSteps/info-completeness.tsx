"use client";

import { AnimatePresence, motion } from "motion/react";
import {
	Label,
	PolarGrid,
	PolarRadiusAxis,
	RadialBar,
	RadialBarChart,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { SupportedDocTypes } from "@/types/general-enums";
import { HandleShowChatMessagesWhenVisible } from "../HandleShowChatMessagesWhenVisible";
import {
	globalStore,
	useDocType,
	type DocumentType,
	type LuminaDocsContextType,
} from "@/contexts/luminaStore";
import { titleCase } from "scule";
import {
	createISODate,
	createMessageUuid,
	type Message,
} from "@/types/organization";

// Type definitions (assuming they exist in your project)
type MissingDocInfo = {
	docName: string;
	description: string;
	missingFields: string[];
	isApplicableButton: boolean;
	chatMessages: Array<Message>;
};

const ANIMATION_PROPS = {
	initial: { opacity: 0, y: "20%" },
	animate: { opacity: 1, y: 0 },
	transition: {
		type: "spring",
		duration: 0.4,
		delay: 0.4,
	},
} as const;

// --- Helper Functions to extract required fields ---

/**
 * Finds the schema for the primary document type (e.g., Mortgage) and identifies a required field that is 'missing' for the demo.
 * In a real app, this would check actual extracted data against the schema.
 */
const getMissingInformationDetails = (
	docType: SupportedDocTypes,
	documentTypes: Array<DocumentType>,
): MissingDocInfo[] => {
	return [];

	const docSchema = documentTypes.find((d) => d.id === docType);

	if (!docSchema || !docSchema.schema) {
		return [];
	}

	if (docType === SupportedDocTypes.Mortgage) {
		return [
			{
				docName: titleCase("expiry_date"),
				description:
					"Information from file 'BUILDING PERMIT & BILL OF MATERIALS' is incomplete.",
				missingFields: ["expiry_date"],
				isApplicableButton: false, // Cannot be 'Not applicable' for a primary required field
				chatMessages: [
					{
						sender: "bot" as const,
						showFooter: true,
						showSender: true,
						createdAt: createISODate(),
						toggleText: "",
						statusIndex: 0,
						statuses: [
							{
								status: "success" as const,
							},
						],
						type: "default",
						uuid: createMessageUuid(),
						text: "Hello. I'm reviewing the 'BUILDING PERMIT & BILL OF MATERIALS' document (ID: BP-482-2025) for processing. We've run into a minor blocker on the permit section.",
					},
					{
						sender: "bot" as const,
						showFooter: true,
						showSender: true,
						createdAt: createISODate(),
						toggleText: "",
						statusIndex: 0,
						statuses: [
							{
								status: "success" as const,
							},
						],
						type: "default",
						uuid: createMessageUuid(),
						text: 'The mandatory field **"expiry\_date"** for the Building Permit is currently missing. For regulatory compliance and scheduling accuracy, we need this date to confirm the permit\'s active status before we can greenlight materials ordering.',
					},
					{
						sender: "bot" as const,
						showFooter: true,
						showSender: true,
						createdAt: createISODate(),
						toggleText: "",
						statusIndex: 0,
						statuses: [
							{
								status: "success" as const,
							},
						],
						type: "default",
						uuid: createMessageUuid(),
						text: "Could you please provide the official expiry date of the permit? Once added, the Bill of Materials can be finalized and submitted immediately.",
					},
					{
						sender: "user" as const,
						showFooter: true,
						showSender: true,
						createdAt: createISODate(),
						toggleText: "",
						statusIndex: 0,
						statuses: [
							{
								status: "success" as const,
							},
						],
						type: "default",
						uuid: createMessageUuid(),
						text: "My apologies! That detail must have been overlooked. The permit expiry date is **2026-06-30**.",
					},
					{
						sender: "bot" as const,
						showFooter: true,
						showSender: true,
						createdAt: createISODate(),
						toggleText: "",
						statusIndex: 0,
						statuses: [
							{
								status: "success" as const,
							},
						],
						type: "default",
						uuid: createMessageUuid(),
						text: "Confirmed. Adding `expiry_date: 2026-06-30` to the Permit record. Processing the final submission now. Thank you for the quick response!",
					},
				],
			},
			{
				docName: titleCase("contractor_name"),
				description:
					"Information from file 'BUILDING PERMIT & BILL OF MATERIALS' is incomplete.",
				missingFields: ["contractor_name"],
				isApplicableButton: false, // Cannot be 'Not applicable' for a primary required field
				chatMessages: [],
			},
		];
	}

	// For other types, use the original SPA example
	return [
		{
			docName: "Special Power of Attorney (SPA)",
			description: "If someone else is acting on behalf of the applicant.",
			missingFields: [
				"Principal/Grantor Information (The person granting the power)",
				"Agent/Attorney-in-Fact Information (The person being granted the power)",
				"Specific Powers Granted",
			],
			isApplicableButton: true,
			chatMessages: [],
		},
	];
};

/**
 * Finds the missing REQUIRED document from the applicationList's documentTypesId array.
 * In a real app, this would check the applicationList's required docs against the actual uploaded documents.
 */
const getMissingDocumentDetails = (
	docType: SupportedDocTypes,
	applicationList: LuminaDocsContextType["applicationList"],
): MissingDocInfo[] => {
	return [];

	const application = applicationList.find((app) => app.id === docType);

	if (!application) {
		return [];
	}

	// We'll fake that one of the required support documents is missing.
	// Required support docs for Mortgage are: EmploymentVerification, Payslip, TaxReturn, UtilityBill.
	// We'll assume the UtilityBill is missing entirely, as per the screenshot SPA example.
	const missingDoc = "Utility Bill"; // Faking 'Utility Bill' as the missing required document.

	return [
		{
			docName: missingDoc,
			description:
				"A required supporting document for the application is missing.",
			missingFields: [],
			isApplicableButton: false, // Cannot be 'Not applicable' as it's a required document type
			chatMessages:
				application.validationRules.find((rule) => rule.chatMessages)
					?.chatMessages ?? [],
		},
	];
};

export function InfoCompleteness() {
	const docType = useDocType()!;

	// Hardcoding values to match the screenshot and application context
	const PRESENT_DOCS = 33;
	const TOTAL_DOCS = 33;
	const percentage = (PRESENT_DOCS / TOTAL_DOCS) * 100;

	const CHART_DATA = [
		{
			totalDocs: TOTAL_DOCS,
			present: PRESENT_DOCS,
			fill: `var(--chart-${percentage === 100 ? 3 : 4})`,
		},
	];

	const applicationList = globalStore.use.applicationList();
	const documentTypes = globalStore.use.documentTypes();

	const missingInformationDetails = getMissingInformationDetails(
		docType,
		documentTypes,
	);
	const missingDocumentDetails = getMissingDocumentDetails(
		docType,
		applicationList,
	);

	const allMissingDetails = [
		...missingDocumentDetails,
		...missingInformationDetails,
	];

	function handleGoToEmailThread(info: MissingDocInfo) {
		globalStore.setState({
			emailThreadChatMessages: info.chatMessages,
			isChatOpen: true,
		});
	}

	// Applying the request to render component props on a new line
	return (
		<>
			<HandleShowChatMessagesWhenVisible />

			<AnimatePresence>
				<div className="grid grid-cols-1 @[800px]:grid-cols-2 gap-4">
					<motion.div {...ANIMATION_PROPS}>
						<Card className="h-fit">
							<CardHeader className="relative">
								<CardDescription>
									Percentage of Information Present
								</CardDescription>

								<CardTitle className="text-2xl font-semibold tabular-nums">
									{percentage.toFixed(0)}%
								</CardTitle>
							</CardHeader>
						</Card>
					</motion.div>

					<motion.div {...ANIMATION_PROPS}>
						<Card className="flex flex-col">
							<CardHeader className="items-center pb-0">
								<CardDescription>Number of Documents Present</CardDescription>
							</CardHeader>

							<CardContent className="flex-1 pb-0">
								<ChartContainer
									className="mx-auto aspect-square max-h-[250px]"
									config={{
										totalDocs: {
											color: "var(--chart-1)",
										},
										present: {
											color: "var(--chart-1)",
										},
									}}
								>
									<RadialBarChart
										endAngle={
											((CHART_DATA[0]!.present * 100) /
												CHART_DATA[0]!.totalDocs) *
											3.6
										}
										data={CHART_DATA}
										outerRadius={110}
										innerRadius={80}
										startAngle={0}
									>
										<PolarGrid
											className="first:fill-muted/10 last:fill-background"
											polarRadius={[86, 74]}
											radialLines={false}
											gridType="circle"
											stroke="none"
										/>

										<RadialBar dataKey="present" background cornerRadius={10} />

										<PolarRadiusAxis
											tickLine={false}
											axisLine={false}
											tick={false}
										>
											<Label
												content={({ viewBox }) => {
													if (viewBox && "cx" in viewBox && "cy" in viewBox) {
														return (
															<text
																dominantBaseline="middle"
																textAnchor="middle"
																x={viewBox.cx}
																y={viewBox.cy}
															>
																<tspan
																	className="fill-foreground text-4xl font-bold"
																	x={viewBox.cx}
																	y={viewBox.cy}
																>
																	{CHART_DATA[0]!.present}/
																	{CHART_DATA[0]!.totalDocs}
																</tspan>

																<tspan
																	className="fill-primary"
																	y={(viewBox.cy || 0) + 24}
																	x={viewBox.cx}
																>
																	Present docs
																</tspan>
															</text>
														);
													}

													return null;
												}}
											/>
										</PolarRadiusAxis>
									</RadialBarChart>
								</ChartContainer>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div {...ANIMATION_PROPS}>
						<Separator className="col-span-2 my-4" />

						<div className="flex flex-col col-span-2">
							<CardHeader className="items-center p-0">
								<CardTitle>Missing Documents/Informations</CardTitle>
							</CardHeader>

							<ul className="flex-1 flex-col pl-4 pt-2">
								{allMissingDetails.map((item, index) => (
									<li
										className="list-decimal text-primary text-sm my-4"
										key={index}
									>
										<div className="flex gap-2 justify-between items-start">
											<div className="flex flex-col">
												<p className="font-semibold">{item.docName}</p>

												<p className="text-xs">{item.description}</p>

												{item.missingFields.length > 0 && (
													<ul className="list-decimal text-primary text-xs pl-8 mt-3 [&_li]:mt-2 border rounded-lg py-4">
														<h4 className="font-semibold mb-3 -ml-4">
															Missing Informations
														</h4>

														{item.missingFields.map((field, fIndex) => (
															<li key={fIndex}>{titleCase(field)}</li>
														))}
													</ul>
												)}
											</div>

											{item.isApplicableButton && (
												<Button size="xs" variant="outline">
													Not applicable
												</Button>
											)}
											{!item.isApplicableButton &&
												item.docName !== "Lender Details" && (
													<Button size="xs" variant="destructive">
														Missing
													</Button>
												)}
										</div>

										<button
											className="flex flex-col gap-1 mt-2 p-2 rounded-md h-auto bg-green-300/30 border text-xs border-green-300 text-green-700 hover:bg-green-300/40 active:bg-green-300/60"
											onClick={() => handleGoToEmailThread(item)}
										>
											Email thread
										</button>
									</li>
								))}
							</ul>
						</div>
					</motion.div>
				</div>
			</AnimatePresence>
		</>
	);
}
