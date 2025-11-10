import { pesoFormatter } from "@/lib/utils";
import { CircleAlert } from "lucide-react";

export function ExistingExposureToBank() {
	return (
		<fieldset>
			<h3 className="leading-none font-semibold">Existing Exposure to Bank</h3>

			<div className="flex gap-2 items-center w-full justify-between">
				<span className="text-muted-foreground text-sm">
					Concentration & Reg. limits:
				</span>

				<div className="border-b border-dotted flex-1 border-border-smooth h-[0.5lh]"></div>

				<div className="flex gap-2 items-center">
					<CircleAlert className="size-4 stroke-red-700" />

					{pesoFormatter.format(20_000_000)}
				</div>
			</div>
		</fieldset>
	);
}
