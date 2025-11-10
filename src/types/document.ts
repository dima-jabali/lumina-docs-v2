"use client";

import type { Cell, Row, Table } from "@tanstack/react-table";
import type { Tagged } from "type-fest";

import type { GeneralIndexStatus, SupportedDocTypes } from "./general-enums";
import type { DeepNullable, Nullable } from "./utils";
import type { ISODateString, Message, MessageUuid } from "./organization";

export type DocumentUuid = Tagged<string, "DocumentUuid">;
export type DocumentId = Tagged<number, "DocumentId">;
export type MortgageId = Tagged<number, "MortgageId">;
export type W2FieldsId = Tagged<number, "W2FieldsId">;
export type InvoiceId = Tagged<number, "InvoiceId">;

export type Document = Nullable<{
	commission_files?: Array<CommissionFields>;
	chat_messages: Map<MessageUuid, Message>;
	mortgages?: Array<MortgageFields>;
	file_type: SupportedDocTypes;
	status: GeneralIndexStatus;
	created_at: ISODateString;
	updated_at: ISODateString;
	invoice?: InvoiceFields;
	file_name: string;
	error: string;
	w2?: W2Fields;
}> & {
	file_uuid: DocumentUuid;
	id: DocumentId;
};

export enum LoanType {
	Conventional = "Conventional",
}

