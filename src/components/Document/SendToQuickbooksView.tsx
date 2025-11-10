import { Loader } from "lucide-react";

export const SendToQuickbooksView: React.FC = () => {
	return (
		<section
			className="flex flex-col items-center border border-border-smooth/20 gap-4 shadow-md shadow-black/20 p-6 rounded-md"
			aria-label="Pre-Approval"
		>
			<header className="flex items-center gap-4 justify-between w-full">
				<div className="flex items-center gap-2">
					<h2 className="font-semibold text-lg">Send to QuickBooks</h2>
				</div>
			</header>

			<div className="flex flex-col min-h-32 w-full gap-1 text-muted text-sm [&_i]:font-semibold">
				<fieldset className="flex h-fit items-center gap-1">
					<Loader className="size-3 animate-spin" />

					<p>
						Notify Slack channel <i>#finance-invoices</i>.
					</p>
				</fieldset>

				<fieldset className="flex h-fit items-center gap-1">
					<Loader className="size-3 animate-spin" />

					<p>
						Archive to <i>SharePoint</i>.
					</p>
				</fieldset>

				<fieldset className="flex h-fit items-center gap-1">
					<Loader className="size-3 animate-spin" />

					<p>Check for early-payment discount.</p>
				</fieldset>
			</div>
		</section>
	);
};
