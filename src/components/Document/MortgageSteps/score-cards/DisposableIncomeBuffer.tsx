import { ShieldCheck } from "lucide-react";

import { pesoFormatter } from "@/lib/utils";

export function DisposableIncomeBuffer() {
	return (
		<fieldset>
			<h3 className="leading-none font-semibold">Disposable-Income Buffer</h3>

			<div className="flex gap-2 items-center w-full justify-between">
				<span className="text-muted-foreground text-sm">
					Peso buffer after all commitments:
				</span>

				<div className="border-b border-dotted flex-1 border-border-smooth h-[0.5lh]"></div>

				<div className="flex gap-2 items-center">
					<ShieldCheck className="size-4 stroke-green-700" />

					{pesoFormatter.format(15_000)}
				</div>
			</div>
		</fieldset>
	);
}
