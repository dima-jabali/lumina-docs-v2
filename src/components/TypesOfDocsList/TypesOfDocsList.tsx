"use client";

import { memo } from "react";
import { titleCase } from "scule";

import { FAKE_COMMISSION_DASHBOARD_CHARTS } from "@/lib/fake-commission-files";
import { FAKE_MORTGAGE_DASHBOARD_CHARTS } from "@/lib/fake-mortgage-files";
import { SUPPORTED_DOC_TYPES, SupportedDocTypes } from "@/types/general-enums";
import { FAKE_INVOICE_DASHBOARD_CHARTS } from "@/lib/fake-invoice-files";
import { globalStore, useDocType } from "@/contexts/luminaStore";

const LI_CLASSNAME =
	"flex gap-2 items-center justify-center px-4 py-1 w-fit min-w-1 text-xs font-semibold cursor-pointer shadow-sm shadow-black/10 button-hover border border-border-smooth/40 border-x-0 text-primary data-[active=true]:text-white data-[active=true]:bg-accent data-[active=true]:ring-offset-2 ring-offset-notebook first:rounded-s-md last:rounded-e-md not-last:border-r first:border-l last:border-r";

export const TypesOfDocsList: React.FC = memo(function TypesOfDocsList() {
	const currentDocType = useDocType();

	const handleChangeDocType = (docType: SupportedDocTypes | null) => {
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

			docType,
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

	const isAllActive = currentDocType === null || currentDocType === undefined;

	console.log({currentDocType})

	return (
		<ul className="flex flex-wrap gap-0 items-center h-10 px-1">
			<li
				onClick={() => handleChangeDocType(null)}
				data-active={isAllActive}
				className={LI_CLASSNAME}
				tabIndex={0}
			>
				<span>All</span>
			</li>

			{SUPPORTED_DOC_TYPES.map((docType) => {
				const isActive = currentDocType === docType;

				return (
					<li
						onClick={() => handleChangeDocType(docType)}
						className={LI_CLASSNAME}
						data-active={isActive}
						key={docType}
						tabIndex={0}
					>
						<span>{titleCase(docType)}</span>
					</li>
				);
			})}
		</ul>
	);
});
