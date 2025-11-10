"use client";

import { Check, DollarSign, PieChart, X } from "lucide-react";
import { useState, type ComponentProps, type PropsWithChildren } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { InputWithIcons } from "../ui/input";
import { FADE_IN_MOTION_ANIMATION_PROPS } from "@/lib/utils";
import { HandleShowChatMessagesWhenVisible } from "./HandleShowChatMessagesWhenVisible";

const Label: React.FC<PropsWithChildren & ComponentProps<"label">> = ({
	children,
	...props
}) => (
	<label
		className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		{...props}
	>
		{children}
	</label>
);

export default function SpendApprovalCalculator() {
	const [departmentBudget, setDepartmentBudget] = useState(100_000);
	const [spendAmount, setSpendAmount] = useState(4_082.43);
	const [discretionaryLimit, setDiscretionaryLimit] = useState(10_000);
	const [monthlySpendCap, setMonthlySpendCap] = useState(20_000);
	const [currentMonthSpend, setCurrentMonthSpend] = useState(10_000);
	const [budgetRemaining, setBudgetRemaining] = useState(20_000 - 4_082.43);

	// Calculate if spend is within budget
	const isWithinRemainingBudget = spendAmount <= budgetRemaining;

	// Calculate if spend is within discretionary limit
	const isWithinDiscretionaryLimit = spendAmount <= discretionaryLimit;

	// Calculate if spend would exceed monthly cap
	const projectedMonthlyTotal = currentMonthSpend + spendAmount;
	const isWithinMonthlyCap = projectedMonthlyTotal <= monthlySpendCap;

	// Calculate percentage of budget remaining that would be used
	const percentOfRemainingBudget = (spendAmount / budgetRemaining) * 100;

	// Calculate percentage of monthly cap that would be used
	const percentOfMonthlyCap = (projectedMonthlyTotal / monthlySpendCap) * 100;

	// Final approval determination
	const isApproved =
		isWithinRemainingBudget && isWithinDiscretionaryLimit && isWithinMonthlyCap;

	return (
		<>
			<HandleShowChatMessagesWhenVisible />

			<AnimatePresence>
				<motion.div {...FADE_IN_MOTION_ANIMATION_PROPS}>
					<Card>
						<CardHeader className="">
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="text-xl">
										Department Spend Approval Calculator
									</CardTitle>
									<CardDescription>
										Verify if a departmental expense is within acceptable limits
									</CardDescription>
								</div>
							</div>
						</CardHeader>

						<CardContent className="pt-6 space-y-6">
							{/* Input Section */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div>
										<Label htmlFor="departmentBudget">
											Total Department Budget
										</Label>

										<div className="relative">
											<InputWithIcons
												iconLeft={
													<DollarSign className="size-4 text-primary" />
												}
												id="departmentBudget"
												type="number"
												value={departmentBudget}
												onChange={(e) =>
													setDepartmentBudget(Number(e.target.value))
												}
											/>
										</div>
									</div>

									<div>
										<Label htmlFor="budgetRemaining">Budget Remaining</Label>

										<div className="relative">
											<InputWithIcons
												iconLeft={
													<DollarSign className="size-4 text-primary" />
												}
												id="budgetRemaining"
												type="number"
												value={budgetRemaining}
												onChange={(e) =>
													setBudgetRemaining(Number(e.target.value))
												}
											/>
										</div>
									</div>

									<div>
										<Label htmlFor="spendAmount">Proposed Spend Amount</Label>

										<div className="relative">
											<InputWithIcons
												id="spendAmount"
												iconLeft={
													<DollarSign className="size-4 text-primary" />
												}
												type="number"
												value={spendAmount}
												onChange={(e) => setSpendAmount(Number(e.target.value))}
											/>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<Label htmlFor="discretionaryLimit">
											Discretionary Spend Limit
										</Label>

										<div className="relative">
											<InputWithIcons
												iconLeft={
													<DollarSign className="size-4 text-primary" />
												}
												id="discretionaryLimit"
												type="number"
												value={discretionaryLimit}
												onChange={(e) =>
													setDiscretionaryLimit(Number(e.target.value))
												}
											/>
										</div>
									</div>

									<div>
										<Label htmlFor="monthlySpendCap">Monthly Spend Cap</Label>

										<div className="relative">
											<InputWithIcons
												iconLeft={
													<DollarSign className="size-4 text-primary" />
												}
												id="monthlySpendCap"
												type="number"
												value={monthlySpendCap}
												onChange={(e) =>
													setMonthlySpendCap(Number(e.target.value))
												}
											/>
										</div>
									</div>

									<div>
										<Label htmlFor="currentMonthSpend">
											Current Month Spend
										</Label>

										<div className="relative">
											<InputWithIcons
												iconLeft={
													<DollarSign className="size-4 text-primary" />
												}
												id="currentMonthSpend"
												type="number"
												value={currentMonthSpend}
												onChange={(e) =>
													setCurrentMonthSpend(Number(e.target.value))
												}
											/>
										</div>
									</div>
								</div>
							</div>

							<Separator />

							{/* Calculation Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-medium flex items-center gap-2">
									<PieChart className="h-5 w-5" />
									Calculation Breakdown
								</h3>

								<div className="grid grid-cols-2 gap-4">
									<Card
										className={`border-l-4 ${isWithinRemainingBudget ? "border-l-green-500" : "border-l-red-500"}`}
									>
										<CardContent className="p-4 text-xs flex flex-col h-full">
											<h4 className="font-medium mb-2">Budget Check</h4>

											<div className="space-y-1 flex flex-col h-full">
												<p className="text-muted">
													Spend Amount: ${spendAmount.toLocaleString()}
												</p>
												<p className="text-muted">
													Budget Remaining: ${budgetRemaining.toLocaleString()}
												</p>
												<Separator className="my-2" />
												<p className="font-medium mt-auto">
													{isWithinRemainingBudget ? (
														<span className="text-green-600 flex items-center gap-1">
															<Check className="h-4 w-4" /> Within Budget
														</span>
													) : (
														<span className="text-red-600 flex items-center gap-1">
															<X className="h-4 w-4" /> Exceeds Budget
														</span>
													)}
												</p>
												<p className="text-slate-500">
													Uses {percentOfRemainingBudget.toFixed(1)}% of
													remaining budget
												</p>
											</div>
										</CardContent>
									</Card>

									<Card
										className={`border-l-4 ${isWithinMonthlyCap ? "border-l-green-500" : "border-l-red-500"}`}
									>
										<CardContent className="p-4 text-xs flex flex-col h-full">
											<h4 className="font-medium mb-2">Monthly Cap</h4>

											<div className="space-y-1 flex flex-col h-full">
												<p className="text-muted">
													Current Month: ${currentMonthSpend.toLocaleString()}
												</p>
												<p className="text-muted">
													+ This Spend: ${spendAmount.toLocaleString()}
												</p>
												<p className="text-muted">
													= Projected Total: $
													{projectedMonthlyTotal.toLocaleString()}
												</p>
												<p className="text-muted">
													Monthly Cap: ${monthlySpendCap.toLocaleString()}
												</p>
												<Separator className="my-2" />
												<p className="font-medium mt-auto">
													{isWithinMonthlyCap ? (
														<span className="text-green-600 flex items-center gap-1">
															<Check className="h-4 w-4" /> Within Cap
														</span>
													) : (
														<span className="text-red-600 flex items-center gap-1">
															<X className="h-4 w-4" /> Exceeds Cap
														</span>
													)}
												</p>
												<p className="text-slate-500">
													Would use {percentOfMonthlyCap.toFixed(1)}% of monthly
													cap
												</p>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>

							<Separator />

							{/* Final Determination */}
							<Alert
								className={
									isApproved
										? "bg-green-50 border-green-200"
										: "bg-red-50 border-red-200"
								}
							>
								<AlertTitle
									className={isApproved ? "text-green-800" : "text-red-800"}
								>
									{isApproved ? "Spend Approved" : "Spend Not Approved"}
								</AlertTitle>
								<AlertDescription
									className={isApproved ? "text-green-700" : "text-red-700"}
								>
									{isApproved
										? "This spend meets all departmental budget requirements and can proceed."
										: "This spend does not meet one or more departmental budget requirements."}
								</AlertDescription>
							</Alert>
						</CardContent>

						<CardFooter className="flex justify-between">
							<Button variant="outline">Reset</Button>
							<Button>Generate Report</Button>
						</CardFooter>
					</Card>
				</motion.div>
			</AnimatePresence>
		</>
	);
}
