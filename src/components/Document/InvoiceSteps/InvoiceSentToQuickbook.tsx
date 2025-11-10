import { SearchCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { FADE_IN_MOTION_ANIMATION_PROPS } from "@/lib/utils";
import { HandleShowChatMessagesWhenVisible } from "../HandleShowChatMessagesWhenVisible";

export function InvoiceSentToQuickbook() {
	return (
		<>
			<HandleShowChatMessagesWhenVisible />

			<AnimatePresence>
				<motion.div {...FADE_IN_MOTION_ANIMATION_PROPS}>
					<fieldset className="flex h-fit items-center justify-between w-full gap-1">
						<div className="flex gap-1 items-center">
							<SearchCheck className="size-4 text-green-600" />

							<p>Invoice sent to QuickBooks.</p>
						</div>
					</fieldset>
				</motion.div>
			</AnimatePresence>
		</>
	);
}
