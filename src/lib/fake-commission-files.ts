"use client";

import { CommissionPayoutCycleTimeChart } from "@/components/Document/CommissionSteps/charts/CommissionPayoutCycleTimeChart";
import { ExceptionRateOverTimeChart } from "@/components/Document/CommissionSteps/charts/ExceptionRateOverTimeChart";
import { SalesByPropertyLocationBarChart } from "@/components/Document/CommissionSteps/charts/SalesByPropertyLocationBarChart";
import { TaxWithheldVsPaidOutChart } from "@/components/Document/CommissionSteps/charts/TaxWithheldVsPaidOutChart";
import { DocumentTurnaroundTimeChart } from "@/components/mortgage-charts/DocumentTurnaroundTimeChart";
import { FieldAccuracyHeatMapChart } from "@/components/mortgage-charts/FieldAccuracyHeatMapChart";
import { MissingDocsChart } from "@/components/mortgage-charts/MissingDocsChart";
import { UnderwritingCycleTimeChart } from "@/components/mortgage-charts/UnderwritingCycleTimeChart";
import type { DashboardProject } from "@/contexts/luminaStore";
import {
	makeDashboardItemUuid,
	makeDashboardProjectUuid,
} from "@/helpers/utils";
import type { CommissionFileFields } from "@/types/document";
import { ChartType } from "@/types/general-enums";
import {
	createISODate,
	createMessageUuid,
	type Message,
} from "@/types/organization";

export const FAKE_COMMISSION_FILES: Array<
	[
		filename: string,
		fields: CommissionFileFields,
		chat_messages: Array<Message>,
	]
> = [
	[
		"BrokerCommissionAgreement_Freelance_WebDev_ProjectX.pdf",
		{
			document_type: "broker_commission_agreement",
			agreement_id: "FCA-WD-2025-001",
			broker_name: "Tech Solutions PH",
			broker_id: "TSPH-007",
			property_id: "WEBDEV-PROJX-001", // This could represent a project ID in a freelance context
			commission_rate_percentage: 10.0,
			tiered_bonus_clauses:
				"5% bonus on total project value if delivered 1 week early.",
			effective_date: "2025-01-15",
		},
		[
			{
				text: "The Broker Commission Agreement is ready for review.",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "streaming" }, { status: "success" }],
				statusIndex: 0,
				showSender: true,
				showFooter: true,
				toggleText: "",
			},
		],
	],
	[
		"SalesContract_ITServices_ClientA.pdf",
		{
			document_type: "sales_contract",
			contract_id: "SC-ITS-2025-003",
			buyer_name: "Client A Innovations Inc.",
			buyer_id: "CLI-A-001",
			property_id: "ITSERV-MIGRATE-005",
			sale_price: 150000.0,
			closing_date: "2025-02-28",
			payment_schedule: "50% upfront, 50% upon project completion",
		},
		[
			{
				text: "The Sales Contract is ready for review.",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "streaming" }, { status: "success" }],
				statusIndex: 0,
				showSender: true,
				showFooter: true,
				toggleText: "",
			},
		],
	],
	[
		"OfficialReceipt_TSPH_Commission_Jan2025.pdf",
		{
			document_type: "official_receipt",
			receipt_number: "OR-2025-01-001",
			series: "COMM",
			date_issued: "2025-03-05",
			amount: 15000.0, // 10% of 150k
			tax_withheld: 750.0, // Example: 5% withholding tax for professional fees
		},
		[
			{
				text: "The Official Receipt is ready for review.",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "streaming" }, { status: "success" }],
				statusIndex: 0,
				showSender: true,
				toggleText: "",
				showFooter: true,
			},
		],
	],
	[
		"BIRForm2307_TechSolutionsPH_Jan2025.pdf",
		{
			document_type: "bir_form_2307",
			taxpayer_identification_no: "000-111-222-333",
			income_type: "commission",
			withholding_tax_rate: 0.05,
			amount_remitted: 750.0,
		},
		[
			{
				text: "The BIR Form is ready for review.",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "streaming" }, { status: "success" }],
				statusIndex: 0,
				showSender: true,
				toggleText: "",
				showFooter: true,
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
				showFooter: true,
			},
		],
	],
	[
		"SalesAgreement_DigitalMarketing_StartupY.pdf",
		{
			document_type: "sales_contract",
			contract_id: "SA-DM-2025-007",
			buyer_name: "Startup Y Ventures",
			buyer_id: "STY-002",
			property_id: "DM-CAMPAIGN-003",
			sale_price: 80000.0,
			closing_date: "2025-03-20",
			payment_schedule: "Monthly retainer fee with performance bonuses",
		},
		[
			{
				text: "The Sales Agreement file fields is ready for review.",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "streaming" }, { status: "success" }],
				statusIndex: 0,
				showSender: true,
				toggleText: "",
				showFooter: true,
			},
		],
	],
	[
		"BIRForm1904_TechSolutionsPH_Registration.pdf",
		{
			document_type: "bir_form_1904",
			taxpayer_identification_no: "000-111-222-333",
			income_type: "commission",
			withholding_tax_rate: null, // Form 1904 is for registration, not direct remittance
			amount_remitted: null,
		},
		[
			{
				text: "The BIR Form file fields is ready for review.",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "streaming" }, { status: "success" }],
				statusIndex: 0,
				showSender: true,
				toggleText: "",
				showFooter: true,
			},
		],
	],
	[
		"GovernmentID_MariaCruz_Passport.pdf",
		{
			document_type: "government_id",
			full_name: "Maria Santos Cruz",
			id_number: "P1234567A",
			id_expiry: "2030-01-01",
			face_photo_url: "https://example.com/photos/maria_cruz_passport.jpg",
		},
		[
			{
				text: "The Government ID file fields is ready for review.",
				createdAt: createISODate(),
				uuid: createMessageUuid(),
				sender: "bot",
				statuses: [{ status: "streaming" }, { status: "success" }],
				statusIndex: 0,
				showSender: true,
				toggleText: "",
				showFooter: true,
			},
		],
	],
];

