"use client";

import type { FilterFnOption } from "@tanstack/react-table";

import { GeneralIndexStatus } from "@/types/general-enums";
import type { DocumentUuid } from "@/types/document";
import type { ISODateString } from "@/types/organization";
import type {
	DashboardItemUuid,
	DashboardProjectUuid,
} from "@/contexts/luminaStore";

export enum MimeType {
	Pptx = "application/vnd.ms-powerpoint",
	General = "application/octet-stream",
	Docx = "application/msword",
	Pdf = "application/pdf",
	Csv = "text/csv",
	Image = "image/",
}

const SUPPORTED_DOC_TYPES = [MimeType.Csv, MimeType.Pdf];

export const isSupportFileType = (fileType: string): boolean =>
	SUPPORTED_DOC_TYPES.includes(fileType as MimeType);

export const matchStatusClassName = (
	status: GeneralIndexStatus | null | undefined,
) => {
	switch (status) {
		case GeneralIndexStatus.InProgress: {
			const className = "text-yellow-100 bg-yellow-800";

			return className;
		}

		case GeneralIndexStatus.TimedOut:
		case GeneralIndexStatus.Aborted:
		case GeneralIndexStatus.Failed: {
			const className = "text-red-100 bg-red-800";

			return className;
		}

		case GeneralIndexStatus.Complete: {
			const className = "text-green-100 bg-green-800";

			return className;
		}
		default: {
			return "";
		}
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dateFilterFn: FilterFnOption<any> = (
	row,
	columnId,
	filterValue,
): boolean => {
	const item = row.original;
	const checkDate =
		"updated_at" in item
			? item.updated_at
			: (item.created_at as ISODateString | null);

	const dateAsDate = checkDate ? new Date(checkDate) : null;

	if (!dateAsDate) {
		return false;
	}

	const value = shortMonthWithHourDateFormatter
		.format(dateAsDate)
		.toLowerCase();

	const includeInFilteredList = value.includes(filterValue);

	return includeInFilteredList;
};

export const makeDashboardProjectUuid = () =>
	(globalThis.crypto?.randomUUID() || "") as DashboardProjectUuid;

export const makeDashboardItemUuid = () =>
	(globalThis.crypto?.randomUUID() || "") as DashboardItemUuid;

export const makeDocumentUuid = () =>
	(globalThis.crypto?.randomUUID() || "") as DocumentUuid;

export const shortMonthWithHourDateFormatter = new Intl.DateTimeFormat(
	undefined,
	{
		minute: "numeric",
		hourCycle: "h12",
		hour: "numeric",
		year: "numeric",
		day: "numeric",
		month: "short",
	},
);

export const isDev = process.env.NEXT_PUBLIC_VERCEL_ENV === "development";
