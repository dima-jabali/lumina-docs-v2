import { FileText, Package, SearchCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { FADE_IN_MOTION_ANIMATION_PROPS } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PurchaseOrderForm } from "../PurchaseOrder";
import { GoodsReceiptForm } from "../GoodsReceipt";
import { HandleShowChatMessagesWhenVisible } from "../HandleShowChatMessagesWhenVisible";

export function Invoice_PurchaseOrder_GoodsReceipt() {
	return (
		<>
			<HandleShowChatMessagesWhenVisible />

			<AnimatePresence>
				<motion.div {...FADE_IN_MOTION_ANIMATION_PROPS}>
					<div className="flex items-center justify-start w-full gap-1 text-muted">
						<Tabs defaultValue="purchase-order" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger
									value="purchase-order"
									className="flex items-center gap-2 data-[state=inactive]:text-white"
								>
									<FileText className="h-4 w-4" />
									Purchase Order
								</TabsTrigger>

								<TabsTrigger
									value="goods-receipt"
									className="flex items-center gap-2 data-[state=inactive]:text-white"
								>
									<Package className="h-4 w-4" />
									Goods Receipt
								</TabsTrigger>
							</TabsList>

							<TabsContent value="purchase-order">
								<p className="flex items-center gap-2 my-6">
									<SearchCheck className="size-6 text-green-600" />

									<span>Corresponding Purchase order identified</span>
								</p>

								<Card>
									<CardContent className="pt-6">
										<PurchaseOrderForm />
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="goods-receipt">
								<p className="flex items-center gap-2 my-6">
									<SearchCheck className="size-6 text-green-600" />

									<span>Corresponding Goods Receipt identified</span>
								</p>

								<Card>
									<CardContent className="pt-6">
										<GoodsReceiptForm />
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</motion.div>
			</AnimatePresence>
		</>
	);
}
