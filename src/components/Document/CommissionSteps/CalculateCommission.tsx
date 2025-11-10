import { AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Separator } from "@/components/ui/separator";
import { useFileMetadata } from "@/hooks/fetch/use-fetch-document-metadata-list";
import { pesoFormatter } from "@/lib/utils";
import { HandleShowChatMessagesWhenVisible } from "../HandleShowChatMessagesWhenVisible";

const ANIMATION_PROPS = {
	initial: { opacity: 0, y: "20%" },
	animate: { opacity: 1, y: 0 },
	transition: {
		type: "spring",
		duration: 0.4,
		delay: 0.4,
	},
} as const;

export function CalculateCommission() {
	const fileMetadata = useFileMetadata();

	if (!fileMetadata) {
		return null;
	}

	// Fake data for the commission calculation display
	const fakeSalePrice = 7_500_000.0; // PHP
	const fakeCommissionRate = 0.03; // 3%
	const fakeTieredBonusClause = `1% bonus for sales above ₱ 5 Million`;
	const fakeWithholdingTaxRate = 0.05; // 5%

	// Calculations based on fake data
	const baseCommission = fakeSalePrice * fakeCommissionRate;
	const bonusAmount = fakeSalePrice > 5_000_000 ? fakeSalePrice * 0.01 : 0;
	const totalCommission = baseCommission + bonusAmount;
	const taxWithheldAmount = totalCommission * fakeWithholdingTaxRate;
	const netPayout = totalCommission - taxWithheldAmount;

	return (
		<>
			<HandleShowChatMessagesWhenVisible />

			<AnimatePresence>
				<div className="w-full max-w-4xl flex flex-col gap-8">
					<motion.div {...ANIMATION_PROPS}>
						{/* Overview Metrics */}
						<div className="grid grid-cols-2 gap-4 text-center">
							<div className="p-4 rounded-lg shadow-sm flex flex-col items-center gap-2">
								<FileText className="size-8 text-blue-500" />

								<h4 className="font-semibold text-base text-muted">
									Documents Processed
								</h4>

								<p className="text-2xl font-bold ">8</p>
							</div>

							<div className="p-4 rounded-lg shadow-sm flex flex-col items-center gap-2">
								<CheckCircle className="size-8 text-positive" />

								<h4 className="font-semibold text-base text-muted">
									Auto-Validated Rate
								</h4>

								<p className="text-2xl font-bold">88.7%</p>
							</div>
						</div>
					</motion.div>

					<motion.div {...ANIMATION_PROPS}>
						<Separator />

						<section className="flex flex-col gap-6">
							<header className="w-full">
								<h3 className="font-bold text-muted pt-2">
									Commission Calculation in Action
								</h3>

								<p className="text-sm text-muted-foreground mt-1">
									Live calculation for Agreement ID:{" "}
									<span className="font-semibold">
										{fileMetadata.file_name}
									</span>
								</p>
							</header>

							<div className="flex flex-col gap-3 text-base ">
								<div className="flex gap-2 w-full justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
									<span className="text-muted-foreground text-sm">
										Property Sale Price
									</span>

									<div className="border-b border-dotted flex-1 border-border-smooth h-[0.5lh]"></div>

									<div className="flex gap-2 items-center">
										{pesoFormatter.format(fakeSalePrice)}
									</div>
								</div>

								<div className="flex gap-2 w-full justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
									<span className="text-muted-foreground text-sm">
										Agreed Commission Rate
									</span>

									<div className="border-b border-dotted flex-1 border-border-smooth h-[0.5lh]"></div>

									<div className="flex gap-2 items-center">
										{(fakeCommissionRate * 100).toFixed(1)}%
									</div>
								</div>

								<div className="flex gap-2 w-full justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
									<span className="text-muted-foreground text-sm">
										Tiered Bonus Clause
									</span>

									<div className="border-b border-dotted flex-1 border-border-smooth h-[0.5lh]"></div>

									<div className="flex gap-2 items-center">
										{fakeTieredBonusClause}
									</div>
								</div>

								<h3 className="font-bold text-muted pt-2">
									Commission Calculation in Action
								</h3>

								<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
									<p className="text-muted-foreground text-sm">
										1. Base Commission Calculation:
									</p>

									<p className="pl-4 text-sm">
										{pesoFormatter.format(fakeSalePrice)} (<i>Sale Price</i>){" "}
										<span className="font-bold">×</span>{" "}
										{(fakeCommissionRate * 100).toFixed(1)}% (
										<i>Commission Rate</i>) <span className="font-bold">=</span>{" "}
										<span className="font-bold">
											{pesoFormatter.format(baseCommission)}
										</span>
									</p>
								</div>

								<div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
									<p className="text-muted-foreground text-sm">
										2. Tiered Bonus Adjustment:
									</p>

									<p className="pl-4 text-sm">
										Since <i>Sale Price</i> (
										{pesoFormatter.format(fakeSalePrice)})
										<span className="font-bold"> &gt; </span>
										{pesoFormatter.format(5_000_000)}{" "}
										<span className="font-bold">{"=>"}</span> apply 1% bonus.
									</p>

									<p className="pl-4 text-sm">
										{pesoFormatter.format(fakeSalePrice)}{" "}
										<span className="font-bold">×</span> 1% ={" "}
										<span className="font-bold">
											{pesoFormatter.format(bonusAmount)}
										</span>
									</p>
								</div>

								<div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
									<p className="text-muted-foreground text-sm">
										3. Total Gross Commission:
									</p>

									<p className="pl-4 text-sm">
										{pesoFormatter.format(baseCommission)} (<i>Base</i>){" "}
										<span className="font-bold">+ </span>
										{pesoFormatter.format(bonusAmount)} (<i>Bonus</i>){" "}
										<span className="font-bold">=</span>{" "}
										<span className="font-semibold">
											{pesoFormatter.format(totalCommission)}
										</span>
									</p>
								</div>

								<div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
									<p className="text-muted-foreground text-sm">
										4. Withholding Tax Deduction:
									</p>

									<p className="pl-4 text-sm">
										{pesoFormatter.format(totalCommission)} (
										<i>Gross Commission</i>)
										<span className="font-bold"> ×</span>{" "}
										{(fakeWithholdingTaxRate * 100).toFixed(1)}% (Tax Rate){" "}
										<span className="font-bold">= </span>
										<span className="font-bold">
											{pesoFormatter.format(taxWithheldAmount)}
										</span>
									</p>
								</div>

								<div className="bg-primary-foreground p-4 rounded-md text-center">
									<p className="font-semibold">
										Final Net Payout: {pesoFormatter.format(netPayout)}
									</p>
								</div>
							</div>
						</section>
					</motion.div>

					<motion.div {...ANIMATION_PROPS}>
						<Separator />

						{/* Validation & Exception Management */}
						<section className="flex flex-col gap-6">
							<header className="w-full text-center">
								<h3 className="font-semibold text-base text-muted pt-2">
									Validation & Exception Management
								</h3>
							</header>

							<div className="grid grid-rows-2 grid-cols-1 gap-4">
								<fieldset className="flex flex-col gap-2 p-3 border rounded-md border-green-300 bg-green-50/50 dark:bg-green-900/20">
									<header className="flex gap-2 items-center text-positive">
										<CheckCircle className="size-5" />

										<h4 className="font-semibold text-lg">
											Successfully Validated (8)
										</h4>
									</header>

									<ul className="pl-6 list-disc text-sm text-muted-foreground">
										<li>BCA-2025-01-001: All fields extracted & matched.</li>

										<li>OR-2025-0012: Amount matches calculated commission.</li>
									</ul>
								</fieldset>

								<fieldset className="flex flex-col gap-2 p-3 border rounded-md border-orange-300 bg-orange-50/50 dark:bg-orange-900/20">
									<header className="flex gap-2 items-center text-orange-700 dark:text-orange-400">
										<AlertTriangle className="size-5" />

										<h4 className="font-semibold text-lg">
											Requires Review (1)
										</h4>
									</header>

									<ul className="pl-6 list-disc text-sm text-muted-foreground">
										<li>
											SC-2025-HL-005: Buyer ID mismatch with Government ID.
										</li>
									</ul>
								</fieldset>
							</div>
						</section>
					</motion.div>
				</div>
			</AnimatePresence>
		</>
	);
}
