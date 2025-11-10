import { Check, X } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";

import {
	Assignee,
	DueDate,
	Labels,
	Priority,
	RuleOperator,
	RuleType,
	Status,
	type Fields,
} from "./enums";
import { FilterIcon } from "./FilterIcon";
import { ruleViewToFilterOptions } from "./utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export type RuleOption = {
	name: RuleType | Status | Assignee | Labels | Priority | DueDate | Fields;
	icon: React.ReactNode | undefined;
	label?: string;
};

export type Rule = {
	operator: RuleOperator;
	value: Array<string>;
	type: RuleType;
	id: string;
};

const ruleOperators = ({
	ruleValues,
	ruleType,
}: {
	ruleValues: Array<string>;
	ruleType: RuleType;
}) => {
	switch (ruleType) {
		case RuleType.STATUS:
		case RuleType.ASSIGNEE:
		case RuleType.PRIORITY:
			if (Array.isArray(ruleValues) && ruleValues.length > 1) {
				return [RuleOperator.IS_ANY_OF, RuleOperator.IS_NOT];
			} else {
				return [RuleOperator.IS, RuleOperator.IS_NOT];
			}
		case RuleType.AMOUNT: {
			return [
				RuleOperator.LT,
				RuleOperator.GTE,
				RuleOperator.LTE,
				RuleOperator.GT,
			];
		}
		case RuleType.LABELS:
			if (Array.isArray(ruleValues) && ruleValues.length > 1) {
				return [
					RuleOperator.INCLUDE_ANY_OF,
					RuleOperator.INCLUDE_ALL_OF,
					RuleOperator.EXCLUDE_ALL_OF,
					RuleOperator.EXCLUDE_IF_ANY_OF,
				];
			} else {
				return [RuleOperator.INCLUDE, RuleOperator.DO_NOT_INCLUDE];
			}
		case RuleType.DUE_DATE:
		case RuleType.CREATED_DATE:
		case RuleType.UPDATED_DATE:
			if (ruleValues?.includes(DueDate.IN_THE_PAST)) {
				return [RuleOperator.IS, RuleOperator.IS_NOT];
			} else {
				return [RuleOperator.BEFORE, RuleOperator.AFTER];
			}
		default:
			return [];
	}
};

