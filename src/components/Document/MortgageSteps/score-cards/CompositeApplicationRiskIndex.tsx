import { ShieldCheck } from "lucide-react";

export function CompositeApplicationRiskIndex() {
	return (
		<fieldset>
			<h3 className="leading-none font-semibold">
				Composite Application Risk Index
			</h3>

			<div className="flex gap-2 items-center w-full justify-between">
				<span className="text-muted-foreground text-sm">
					One-look overall risk
				</span>

				<div className="border-b border-dotted flex-1 border-border-smooth h-[0.5lh]"></div>

				<div className="flex gap-2 items-center">
					<ShieldCheck className="size-4 stroke-green-700" />

					<span>32%, Low risk</span>
				</div>
			</div>
		</fieldset>
	);
}
