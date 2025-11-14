"use client";

import type { ColumnFiltersState } from "@tanstack/react-table";
import type { Tagged } from "type-fest";

import type { ChartConfig } from "@/components/ui/chart";
import {
	type FetchDocumentMetadataListQueryKey,
	useFileMetadata,
} from "@/hooks/fetch/use-fetch-document-metadata-list";
import type {
	CommissionFields,
	DocumentUuid,
	MortgageFields,
} from "@/types/document";
import { type ChartType, SupportedDocTypes, View } from "@/types/general-enums";
import {
	createISODate,
	createMessageUuid,
	type ISODateString,
	type Message,
	type OrganizationUuid,
} from "@/types/organization";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { createReactSelectors } from "./createZustandProvider";

export type DashboardProjectUuid = Tagged<string, "DashboardProjectUuid">;
export type DashboardItemUuid = Tagged<string, "DashboardItemUuid">;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DashboardItem<DataType = any> = {
	chart?: React.FC<{ item: DashboardItem }>;
	chartConfig: ChartConfig;
	uuid: DashboardItemUuid;
	chartType?: ChartType;
	description: string;
	data: DataType;
	name: string;
};

export type DashboardProject = {
	items: Array<DashboardItem>;
	uuid: DashboardProjectUuid;
	name: string;
};

export enum AdminTab {
	Applications = "Applications",
	DocumentTypes = "Document Types",
	Upload = "Upload",
	ReviewQueue = "Review Queue",
	Settings = "Settings",
}

type ExtractedField = {
	confidence: number;
	value: string;
	name: string;
	type: string;
};

export type Document_V2 = {
	status: "pending" | "approved" | "rejected";
	extractedData: ExtractedField[];
	documentType: string;
	uploadedAt: string;
	confidence: number;
	file: File | null;
	fileName: string;
	id: string;
};

export type LuminaDocsContextType = {
	fetchDocumentMetadataListQueryKey: FetchDocumentMetadataListQueryKey | null;

	fileMetadataUuid: DocumentUuid | null;
	docType: SupportedDocTypes | null;
	columnFilters: ColumnFiltersState;
	view: View;

	organizationUuid: OrganizationUuid;

	selectedSubFile: MortgageFields | CommissionFields | null;
	dashboardList: Array<DashboardProject>;
	dashboardChatMessages: Array<Message>;
	isStreaming: boolean;
	isChatOpen: boolean;

	applicationList: Array<Application>;
	documentTypes: Array<DocumentType>;
	documents: Array<Document_V2>;
	fileInReview: string | null;
	adminTab: AdminTab;

	emailThreadChatMessages: Array<Message> | null;
};

export type SchemaField = {
	type: "string" | "number" | "date" | "boolean";
	required: boolean;
	name: string;
};

export type DocumentType = {
	id: SupportedDocTypes;
	description: string;
	schema: {
		fields: SchemaField[];
	};
};

export type Application = {
	documentTypesId: Array<SupportedDocTypes>;
	validationRules: ValidationRule[];
	description: string;
	createdAt: string;
	id: string;
};

export type ValidationRule = {
	type: "field" | "document" | "application";
	documentTypeId?: SupportedDocTypes;
	chatMessages?: Array<Message>;
	conditionNotMet: string;
	documentField?: string;
	description: string;
	name: string;
	id: string;
};

