export enum RuleType {
	EMPLOYMENT_TYPE = "Employment Type",
	DOCUMENT_TYPE = "Document Type",
	VENDOR_NAME = "Vendor Name",
	TEXT = "Text",

	AMOUNT = "Amount",
	STATUS = "Status",
	ASSIGNEE = "Assignee",
	LABELS = "Labels",
	PRIORITY = "Priority",
	DUE_DATE = "Due date",
	CREATED_DATE = "Created date",
	UPDATED_DATE = "Updated date",
}

export enum RuleOperator {
	IS = "is",
	IS_NOT = "is not",
	IS_ANY_OF = "is any of",
	INCLUDE = "includes",
	DO_NOT_INCLUDE = "do not include",
	INCLUDE_ALL_OF = "include all of",
	INCLUDE_ANY_OF = "include any of",
	EXCLUDE_ALL_OF = "exclude all of",
	EXCLUDE_IF_ANY_OF = "exclude if any of",
	BEFORE = "before",
	AFTER = "after",
	GT = "greater than",
	LT = "less than",
	GTE = "greater or equal than",
	LTE = "less or equal than",
}

export enum Status {
	BACKLOG = "Backlog",
	TODO = "Todo",
	IN_PROGRESS = "In Progress",
	IN_REVIEW = "In Review",
	DONE = "Done",
	CANCELLED = "Cancelled",
}

export enum Fields {
	VENDOR_NAME = "Vendor Name",
	AMOUNT = "Amount",
	TEXT = "Text",
}

export enum Assignee {
	ANDREW_LUO = "Andrew Luo",
	NO_ASSIGNEE = "No assignee",
}

export enum Labels {
	BUG = "Bug",
	FEATURE = "Feature",
	HOTFIX = "Hotfix",
	RELEASE = "Release",
}

export enum Priority {
	URGENT = "Urgent",
	HIGH = "High",
	MEDIUM = "Medium",
	LOW = "Low",
}

export enum DueDate {
	IN_THE_PAST = "in the past",
	IN_24_HOURS = "24 hours from now",
	IN_3_DAYS = "3 days from now",
	IN_1_WEEK = "1 week from now",
	IN_1_MONTH = "1 month from now",
	IN_3_MONTHS = "3 months from now",
}
