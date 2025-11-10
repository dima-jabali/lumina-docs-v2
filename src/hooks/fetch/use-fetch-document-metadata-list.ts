"use client";

import {
	useSuspenseInfiniteQuery,
	type InfiniteData,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { clientAPI_V1 } from "@/api";
import { makeDocumentUuid } from "@/helpers/utils";
import { FAKE_COMMISSION_FILES } from "@/lib/fake-commission-files";
import { FAKE_MORTGAGE_FILES } from "@/lib/fake-mortgage-files";
import { PLEASE_REFRESH_PAGE } from "@/lib/utils";
import {
	type CommissionFields,
	type CommissionId,
	type Document,
	type DocumentId,
	type MortgageFields,
	type MortgageId,
} from "@/types/document";
import {
	FilterArchived,
	GeneralIndexStatus,
	SupportedDocTypes,
} from "@/types/general-enums";
import { queryKeys } from "../queryKeys";
import { usePageArchived } from "../url/use-page-archived";
import { usePageLimit } from "../url/use-page-limit";
import { usePageSort } from "../url/use-page-sort";
import {
	createISODate,
	type Message,
	type MessageUuid,
} from "@/types/organization";
import { globalStore } from "@/contexts/luminaStore";

export type FetchDocumentsResponse = {
	results: Array<Document>;
	num_results: number;
	offset: number;
	limit: number;
};

export type PageParam = {
	sort_direction?: string | null;
	archived?: string | null;
	sort?: string | null;
	offset: number;
	limit: number;
};

export type InifiteQueryResponseOfFetchDocumentsResponse = {
	pages: Array<FetchDocumentsResponse>;
	pageParams: Array<PageParam>;
};

export type FetchDocumentMetadataListQueryKey = [
	typeof queryKeys.get.DOCUMENT_METADATA_LIST,
	PageParam,
];

export const useFetchDocumentMetadataList = <
	SelectedData = InfiniteData<FetchDocumentsResponse, PageParam>,
>(
	select?: (
		data: InfiniteData<FetchDocumentsResponse, PageParam>,
	) => SelectedData,
) => {
	const [pageArchived] = usePageArchived();
	const [pageLimit] = usePageLimit();
	const [pageSort] = usePageSort();

	const [{ queryKey, initialPageParam }] = useState(() => {
		const initialPageParam: PageParam = {
			archived: pageArchived === FilterArchived.ALL ? undefined : pageArchived, // If ALL, don't send archived
			sort_direction: pageSort.sort_direction,
			sort: pageSort.sort,
			limit: pageLimit,
			offset: 0,
		};

		const ret = {
			queryKey: [
				queryKeys.get.DOCUMENT_METADATA_LIST,
				initialPageParam,
			] satisfies FetchDocumentMetadataListQueryKey,
			initialPageParam,
		};

		globalStore.setState({ fetchDocumentMetadataListQueryKey: ret.queryKey });

		return ret;
	});

	const projectsQuery = useSuspenseInfiniteQuery<
		FetchDocumentsResponse,
		Error,
		SelectedData,
		typeof queryKey,
		PageParam
	>({
		gcTime: Infinity, // Maintain on cache
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		initialPageParam,
		queryKey,
		select,
		queryFn: async ({ pageParam }) => {
			try {
				const objForUrlSearchParams: typeof pageParam = {
					...pageParam,
				};

				for (const key in objForUrlSearchParams) {
					// @ts-expect-error => Ignore
					const value = objForUrlSearchParams[key]!;

					if (value === null || value === undefined) {
						Reflect.deleteProperty(objForUrlSearchParams, key);
					}
				}

				const queryParamsString = new URLSearchParams(
					objForUrlSearchParams as unknown as Record<string, string>,
				).toString();

				console.log({ queryParamsString, pageParam, initialPageParam });

				const res = await clientAPI_V1
					.get<FetchDocumentsResponse>(`/aws-demo-files?${queryParamsString}`)
					.catch((error) => {
						console.error("Error fetching document metadata list:", error);

						return {
							data: {
								num_results: 0,
								results: [],
								offset: 0,
								limit: 0,
							} as FetchDocumentsResponse,
						};
					});

				{
					// Fake mortgages:

					console.log("Making fake mortgages");

					const fakeMortgage: Document = {
						file_type: SupportedDocTypes.Mortgage,
						status: GeneralIndexStatus.Complete,
						id: Math.random() as DocumentId,
						file_name: "MORT-2025-001233",
						file_uuid: makeDocumentUuid(),
						updated_at: createISODate(),
						created_at: createISODate(),
						chat_messages: new Map(),
						error: null,
						mortgages: FAKE_MORTGAGE_FILES.map(
							([file_name, fileFields, chat_messages]) =>
								({
									id: Math.random() as MortgageId,
									file_uuid: makeDocumentUuid(),
									created_at: createISODate(),
									updated_at: createISODate(),
									isValidated: true,
									chat_messages,
									fileFields,
									file_name,
								}) satisfies MortgageFields,
						),
					};

					res.data.results.push(
						fakeMortgage,
						{
							...fakeMortgage,
							id: Math.random() as DocumentId,
							file_name: "MORT-2025-001234",
							file_uuid: makeDocumentUuid(),
						},
						{
							...fakeMortgage,
							id: Math.random() as DocumentId,
							file_name: "MORT-2025-001235",
							file_uuid: makeDocumentUuid(),
						},
						{
							...fakeMortgage,
							id: Math.random() as DocumentId,
							file_name: "MORT-2025-001236",
							file_uuid: makeDocumentUuid(),
						},
						{
							...fakeMortgage,
							id: Math.random() as DocumentId,
							file_name: "MORT-2025-001237",
							file_uuid: makeDocumentUuid(),
						},
					);
				}

				{
					console.log("Making fake commissions");

					const fakeCommission: Document = {
						file_type: SupportedDocTypes.Commission,
						status: GeneralIndexStatus.Complete,
						id: Math.random() as DocumentId,
						file_name: "COMM-2025-001233",
						file_uuid: makeDocumentUuid(),
						updated_at: createISODate(),
						created_at: createISODate(),
						chat_messages: new Map(),
						error: null,
						commission_files: FAKE_COMMISSION_FILES.map(
							([file_name, fileFields, chat_messages]) =>
								({
									id: Math.random() as CommissionId,
									file_uuid: makeDocumentUuid(),
									created_at: createISODate(),
									updated_at: createISODate(),
									isValidated: true,
									chat_messages,
									fileFields,
									file_name,
								}) satisfies CommissionFields,
						),
					};

					res.data.results.push(
						fakeCommission,
						{
							...fakeCommission,
							id: Math.random() as DocumentId,
							file_name: "COMM-2025-001234",
							file_uuid: makeDocumentUuid(),
						},
						{
							...fakeCommission,
							id: Math.random() as DocumentId,
							file_name: "COMM-2025-001235",
							file_uuid: makeDocumentUuid(),
						},
						{
							...fakeCommission,
							id: Math.random() as DocumentId,
							file_name: "COMM-2025-001236",
							file_uuid: makeDocumentUuid(),
						},
						{
							...fakeCommission,
							id: Math.random() as DocumentId,
							file_name: "COMM-2025-001237",
							file_uuid: makeDocumentUuid(),
						},
					);
				}

				return res.data;
			} catch (error) {
				console.error("Error fetching documents of organization:", {
					initialPageParam,
					pageParam,
					error,
				});

				const currentPage = Math.floor(pageParam.offset / pageParam.limit) + 1;

				toast(`Error getting documents, page ${currentPage}`, {
					description: PLEASE_REFRESH_PAGE,
				});

				throw error;
			}
		},
		getNextPageParam: (lastPage, _allPages, lastPageParams) => {
			const nextOffset = lastPageParams.offset + lastPageParams.limit;

			if (lastPage && nextOffset > lastPage.num_results) return;

			return { ...lastPageParams, offset: nextOffset };
		},
		getPreviousPageParam: (_firstPage, _allPages, firstPageParams) => {
			const prevOffset = firstPageParams.offset - firstPageParams.limit;

			if (prevOffset < 0) return;

			return { ...firstPageParams, offset: prevOffset };
		},
	});

	return projectsQuery;
};

const FALLBACK_CHAT_MESSAGES: Map<MessageUuid, Message> = new Map();
export const useDocumentChatMessages = () => {
	const fileMetadataUuid = globalStore.use.fileMetadataUuid();

	const selectFileMetadata = (
		data: InifiteQueryResponseOfFetchDocumentsResponse,
	) => {
		if (!fileMetadataUuid) {
			return FALLBACK_CHAT_MESSAGES;
		}

		const flatPages = data.pages.flatMap((page) => page.results);

		const document = flatPages.find(
			(result) => result.file_uuid === fileMetadataUuid,
		);

		// console.log({ flatPages, document, fileMetadataUuid });

		return document?.chat_messages ?? FALLBACK_CHAT_MESSAGES;
	};

	return useFetchDocumentMetadataList(selectFileMetadata).data;
};

export function useFileMetadata() {
	const fileMetadataUuid = globalStore.use.fileMetadataUuid();

	const selectFileMetadata = (
		data: InifiteQueryResponseOfFetchDocumentsResponse,
	) => {
		if (!fileMetadataUuid) {
			return undefined;
		}

		const flatPages = data.pages.flatMap((page) => page.results);

		const document = flatPages.find(
			(result) => result.file_uuid === fileMetadataUuid,
		);

		// console.log({ flatPages, document, fileMetadataUuid });

		return document;
	};

	return useFetchDocumentMetadataList(selectFileMetadata).data;
}
