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
import {
	type ChartType,
	type SupportedDocTypes,
	View,
} from "@/types/general-enums";
import type { Message, OrganizationUuid } from "@/types/organization";
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

	applicationList: Array<Application>;
	documentTypes: Array<DocumentType>;
	documents: Array<Document_V2>;
	fileInReview: string | null;
	adminTab: AdminTab;
};

type SchemaField = {
	type: "string" | "number" | "date" | "boolean";
	required: boolean;
	name: string;
};

export type DocumentType = {
	documentCount: number;
	description: string;
	fieldCount: number;
	name: string;
	id: string;
	schema: {
		fields: SchemaField[];
	};
};

export type Application = {
	validationRules: ValidationRule[];
	documentTypes: string[];
	description: string;
	createdAt: string;
	name: string;
	id: string;
};

type ValidationRule = {
	type: "field" | "document" | "application";
	description: string;
	condition: string;
	name: string;
	id: string;
};

const globalStoreBase = create(
	subscribeWithSelector<LuminaDocsContextType>(() => ({
		fetchDocumentMetadataListQueryKey: null,
		selectedSubFile: null,

		organizationUuid:
			"dbe0f417-2d39-4bb8-b74c-12b023aae761" as OrganizationUuid,

		fileMetadataUuid: null,
		view: View.TableOfDocs,
		isStreaming: false,
		columnFilters: [],
		docType: null,

		dashboardChatMessages: [],
		dashboardList: [],

		fileInReview: null,
		adminTab: AdminTab.Applications,
		applicationList: [
			{
				id: "1",
				name: "Mortgage Application",
				description: "Mortgage loan processing with document validation",
				documentTypes: [
					"Bank Statement",
					"Payslip",
					"Tax Return",
					"Utility Bill",
				],
				validationRules: [
					{
						id: "r1",
						name: "Payslip Currency",
						description: "Payslip must be current as of last 3 months",
						type: "document",
						condition: "statementDate >= now - 90 days",
					},
					{
						id: "r2",
						name: "Address Consistency",
						description:
							"Utility bill address must match bank statement address",
						type: "application",
						condition: "utilityBill.address == bankStatement.address",
					},
					{
						id: "r3",
						name: "Required Documents",
						description: "All required documents must be submitted",
						type: "application",
						condition: "bankStatement AND payslip AND utilityBill",
					},
				],
				createdAt: "2024-01-10",
			},
			{
				id: "2",
				name: "Employment Verification",
				description: "Employment verification application",
				documentTypes: ["Employment Letter", "Payslip"],
				validationRules: [
					{
						id: "r4",
						name: "Recent Employment",
						description: "Employment letter must be recent",
						type: "document",
						condition: "issuanceDate >= now - 30 days",
					},
				],
				createdAt: "2024-01-12",
			},
		],
		documentTypes: [
			{
				id: "1",
				name: "Invoice",
				description: "Standard invoice documents with line items",
				fieldCount: 8,
				documentCount: 142,
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
				id: "2",
				name: "Bank Statement",
				description: "Monthly bank statements and transaction records",
				fieldCount: 6,
				documentCount: 89,
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
				id: "3",
				name: "Receipt",
				description: "Purchase receipts and proof of payment",
				fieldCount: 5,
				documentCount: 267,
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
  const document = documents.find(d => d.id === fileInReview);

	if (!document) {
		console.log("Document not found in useWithFileInReview", {
			fileInReview,
			documents,
		});
		
		throw new Error("Document not found in useWithFileInReview");
	}
	
	return document;
}
