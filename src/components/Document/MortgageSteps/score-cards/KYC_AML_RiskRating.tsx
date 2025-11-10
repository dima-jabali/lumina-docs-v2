import { ShieldCheck } from "lucide-react";

export function KYC_AML_RiskRating() {
	return (
		<fieldset>
			<h3 className="leading-none font-semibold">KYC / AML Risk Rating</h3>

			<div className="flex gap-2 items-center w-full justify-between">
				<span className="text-muted-foreground text-sm">
					Sanctions, PEP, watch-list exposure
				</span>

				<div className="border-b border-dotted flex-1 border-border-smooth h-[0.5lh]"></div>

				<div className="flex gap-2 items-center">
					<ShieldCheck className="size-4 stroke-green-700" />

					<span>Low risk, no positive hits</span>
				</div>
			</div>
		</fieldset>
	);
}
