"use client";

import { AnimatePresence, motion } from "motion/react";
import { titleCase } from "scule";

import { globalStore, useDocType } from "@/contexts/luminaStore";
import { useFileMetadata } from "@/hooks/fetch/use-fetch-document-metadata-list";
import {
	useCurrentOrganization,
	useCurrentStep,
} from "@/hooks/fetch/use-fetch-organization-list";
import { useUpdateOrgLocally } from "@/hooks/mutation/use-update-org-locally";
import { SupportedDocTypes } from "@/types/general-enums";
import { DefaultSuspenseAndErrorBoundary } from "../DefaultSuspenseAndErrorBoundary";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AskForApproval } from "./CommissionSteps/AskForApproval";
import { CalculateCommission } from "./CommissionSteps/CalculateCommission";
import { InformationCompleteness } from "./CommissionSteps/InformationCompleteness";
import { AutoTagGlCodes } from "./InvoiceSteps/AutoTagGlCodes";
import { DuplicateInvoiceDetection } from "./InvoiceSteps/DuplicateInvoiceDetection";
import { EarlyDiscountPaymentMonitor } from "./InvoiceSteps/EarlyDiscountPaymentMonitor";
import { InvoiceSentToQuickbook } from "./InvoiceSteps/InvoiceSentToQuickbook";
import { Invoice_PurchaseOrder_GoodsReceipt } from "./InvoiceSteps/Invoice_PurchaseOrder_GoodsReceipt";
import { NotifiedMicrosoft } from "./InvoiceSteps/NotifiedMicrosoft";
import { StoredInSharepoint } from "./InvoiceSteps/StoredInSharepoint";
import { UnderwriterReview } from "./MortgageSteps/UnderwriterReview";
import { RequireApprovalView } from "./RequireApprovalView";
import SpendApprovalCalculator from "./SpendApprovalCalculator";
import { ValidateMetadata } from "./ValidateMetadata";
import { InfoCompleteness } from "./CommissionSteps/info-completeness";

export function CurrentStepDetails() {
	const selectedSubFile = globalStore.use.selectedSubFile();
	const updateOrgLocally = useUpdateOrgLocally().mutate;
	const fileMetadata = useFileMetadata();
	const org = useCurrentOrganization();
	const step = useCurrentStep();
	const docType = useDocType();

	// console.log({ step, fileMetadata, org, docType });

	if (!fileMetadata) {
		return null;
	}

	if (!step || !org || !docType) {
		return null;
	}

	const handleNext = async () => {
		const { currentStep } = org;

		const updatedOrg: typeof org = { ...org };

		const stepIndex = org.steps[docType]?.findIndex(
			(s) => s.step === currentStep,
		);

		if (stepIndex === -1) {
			console.error("Unable to find step", { stepIndex });
		} else {
			const step = org.steps[docType][stepIndex]!;
			const updatedStep = { ...step, isCompleted: true };

			updatedOrg.steps[docType][stepIndex] = updatedStep;

			const hasNextStep = org.steps[docType][stepIndex + 1];

			if (hasNextStep) {
				updatedOrg.currentStep = step.step + 1;
			}
		}

		updateOrgLocally(updatedOrg);
	};

	const currentStepNodes = (() => {
		const { currentStep } = org;

		if (docType === SupportedDocTypes.Commission) {
			switch (currentStep) {
				case 2:
					return <InformationCompleteness />;

				case 3:
					return <CalculateCommission />;

				case 4:
					return <AskForApproval />;

				default:
					return null;
			}
		} else if (docType === SupportedDocTypes.Mortgage) {
			switch (currentStep) {
				case 1:
					return <ValidateMetadata />;

				case 2:
					return <InfoCompleteness />;

				case 3:
					return <ValidateMetadata />;

				case 4:
					return <UnderwriterReview />;

				default:
					return null;
			}
		} else {
			switch (currentStep) {
				case 1:
					return <ValidateMetadata />;

				case 2:
					return <DuplicateInvoiceDetection />;

				case 3:
					return <Invoice_PurchaseOrder_GoodsReceipt />;

				case 4:
					return <AutoTagGlCodes />;

				case 5:
					return <SpendApprovalCalculator />;

				case 6:
					return <RequireApprovalView />;

				case 7:
					return <NotifiedMicrosoft />;

				case 8:
					return <StoredInSharepoint />;

				case 9:
					return <EarlyDiscountPaymentMonitor />;

				case 10:
					return <InvoiceSentToQuickbook />;

				default:
					return null;
			}
		}
	})();

	return (
		<section className="@container flex flex-col border border-border-smooth/20 gap-4 shadow-md shadow-black/20 p-6 rounded-md relative [&_label]:text-muted-foreground [&_label]:text-sm">
			<header className="flex items-center gap-4 justify-between w-full">
				<h2 className="font-semibold text-lg">{step.title}</h2>

				<Button variant="success" onClick={handleNext}>
					Next
				</Button>
			</header>

			{selectedSubFile && step.dealsWithSubFiles ? (
				<div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
					key={selectedSubFile.id}
				>
					<div className="col-span-full">
						<h3 className="font-semibold text-md text-muted mb-3">
							{titleCase(selectedSubFile.fileFields?.document_type || "")}
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<AnimatePresence>
								{Object.entries(selectedSubFile.fileFields || {}).map(
									([key, value], index) =>
										value ? (
											<motion.fieldset
												initial={{ opacity: 0, y: "20%" }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													delay: 2 + index / 10,
													duration: 0.4,
													type: "spring",
												}}
												key={key}
											>
												<div className="grid gap-2">
													<label htmlFor={key}>{titleCase(key)}</label>

													<Input defaultValue={value} id={key} />
												</div>
											</motion.fieldset>
										) : null,
								)}
							</AnimatePresence>
						</div>
					</div>
				</div>
			) : !selectedSubFile && step.dealsWithSubFiles ? (
				<div className="min-h-40 w-full flex items-center justify-center text-muted gap-2">
					<p>
						{"<-"} Choose a processed{" "}
						{docType === SupportedDocTypes.Commission
							? "commission"
							: "mortgage"}{" "}
						file to validate its fields
					</p>
				</div>
			) : null}

			<DefaultSuspenseAndErrorBoundary failedText="Failed to render current step details">
				{step.dealsWithSubFiles ? null : currentStepNodes}
			</DefaultSuspenseAndErrorBoundary>
		</section>
	);
}
