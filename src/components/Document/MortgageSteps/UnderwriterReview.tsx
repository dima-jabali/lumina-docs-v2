import { Check } from "lucide-react";
import { useState } from "react";

import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentOrganization } from "@/hooks/fetch/use-fetch-organization-list";
import { useUpdateOrgLocally } from "@/hooks/mutation/use-update-org-locally";
import { sleep } from "@/lib/utils";
import { useDocType } from "@/contexts/luminaStore";

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
		<section className="flex flex-col items-center border border-border-smooth/20 gap-4 shadow-md shadow-black/20 p-6 rounded-md">
			<header className="flex items-center gap-4 justify-between w-full">
				<h2 className="font-semibold text-lg">Underwriter Review</h2>

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
							Approv{isApproved ? "ed" : isApproving ? "ing..." : "e"}
						</span>
					</Button>
				</div>
			</header>

			<div className="flex flex-col min-h-32 w-full gap-8 text-muted text-sm">
				<fieldset className="flex flex-col gap-0.5">
					<label className="text-xs" htmlFor="followup">
						Follow-up questions
					</label>

					<Textarea id="followup" className="min-h-32" />

					<Button className="ml-auto mt-1" size="xs">
						Send to applicant
					</Button>
				</fieldset>

				<fieldset>
					<label className="text-xs" htmlFor="feedback">
						Feedback
					</label>

					<Textarea id="feedback" className="min-h-32" />
				</fieldset>
			</div>
		</section>
	);
}
