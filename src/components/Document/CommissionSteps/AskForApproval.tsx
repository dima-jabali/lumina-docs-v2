import { Check } from "lucide-react";

export function AskForApproval() {
	return (
		<div className="flex flex-col min-h-32 w-full gap-1 text-muted text-sm">
			<fieldset className="flex h-fit items-center justify-between w-full gap-1">
				<div className="flex gap-1 items-center">
					<Check className="size-3 text-green" />

					<p>Sent email to finance department.</p>
				</div>
			</fieldset>

			<fieldset className="flex h-fit items-center justify-between w-full gap-1">
				<div className="flex gap-1 items-center">
					<Check className="size-3 text-green" />

					<p>
						Added to connected ERP system (Red Hat OpenShift Service on AWS).
					</p>
				</div>
			</fieldset>
		</div>
	);
}
