import { ShieldCheck } from "lucide-react";

export function RealEstatePortfolioLimitBuffer() {
	return (
		<fieldset>
			<h3 className="leading-none font-semibold">
				Real-Estate-Portfolio Limit Buffer
			</h3>

			<div className="flex gap-2 items-center w-full justify-between">
				<span className="text-muted-foreground text-sm">
					Compliance with BSP 25% real-estate exposure cap
				</span>

				<div className="border-b border-dotted flex-1 border-border-smooth h-[0.5lh]"></div>

				<div className="flex gap-2 items-center">
					<ShieldCheck className="size-4 stroke-green-700" />

					<span>21%</span>
				</div>
			</div>
		</fieldset>
	);
}