export type MortgageFileFields = DeepNullable<
	| {
			file_name: string;
			document_type: "government_issued_id";
			id_type: string;
			full_name: string;
			id_number: string;
			birthdate: string;
			address: string;
			issue_date: string;
			expiry_date: string;
			issuing_authority: string;
	  }
	| {
			file_name: string;
			document_type: "tin_card";
			tin: string;
			full_name: string;
			issue_date: string;
	  }
	| {
			file_name: string;
			document_type: "marriage_certificate";
			spouse1_full_name: string;
			spouse2_full_name: string;
			date_of_marriage: string;
			place_of_marriage: string;
			registry_number: string;
	  }
	| {
			file_name: string;
			document_type: "proof_of_billing";
			customer_name: string;
			account_number: string;
			service_provider: string;
			service_address: string;
			billing_period_start: string;
			billing_period_end: string;
			amount_due: number;
	  }
	| {
			file_name: string;
			document_type: "loan_application_form";
			loan_type: string;
			loan_amount: number;
			loan_term_months: number;
			loan_purpose: string;
			borrower_full_name: string;
			borrower_birthdate: string;
			borrower_civil_status: string;
			borrower_address: string;
			borrower_contact_number: string;
			co_borrower_full_name: string;
			co_borrower_relationship: string;
			employer_name: string;
			employer_address: string;
			employment_status: string;
			employment_start_date: string;
			declared_gross_monthly_income: number;
			declared_other_income: string;
			declared_existing_debts: number;
			declared_monthly_expenses: number;
			collateral_property_type: string;
			collateral_property_address: string;
			collateral_estimated_value: number;
	  }
	| {
			file_name: string;
			document_type: "certificate_of_employment_and_compensation";
			employer_name: string;
			employee_full_name: string;
			position: string;
			employment_start_date: string;
			gross_monthly_income: number;
			gross_annual_income: number;
			signatory_name: string;
			date_issued: string;
	  }
	| {
			file_name: string;
			document_type: "payslip";
			employee_full_name: string;
			employer_name: string;
			pay_period_start: string;
			pay_period_end: string;
			basic_pay: number;
			allowances: number;
			overtime_pay: number;
			deductions_total: number;
			net_pay: number;
	  }
	| {
			file_name: string;
			document_type: "bir_form_2316";
			employee_full_name: string;
			employer_name: string;
			employer_tin: string;
			taxable_year: string;
			gross_compensation_income: number;
			taxable_income: number;
			tax_withheld: number;
	  }
	| {
			file_name: string;
			document_type: "payroll_bank_statement";
			bank_name: string;
			account_number_masked: string;
			transaction_date: string;
			credit_amount: number;
			running_balance: number;
	  }
	| {
			file_name: string;
			document_type: "transfer_certificate_of_title";
			title_number: string;
			registry_of_deeds: string;
			lot_block_unit: string;
			area_sqm: number;
			registered_owner: string;
			encumbrances: string;
	  }
	| {
			file_name: string;
			document_type: "condominium_certificate_of_title";
			title_number: string;
			registry_of_deeds: string;
			unit_number: string;
			floor_area_sqm: string;
			registered_owner: string;
			encumbrances: string;
	  }
	| {
			file_name: string;
			document_type: "tax_declaration";
			property_index_number: string;
			owner_name: string;
			assessed_value_land: number;
			assessed_value_building: number;
			property_classification: string;
			arp_year: number;
	  }
	| {
			file_name: string;
			document_type: "real_property_tax_receipt";
			receipt_number: string;
			tax_year: number;
			amount_paid: number;
			date_paid: string;
	  }
	| {
			file_name: string;
			document_type: "deed_of_absolute_sale";
			buyer_name: string;
			seller_name: string;
			consideration_amount: number;
			date_of_execution: string;
			notary_name: string;
			notary_doc_number: string;
			property_description: string;
	  }
	| {
			file_name: string;
			document_type: "contract_to_sell";
			buyer_name: string;
			seller_name: string;
			consideration_amount: number;
			date_of_execution: string;
			notary_name: string;
			notary_doc_number: string;
			property_description: string;
	  }
	| {
			file_name: string;
			document_type: "appraisal_report";
			appraised_market_value: number;
			forced_sale_value: number;
			valuation_methodology: string;
			appraiser_name: string;
			appraisal_date: string;
			property_address: string;
	  }
	| {
			file_name: string;
			document_type: "lot_building_plan_vicinity_map";
			survey_number: string;
			technical_description: string;
			scale: string;
			engineer_name: string;
			engineer_license_number: string;
			date_prepared: string;
	  }
	| {
			file_name: string;
			document_type: "credit_card_statement";
			statement_date: string;
			credit_card_account_number_masked: string;
			credit_card_issuer: string;
			credit_limit: string;
			outstanding_balance: string;
			minimum_payment_due: string;
			payment_due_date: string;
			last_payment_amount: string;
	  }
	| {
			file_name: string;
			document_type: "personal_loan_statement";
			statement_date: string;
			account_number_masked: string;
			lender_name: string;
			credit_limit: number;
			outstanding_balance: number;
			minimum_payment_due: number;
			payment_due_date: string;
			last_payment_amount: string;
	  }
	| {
			file_name: string;
			document_type: "cic_report";
			report_date: string;
			cic_score: number;
			delinquency_flags: string;
			number_active_trade_lines: number;
	  }
	| {
			file_name: string;
			document_type: "special_power_of_attorney";
			principal_full_name: string;
			attorney_in_fact_full_name: string;
			scope_of_authority: string;
			date_of_execution: string;
			notary_name: string;
			notary_doc_number: string;
			validity_end_date: string;
	  }
	| {
			file_name: string;
			document_type: "authorization_letter";
			authorizer_full_name: string;
			authorizee_full_name: string;
			authorization_purpose: string;
			date_issued: string;
			contact_number: string;
			validity_end_date: string;
	  }
	| {
			file_name: string;
			document_type: "appraisal_fee_payment_receipt";
			receipt_number: string;
			payer_name: string;
			payee_name: string;
			amount_paid: number;
			date_paid: string;
			payment_method: string;
	  }
	| {
			file_name: string;
			document_type: "building_permit";
			permit_number: string;
			project_name: string;
			project_location: string;
			owner_full_name: string;
			contractor_name: string;
			estimated_cost: number;
			date_issued: string;
			expiry_date: string;
	  }
	| {
			file_name: string;
			document_type: "bill_of_materials";
			project_name: string;
			project_location: string;
			owner_full_name: string;
			contractor_name: string;
			itemized_costs_total: string;
			date_prepared: string;
			preparer_name: string;
	  }
>;

export type MortgageFields = DeepNullable<{
	fileFields: MortgageFileFields;
	created_at: ISODateString;
	updated_at: ISODateString;
	file_name: string;
}> & {
	chat_messages?: Array<Message>;
	file_uuid: DocumentUuid;
	isValidated: boolean;
	id: MortgageId;
};

