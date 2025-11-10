"use client";

import { Plus, Trash2, Save, Send, Download } from "lucide-react";
import { useState, type ComponentProps, type PropsWithChildren } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card, CardContent } from "../ui/card";

type LineItem = {
	id: number;
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
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

export function PurchaseOrderForm() {
	const [lineItems, setLineItems] = useState<LineItem[]>([
		{
			id: 1,
			description: "Improve",
			quantity: 2,
			unitPrice: 472.62,
			total: 945.24,
		},
		{
			id: 2,
			description: "Lawyer",
			quantity: 3,
			unitPrice: 922.02,
			total: 2766.06,
		},
	]);

	const addLineItem = () => {
		const newId =
			lineItems.length > 0
				? Math.max(...lineItems.map((item) => item.id)) + 1
				: 1;
		setLineItems([
			...lineItems,
			{ id: newId, description: "", quantity: 1, unitPrice: 0, total: 0 },
		]);
	};

	const removeLineItem = (id: number) => {
		if (lineItems.length > 1) {
			setLineItems(lineItems.filter((item) => item.id !== id));
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const updateLineItem = (id: number, field: keyof LineItem, value: any) => {
		setLineItems(
			lineItems.map((item) => {
				if (item.id === id) {
					const updatedItem = { ...item, [field]: value };

					// Recalculate total if quantity or unitPrice changes
					if (field === "quantity" || field === "unitPrice") {
						updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
					}

					return updatedItem;
				}
				return item;
			}),
		);
	};

	const calculateSubtotal = () => {
		return lineItems.reduce((sum, item) => sum + item.total, 0);
	};

	const subtotal = calculateSubtotal();
	const tax = subtotal * 0.1; // Assuming 10% tax
	const total = subtotal + tax;

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-start">
				<div>
					<h2 className="text-2xl font-bold">Purchase Order</h2>
					<p className="text-muted-foreground">PO-2023-0042</p>
				</div>
				<div className="text-right">
					<p className="font-medium">Date: {new Date().toLocaleDateString()}</p>
					<p className="text-muted-foreground">Status: Draft</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-4">
					<h3 className="font-medium">From (Your Company)</h3>
					<div className="space-y-2">
						<Label htmlFor="company-name">Company Name</Label>

						<Input id="company-name" defaultValue="Lloyd-Bowers" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="company-address">Address</Label>

						<Textarea
							id="company-address"
							defaultValue="9207 Johnson Circle Apt. 689, Veronicaton, WI 55694"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="company-phone">Phone</Label>

							<Input id="company-phone" defaultValue="(415) 555-1234" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="company-email">Email</Label>

							<Input id="company-email" defaultValue="procurement@acme.com" />
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="font-medium">To (Supplier)</h3>
					<div className="space-y-2">
						<Label htmlFor="supplier">Supplier</Label>

						<Select defaultValue="supplier1">
							<SelectTrigger>
								<SelectValue placeholder="Select supplier" />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="supplier1">BetterBrain</SelectItem>
								<SelectItem value="supplier2">Global Widgets Co.</SelectItem>
								<SelectItem value="supplier3">Office Solutions Ltd.</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="supplier-address">Address</Label>

						<Textarea
							id="supplier-address"
							defaultValue="USCGC Arellano, FPO AA 88650"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="supplier-contact">Contact Person</Label>

							<Input id="supplier-contact" defaultValue="Jane Smith" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="supplier-email">Email</Label>

							<Input
								id="supplier-email"
								defaultValue="sales@techsupplies.com"
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h3 className="font-medium">Line Items</h3>
					<Button variant="outline" size="sm" onClick={addLineItem}>
						<Plus className="h-4 w-4 mr-2" />
						Add Item
					</Button>
				</div>

				<div className="space-y-4">
					<div className="grid grid-cols-12 gap-4 font-medium text-xs text-muted-foreground px-2">
						<div className="col-span-5">Description</div>
						<div className="col-span-2">Quantity</div>
						<div className="col-span-2">Unit Price</div>
						<div className="col-span-2">Total</div>
						<div className="col-span-1"></div>
					</div>

					<Separator />

					{lineItems.map((item) => (
						<div key={item.id} className="grid grid-cols-12 gap-4 items-center">
							<div className="col-span-5">
								<Input
									value={item.description}
									onChange={(e) =>
										updateLineItem(item.id, "description", e.target.value)
									}
									placeholder="Item description"
								/>
							</div>
							<div className="col-span-2">
								<Input
									type="number"
									min="1"
									value={item.quantity}
									onChange={(e) =>
										updateLineItem(
											item.id,
											"quantity",
											Number.parseInt(e.target.value) || 0,
										)
									}
								/>
							</div>
							<div className="col-span-2">
								<Input
									type="number"
									min="0"
									step="0.01"
									value={item.unitPrice}
									onChange={(e) =>
										updateLineItem(
											item.id,
											"unitPrice",
											Number.parseFloat(e.target.value) || 0,
										)
									}
									className="text-right"
								/>
							</div>
							<div className="col-span-2">
								<Input
									value={`$${item.total.toFixed(2)}`}
									readOnly
									className="text-right"
								/>
							</div>
							<div className="col-span-1 text-right">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => removeLineItem(item.id)}
									disabled={lineItems.length === 1}
								>
									<Trash2 className="h-4 w-4 text-muted" />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="flex justify-end">
				<Card className="w-full md:w-72">
					<CardContent className="pt-6">
						<div className="space-y-2">
							<div className="flex justify-between">
								<span>Subtotal:</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span>Tax (10%):</span>
								<span>${tax.toFixed(2)}</span>
							</div>
							{/* <Separator className="my-2" /> */}
							<div className="flex justify-between font-medium">
								<span>Total:</span>
								<span>${total.toFixed(2)}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="payment-terms">Payment Terms</Label>

					<Select defaultValue="net30">
						<SelectTrigger>
							<SelectValue placeholder="Select payment terms" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="net15">Net 15</SelectItem>
							<SelectItem value="net30">Net 30</SelectItem>
							<SelectItem value="net60">Net 60</SelectItem>
							<SelectItem value="cod">Cash on Delivery</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="notes">Notes</Label>

					<Textarea
						id="notes"
						placeholder="Additional notes or special instructions..."
					/>
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
					<Send className="h-4 w-4 mr-2" />
					Send to Supplier
				</Button>
			</div>
		</div>
	);
}