const RuleOperatorDropdown = ({
	ruleType,
	operator,
	ruleValues,
	setOperator,
}: {
	ruleValues: Array<string>;
	operator: RuleOperator;
	ruleType: RuleType;
	setOperator: (operator: RuleOperator) => void;
}) => {
	const operators = ruleOperators({ ruleType, ruleValues });

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="px-1.5 text-primary hover:bg-accent hover:text-white py-1 shrink-0 bg-muted-strong/50">
				{operator}
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				className="w-fit min-w-fit"
				data-rule-operator
			>
				{operators.map((operator) => (
					<DropdownMenuItem
						key={operator}
						onClick={() => setOperator(operator)}
					>
						{operator}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const RuleValueCombobox = ({
	ruleValues,
	ruleType,
	setRuleValues,
}: {
	ruleValues: Array<string>;
	ruleType: RuleType;
	setRuleValues: (ruleValues: Array<string>) => void;
}) => {
	const [commandInput, setCommandInput] = useState("");
	const [open, setOpen] = useState(false);

	const commandInputRef = useRef<HTMLInputElement>(null);

	const nonSelectedFilterValues = ruleViewToFilterOptions[ruleType]?.filter(
		(rule) => !ruleValues.includes(rule.name),
	);

	const handleOnOpenChange = (open: boolean) => {
		setOpen(open);

		if (!open) {
			setTimeout(() => {
				setCommandInput("");
			}, 200);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			setRuleValues([(event.target as HTMLInputElement).value]);
			setOpen(false);
		}
	};

	const shouldShowInput = [RuleType.VENDOR_NAME, RuleType.AMOUNT].includes(
		ruleType,
	);

	return (
		<Popover open={open} onOpenChange={handleOnOpenChange}>
			<PopoverTrigger className="rounded-none px-1.5 py-1 shrink-0 bg-muted-strong/50">
				<div className="flex gap-1.5 items-center">
					{ruleType !== RuleType.PRIORITY ? (
						shouldShowInput ? null : (
							<div
								className={cn(
									"flex items-center flex-row",
									ruleType === RuleType.LABELS ? "-space-x-1" : "-space-x-1.5",
								)}
							>
								{ruleValues?.slice(0, 3).map((value) => (
									<FilterIcon key={value} type={value as RuleType} />
								))}
							</div>
						)
					) : null}

					{ruleValues?.length === 1
						? ruleValues?.[0]
						: `${ruleValues?.length} selected`}
				</div>
			</PopoverTrigger>

			<PopoverContent className="w-[200px] p-0" data-rule-value-combobox>
				{shouldShowInput ? (
					<fieldset className="">
						<Input
							placeholder={`Type a ${ruleType}`}
							className="w-full border-none"
							onKeyDown={handleKeyDown}
							type="text"
							autoFocus
						/>
					</fieldset>
				) : (
					<Command className="border-none">
						<CommandInput
							onInputCapture={(e) => setCommandInput(e.currentTarget.value)}
							placeholder={ruleType}
							ref={commandInputRef}
							value={commandInput}
							className="h-9"
						/>

						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>

							<CommandGroup>
								{ruleValues.map((value) => (
									<CommandItem
										onSelect={() => {
											setRuleValues(ruleValues.filter((v) => v !== value));
											setOpen(false);

											setTimeout(() => {
												setCommandInput("");
											}, 200);
										}}
										className="group flex gap-2 items-center text-primary"
										key={value}
									>
										<Checkbox
											checked={true}
											className="data-[state=checked]:bg-white data-[state=checked]:border-white"
										/>

										<FilterIcon type={value as RuleType} />

										{value}
									</CommandItem>
								))}
							</CommandGroup>

							{nonSelectedFilterValues?.length > 0 && (
								<>
									<CommandSeparator />

									<CommandGroup>
										{nonSelectedFilterValues.map((ruleOption: RuleOption) => (
											<CommandItem
												onSelect={(currentValue: string) => {
													setRuleValues([...ruleValues, currentValue]);
													setCommandInput("");
													setOpen(false);
												}}
												className="group flex gap-2 items-center text-primary hover:text-white active:text-white"
												value={ruleOption.name}
												key={ruleOption.name}
											>
												<Checkbox
													className="opacity-0 group-data-[selected=true]:opacity-100 group-hover:border-white data-[state=checked]:bg-white  data-[state=checked]:border-white"
													checked={false}
												/>

												{ruleOption.icon}

												<span className="">{ruleOption.name}</span>

												{ruleOption.label && (
													<span className="text-muted-foreground text-xs ml-auto">
														{ruleOption.label}
													</span>
												)}
											</CommandItem>
										))}
									</CommandGroup>
								</>
							)}
						</CommandList>
					</Command>
				)}
			</PopoverContent>
		</Popover>
	);
};

const RuleValueDateCombobox = ({
	ruleValues,
	ruleType,
	setRuleValues,
}: {
	ruleValues: Array<string>;
	ruleType: RuleType;
	setRuleValues: (filterValues: Array<string>) => void;
}) => {
	const [commandInput, setCommandInput] = useState("");
	const [open, setOpen] = useState(false);

	const commandInputRef = useRef<HTMLInputElement>(null);

	return (
		<Popover
			open={open}
			onOpenChange={(open) => {
				setOpen(open);
				if (!open) {
					setTimeout(() => {
						setCommandInput("");
					}, 200);
				}
			}}
		>
			<PopoverTrigger className="rounded-none px-1.5 py-1 shrink-0">
				{ruleValues?.[0]}
			</PopoverTrigger>

			<PopoverContent className="w-fit p-0" data-rule-value-date-combobox>
				<Command>
					<CommandInput
						onInputCapture={(e) => {
							setCommandInput(e.currentTarget.value);
						}}
						placeholder={ruleType}
						ref={commandInputRef}
						value={commandInput}
						className="h-9"
					/>

					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>

						<CommandGroup>
							{ruleViewToFilterOptions[ruleType].map((filter: RuleOption) => (
								<CommandItem
									onSelect={(currentValue: string) => {
										setRuleValues([currentValue]);
										setTimeout(() => {
											setCommandInput("");
										}, 200);
										setOpen(false);
									}}
									className="group flex gap-2 items-center"
									value={filter.name}
									key={filter.name}
								>
									<span className="">{filter.name}</span>

									<Check
										className={cn(
											"ml-auto",
											ruleValues.includes(filter.name)
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default function Rules({
	rules,
	setRules,
}: {
	rules: Array<Rule>;
	setRules: Dispatch<SetStateAction<Array<Rule>>>;
}) {
	return (
		<div className="flex flex-wrap gap-2" data-rule>
			{rules
				.filter((rule) => rule.value?.length > 0)
				.map((rule) => (
					<div key={rule.id} className="flex gap-[1px] items-center text-xs">
						<div className="flex gap-1.5 shrink-0 rounded-l px-1.5 py-1 items-center bg-muted-strong/50">
							<FilterIcon type={rule.type} />

							{rule.type}
						</div>

						<RuleOperatorDropdown
							setOperator={(operator) => {
								setRules((prev) =>
									prev.map((f) => (f.id === rule.id ? { ...f, operator } : f)),
								);
							}}
							ruleValues={rule.value}
							operator={rule.operator}
							ruleType={rule.type}
						/>

						{rule.type === RuleType.CREATED_DATE ||
						rule.type === RuleType.UPDATED_DATE ||
						rule.type === RuleType.DUE_DATE ? (
							<RuleValueDateCombobox
								setRuleValues={(filterValues) => {
									setRules((prev) =>
										prev.map((f) =>
											f.id === rule.id ? { ...f, value: filterValues } : f,
										),
									);
								}}
								ruleValues={rule.value}
								ruleType={rule.type}
							/>
						) : (
							<RuleValueCombobox
								setRuleValues={(filterValues) => {
									setRules((prev) =>
										prev.map((f) =>
											f.id === rule.id ? { ...f, value: filterValues } : f,
										),
									);
								}}
								ruleValues={rule.value}
								ruleType={rule.type}
							/>
						)}

						<Button
							onClick={() => {
								setRules((prev) => prev.filter((f) => f.id !== rule.id));
							}}
							className="rounded-l-none bg-muted-strong/50 hover:bg-destructive hover:text-white rounded-r-sm size-6 shrink-0"
							variant="ghost"
							size="icon"
						>
							<X className="size-3" />
						</Button>
					</div>
				))}
		</div>
	);
}
