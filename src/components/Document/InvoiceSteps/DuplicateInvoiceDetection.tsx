import { SearchCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { FADE_IN_MOTION_ANIMATION_PROPS } from "@/lib/utils";
import { HandleShowChatMessagesWhenVisible } from "../HandleShowChatMessagesWhenVisible";

export function DuplicateInvoiceDetection() {
	return (
		<>
			<HandleShowChatMessagesWhenVisible />

			<AnimatePresence>
				<motion.div {...FADE_IN_MOTION_ANIMATION_PROPS}>
					<div className="flex flex-col items-center justify-center min-h-32 w-full gap-1 text-muted">
						<SearchCheck className="size-6 text-green-600" />

						<p>No duplicated invoices found.</p>
					</div>
				</motion.div>
			</AnimatePresence>
		</>
	);
}