export const FAKE_COMMISSION_DASHBOARD_CHARTS: Array<DashboardProject> = [
	{
		name: "General Analytics",
		uuid: makeDashboardProjectUuid(),
		items: [
			{
				name: "Tax Withheld vs. Paid Out (Compliance Trend)",
				chart: TaxWithheldVsPaidOutChart,
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.BoxPlot,
				chartConfig: {},
				description: "",
				data: [],
			},
			{
				description: "% docs that triggered manual review",
				chart: ExceptionRateOverTimeChart,
				name: "Exception rate over time",
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.BoxPlot,
				chartConfig: {},
				data: [],
			},
			{
				name: "Sales by Property Location & Marketing Spots",
				chart: SalesByPropertyLocationBarChart,
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.BoxPlot,
				chartConfig: {},
				description: "",
				data: [],
			},
			{
				name: "Commission Payout Cycle-Time (Upload docs → ERP Write) Distribution",
				description: "See process bottlenecks/improvements",
				chart: CommissionPayoutCycleTimeChart,
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.BoxPlot,
				chartConfig: {},
				data: [],
			},
		],
	},
	{
		name: "Operational Efficiency Metrics",
		uuid: makeDashboardProjectUuid(),
		items: [
			{
				name: "Average document-turnaround time",
				chart: DocumentTurnaroundTimeChart,
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.BoxPlot,
				description: "Per doc type",
				chartConfig: {},
				data: [],
			},
			{
				name: "% Applications with missing docs",
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.Line,
				chart: MissingDocsChart,
				chartConfig: {},
				description: "",
				data: [],
			},
			{
				description: "Received -> Approval",
				chart: UnderwritingCycleTimeChart,
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.Line,
				name: "Cycle time",
				chartConfig: {},
				data: [],
			},
			{
				description: "Field-level accuracy heat-map",
				chart: FieldAccuracyHeatMapChart,
				name: "Top OCR error sources",
				uuid: makeDashboardItemUuid(),
				chartType: ChartType.Line,
				chartConfig: {},
				data: [],
			},
		],
	},
];
