import { ShieldCheck } from "lucide-react";

export function ExtractionConfidenceScore() {
	return (
		<fieldset>
			<h3 className="leading-none font-semibold">
				Extraction-Confidence Score
			</h3>

			<div className="flex gap-2 items-center w-full justify-between">
				<span className="text-muted-foreground text-sm">
					Data-quality flag from IDP
				</span>

				<div className="border-b border-dotted flex-1 border-border-smooth h-[0.5lh]"></div>

				<div className="flex gap-2 items-center">
					<ShieldCheck className="size-4 stroke-green-700" />

					<span>99.67%, High confidence</span>
				</div>
			</div>
		</fieldset>
	);
}
