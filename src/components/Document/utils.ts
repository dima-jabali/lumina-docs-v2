"use client";

import type {
	InvoiceFields,
	InvoiceId,
	InvoiceLineItem,
	InvoiceTax,
	W2Fields,
	W2FieldsId,
	W2StateTaxField,
} from "@/types/document";
import { SupportedDocTypes } from "@/types/general-enums";
import { createISODate } from "@/types/organization";

type OfTypeOrNullKeys<Obj, Type> = {
	[K in keyof Obj as Obj[K] extends Type | null ? K : never]: Obj[K];
};

export const W2_STRING_FIELDS: Array<keyof OfTypeOrNullKeys<W2Fields, string>> =
	[
		"federal_wages_tips_other_compensation",
		"federal_social_security_wages",
		"federal_social_security_tips",
		"federal_medicare_wages_tips",
		"federal_social_security_tax",
		"nonqualified_plans_income",
		"filing_verification_code",
		"employer_control_number",
		"federal_allocated_tips",
		"employee_name_suffix",
		"federal_medicare_tax",
		"employee_first_name",
		"federal_income_tax",
		"employee_last_name",
		"employee_zip_code",
		"employer_zip_code",
		"filing_omb_number",
		"employee_address",
		"employer_address",
		"employer_name",
		"employee_ssn",
		"employer_ein",
		"other",
	];

export const W2_STATE_TAXES_NUMBER_FIELDS: Array<
	keyof OfTypeOrNullKeys<W2StateTaxField, number>
> = [
	"employer_state_id_number",
	"state_wages_and_tips",
	"local_income_tax",
	"local_wages_tips",
	"state_income_tax",
];

export const W2_STATE_TAXES_STRING_FIELDS: Array<
	keyof OfTypeOrNullKeys<W2StateTaxField, string>
> = ["locality_name", "state_name"];

export const INVOICE_TAXES_STRING_FIELDS: Array<
	keyof OfTypeOrNullKeys<InvoiceTax, string>
> = ["description"];

export const INVOICE_TAXES_NUMBER_FIELDS: Array<
	keyof OfTypeOrNullKeys<InvoiceTax, number>
> = ["amount"];

export const W2_NUMBER_FIELDS: Array<
	Exclude<keyof OfTypeOrNullKeys<W2Fields, number>, "id">
> = [];

export const INVOICE_STRING_FIELDS: Array<
	keyof OfTypeOrNullKeys<InvoiceFields, string>
> = [
	"recipient_address",
	"recipient_tax_id",
	"recipient_name",
	"vendor_address",
	"vendor_name",
	"date",
];

export const INVOICE_NUMBER_FIELDS: Array<
	Exclude<keyof OfTypeOrNullKeys<InvoiceFields, number>, "id">
> = [
	"purchase_order_number",
	"vendor_tax_id",
	"total_amount",
	"invoice_id",
	"subtotal",
];

export const LINE_ITEM_STRING_FIELDS: Array<
	keyof OfTypeOrNullKeys<InvoiceLineItem, string>
> = ["product_description", "product_name"];

export const LINE_ITEM_NUMBER_FIELDS: Array<
	keyof OfTypeOrNullKeys<InvoiceLineItem, number>
> = ["unit_price", "quantity", "amount"];

export const makeDefaultW2Fields = (id: W2FieldsId): W2Fields => {
	const w2: W2Fields = {
		federal_wages_tips_other_compensation: null,
		federal_social_security_wages: null,
		federal_social_security_tips: null,
		federal_medicare_wages_tips: null,
		federal_social_security_tax: null,
		nonqualified_plans_income: null,
		filing_verification_code: null,
		employer_control_number: null,
		federal_allocated_tips: null,
		federal_medicare_tax: null,
		employee_name_suffix: null,
		employee_first_name: null,
		federal_income_tax: null,
		employee_last_name: null,
		filing_omb_number: null,
		employer_zip_code: null,
		employee_zip_code: null,
		employer_address: null,
		employee_address: null,
		employer_name: null,
		employee_ssn: null,
		employer_ein: null,
		state_taxes: [],
		other: null,
		codes: [],

		id,
	};

	return w2;
};

export const makeDefaultStateTaxes = () => {
	const stateTaxes: W2StateTaxField = {
		employer_state_id_number: 0,
		state_wages_and_tips: 0,
		local_income_tax: 0,
		local_wages_tips: 0,
		state_income_tax: 0,
		locality_name: "",
		state_name: "",
	};

	return stateTaxes;
};

const MIME_TYPES: { [key: string]: string } = {
	txt: "text/plain",
	html: "text/html",
	htm: "text/html",
	json: "application/json",
	xml: "application/xml",
	pdf: "application/pdf",
	doc: "application/msword",
	docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	xls: "application/vnd.ms-excel",
	xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	ppt: "application/vnd.ms-powerpoint",
	pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	png: "image/png",
	gif: "image/gif",
	bmp: "image/bmp",
	svg: "image/svg+xml",
	webp: "image/webp",
	mp3: "audio/mpeg",
	wav: "audio/wav",
	ogg: "audio/ogg",
	mp4: "video/mp4",
	webm: "video/webm",
	avi: "video/x-msvideo",
	zip: "application/zip",
	rar: "application/x-rar-compressed",
	"7z": "application/x-7z-compressed",
	csv: "text/csv",
};

export const tryGetDocumentMimeType = (fileName: string | undefined | null) => {
	if (!fileName) {
		return undefined;
	}

	const extension = fileName.split(".").pop()?.toLowerCase();

	if (!extension) {
		return undefined; // No extension found
	}

	return MIME_TYPES[extension];
};

export const makeDefaultLineItem = (): InvoiceLineItem => {
	const lineItem: InvoiceLineItem = {
		product_description: "",
		product_name: "",
		unit_price: 0,
		quantity: 0,
		amount: 0,
	};

	return lineItem;
};

export const makeDefaultInvoiceFields = (
	invoiceId: InvoiceId,
): InvoiceFields => {
	const invoice: InvoiceFields = {
		purchase_order_number: 0,
		amounts_validated: false,
		date: createISODate(),
		recipient_address: "",
		recipient_tax_id: "",
		recipient_name: "",
		vendor_address: "",
		vendor_tax_id: 0,
		invoice_id: null,
		total_amount: 0,
		vendor_name: "",
		line_items: [],
		id: invoiceId,
		subtotal: 0,
		taxes: [],
	};

	return invoice;
};

export const makeDefaultInvoiceTax = (): InvoiceTax => {
	const tax: InvoiceTax = {
		description: "",
		amount: 0,
	};

	return tax;
};

export function getSubFileType(docType: SupportedDocTypes | null | undefined) {
	switch (docType) {
		case SupportedDocTypes.Mortgage:
			return "mortgages";

		case SupportedDocTypes.Commission:
			return "commission_files";

		case SupportedDocTypes.Invoice:
			return "invoice";

		default:
			throw new Error(`Invalid doc type: ${docType}`);
	}
}
