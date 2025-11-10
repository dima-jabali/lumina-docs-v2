import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { FADE_IN_MOTION_ANIMATION_PROPS } from "@/lib/utils";
import { HandleShowChatMessagesWhenVisible } from "../HandleShowChatMessagesWhenVisible";

export function StoredInSharepoint() {
	return (
		<>
			<HandleShowChatMessagesWhenVisible />

			<AnimatePresence>
				<motion.div {...FADE_IN_MOTION_ANIMATION_PROPS}>
					<fieldset className="flex h-fit items-center justify-between w-full gap-1">
						<div className="flex gap-1 items-center">
							<Check className="size-3 text-green" />

							<p>
								Stored in SharePoint at
								&quot;/archive/invoices/2025/lloyd-bowers&quot;.
							</p>
						</div>
					</fieldset>
				</motion.div>
			</AnimatePresence>
		</>
	);
}
