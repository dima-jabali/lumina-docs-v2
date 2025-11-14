"use client";

import * as React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { globalStore, type ValidationRule } from "@/contexts/luminaStore";
import type { SupportedDocTypes } from "@/types/general-enums";

interface CreateApplicationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreateApp: (app: {
		documentTypesId: Array<SupportedDocTypes>;
		validationRules: ValidationRule[];
		description: string;
		name: string;
	}) => void;
}

export function CreateApplicationDialog({
	open,
	onOpenChange,
	onCreateApp,
}: CreateApplicationDialogProps) {
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [selectedDocTypes, setSelectedDocTypes] = React.useState<
		Array<SupportedDocTypes>
	>([]);
	const [rules, setRules] = React.useState<ValidationRule[]>([
		{
			id: "1",
			name: "",
			description: "",
			type: "application",
			conditionNotMet: "",
		},
	]);

	const documentTypes = globalStore.use.documentTypes();

	const handleAddRule = () => {
		setRules([
			...rules,
			{
				id: Date.now().toString(),
				name: "",
				description: "",
				type: "application",
				conditionNotMet: "",
			},
		]);
	};

	const handleRemoveRule = (id: string) => {
		if (rules.length > 1) {
			setRules(rules.filter((r) => r.id !== id));
		}
	};

	const handleRuleChange = (
		id: string,
		key: keyof ValidationRule,
		value: string,
	) => {
		setRules(rules.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
	};

	const handleDocTypeToggle = (docTypeId: SupportedDocTypes) => {
		setSelectedDocTypes((prev) =>
			prev.includes(docTypeId)
				? prev.filter((d) => d !== docTypeId)
				: [...prev, docTypeId],
		);
	};

	const handleSubmit = () => {
		if (!name || selectedDocTypes.length === 0) return;

		const validRules = rules.filter((r) => r.name.trim());

		onCreateApp({
			name,
			description,
			documentTypesId: selectedDocTypes,
			validationRules: validRules,
		});

		// Reset form
		setName("");
		setDescription("");
		setSelectedDocTypes([]);
		setRules([
			{
				id: "1",
				name: "",
				description: "",
				type: "application",
				conditionNotMet: "",
			},
		]);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Create Application</DialogTitle>

					<DialogDescription>
						Configure a new document processing application with validation
						rules
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					<div className="space-y-2">
						<label htmlFor="name">Application Name</label>

						<Input
							placeholder="e.g., Mortgage Application, Employment Verification"
							onChange={(e) => setName(e.target.value)}
							value={name}
							id="name"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="description">Description</label>

						<Textarea
							placeholder="Brief description of this application"
							onChange={(e) => setDescription(e.target.value)}
							value={description}
							id="description"
							rows={2}
						/>
					</div>

					<div className="space-y-3">
						<label>Document Types</label>

						<div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
							{documentTypes.map((docType) => (
								<div key={docType.id} className="flex items-center space-x-2">
									<Checkbox
										onCheckedChange={() => handleDocTypeToggle(docType.id)}
										checked={selectedDocTypes.includes(docType.id)}
										id={docType.id}
									/>

									<label
										htmlFor={docType.id}
										className="text-sm font-normal cursor-pointer"
									>
										{docType.id}
									</label>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<label>Validation Rules</label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleAddRule}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Rule
							</Button>
						</div>

						<div className="space-y-3">
							{rules.map((rule) => (
								<div
									key={rule.id}
									className="rounded-lg border border-border p-4 space-y-3"
								>
									<div className="grid grid-cols-2 gap-3">
										<div className="space-y-2">
											<label className="text-xs">Rule Name</label>

											<Input
												placeholder="e.g., Payslip Currency"
												value={rule.name}
												onChange={(e) =>
													handleRuleChange(rule.id, "name", e.target.value)
												}
											/>
										</div>

										<div className="space-y-2">
											<label className="text-xs">Rule Type</label>

											<Select
												onValueChange={(value) =>
													handleRuleChange(rule.id, "type", value)
												}
												value={rule.type}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>

												<SelectContent>
													<SelectItem value="field">Field-level</SelectItem>
													<SelectItem value="document">
														Document-level
													</SelectItem>
													<SelectItem value="application">
														Application-level
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>

									{rule.type === "field" && (
										<div className="space-y-2">
											<label className="text-xs">Document Type</label>

											<Select
												onValueChange={(value) =>
													handleRuleChange(rule.id, "documentTypeId", value)
												}
												defaultValue={
													documentTypes.find(
														(dt) => dt.id === rule.documentTypeId,
													)?.id
												}
											>
												<SelectTrigger>
													{documentTypes.find(
														(dt) => dt.id === rule.documentTypeId,
													)?.id || (
														<i className="text-muted">Select a document type</i>
													)}
												</SelectTrigger>

												<SelectContent>
													{documentTypes.map((dt) => (
														<SelectItem key={dt.id} value={dt.id}>
															{dt.id}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									)}

									{rule.documentTypeId ? (
										<div className="space-y-2">
											<label className="text-xs">Field from Document</label>

											<Select
												onValueChange={(value) =>
													handleRuleChange(rule.id, "documentField", value)
												}
												value={rule.documentField}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select a document field" />
												</SelectTrigger>

												<SelectContent>
													{documentTypes
														.find((dt) => dt.id === rule.documentTypeId)
														?.schema.fields.map((field) => (
															<SelectItem key={field.name} value={field.name}>
																{field.name}
															</SelectItem>
														))}
												</SelectContent>
											</Select>
										</div>
									) : null}

									<div className="space-y-2">
										<label className="text-xs">Description</label>

										<Input
											placeholder="What does this rule validate?"
											value={rule.description}
											onChange={(e) =>
												handleRuleChange(rule.id, "description", e.target.value)
											}
										/>
									</div>

									<div className="space-y-2">
										<label className="text-xs">Condition</label>

										<Input
											placeholder="e.g., Ask for correct document"
											value={rule.conditionNotMet}
											onChange={(e) =>
												handleRuleChange(
													rule.id,
													"conditionNotMet",
													e.target.value,
												)
											}
										/>
									</div>

									{rules.length > 1 && (
										<Button
											onClick={() => handleRemoveRule(rule.id)}
											className="w-full"
											variant="ghost"
											type="button"
											size="sm"
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Remove Rule
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
						onClick={handleSubmit}
						disabled={!name || selectedDocTypes.length === 0}
					>
						Create Application
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
