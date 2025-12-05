"use client";

import type { ColumnFiltersState } from "@tanstack/react-table";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Tagged } from "type-fest";

import type { ChartConfig } from "@/components/ui/chart";
import {
	type FetchDocumentMetadataListQueryKey,
	useFileMetadata,
} from "@/hooks/fetch/use-fetch-document-metadata-list";
import type {
	ClaimFields,
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

	selectedSubFile: MortgageFields | CommissionFields | ClaimFields | null;
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
	missing: boolean;
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
						id: "r2",
						name: "Address Consistency",
						description: "Utility bill address must match address on the ID",
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
								text: "**Action Required: Address Mismatch Found**\n\nWe have reviewed the utility bill you submitted for proof of address. The address listed on the document (**`123 Elm St, Apt 2B`**) does not match the address on your ID (**`833 Sisa Street. BRGY 526, Sampaloc, Manila, NCR`**).\n\nTo proceed with your application, please provide one of the following:\n1. A different valid Proof of Address document that clearly shows your ID address (**`833 Sisa Street. BRGY 526, Sampaloc, Manila, NCR`**).\n2. Confirmation of which address is the current, correct one.",
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
								text: "Hi, I don't have another utility bill right now that shows the Sisa Street address. The ID address is the correct one. What other documents can I use? I can't wait for a new utility bill to be generated.",
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

								text: "Thank you for confirming that **`833 Sisa Street. BRGY 526, Sampaloc, Manila, NCR`** is your correct current address. \n\nSince you don't have another utility bill, here is a list of alternative Proof of Address documents we can accept, provided they are dated within the last 90 days and show your name and the correct address:\n\n* Hospital bill\n* Barangay certificate\n* Bank statement\n* Insurance policy\n * Delivery receipt\n\nPlease upload one of these alternatives showing the address **Sisa Street** to continue.",
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

								text: "I have uploaded a hospital bill dated last month. It clearly shows my name and the Sisa Street address.",
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

								text: "**Verification Complete!**\n\nWe have reviewed the hospital bill. The document is accepted and successfully confirms your address as **Sisa Street**. \n\nThis verification step is now **complete and correct**. We will proceed with the next steps of your application.",
							},
						],
					},
					{
						id: "r1",
						name: "Payslip Currency",
						description: "Payslip must be current as of last 3 months",
						type: "document",
						conditionNotMet: "Ask for a payslip from last 3 months",
						missing: false,
					},

					{
						id: "r3",
						name: "Required Documents",
						description: "All required documents must be submitted",
						type: "application",
						conditionNotMet: "Ask for all required documents",
						missing: false,
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
						missing: false,
					},
				],
				createdAt: "2024-01-12",
			},
			{
				id: SupportedDocTypes.Claims,
				description:
					"Processing for Critical Illness (Major Disease) claims, focusing on diagnosis and required documentation.",
				documentTypesId: [
					SupportedDocTypes.Claims, // Represents the core claim set (APS, SOA, Medical Records)
					SupportedDocTypes.BankStatement, // Used to simulate Payee's Bank Account Proof
					SupportedDocTypes.Receipt, // Used to simulate Payee's Valid ID/Proof of relationship
				],
				validationRules: [
					{
						id: "ci_r1_completeness",
						name: "Medical Records Check",
						description:
							"Medical Records (Abstract, Lab Tests) must be submitted to support the diagnosis.",
						type: "application",
						conditionNotMet:
							"Ask for missing Medical Records (Clinical Abstract & Lab Tests)",
						missing: true,
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
								text: "## 🚨 **Action Required: Incomplete Medical Records**\n\nWe are processing your Critical Illness claim but require additional supporting documentation.\n\nThe **Medical Records** (Admitting history, Clinical abstract, Lab tests, Record of operation) are either missing or incomplete.\n\n**Please upload the following required documents:**\n* **Clinical Abstract** (Must include diagnosis and physician notes)\n* **Lab Tests** (Objective evidence confirming the diagnosis)\n\nWe cannot proceed with assessment until these are received.",
								type: "email",
							},
							// --- User replies they are uploading the documents ---
							{
								sender: "user",
								showFooter: false,
								showSender: true,
								createdAt: createISODate(),
								toggleText: "",
								statusIndex: 0,
								statuses: [{ status: "hidden" as const }],
								uuid: createMessageUuid(),
								text: "My apologies. I have just uploaded the complete Clinical Abstract and the Lab Test results under the document name 'CI_Medical_Records_0524'. Please let me know once they are reviewed.",
								type: "email",
							},
							// --- Bot confirms receipt and next step ---
							{
								sender: "bot",
								showFooter: true,
								showSender: true,
								createdAt: createISODate(),
								toggleText: "",
								statusIndex: 0,
								statuses: [{ status: "hidden" as const }],
								uuid: createMessageUuid(),
								type: "email",
								text: "**Medical Records Received and Accepted!**\n\nThe Clinical Abstract and Lab Test results have been successfully received and linked to your claim. We are now checking for consistency between the diagnosis and the policy's covered conditions.",
							},
						],
					},
					{
						id: "ci_r2_consistency",
						name: "Payee Name Consistency",
						description:
							"Payee Name on Valid ID must match Payee Name on Bank Account Proof (Consistency Rule).",
						type: "application",
						conditionNotMet:
							"Ask for clarification on payee name difference between ID and bank proof.",
						missing: true,
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
								text: "## ⚠️ **Action Required: Payee Name Mismatch**\n\nWe identified a potential consistency issue between your payment documents:\n\n* **Payee's Valid ID:** Shows the name **`Maria A. Santos`**\n* **Payee's Bank Account Proof:** Shows the account name **`Maria Santos-Cruz`**\n\n**Action Required:** Please confirm if **`Maria A. Santos`** and **`Maria Santos-Cruz`** refer to the same person. If so, provide a brief affidavit or marriage certificate to confirm the legal name change/variation for secure electronic fund transfer.",
								type: "email",
							},
							// --- User replies with clarification ---
							{
								sender: "user",
								showFooter: false,
								showSender: true,
								createdAt: createISODate(),
								toggleText: "",
								statusIndex: 0,
								statuses: [{ status: "hidden" as const }],
								uuid: createMessageUuid(),
								text: "Yes, that is the same person. 'Maria A. Santos' is my maiden name used on my ID. 'Maria Santos-Cruz' is my married name on the bank account. I have uploaded a copy of my Marriage Certificate for verification.",
								type: "email",
							},
							// --- Bot confirms acceptance ---
							{
								sender: "bot",
								showFooter: true,
								showSender: true,
								createdAt: createISODate(),
								toggleText: "",
								statusIndex: 0,
								statuses: [{ status: "hidden" as const }],
								uuid: createMessageUuid(),
								type: "email",
								text: "**Consistency Verified!**\n\nThank you for providing the Marriage Certificate. The name variation has been successfully verified, and the payee information is now **consistent** for claim payment purposes. Proceeding to the next validation step.",
							},
						],
					},
				],
				createdAt: "2025-05-01",
			},
		],
		documentTypes: [
			{
				id: SupportedDocTypes.Claims,
				description:
					"Comprehensive document set for various insurance claims (Death, Hospitalization, Critical Illness).",
				schema: {
					fields: [
						{
							name: "insuredName",
							type: "string",
							required: true,
						},
						{
							name: "policyNumber",
							type: "string",
							required: true,
						},
						{
							name: "eventDate",
							type: "date",
							required: true,
						},
						{
							name: "diagnosis",
							type: "string",
							required: true,
						},
						{
							name: "payeeName",
							type: "string",
							required: true,
						},
						{
							name: "hospitalName",
							type: "string",
							required: false,
						},
						{
							name: "claimType",
							type: "string",
							required: true, // e.g., 'Death', 'Critical Illness'
						},
					],
				},
			},
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
			{
				id: "4",
				fileName: "claim.pdf",
				documentType: SupportedDocTypes.Claims,
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
