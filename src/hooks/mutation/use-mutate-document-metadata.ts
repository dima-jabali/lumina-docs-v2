import {
	MutationObserverOptions,
	useMutation,
	useQueryClient,
	type QueryFilters,
} from "@tanstack/react-query";
import axios from "axios";

import { queryKeys } from "../queryKeys";
import type { Document } from "@/types/document";
import type { InifiteQueryResponseOfFetchDocumentsResponse } from "../fetch/use-fetch-document-metadata-list";
import { globalStore } from "@/contexts/luminaStore";

type MutateDocumentRequest = Partial<Document> & Pick<Document, "id">;

type MutateDocumentResponse = Document;

const mutationKey = [queryKeys.put.DOCUMENT_METADATA];

const cancelQueriesParams: QueryFilters = {
	predicate: (query) =>
		query.queryKey[0] === queryKeys.get.DOCUMENT_METADATA_LIST,
};

export const useMutateDocumentMetadata = () => {
	const queryClient = useQueryClient();

	queryClient.setMutationDefaults(mutationKey, {
		mutationFn: async (args) => {
			const res = await axios.put<MutateDocumentResponse>(
				`${process.env.NEXT_PUBLIC_DJANGO_BACKEND_ROOT_URL}/api/v1/aws-demo-files/${args.id}`,
				args,
			);

			return res.data;
		},

		onMutate: async () => await queryClient.cancelQueries(cancelQueriesParams),

		onSuccess: (updatedDocumentFromResponse) => {
			const { fetchDocumentMetadataListQueryKey } = globalStore.getState();

			if (!fetchDocumentMetadataListQueryKey) {
				return;
			}

			queryClient.setQueryData<InifiteQueryResponseOfFetchDocumentsResponse>(
				fetchDocumentMetadataListQueryKey,
				(cachedDocumentListInfiniteQueryResponse) => {
					if (
						!(
							cachedDocumentListInfiniteQueryResponse &&
							updatedDocumentFromResponse
						)
					) {
						console.log(
							"No cachedDocumentListInfiniteQueryResponse or updatedDocumentFromResponse! There is no optimistic item to replace!",
							{
								cachedDocumentListInfiniteQueryResponse,
								updatedDocumentFromResponse,
							},
						);

						return cachedDocumentListInfiniteQueryResponse;
					}

					const documentIdFromResponse = updatedDocumentFromResponse.id;

					const path = { pagesIndex: -1, resultIndex: -1 };

					let pagesIndex = -1;
					for (const page of cachedDocumentListInfiniteQueryResponse.pages) {
						++pagesIndex;

						const index = page.results.findIndex(
							({ id }) => id === documentIdFromResponse,
						);

						if (index === -1) continue;

						path.pagesIndex = pagesIndex;
						path.resultIndex = index;

						break;
					}

					if (path.pagesIndex === -1 || path.resultIndex === -1) {
						console.log(
							"[onSuccess] No optimistic document found in document infinite list. Not replacing it.",
						);

						return cachedDocumentListInfiniteQueryResponse;
					}

					const prevResults =
						cachedDocumentListInfiniteQueryResponse.pages[path.pagesIndex]
							?.results;

					if (!prevResults) {
						console.error(
							"[onSuccess] newResults is undefined inside infinite list! This should never happen!",
							{
								cachedDocumentListInfiniteQueryResponse,
								updatedDocumentFromResponse,
								path,
							},
						);

						return cachedDocumentListInfiniteQueryResponse;
					}

					const newResults: typeof prevResults = [...prevResults];

					newResults[path.resultIndex] = updatedDocumentFromResponse;

					const oldPage =
						cachedDocumentListInfiniteQueryResponse.pages[path.pagesIndex];

					if (!oldPage) {
						console.error(
							"[onSuccess] oldPage is undefined inside infinite list! This should never happen!",
							{
								cachedDocumentListInfiniteQueryResponse,
								updatedDocumentFromResponse,
								path,
							},
						);

						return cachedDocumentListInfiniteQueryResponse;
					}

					const newPage: (typeof cachedDocumentListInfiniteQueryResponse.pages)[number] =
						{
							...oldPage,
							num_results: oldPage.num_results,
							results: newResults,
						};

					const newPages: typeof cachedDocumentListInfiniteQueryResponse.pages =
						cachedDocumentListInfiniteQueryResponse.pages.with(
							path.pagesIndex,
							newPage,
						);

					const newCachedProjectsInfiniteQueryResponse: typeof cachedDocumentListInfiniteQueryResponse =
						{
							...cachedDocumentListInfiniteQueryResponse,
							pages: newPages,
						};

					console.log(
						"[onSuccess] replaced optimist document metadata in documents infinite list",
						{
							newCachedProjectsInfiniteQueryResponse,
							updatedDocumentFromResponse,
						},
					);

					return newCachedProjectsInfiniteQueryResponse;
				},
			);
		},
	} satisfies MutationObserverOptions<
		MutateDocumentResponse,
		Error,
		MutateDocumentRequest
	>);

	const createProjectMutation = useMutation<
		MutateDocumentResponse,
		Error,
		MutateDocumentRequest
	>({
		retry: false,
		mutationKey,
	});

	return createProjectMutation;
};
