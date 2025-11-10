"use client";

import { Plus, Trash2 } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface Field {
	required: boolean;
	name: string;
	type: string;
}

interface CreateDocumentTypeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreateType: (type: {
		name: string;
		description: string;
		fieldCount: number;
		schema: { fields: Field[] };
	}) => void;
}

export function CreateDocumentTypeDialog({
	open,
	onOpenChange,
	onCreateType,
}: CreateDocumentTypeDialogProps) {
	const [fields, setFields] = useState<Field[]>([
		{ name: "", type: "string", required: true },
	]);
	const [description, setDescription] = useState("");
	const [name, setName] = useState("");

	const handleAddField = () => {
		setFields([...fields, { name: "", type: "string", required: true }]);
	};

	const handleRemoveField = (index: number) => {
		setFields(fields.filter((_, i) => i !== index));
	};

	const handleFieldChange = (
		index: number,
		key: keyof Field,
		value: string | boolean,
	) => {
		const newFields = [...fields];
		// @ts-expect-error => ignore
		newFields[index] = { ...newFields[index], [key]: value };
		setFields(newFields);
	};

	const handleSubmit = () => {
		if (!name || fields.some((f) => !f.name)) return;

		onCreateType({
			name,
			description,
			fieldCount: fields.length,
			schema: { fields },
		});

		// Reset form
		setName("");
		setDescription("");
		setFields([{ name: "", type: "string", required: true }]);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Create Document Type</DialogTitle>
					<DialogDescription>
						Define a new document type with custom schema fields
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					<div className="space-y-2">
						<label htmlFor="name">Type Name</label>

						<Input
							placeholder="e.g., Invoice, Receipt, Contract"
							onChange={(e) => setName(e.target.value)}
							value={name}
							id="name"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="description">Description</label>

						<Textarea
							placeholder="Brief description of this document type"
							onChange={(e) => setDescription(e.target.value)}
							value={description}
							id="description"
							rows={2}
						/>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<label>Schema Fields</label>

							<Button
								onClick={handleAddField}
								variant="outline"
								type="button"
								size="sm"
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Field
							</Button>
						</div>

						<div className="space-y-3">
							{fields.map((field, index) => (
								<div
									className="flex items-end gap-3 rounded-lg border border-border p-3"
									key={index}
								>
									<div className="flex-1 space-y-2">
										<label className="text-xs">Field Name</label>

										<Input
											placeholder="e.g., invoiceNumber"
											value={field.name}
											onChange={(e) =>
												handleFieldChange(index, "name", e.target.value)
											}
										/>
									</div>

									<div className="w-32 space-y-2">
										<label className="text-xs">Type</label>

										<Select
											value={field.type}
											onValueChange={(value) =>
												handleFieldChange(index, "type", value)
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>

											<SelectContent>
												<SelectItem value="string">String</SelectItem>
												<SelectItem value="number">Number</SelectItem>
												<SelectItem value="date">Date</SelectItem>
												<SelectItem value="boolean">Boolean</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="flex items-center space-x-2 pb-2">
										<Checkbox
											id={`required-${index}`}
											checked={field.required}
											onCheckedChange={(checked) =>
												handleFieldChange(index, "required", checked === true)
											}
										/>

										<label htmlFor={`required-${index}`} className="text-xs">
											Required
										</label>
									</div>

									{fields.length > 1 && (
										<Button
											onClick={() => handleRemoveField(index)}
											className="mb-1"
											variant="ghost"
											type="button"
											size="icon"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>

					<Button
						disabled={!name || fields.some((f) => !f.name)}
						onClick={handleSubmit}
					>
						Create Type
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
