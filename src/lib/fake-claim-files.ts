"use client";

import type { ClaimFileFields } from "@/types/document";
import {
	createISODate,
	createMessageUuid,
	type Message,
} from "@/types/organization";

export const FAKE_CLAIM_FILES: Array<
	[filename: string, fields: ClaimFileFields, chat_messages: Array<Message>]
> = [
	[
		"APS_Critical_Illness.pdf",
		{
			document_type: "attending_physician_statement",
			patient_name: "Juan Dela Cruz",
			date_of_birth: "1980-05-15",
			file_name: "APS_Critical_Illness.pdf",
			policy_number: "9988776655",
			diagnosis: "Acute Myocardial Infarction",
			icd10_code: "I21.0",
			date_of_diagnosis: "2024-01-12",
			physician_name: "Dr. Maria Santos",
			physician_license_no: "123456",
			medical_facility: "Makati Medical Center",
		},
		[
			{
				text: "APS document has been extracted and classified as Critical Illness.",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "success" as const }],
				statusIndex: 0,
				showSender: true,
				type: "default",
				showFooter: true,
				toggleText: "",
			},
		],
	],
		[
		"BrokerID_MariaCruz.pdf",
		{
			document_type: "broker_id",
			full_name: "Maria S. Cruz",
			id_number: "PRC-CSD-98765", // Example: Licensed Contractor or Service Provider ID
			id_expiry: "2027-08-30",
			face_photo_url: "https://example.com/photos/maria_cruz_broker.jpg",
		},
		[
			{
				text: "The Broker ID file is ready for review.",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "streaming" }, { status: "success" }],
				statusIndex: 0,
				showSender: true,
				toggleText: "",
				type: "default",
				showFooter: true,
			},
		],
	],
	[
		"Hospital_SOA.pdf",
		{
			file_name: "Hospital_SOA.pdf",
			document_type: "hospital_statement_of_account",
			patient_name: "Juan Dela Cruz",
			hospital_name: "St. Luke's Medical Center - Global City",
			admission_date: "2024-01-12",
			discharge_date: "2024-01-19",
			case_number: "2024-001923",
			total_amount_due: 230750.0,
			room_and_board_cost: 35000.0,
			professional_fees: 50000.0,
		},
		[
			{
				text: "SOA extracted. Total amount due of PHP 230,750.00 is flagged for consistency check against policy limits.",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "streaming" }, { status: "success" }],
				statusIndex: 0,
				showSender: true,
				type: "default",
				showFooter: true,
				toggleText: "",
			},
		],
	],
	[
		"Medical_Abstract_Lab.pdf",
		{
			file_name: "Medical_Abstract_Lab.pdf",
			document_type: "medical_abstract",
			patient_name: "Juan Dela Cruz",
			abstract_date: "2024-01-15",
			final_diagnosis: "Acute Anterior Wall Myocardial Infarction",
			clinical_history_summary:
				"44-year-old male admitted due to chest pain. History of hypertension. Smoker.",
			lab_results_summary: "Troponin I: 25,000 ng/L. CK-MB: Elevated.",
			troponin_level: "25000",
			procedure_performed: "PCI",
		},
		[
			{
				text: "Medical Abstract fields extracted. Troponin level **25,000 ng/L** is critical and supports the diagnosis in the APS.",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "success" as const }],
				statusIndex: 0,
				showSender: true,
				type: "default",
				showFooter: true,
				toggleText: "",
			},
		],
	],
	[
		"Death_Certificate.pdf",
		{
			file_name: "Death_Certificate.pdf",
			document_type: "death_certificate",
			deceased_name: "ROBERTO G. REYES",
			date_of_death: "2023-12-20",
			place_of_death: "Quezon City, Metro Manila",
			immediate_cause: "Acute Respiratory Failure",
			antecedent_cause: "Community Acquired Pneumonia",
			underlying_cause: "Chronic Obstructive Pulmonary Disease",
			civil_status: "Married",
			registry_number: "2023-999-D",
		},
		[
			{
				text: "Death Certificate extracted. Cause of Death is flagged for review against the policy's contestability period (death occurred within 1 year).",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "streaming" }, { status: "success" }],
				statusIndex: 0,
				showSender: true,
				type: "default",
				showFooter: true,
				toggleText: "",
			},
		],
	],
	[
		"Payee_Bank_Proof.pdf",
		{
			file_name: "Payee_Bank_Proof.pdf",
			document_type: "bank_account_proof",
			account_name: "JUAN DELA CRUZ",
			account_number: "1029384756",
			bank_name: "BANK OF THE PHILIPPINE ISLANDS",
			branch_name: "Ayala Triangle",
			account_type: "Savings Account - PHP",
			date_generated: "2024-02-01",
		},
		[
			{
				text: "Bank Account Proof successfully extracted. Payee name matches the insured. Ready for Consistency check.",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "success" as const }],
				statusIndex: 0,
				showSender: true,
				type: "default",
				showFooter: true,
				toggleText: "",
			},
		],
	],
];
