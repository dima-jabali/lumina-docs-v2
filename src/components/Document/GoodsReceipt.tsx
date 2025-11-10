"use client";

import { Save, Download, CheckCircle2 } from "lucide-react";
import { useState, type ComponentProps, type PropsWithChildren } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

type ReceiptItem = {
	id: number;
	description: string;
	poQuantity: number;
	receivedQuantity: number;
	condition: "good" | "damaged" | "partial";
	notes: string;
};

const Label: React.FC<PropsWithChildren & ComponentProps<"label">> = ({
	children,
	...props
}) => (
	<label
		className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		{...props}
	>
		{children}
	</label>
);

export function GoodsReceiptForm() {
	const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([
		{
			id: 1,
			description: "Improve",
			poQuantity: 2,
			receivedQuantity: 2,
			condition: "good",
			notes: "",
		},
		{
			id: 2,
			description: "Lawyer",
			poQuantity: 3,
			receivedQuantity: 3,
			condition: "good",
			notes: "",
		},
	]);

	const updateReceiptItem = (
		id: number,
		field: keyof ReceiptItem,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
	) => {
		setReceiptItems((items) =>
			items.map((item) => {
				if (item.id === id) {
					return { ...item, [field]: value };
				}
				return item;
			}),
		);
	};

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-start">
				<div>
					<h2 className="text-2xl font-bold">Goods Receipt</h2>
					<p className="text-muted-foreground">22030</p>
				</div>
				<div className="text-right">
					<p className="font-medium">Date: 22/06/2024</p>
					<p className="text-muted-foreground">Status: Draft</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-4">
					<h3 className="font-medium">Reference Information</h3>
					<div className="space-y-2">
						<Label htmlFor="po-reference">Purchase Order Reference</Label>

						<Select defaultValue="po-2023-0042">
							<SelectTrigger>
								<SelectValue placeholder="Select purchase order" />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="po-2023-0042">
									PO-2023-0042 (BetterBrain)
								</SelectItem>
								<SelectItem value="po-2023-0041">
									PO-2023-0041 (Office Solutions Ltd.)
								</SelectItem>
								<SelectItem value="po-2023-0040">
									PO-2023-0040 (Global Widgets Co.)
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="supplier">Supplier</Label>

						<Input id="supplier" readOnly className="opacity-60" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="delivery-date">Delivery Date</Label>

						<Input
							id="delivery-date"
							type="date"
							defaultValue={new Date().toISOString().split("T")[0]}
						/>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="font-medium">Delivery Information</h3>
					<div className="space-y-2">
						<Label htmlFor="delivery-location">Delivery Location</Label>

						<Select defaultValue="warehouse1">
							<SelectTrigger>
								<SelectValue placeholder="Select location" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="warehouse1">Main Warehouse</SelectItem>
								<SelectItem value="warehouse2">
									East Coast Distribution Center
								</SelectItem>
								<SelectItem value="office">Corporate Office</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="carrier">Carrier/Shipping Method</Label>

						<Input id="carrier" defaultValue="FedEx Ground" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="tracking">Tracking Number</Label>

						<Input id="tracking" defaultValue="794633021500" />
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<h3 className="font-medium">Received Items</h3>

				<div className="space-y-6">
					{receiptItems.map((item) => (
						<Card key={item.id}>
							<CardContent className="pt-6">
								<div className="space-y-4">
									<div className="flex flex-wrap gap-4 justify-between items-start">
										<div className="space-y-1">
											<h4 className="font-medium">{item.description}</h4>
											<p className="text-sm text-muted-foreground">
												Item #{item.id}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-sm text-muted-foreground">
												PO Quantity: {item.poQuantity}
											</span>
											{/* <Separator orientation="vertical" className="h-4" /> */}
											<div className="flex items-center gap-2">
												<Label
													htmlFor={`received-qty-${item.id}`}
													className="text-sm whitespace-nowrap"
												>
													Received:
												</Label>

												<Input
													id={`received-qty-${item.id}`}
													type="number"
													className="w-20"
													value={item.receivedQuantity}
													onChange={(e) =>
														updateReceiptItem(
															item.id,
															"receivedQuantity",
															Number.parseInt(e.target.value) || 0,
														)
													}
												/>
											</div>
										</div>
									</div>

									<div className="space-y-2">
										<Label className="text-sm">Condition</Label>

										<RadioGroup
											value={item.condition}
											onValueChange={(value) =>
												updateReceiptItem(
													item.id,
													"condition",
													value as "good" | "damaged" | "partial",
												)
											}
											className="flex space-x-4"
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="good"
													id={`condition-good-${item.id}`}
												/>
												<Label
													htmlFor={`condition-good-${item.id}`}
													className="text-sm"
												>
													Good
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="damaged"
													id={`condition-damaged-${item.id}`}
												/>
												<Label
													htmlFor={`condition-damaged-${item.id}`}
													className="text-sm"
												>
													Damaged
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="partial"
													id={`condition-partial-${item.id}`}
												/>
												<Label
													htmlFor={`condition-partial-${item.id}`}
													className="text-sm"
												>
													Partial
												</Label>
											</div>
										</RadioGroup>
									</div>

									<div className="space-y-2">
										<Label htmlFor={`notes-${item.id}`} className="text-sm">
											Notes
										</Label>

										<Textarea
											id={`notes-${item.id}`}
											placeholder="Add notes about condition, discrepancies, etc."
											value={item.notes}
											onChange={(e) =>
												updateReceiptItem(item.id, "notes", e.target.value)
											}
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="received-by">Received By</Label>

					<Input id="received-by" defaultValue="John Doe" />
				</div>

				<div className="space-y-2">
					<Label htmlFor="additional-notes">Additional Notes</Label>

					<Textarea
						id="additional-notes"
						placeholder="Any additional notes about the delivery..."
					/>
				</div>

				<div className="flex items-center space-x-2">
					<Checkbox id="quality-check" />
					<Label htmlFor="quality-check">Quality check performed</Label>
				</div>
			</div>

			<div className="flex flex-wrap gap-4 justify-end">
				<Button variant="outline">
					<Save className="h-4 w-4 mr-2" />
					Save Draft
				</Button>

				<Button variant="outline">
					<Download className="h-4 w-4 mr-2" />
					Download PDF
				</Button>

				<Button>
					<CheckCircle2 className="h-4 w-4 mr-2" />
					Confirm Receipt
				</Button>
			</div>
		</div>
	);
}