export type CommissionFileFields = DeepNullable<
	| {
			document_type: "broker_commission_agreement";
			agreement_id: string;
			broker_name: string;
			broker_id: string;
			property_id: string;
			commission_rate_percentage: number;
			tiered_bonus_clauses: string;
			effective_date: string;
	  }
	| {
			document_type: "sales_contract";
			contract_id: string;
			buyer_name: string;
			buyer_id: string;
			property_id: string;
			sale_price: number;
			closing_date: string;
			payment_schedule: string;
	  }
	| {
			document_type: "official_receipt";
			receipt_number: string;
			series: string;
			date_issued: string;
			amount: number;
			tax_withheld: number;
	  }
	| {
			document_type: "bir_form_2307";
			taxpayer_identification_no: string;
			income_type: "commission";
			withholding_tax_rate: number;
			amount_remitted: number;
	  }
	| {
			document_type: "bir_form_1904";
			taxpayer_identification_no: string;
			income_type: "commission";
			withholding_tax_rate: number;
			amount_remitted: number;
	  }
	| {
			document_type: "broker_id";
			full_name: string;
			id_number: string;
			id_expiry: string;
			face_photo_url: string;
	  }
	| {
			document_type: "government_id";
			full_name: string;
			id_number: string;
			id_expiry: string;
			face_photo_url: string;
	  }
>;

export type CommissionId = Tagged<number, "CommissionId">;

export type CommissionFields = DeepNullable<{
	fileFields: CommissionFileFields;
	created_at: ISODateString;
	updated_at: ISODateString;
	file_name: string;
}> & {
	chat_messages?: Array<Message>;
	file_uuid: DocumentUuid;
	isValidated: boolean;
	id: CommissionId;
};

export type InvoiceLineItem = Nullable<{
	product_description: string;
	product_name: string;
	unit_price: number;
	quantity: number;
	amount: number;
}>;

export type InvoiceTax = Nullable<{
	description: string;
	amount: number;
}>;

export type InvoiceFields = Nullable<{
	line_items: Array<InvoiceLineItem>;
	purchase_order_number: number;
	amounts_validated: boolean;
	recipient_address: string;
	recipient_tax_id: string;
	taxes: Array<InvoiceTax>;
	recipient_name: string;
	vendor_address: string;
	vendor_tax_id: number;
	total_amount: number;
	vendor_name: string;
	date: ISODateString;
	invoice_id: number;
	subtotal: number;
}> & {
	id: InvoiceId;
};

export type W2CodeField = {
	amount: number;
	code: string;
};

export type W2StateTaxField = {
	employer_state_id_number: number;
	state_wages_and_tips: number;
	local_income_tax: number;
	local_wages_tips: number;
	state_income_tax: number;
	locality_name: string;
	state_name: string;
};

export type W2Fields = Nullable<{
	federal_wages_tips_other_compensation: string;
	federal_social_security_wages: string;
	federal_social_security_tips: string;
	state_taxes: Array<W2StateTaxField>;
	federal_medicare_wages_tips: string;
	federal_social_security_tax: string;
	nonqualified_plans_income: string;
	filing_verification_code: string;
	employer_control_number: string;
	federal_allocated_tips: string;
	employee_name_suffix: string;
	federal_medicare_tax: string;
	employee_first_name: string;
	federal_income_tax: string;
	employee_last_name: string;
	codes: Array<W2CodeField>;
	employee_zip_code: string;
	employer_zip_code: string;
	filing_omb_number: string;
	employee_address: string;
	employer_address: string;
	employer_name: string;
	employee_ssn: string;
	employer_ein: string;
	other: string;
}> & {
	id: W2FieldsId;
};

export type DocumentCell = Cell<Document, unknown>;
export type DocumentTable = Table<Document>;
export type DocumentRow = Row<Document>;
export type TableCellProps = {
	row: {
		original: Document;
	};
	cell: DocumentCell;
	column: {
		id: string;
	};
	table: DocumentTable;
};
