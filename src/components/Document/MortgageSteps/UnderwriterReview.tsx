import { Check } from "lucide-react";
import { useState } from "react";

import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentOrganization } from "@/hooks/fetch/use-fetch-organization-list";
import { useUpdateOrgLocally } from "@/hooks/mutation/use-update-org-locally";
import { sleep } from "@/lib/utils";
import { useDocType } from "@/contexts/luminaStore";
import { Input } from "@/components/ui/input";

const validatedFields = [
	{
		name: "Full Name (Primary Applicant)",
		value: "Maria Elena Santos Reyes",
	},
	{
		name: "Tax Identification Number (TIN)",
		value: "123-456-789-000",
	},
	{
		name: "Civil Status",
		value: "Married",
	},
	{
		name: "Gross Monthly Income (GMI)",
		value: "₱115,000.00",
	},
	{
		name: "Existing Loan Monthly Amortization",
		value: "₱18,500.00",
	},
	{
		name: "Desired Loan Amount (in PHP)",
		value: "₱4,800,000.00",
	},
	{
		name: "Loan Purpose",
		value: "Purchase of a new House and Lot",
	},
	{
		name: "Property Type",
		value: "House and Lot",
	},
	{
		name: "Property Address (Collateral)",
		value: "Blk 15, Lot 28, Acacia St., Brgy. San Jose, Antipolo City, Rizal",
	},
	{
		name: "Transfer Certificate of Title (TCT) Number",
		value: "T-123456",
	},
	{
		name: "Employment Status",
		value: "Locally Employed (Salaried)",
	},
	{
		name: "Years with Current Employer",
		value: "5 years and 3 months",
	},
];

export function UnderwriterReview() {
	const [isApproving, setIsApproving] = useState(false);
	const [isApproved, setIsApproved] = useState(false);

	const updateOrgLocally = useUpdateOrgLocally().mutate;
	const org = useCurrentOrganization();
	const docType = useDocType();

	const handleApprove = async () => {
		if (!org || !docType) return;

		setIsApproving(true);

		const { currentStep } = org;

		await sleep(1_500);

		setIsApproved(true);

		const updatedOrg: typeof org = { ...org };

		const stepIndex = org.steps[docType].findIndex(
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

	return (
		<>
			<div className="flex flex-col w-full gap-2 text-xs border border-border-smooth/20 shadow-md shadow-black/20 p-6 rounded-md">
				{validatedFields.slice(0, 10).map((field) => (
					<div key={field.name} className="flex flex-col gap-2">
						<label className="font-semibold">{field.name}</label>

						<Input
							className="text-muted-foreground"
							value={field.value}
							readOnly
						/>
					</div>
				))}

				<div className="mt-5 w-full justify-end flex">
					<Button variant="outline">More</Button>
				</div>
			</div>

			<footer className="flex items-center justify-end gap-4 w-full">
				<div className="flex gap-2">
					<Button size="sm" variant="destructive">
						Reject
					</Button>

					<Button size="sm" variant="success" onClick={handleApprove}>
						{isApproved ? (
							<Check className="size-3" />
						) : isApproving ? (
							<Loader className="size-3 border-t-white" />
						) : null}

						<span>
							Submit{isApproved ? "ed" : isApproving ? "ing..." : ""} to LOS
						</span>
					</Button>
				</div>
			</footer>
		</>
	);
}
