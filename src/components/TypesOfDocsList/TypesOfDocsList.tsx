"use client";

import { memo } from "react";
import { titleCase } from "scule";

import { globalStore, useDocType } from "@/contexts/luminaStore";
import { FAKE_COMMISSION_DASHBOARD_CHARTS } from "@/lib/fake-commission-files";
import { FAKE_INVOICE_DASHBOARD_CHARTS } from "@/lib/fake-invoice-files";
import { FAKE_MORTGAGE_DASHBOARD_CHARTS } from "@/lib/fake-mortgage-files";
import { SupportedDocTypes } from "@/types/general-enums";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export const TypesOfDocsList: React.FC = memo(function TypesOfDocsList() {
	const documentTypes = globalStore.use.documentTypes();
	const currentDocType = useDocType();

	const handleChangeDocType = (docType: string | null) => {
		if (docType === "all") {
			docType = null;
		}

		const dashboardList = (() => {
			switch (docType) {
				case SupportedDocTypes.Mortgage:
					return FAKE_MORTGAGE_DASHBOARD_CHARTS;

				case SupportedDocTypes.Commission:
					return FAKE_COMMISSION_DASHBOARD_CHARTS;

				case SupportedDocTypes.Invoice:
					return FAKE_INVOICE_DASHBOARD_CHARTS;

				default:
					return [];
			}
		})();

		globalStore.setState({
			dashboardList,

			docType: docType as SupportedDocTypes | null,
			columnFilters: docType
				? [
						{
							id: "file_type",
							value: docType,
						},
					]
				: [],
		});
	};

	return (
		<Select onValueChange={handleChangeDocType} value={currentDocType || "all"}>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>

			<SelectContent>
				<SelectItem key="all" value="all">
					All
				</SelectItem>

				{documentTypes.map((dt) => (
					<SelectItem key={dt.id} value={dt.id}>
						{titleCase(dt.id)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
});
