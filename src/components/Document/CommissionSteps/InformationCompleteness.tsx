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
import { useDocType } from "@/contexts/luminaStore";

const ANIMATION_PROPS = {
	initial: { opacity: 0, y: "20%" },
	animate: { opacity: 1, y: 0 },
	transition: {
		type: "spring",
		duration: 0.4,
		delay: 0.4,
	},
} as const;

export function InformationCompleteness() {
	const docType = useDocType();

	const CHART_DATA =
		docType === SupportedDocTypes.Mortgage
			? [{ totalDocs: 33, present: 32, fill: "var(--chart-4)" }]
			: docType === SupportedDocTypes.Commission
				? [{ totalDocs: 9, present: 8, fill: "var(--chart-4)" }]
				: [{ totalDocs: 33, present: 32, fill: "var(--chart-4)" }];

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
									93%
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
																	className="fill-muted-foreground"
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

						{docType === SupportedDocTypes.Mortgage ? (
							<div className="flex flex-col col-span-2">
								<CardHeader className="items-center p-0">
									<CardTitle>Missing Documents and Informations</CardTitle>
								</CardHeader>

								<ul className="flex-1 flex-col pl-4 pt-2">
									<li className="list-decimal text-muted text-sm">
										<div className=" flex gap-2 justify-between items-start">
											<div className="flex flex-col">
												<p className="font-semibold">
													Special Power of Attorney (SPA)
												</p>

												<p className="text-xs">
													If someone else is acting on behalf of the applicant.
												</p>

												<ul className="list-decimal text-muted text-xs pl-8 mt-3 [&_li]:mt-2 border rounded-lg py-4">
													<h4 className="font-semibold mb-3 -ml-4">
														Missing Informations
													</h4>

													<li>
														Principal/Grantor Information (The person granting
														the power)
													</li>
													<li>
														Agent/Attorney-in-Fact Information (The person being
														granted the power)
													</li>
													<li>Specific Powers Granted</li>
												</ul>
											</div>

											<Button size="xs" variant="outline">
												Not applicable
											</Button>
										</div>
									</li>
								</ul>
							</div>
						) : (
							<div className="flex flex-col col-span-2">
								<CardHeader className="items-center p-0">
									<CardTitle>Missing Documents and Informations</CardTitle>
								</CardHeader>

								<ul className="flex-1 flex-col pl-4 pt-2">
									<li className="list-decimal text-muted text-sm">
										<div className=" flex gap-2 justify-between items-start">
											<div className="flex flex-col">
												<p className="font-semibold">BIR Form specifics</p>

												<p className="text-xs">
													Missing a specific information of the BIR Form.
												</p>

												<ul className="list-decimal text-muted text-xs pl-8 mt-3 [&_li]:mt-2 border rounded-lg py-4">
													<h4 className="font-semibold mb-3 -ml-4">
														Missing Informations
													</h4>

													<li>ATC (Alphanumeric Tax Code)</li>
												</ul>
											</div>

											<Button size="xs" variant="outline">
												Not applicable
											</Button>
										</div>
									</li>
								</ul>
							</div>
						)}
					</motion.div>
				</div>
			</AnimatePresence>
		</>
	);
}
