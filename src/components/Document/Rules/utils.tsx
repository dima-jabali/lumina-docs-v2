import {
	Assignee,
	DueDate,
	RuleType,
	Labels,
	Priority,
	Status,
	Fields,
} from "./enums";
import { FilterIcon } from "./FilterIcon";
import type { RuleOption } from "./filters";

export const ruleViewOptions: RuleOption[][] = [
	[
		{
			name: RuleType.AMOUNT,
			icon: <FilterIcon type={RuleType.VENDOR_NAME} />,
		},
		{
			name: RuleType.VENDOR_NAME,
			icon: <FilterIcon type={RuleType.VENDOR_NAME} />,
		},
		{
			name: RuleType.STATUS,
			icon: <FilterIcon type={RuleType.STATUS} />,
		},
		{
			name: RuleType.ASSIGNEE,
			icon: <FilterIcon type={RuleType.ASSIGNEE} />,
		},
		{
			name: RuleType.LABELS,
			icon: <FilterIcon type={RuleType.LABELS} />,
		},
		{
			name: RuleType.PRIORITY,
			icon: <FilterIcon type={RuleType.PRIORITY} />,
		},
	],
	[
		{
			name: RuleType.DUE_DATE,
			icon: <FilterIcon type={RuleType.DUE_DATE} />,
		},
		{
			name: RuleType.CREATED_DATE,
			icon: <FilterIcon type={RuleType.CREATED_DATE} />,
		},
		{
			name: RuleType.UPDATED_DATE,
			icon: <FilterIcon type={RuleType.UPDATED_DATE} />,
		},
	],
];

export const statusRuleOptions: RuleOption[] = Object.values(Status).map(
	(status) => ({
		name: status,
		icon: <FilterIcon type={status} />,
	}),
);

export const employmentTypeRuleOptions: RuleOption[] = Object.values(
	Fields,
).map((field) => ({
	name: field,
	icon: <FilterIcon type={field} />,
}));

export const vendorNameRuleOptions: RuleOption[] = Object.values(Fields).map(
	(field) => ({
		name: field,
		icon: <FilterIcon type={field} />,
	}),
);

export const amountRuleOptions: RuleOption[] = Object.values(Fields).map(
	(field) => ({
		name: field,
		icon: <FilterIcon type={field} />,
	}),
);

export const assigneeRuleOptions: RuleOption[] = Object.values(Assignee).map(
	(assignee) => ({
		name: assignee,
		icon: <FilterIcon type={assignee} />,
	}),
);

export const labelRuleOptions: RuleOption[] = Object.values(Labels).map(
	(label) => ({
		name: label,
		icon: <FilterIcon type={label} />,
	}),
);

export const priorityRuleOptions: RuleOption[] = Object.values(Priority).map(
	(priority) => ({
		name: priority,
		icon: <FilterIcon type={priority} />,
	}),
);

export const dateRuleOptions: RuleOption[] = Object.values(DueDate).map(
	(date) => ({
		name: date,
		icon: undefined,
	}),
);

export const textRuleOptions: RuleOption[] = Object.values(Fields).map(
	(text) => ({
		name: text,
		icon: <FilterIcon type={text} />,
	}),
);

export const documentTypeRuleOptions: RuleOption[] = Object.values(Fields).map(
	(docType) => ({
		name: docType,
		icon: <FilterIcon type={docType} />,
	}),
);

export const ruleViewToFilterOptions: Record<RuleType, RuleOption[]> = {
	[RuleType.DOCUMENT_TYPE]: documentTypeRuleOptions,
	[RuleType.TEXT]: textRuleOptions,
	[RuleType.AMOUNT]: amountRuleOptions,
	[RuleType.VENDOR_NAME]: vendorNameRuleOptions,
	[RuleType.EMPLOYMENT_TYPE]: employmentTypeRuleOptions,
	[RuleType.STATUS]: statusRuleOptions,
	[RuleType.ASSIGNEE]: assigneeRuleOptions,
	[RuleType.LABELS]: labelRuleOptions,
	[RuleType.PRIORITY]: priorityRuleOptions,
	[RuleType.DUE_DATE]: dateRuleOptions,
	[RuleType.CREATED_DATE]: dateRuleOptions,
	[RuleType.UPDATED_DATE]: dateRuleOptions,
};