const globalStoreBase = create(
	subscribeWithSelector<LuminaDocsContextType>(() => ({
		fetchDocumentMetadataListQueryKey: null,
		selectedSubFile: null,

		organizationUuid:
			"dbe0f417-2d39-4bb8-b74c-12b023aae761" as OrganizationUuid,

		docType: SupportedDocTypes.Mortgage,
		fileMetadataUuid: null,
		view: View.TableOfDocs,
		isStreaming: false,
		columnFilters: [
			{
				value: SupportedDocTypes.Mortgage,
				id: "file_type",
			},
		],

		emailThreadChatMessages: null,
		dashboardChatMessages: [],
		dashboardList: [],
		isChatOpen: false,

		fileInReview: null,
		adminTab: AdminTab.Applications,
		applicationList: [
			{
				id: SupportedDocTypes.Mortgage,
				description: "Mortgage loan processing with document validation",
				documentTypesId: [
					SupportedDocTypes.EmploymentVerification,
					SupportedDocTypes.Payslip,
					SupportedDocTypes.TaxReturn,
					SupportedDocTypes.UtilityBill,
				],
				validationRules: [
					{
						id: "r1",
						name: "Payslip Currency",
						description: "Payslip must be current as of last 3 months",
						type: "document",
						conditionNotMet: "Ask for a payslip from last 3 months",
					},
					{
						id: "r2",
						name: "Address Consistency",
						description:
							"Utility bill address must match bank statement address",
						type: "application",
						conditionNotMet: "Ask for a utility bill with matching address",
						missing: true,
						chatMessages: [
							{
								sender: "bot",
								showFooter: true,
								showSender: true,
								createdAt: "2025-11-14T10:00:00.000Z" as ISODateString,
								toggleText: "",
								type: "email",
								statusIndex: 0,
								statuses: [{ status: "success" }],
								uuid: createMessageUuid(),
								text: "**Action Required: Address Mismatch Found**\n\nWe have reviewed the utility bill you submitted for proof of address. The address listed on the document (`123 Elm St, Apt 2B`) does not match the address on your ID (`456 Oak Ave, Unit 1A`).\n\nTo proceed with your application, please provide one of the following:\n1. A different valid Proof of Address document that clearly shows your ID address (`456 Oak Ave, Unit 1A`).\n2. Confirmation of which address is the current, correct one.",
							},
							// 2. User replies they don't have another utility document (User to Bot)
							{
								sender: "user",
								showFooter: true,
								showSender: true,
								createdAt: "2025-11-14T10:15:00.000Z" as ISODateString,
								toggleText: "",
								statusIndex: 0,
								statuses: [{ status: "hidden" }],
								uuid: createMessageUuid(),
								type: "email",
								text: "Hi, I don't have another utility bill right now that shows the 456 Oak Ave address. The ID address is the correct one. What other documents can I use? I can't wait for a new utility bill to be generated.",
							},
							// 3. Agent asks which address is correct and lists alternatives (Bot to User)
							{
								sender: "bot",
								showFooter: true,
								showSender: true,
								createdAt: "2025-11-14T10:30:00.000Z" as ISODateString,
								toggleText: "",
								statusIndex: 0,
								statuses: [{ status: "hidden" }],
								uuid: createMessageUuid(),
								type: "email",

								text: "Thank you for confirming that **456 Oak Ave, Unit 1A** is your correct current address. \n\nSince you don't have another utility bill, here is a list of alternative Proof of Address documents we can accept, provided they are dated within the last 90 days and show your name and the correct address:\n\n* Bank or Credit Card Statement\n* Lease Agreement or Mortgage Statement\n* **Hospital or Medical Bill**\n* Government-issued tax document\n\nPlease upload one of these alternatives showing the address **456 Oak Ave, Unit 1A** to continue.",
							},
							// 4. User submits hospital bill (User to Bot - simulating upload confirmation)
							{
								sender: "user",
								showFooter: true,
								showSender: true,
								createdAt: "2025-11-14T11:05:00.000Z" as ISODateString,
								toggleText: "",
								statusIndex: 0,
								statuses: [{ status: "hidden" }],
								uuid: createMessageUuid(),
								type: "email",

								text: "I have uploaded a hospital bill dated last month. It clearly shows my name and the 456 Oak Ave, Unit 1A address.",
							},
							// 5. Agent marks as complete and correct (Bot to User)
							{
								sender: "bot",
								showFooter: true,
								showSender: true,
								createdAt: "2025-11-14T11:20:00.000Z" as ISODateString,
								toggleText: "",
								statusIndex: 0,
								statuses: [{ status: "hidden" }],
								uuid: createMessageUuid(),
								type: "email",

								text: "**Verification Complete!**\n\nWe have reviewed the hospital bill. The document is accepted and successfully confirms your address as **456 Oak Ave, Unit 1A**. \n\nThis verification step is now **complete and correct**. We will proceed with the next steps of your application.",
							},
						],
					},
					{
						id: "r3",
						name: "Required Documents",
						description: "All required documents must be submitted",
						type: "application",
						conditionNotMet: "Ask for all required documents",
						chatMessages: [
							{
								sender: "bot",
								showFooter: true,
								showSender: true,
								createdAt: createISODate(),
								toggleText: "",
								statusIndex: 0,
								statuses: [{ status: "success" as const }],
								uuid: createMessageUuid(),
								text: "## 🚨 Missing Required Document\n\nI've detected that the **Utility Bill (Proof of Billing)** is missing from your submitted documents for the Mortgage Application. \n\n**Action Required:** Please upload a recent Utility Bill (dated within the last 90 days) to verify the property address and residency.",
								type: "email",
							},

							// --- Message 2: Bot provides a brief summary/next step ---
							{
								sender: "bot",
								showFooter: false,
								showSender: true,
								createdAt: createISODate(),
								toggleText: "",
								statusIndex: 0,
								statuses: [{ status: "success" as const }],
								uuid: createMessageUuid(),
								text: "Once uploaded, our system will automatically process the document and check for address consistency.",
								type: "email",
							},

							// --- Message 3: User acknowledges the request (simulated user response) ---
							{
								sender: "user",
								showFooter: false,
								showSender: true,
								createdAt: createISODate(),
								toggleText: "",
								statusIndex: 0,
								statuses: [{ status: "success" as const }],
								uuid: createMessageUuid(),
								text: "Got it. I'll upload the latest utility bill now. Thanks for the prompt notification!",
								type: "email",
							},
						],
					},
				],
				createdAt: "2024-01-10",
			},
			{
				id: SupportedDocTypes.EmploymentVerification,
				description: "Employment verification application",
				documentTypesId: [
					SupportedDocTypes.EmploymentVerification,
					SupportedDocTypes.Payslip,
				],
				validationRules: [
					{
						id: "r4",
						name: "Recent Employment",
						description: "Employment letter must be recent",
						type: "document",
						conditionNotMet: "Ask for a recent employment letter",
					},
				],
				createdAt: "2024-01-12",
			},
		],
		documentTypes: [
			{
				id: SupportedDocTypes.Mortgage,
				description:
					"Official document submitted to a lender requesting a loan secured by real property.",
				schema: {
					fields: [
						{ name: "contractor_name", type: "string", required: true },
						{ name: "date_issued", type: "date", required: true },
						{ name: "document_type", type: "string", required: true },
						{ name: "estimated_cost", type: "number", required: true },
						{ name: "expiry_date", type: "date", required: true },
						{ name: "file_name", type: "string", required: true },
						{ name: "owner_full_name", type: "number", required: false }, // Often determined later
						{ name: "permit_number", type: "string", required: true },
						{ name: "project_location", type: "number", required: true },
						{ name: "project_name", type: "string", required: true },
					],
				},
			},
			{
				id: SupportedDocTypes.Invoice,
				description: "Standard invoice documents with line items",
				schema: {
					fields: [
						{ name: "invoiceNumber", type: "string", required: true },
						{ name: "date", type: "date", required: true },
						{ name: "amount", type: "number", required: true },
						{ name: "vendor", type: "string", required: true },
						{ name: "dueDate", type: "date", required: false },
						{ name: "taxAmount", type: "number", required: false },
						{ name: "currency", type: "string", required: true },
						{ name: "paymentTerms", type: "string", required: false },
					],
				},
			},
			{
				id: SupportedDocTypes.BankStatement,
				description: "Monthly bank statements and transaction records",
				schema: {
					fields: [
						{ name: "accountNumber", type: "string", required: true },
						{ name: "statementDate", type: "date", required: true },
						{ name: "openingBalance", type: "number", required: true },
						{ name: "closingBalance", type: "number", required: true },
						{ name: "bankName", type: "string", required: true },
						{ name: "accountHolder", type: "string", required: true },
					],
				},
			},
			{
				id: SupportedDocTypes.Receipt,
				description: "Purchase receipts and proof of payment",
				schema: {
					fields: [
						{ name: "receiptNumber", type: "string", required: true },
						{ name: "date", type: "date", required: true },
						{ name: "total", type: "number", required: true },
						{ name: "merchant", type: "string", required: true },
						{ name: "paymentMethod", type: "string", required: false },
					],
				},
			},
			{
				id: SupportedDocTypes.Payslip,
				description:
					"Detailed breakdown of an employee's earnings, deductions, and net pay for a specific period.",
				schema: {
					fields: [
						{ name: "employeeName", type: "string", required: true },
						{ name: "payPeriodStart", type: "date", required: true },
						{ name: "payPeriodEnd", type: "date", required: true },
						{ name: "paymentDate", type: "date", required: true },
						{ name: "grossPay", type: "number", required: true },
						{ name: "netPay", type: "number", required: true },
						{ name: "totalDeductions", type: "number", required: true },
						{ name: "employerName", type: "string", required: true },
						{ name: "employeeId", type: "string", required: false },
						{ name: "taxYear", type: "number", required: true },
					],
				},
			},
			{
				id: SupportedDocTypes.TaxReturn,
				description:
					"Official declaration of income, expenses, and tax owed to a governing tax authority.",
				schema: {
					fields: [
						{ name: "taxYear", type: "number", required: true },
						{ name: "submissionDate", type: "date", required: true },
						{ name: "taxpayerId", type: "string", required: true },
						{ name: "totalIncome", type: "number", required: true },
						{ name: "taxOwed", type: "number", required: true },
						{ name: "taxRefund", type: "number", required: false }, // Could be zero
						{ name: "filingStatus", type: "string", required: true }, // e.g., 'Single', 'Married Filing Jointly'
						{ name: "authority", type: "string", required: true }, // e.g., 'IRS', 'HMRC'
					],
				},
			},
			{
				id: SupportedDocTypes.UtilityBill,
				description:
					"Statement for consumption of services like electricity, water, or gas.",
				schema: {
					fields: [
						{ name: "accountNumber", type: "string", required: true },
						{ name: "billingPeriodStart", type: "date", required: true },
						{ name: "billingPeriodEnd", type: "date", required: true },
						{ name: "issueDate", type: "date", required: true },
						{ name: "dueDate", type: "date", required: true },
						{ name: "totalAmount", type: "number", required: true },
						{ name: "serviceType", type: "string", required: true }, // e.g., 'Electricity', 'Water', 'Gas'
						{ name: "utilityProvider", type: "string", required: true },
					],
				},
			},
			{
				id: SupportedDocTypes.EmploymentVerification,
				description:
					"Formal letter confirming an individual's employment status, position, and salary.",
				schema: {
					fields: [
						{ name: "issueDate", type: "date", required: true },
						{ name: "employeeName", type: "string", required: true },
						{ name: "jobTitle", type: "string", required: true },
						{ name: "startDate", type: "date", required: true },
						{ name: "annualSalary", type: "number", required: false }, // Sometimes excluded
						{ name: "signerTitle", type: "string", required: true },
					],
				},
			},
		],
		documents: [
			{
				id: "1",
				fileName: "invoice_2024_001.pdf",
				documentType: "Invoice",
				uploadedAt: "2024-01-15T10:30:00",
				status: "pending",
				confidence: 0.92,
				file: null,
				extractedData: [
					{
						name: "invoiceNumber",
						value: "INV-2024-001",
						confidence: 0.98,
						type: "string",
					},
					{ name: "date", value: "2024-01-15", confidence: 0.95, type: "date" },
					{
						name: "amount",
						value: "1250.00",
						confidence: 0.89,
						type: "number",
					},
					{
						name: "vendor",
						value: "Acme Corp",
						confidence: 0.94,
						type: "string",
					},
					{ name: "currency", value: "USD", confidence: 0.99, type: "string" },
				],
			},
			{
				id: "2",
				fileName: "receipt_store_456.jpg",
				documentType: "Receipt",
				uploadedAt: "2024-01-15T11:45:00",
				status: "pending",
				confidence: 0.78,
				file: null,
				extractedData: [
					{
						name: "receiptNumber",
						value: "RCP-456",
						confidence: 0.82,
						type: "string",
					},
					{ name: "date", value: "2024-01-14", confidence: 0.88, type: "date" },
					{ name: "total", value: "45.99", confidence: 0.75, type: "number" },
					{
						name: "merchant",
						value: "Store ABC",
						confidence: 0.71,
						type: "string",
					},
				],
			},
			{
				id: "3",
				fileName: "bank_statement_dec.pdf",
				documentType: "Bank Statement",
				uploadedAt: "2024-01-14T16:20:00",
				status: "approved",
				confidence: 0.96,
				file: null,
				extractedData: [
					{
						name: "accountNumber",
						value: "****1234",
						confidence: 0.99,
						type: "string",
					},
					{
						name: "statementDate",
						value: "2023-12-31",
						confidence: 0.97,
						type: "date",
					},
					{
						name: "openingBalance",
						value: "5000.00",
						confidence: 0.95,
						type: "number",
					},
					{
						name: "closingBalance",
						value: "5450.00",
						confidence: 0.94,
						type: "number",
					},
				],
			},
		],
	})),
);

export const globalStore = createReactSelectors(globalStoreBase);

export const useDocType = () => {
	const filterOnTable = globalStore.use.docType();
	const fileMetadata = useFileMetadata();

	return filterOnTable ?? fileMetadata?.file_type;
};

export function useWithFileInReview() {
	const fileInReview = globalStore.use.fileInReview();
	const documents = globalStore.use.documents();
	const document = documents.find((d) => d.id === fileInReview);

	if (!document) {
		console.log("Document not found in useWithFileInReview", {
			fileInReview,
			documents,
		});

		throw new Error("Document not found in useWithFileInReview");
	}

	return document;
}
