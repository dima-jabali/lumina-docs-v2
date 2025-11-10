import { AnimatePresence, motion } from "motion/react";

import { FADE_IN_MOTION_ANIMATION_PROPS } from "@/lib/utils";
import { Badge } from "../../ui/badge";
import { HandleShowChatMessagesWhenVisible } from "../HandleShowChatMessagesWhenVisible";

export const EarlyDiscountPaymentMonitor: React.FC = () => {
	return (
		<>
			<HandleShowChatMessagesWhenVisible />

			<AnimatePresence>
				<motion.div {...FADE_IN_MOTION_ANIMATION_PROPS}>
					<div className="flex flex-col gap-4">
						<h4 className="font-semibold text-base text-muted">
							Early Discount Payment Monitor
						</h4>

						<table className="[&_th]:text-left [&_th]:py-1 [&_th]:pr-2 [&_td]:px-2 w-1/2">
							<tbody>
								<tr>
									<th>Invoice #</th>
									<td>22030</td>
								</tr>

								<tr>
									<th>Customer</th>
									<td>Lloyd-Bowers</td>
								</tr>

								<tr>
									<th>Issue Date</th>
									<td>22/06/2024</td>
								</tr>

								<tr>
									<th>Due Date</th>
									<td>23/06/2024</td>
								</tr>

								<tr>
									<th>Amount</th>
									<td>$ 4,082.43</td>
								</tr>

								<tr>
									<th>Discount</th>
									<td>$ 204,12 (5%)</td>
								</tr>

								<tr>
									<th>Status</th>
									<td>
										<Badge className="bg-amber-500 shadow-none rounded-full tracking-wide">
											Eligible
										</Badge>
									</td>
								</tr>

								<tr></tr>
							</tbody>
						</table>
					</div>
				</motion.div>
			</AnimatePresence>
		</>
	);
};
