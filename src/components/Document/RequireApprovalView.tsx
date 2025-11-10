import { Check, Loader } from "lucide-react";
import { useState } from "react";

import {
	useCurrentOrganization,
	useCurrentStep,
} from "@/hooks/fetch/use-fetch-organization-list";
import { useUpdateOrgLocally } from "@/hooks/mutation/use-update-org-locally";
import { sleep } from "@/lib/utils";
import { Button } from "../ui/button";
import { useDocType } from "@/contexts/luminaStore";

export const RequireApprovalView: React.FC = () => {
	const [isApproved, setIsApproved] = useState(false);

	const updateOrgLocally = useUpdateOrgLocally().mutate;
	const org = useCurrentOrganization();
	const step = useCurrentStep();
	const docType = useDocType();

	if (!step || !org || !docType) {
		return null;
	}

	const handleApprove = async () => {
		setIsApproved(true);

		await sleep(500);

		const { currentStep } = org;

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
		<div className="relative flex flex-col min-h-32 w-full gap-1 text-muted text-sm">
			<fieldset className="flex h-fit items-center justify-between w-full gap-1">
				<div className="flex gap-1 items-center">
					<Check className="size-3" />

					<p>Approved by Mary.</p>
				</div>
			</fieldset>

			<fieldset className="flex h-fit items-center justify-between w-full gap-1">
				<div className="flex gap-1 items-center">
					{isApproved ? (
						<Check className="size-3" />
					) : (
						<Loader className="size-3 animate-spin" />
					)}

					<p>Waiting for approval from John.</p>
				</div>
			</fieldset>

			<header className="absolute right-0 bottom-0 w-fit flex items-center gap-4 justify-between">
				<Button size="sm" variant="success" onClick={handleApprove}>
					<Check className="size-3" />

					<span>Approve</span>
				</Button>
			</header>
		</div>
	);
};
