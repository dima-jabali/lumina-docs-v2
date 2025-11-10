import { ShieldCheck } from "lucide-react";

export function SelfEmployedEarningsTrend() {
	return (
		<fieldset>
			<h3 className="leading-none font-semibold">
				Self-Employed Earnings Trend
			</h3>

			<div className="flex gap-2 items-center w-full justify-between">
				<span className="text-muted-foreground text-sm">
					YoY revenue movement
				</span>

				<div className="border-b border-dotted flex-1 border-border-smooth h-[0.5lh]"></div>

				<div className="flex gap-2 items-center">
					<ShieldCheck className="size-4 stroke-green-700" />
					5.43%
				</div>
			</div>
		</fieldset>
	);
}
