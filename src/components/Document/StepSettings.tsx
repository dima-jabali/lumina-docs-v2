"use client";

import { Plus, Settings, Trash2 } from "lucide-react";
import { useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import type {
	FileMetadataStep,
	FileMetadataStepWithoutSubSteps,
} from "@/types/organization";

export const StepSettings: React.FC<{ step: FileMetadataStep }> = ({
	step,
}) => {
	step.subSteps.at(0);

	const [newSubSteps, setNewSubSteps] = useState<
		Array<FileMetadataStepWithoutSubSteps>
	>(
		step.subSteps ?? [
			{
				currentSubStep: 0,
				description: "",
				isAutomated: false,
				isCompleted: false,
				dealsWithSubFiles: false,
				step: 1,
				title: "",
				chatMessages: [],
			},
		],
	);

	const addLineItem = () => {
		setNewSubSteps((prev) => [
			...prev,
			{
				currentSubStep: 0,
				description: "",
				isAutomated: false,
				dealsWithSubFiles: false,
				isCompleted: false,
				step: prev.length,
				title: "",
				chatMessages: [],
				subSteps: [],
			},
		]);
	};

	const removeLineItem = (item: FileMetadataStepWithoutSubSteps) => {
		if (newSubSteps.length > 1) {
			setNewSubSteps((prev) => prev.filter((i) => i !== item));
		}
	};

	const updateLineItem = (
		subStep: FileMetadataStepWithoutSubSteps,
		field: keyof FileMetadataStep,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
	) => {
		setNewSubSteps((prev) =>
			prev.map((item) => {
				if (item === subStep) {
					const updatedItem = { ...item, [field]: value };

					return updatedItem;
				}

				return item;
			}),
		);
	};

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<Dialog>
			<DialogTrigger className="flex items-center gap-2 rounded-sm button-hover w-full p-2 pr-4 text-xs">
				<Settings className="size-3" />

				<span>Settings</span>
			</DialogTrigger>

			<DialogContent overlayClassName="z-60" className="z-60">
				<DialogHeader>Step settings</DialogHeader>

				<DialogDescription>Edit step and its sub-steps</DialogDescription>

				<form className="flex flex-col gap-4" onSubmit={handleSave}>
					<fieldset className="flex flex-col gap-0">
						<label className="text-xs">Title</label>

						<Input className="h-8" defaultValue={step.title} />
					</fieldset>

					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="font-medium">Line Items</h3>
							<Button variant="outline" size="sm" onClick={addLineItem}>
								<Plus className="h-4 w-4 mr-2" />
								Add Item
							</Button>
						</div>

						<Separator />

						<div className="space-y-4">
							<div className="font-medium text-xs text-muted-foreground px-2">
								<div className="col-span-5">Title</div>
							</div>

							{newSubSteps.map((subStep, index) => (
								<div
									className="flex items-center justify-between gap-4"
									key={`${subStep.step}${index}`}
								>
									<div>
										<Input
											className="w-full"
											onChange={(e) =>
												updateLineItem(subStep, "title", e.target.value)
											}
											placeholder="Substep title"
											value={subStep.title}
										/>
									</div>

									<div className="col-span-1 text-right">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => removeLineItem(subStep)}
											disabled={newSubSteps.length === 1}
										>
											<Trash2 className="h-4 w-4 text-muted" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>

					<Button onClick={handleSave}>Save</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
