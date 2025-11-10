import { ShieldAlert, ShieldX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { DefaultSuspenseAndErrorBoundary } from "@/components/DefaultSuspenseAndErrorBoundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { HandleShowChatMessagesWhenVisible } from "../HandleShowChatMessagesWhenVisible";
import { CurrentRealEstateLoanExposureVsLimitChart } from "./charts/CurrentRealEstateLoanExposureVsLimitChart";
import { RealEstateStressTestChart } from "./charts/RealEstateStressTestChart";

const ANIMATION_PROPS = {
	initial: { opacity: 0, y: "20%" },
	animate: { opacity: 1, y: 0 },
	transition: {
		type: "spring",
		duration: 0.4,
		delay: 0.4,
	},
} as const;

export function RegulatoryCompliance() {
	return (
		<>
			<HandleShowChatMessagesWhenVisible />

			<AnimatePresence>
				<motion.section
					className="flex flex-col items-center gap-4 relative"
					{...ANIMATION_PROPS}
				>
					<div className="flex flex-col min-h-32 w-full gap-6 text-muted text-sm">
						<fieldset>
							<h3>
								<span className="font-semibold">Compliance Overall Score:</span>{" "}
								<span>98.2%</span>
							</h3>

							<h3>
								<span className="font-semibold">Alerts:</span> 3 High Priority,
								2 Medium Priority
							</h3>
						</fieldset>

						<fieldset>
							<label className="text-xs" htmlFor="bank-name">
								Bank Name
							</label>

							<Input id="bank-name" defaultValue="Pacific Bank of Manila" />
						</fieldset>

						<div className="flex flex-col items-center gap-2 text-xs text-muted rounded-md border-none border-border-smooth/20 p-2 shadow-black/10 py-4">
							<h5 className="text-sm font-semibold">Summary Metrics</h5>

							<ul className="flex flex-col gap-0 [&_span]:font-semibold">
								<li>
									<span>Suspicious Transaction Reports (STRs) Generated:</span>{" "}
									2
								</li>

								<li>
									<span>Covered Transaction Reports (CTRs) Generated:</span> 5
								</li>

								<li>
									<span>Documents Flagged for AMLC Review:</span> 12
								</li>
							</ul>
						</div>

						<section className="flex flex-col gap-8 border border-border-smooth/20 rounded-md p-3">
							<header className="w-full text-center">
								<h3 className="font-bold pt-2">AMLA Compliance Check</h3>
							</header>

							<fieldset className="flex flex-col gap-0.5">
								<h3 className="font-semibold">Documents</h3>

								<table cellPadding="0" cellSpacing="0">
									<thead className="rounded-md">
										<tr className="bg-muted-strong text-muted rounded-md">
											<th className="font-semibold px-2 py-1 not-first:border-l border-border-white first:rounded-s last:rounded-e">
												Document ID
											</th>
											<th className="font-semibold px-2 py-1 not-first:border-l border-border-white first:rounded-s last:rounded-e">
												Document Type
											</th>
											<th className="font-semibold px-2 py-1 not-first:border-l border-border-white first:rounded-s last:rounded-e">
												Customer/Entity Name
											</th>
										</tr>
									</thead>

									<tbody className="text-sm [&_td]:px-3 [&_td]:py-0.5 [&_tr]:rounded [&_tr]:even:bg-muted-strong/30">
										<tr>
											<td>LoanApp_001</td>
											<td>Account Opening Form</td>
											<td>Juan Dela Cruz</td>
										</tr>

										<tr>
											<td>AcctOpen_045</td>
											<td>Loan Application</td>
											<td>Sampaguita Dev. Corp.</td>
										</tr>

										<tr>
											<td>REDeed_012</td>
											<td>Transaction Record</td>
											<td>Sampaguita Dev. Corp.</td>
										</tr>
									</tbody>
								</table>
							</fieldset>

							<Separator />

							<fieldset className="flex flex-col gap-2.5">
								<h3 className="font-semibold">Detected Issues</h3>

								<fieldset className="pl-8">
									<header className="flex gap-2 items-center">
										<ShieldX className="size-4 stroke-destructive" />

										<h4 className="font-semibold">Red Flags (Critical)</h4>
									</header>

									<ul className="pl-4.5 list-disc">
										<li>Incomplete KYC Information</li>
										<li>Inconsistent Transaction Behavior</li>
										<li>Beneficial Owner Mismatch</li>
									</ul>
								</fieldset>

								<fieldset className="pl-8 pt-2">
									<header className="flex gap-2 items-center">
										<ShieldAlert className="size-4 stroke-amber-500" />

										<h4 className="font-semibold">Warnings (Moderate):</h4>
									</header>

									<ul className="pl-4.5 list-disc">
										<li>Unusual Transaction Volume/Frequency</li>
										<li>Missing Supporting Document</li>
									</ul>
								</fieldset>
							</fieldset>

							<Separator />

							<fieldset className="flex flex-col gap-2">
								<h3>
									<span className="font-semibold">Status:</span> Needs Review
								</h3>

								<div className="flex gap-2 items-center">
									<Button className="text-xs" variant="outline" size="sm">
										View Document & Details
									</Button>
									<Button className="text-xs" variant="outline" size="sm">
										Generate STR
									</Button>
									<Button className="text-xs" variant="outline" size="sm">
										Generate CTR
									</Button>
									<Button className="text-xs" variant="success" size="sm">
										Approve
									</Button>
								</div>
							</fieldset>
						</section>

						<div></div>

						<section className="flex flex-col gap-8 border border-border-smooth/20 rounded-md p-3">
							<header className="w-full text-center">
								<h3 className="font-bold pt-2">
									Real-Estate-Portfolio Limit Buffer
								</h3>
							</header>

							<fieldset>
								<DefaultSuspenseAndErrorBoundary failedText="Failed to load chart!">
									<CurrentRealEstateLoanExposureVsLimitChart />
								</DefaultSuspenseAndErrorBoundary>
							</fieldset>

							<Separator />

							<fieldset>
								<DefaultSuspenseAndErrorBoundary failedText="Failed to load chart!">
									<RealEstateStressTestChart />
								</DefaultSuspenseAndErrorBoundary>
							</fieldset>
						</section>
					</div>
				</motion.section>
			</AnimatePresence>
		</>
	);
}
