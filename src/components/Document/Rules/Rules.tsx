"use client";

import { Fragment, useRef, useState } from "react";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { createUUID } from "@/lib/utils";
import { SupportedDocTypes } from "@/types/general-enums";
import { DueDate, RuleOperator, RuleType } from "./enums";
import Rules, { Rule, RuleOption } from "./filters";
import { ruleViewOptions, ruleViewToFilterOptions } from "./utils";
import { useDocType } from "@/contexts/luminaStore";

export const RulesView: React.FC = () => {
	const [selectedView, setSelectedView] = useState<RuleType | null>(null);
	const [commandInput, setCommandInput] = useState("");
	const [open, setOpen] = useState(false);

	const docType = useDocType();

	const [rules, setRules] = useState<Array<Rule>>(
		docType === SupportedDocTypes.Mortgage
			? [
					{
						value: ["local employee"],
						operator: RuleOperator.IS,
						type: RuleType.EMPLOYMENT_TYPE,
						id: createUUID(),
					},
				]
			: docType === SupportedDocTypes.Commission
				? [
						{
							value: ["Contract"],
							operator: RuleOperator.IS,
							type: RuleType.DOCUMENT_TYPE,
							id: createUUID(),
						},
						{
							value: ["Commission"],
							operator: RuleOperator.INCLUDE,
							type: RuleType.TEXT,
							id: createUUID(),
						},
					]
				: [
						{
							value: ["Lloyd Bowers"],
							operator: RuleOperator.IS,
							type: RuleType.VENDOR_NAME,
							id: createUUID(),
						},
						{
							value: ["4000"],
							type: RuleType.AMOUNT,
							id: createUUID(),
							operator: RuleOperator.GT,
						},
					],
	);

	const commandInputRef = useRef<HTMLInputElement>(null);

	const shouldShowInput =
		!!selectedView &&
		[RuleType.VENDOR_NAME, RuleType.EMPLOYMENT_TYPE].includes(selectedView);

	const handleOnOpenChange = (newIsOpen: boolean) => {
		setOpen(newIsOpen);

		if (!newIsOpen) {
			setTimeout(() => {
				setSelectedView(null);
				setCommandInput("");
			}, 200);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			setSelectedView(null);
			setCommandInput("");
			setOpen(false);

			setRules((prev) => [
				...prev,
				{
					value: [(event.target as HTMLInputElement).value],
					operator: RuleOperator.IS,
					type: selectedView!,
					id: createUUID(),
				},
			]);
		}
	};

	return (
		<section
			className="flex items-start gap-2 w-full flex-wrap"
			title="If these rules apply, then do this workflow"
			aria-label="Rules"
		>
			{/* <span className="text-xs text-muted h-6 flex items-center">If</span> */}

			<Rules rules={rules} setRules={setRules} />

			{/* {rules.filter((filter) => filter.value?.length > 0).length > 0 && (
				<Button
					className="group h-6 text-xs items-center rounded-sm"
					onClick={() => setRules([])}
					variant="outline"
					size="sm"
				>
					Clear rules
				</Button>
			)} */}

			<Popover onOpenChange={handleOnOpenChange} open={open}>
				<PopoverTrigger>
					{/* <Button
						className="group h-6 text-xs rounded-sm flex gap-1.5 items-center data-[has-rules=true]:w-6"
						data-has-rules={hasRules}
						aria-expanded={open}
						variant="ghost"
						role="combobox"
						size="sm"
					>
						<ListFilter className="size-3 shrink-0 " />

						{hasRules ? null : "Rules"}
					</Button> */}
				</PopoverTrigger>

				{/* <span className="text-xs text-muted h-6 flex items-center">then do this workflow:</span> */}

				<PopoverContent className="w-[200px] p-0" data-rules-root>
					{shouldShowInput ? (
						<fieldset className="">
							<Input
								placeholder={`Type a ${selectedView}`}
								className="w-full border-none"
								onKeyDown={handleKeyDown}
								type="text"
								autoFocus
							/>
						</fieldset>
					) : (
						<Command className="border-none">
							<CommandInput
								onInputCapture={(e) => {
									setCommandInput(e.currentTarget.value);
								}}
								placeholder={selectedView ? selectedView : "Rule..."}
								ref={commandInputRef}
								value={commandInput}
								className="h-9"
							/>

							<CommandList>
								<CommandEmpty>No results found.</CommandEmpty>

								{selectedView ? (
									<CommandGroup>
										{ruleViewToFilterOptions[selectedView].map(
											(filter: RuleOption) => (
												<CommandItem
													className="group flex gap-2 items-center"
													value={filter.name}
													key={filter.name}
													onSelect={(currentValue) => {
														setOpen(false);

														setRules((prev) => [
															...prev,
															{
																value: [currentValue],
																type: selectedView,
																id: createUUID(),
																operator:
																	selectedView === RuleType.DUE_DATE &&
																	currentValue !== DueDate.IN_THE_PAST
																		? RuleOperator.BEFORE
																		: RuleOperator.IS,
															},
														]);

														setTimeout(() => {
															setSelectedView(null);
															setCommandInput("");
														}, 200);
													}}
												>
													{filter.icon}

													<span className="">{filter.name}</span>

													{filter.label && (
														<span className="text-xs ml-auto">
															{filter.label}
														</span>
													)}
												</CommandItem>
											),
										)}
									</CommandGroup>
								) : (
									ruleViewOptions.map((group: RuleOption[], index: number) => (
										<Fragment key={index}>
											<CommandGroup>
												{group.map((filter: RuleOption) => (
													<CommandItem
														className="group flex gap-2 items-center"
														value={filter.name}
														key={filter.name}
														onSelect={(currentValue) => {
															setSelectedView(currentValue as RuleType);
															setCommandInput("");

															commandInputRef.current?.focus();
														}}
													>
														{filter.icon}

														<span className="">{filter.name}</span>
													</CommandItem>
												))}
											</CommandGroup>

											{index < ruleViewOptions.length - 1 && (
												<CommandSeparator />
											)}
										</Fragment>
									))
								)}
							</CommandList>
						</Command>
					)}
				</PopoverContent>
			</Popover>
		</section>
	);
};
