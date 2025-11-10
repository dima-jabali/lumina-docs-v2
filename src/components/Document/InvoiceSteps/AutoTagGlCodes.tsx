import { AnimatePresence, motion } from "motion/react";

import { FADE_IN_MOTION_ANIMATION_PROPS } from "@/lib/utils";
import { HandleShowChatMessagesWhenVisible } from "../HandleShowChatMessagesWhenVisible";

export function AutoTagGlCodes() {
	return (
		<>
			<HandleShowChatMessagesWhenVisible />

			<AnimatePresence>
				<motion.div {...FADE_IN_MOTION_ANIMATION_PROPS}>
					<ul className="flex flex-col items-start justify-start w-full gap-6 mt-4 text-muted">
						<li className="list-inside">
							<p className="pb-3 inline font-semibold text-muted">
								Professional Services Expense:
							</p>

							<div className="flex flex-col gap-1 mt-1 text-sm">
								<p>GL Code: 6120</p>

								<p>
									The professional services expense account is used to track the
									costs associated with hiring consultants or professional
									services.
								</p>
							</div>
						</li>

						<li className="list-inside">
							<p className="pb-3 font-semibold inline text-muted">
								Legal Fees:
							</p>

							<div className="flex flex-col gap-1 mt-1 text-sm">
								<p>GL Code: 6160</p>

								<p>
									The legal fees account is used to track the costs associated
									with hiring legal counsel or attorneys.
								</p>
							</div>
						</li>
					</ul>
				</motion.div>
			</AnimatePresence>
		</>
	);
}
