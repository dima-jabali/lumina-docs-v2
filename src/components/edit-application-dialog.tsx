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
import {
	globalStore,
	type Application,
	type ValidationRule,
} from "@/contexts/luminaStore";
import type { SupportedDocTypes } from "@/types/general-enums";

interface EditApplicationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	application: Application;
	onEditApp: (app: Application) => void;
}

export function EditApplicationDialog({
	open,
	onOpenChange,
	application,
	onEditApp,
}: EditApplicationDialogProps) {
	const [name, setName] = React.useState(application.id);
	const [description, setDescription] = React.useState(application.description);
	const [selectedDocTypes, setSelectedDocTypes] = React.useState<
		Array<SupportedDocTypes>
	>(application.documentTypesId);
	const [rules, setRules] = React.useState<ValidationRule[]>(
		application.validationRules,
	);

	const documentTypes = globalStore.use.documentTypes();

	React.useEffect(() => {
		setName(application.id);
		setDescription(application.description);
		setSelectedDocTypes(application.documentTypesId);
		setRules(application.validationRules);
	}, [application]);

	const handleAddRule = () => {
		setRules([
			...rules,
			{
				id: Date.now().toString(),
				type: "application",
				conditionNotMet: "",
				description: "",
				name: "",
			},
		]);
	};

	const handleRemoveRule = (id: string) => {
		setRules(rules.filter((r) => r.id !== id));
	};

	const handleRuleChange = (
		id: string,
		key: keyof ValidationRule,
		value: string,
	) => {
		setRules(rules.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
	};

	const handleDocTypeToggle = (docType: SupportedDocTypes) => {
		setSelectedDocTypes((prev) =>
			prev.includes(docType)
				? prev.filter((d) => d !== docType)
				: [...prev, docType],
		);
	};

	const handleSubmit = () => {
		if (!name || selectedDocTypes.length === 0) return;

		const validRules = rules.filter((r) => r.name.trim());

		onEditApp({
			...application,
			id: name,
			description,
			documentTypesId: selectedDocTypes,
			validationRules: validRules,
		});

		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Application</DialogTitle>

					<DialogDescription>
						Update the application configuration and validation rules
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					<div className="space-y-2">
						<label htmlFor="name">Application Name</label>

						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="description">Description</label>

						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
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
												value={rule.documentTypeId}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select a document type" />
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
											onChange={(e) =>
												handleRuleChange(rule.id, "description", e.target.value)
											}
											value={rule.description}
										/>
									</div>

									<div className="space-y-2">
										<label className="text-xs">
											What Happens If Condition Is Not Met
										</label>

										<Input
											onChange={(e) =>
												handleRuleChange(
													rule.id,
													"conditionNotMet",
													e.target.value,
												)
											}
											value={rule.conditionNotMet}
										/>
									</div>

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
						Update Application
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
