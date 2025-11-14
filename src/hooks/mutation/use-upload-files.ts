"use client";

import {
	MutationObserverOptions,
	useMutation,
	useQueryClient,
	type QueryFilters,
} from "@tanstack/react-query";
import axios from "axios";

import { queryKeys } from "../queryKeys";
import { clientToNextApi } from "@/api";
import type { Document } from "@/types/document";
import type { InifiteQueryResponseOfFetchDocumentsResponse } from "../fetch/use-fetch-document-metadata-list";
import { globalStore } from "@/contexts/luminaStore";

const mutationKey = [queryKeys.post.DOCUMENTS_BLOBS];

type UploadDocumentRequest = {
	file: File;
};

type UploadDocumentResponse = Document;

const cancelQueriesParams: QueryFilters = {
	predicate: (query) =>
		query.queryKey[0] === queryKeys.get.DOCUMENT_METADATA_LIST,
};

export const useUploadFiles = () => {
	const queryClient = useQueryClient();

	queryClient.setMutationDefaults(mutationKey, {
		mutationFn: async (args) => {
			const formData = new FormData();
			formData.append("file", args.file);

			const awsKey = `aws-idp/documents/${args.file.name}`;
			const awsBucket = "bb-demos-public-data";

			await clientToNextApi.post(
				`/?aws_key=${awsKey}&aws_bucket=${awsBucket}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
					timeout: 5 * 60 * 1000,
				},
			);

			const sendBucketAndKeyToBackendResponse = await axios.post(
				`${process.env.NEXT_PUBLIC_DJANGO_BACKEND_ROOT_URL}/api/v1/aws-demo-manual-upload-file/`,
				{
					bucket: awsBucket,
					key: awsKey,
				},
			);

			return sendBucketAndKeyToBackendResponse.data;
		},

		onMutate: async () => await queryClient.cancelQueries(cancelQueriesParams),

		onSuccess: (newDocumentFromResponse) => {
			const { fetchDocumentMetadataListQueryKey } = globalStore.getState();

			if (!fetchDocumentMetadataListQueryKey) {
				return;
			}

			queryClient.setQueryData<InifiteQueryResponseOfFetchDocumentsResponse>(
				fetchDocumentMetadataListQueryKey,
				(cachedDocumentListInfiniteQueryResponse) => {
					if (
						!(
							cachedDocumentListInfiniteQueryResponse && newDocumentFromResponse
						)
					) {
						console.log(
							"No cachedDocumentListInfiniteQueryResponse or newDocumentFromResponse! There is no optimistic item to replace!",
							{
								cachedDocumentListInfiniteQueryResponse,
								newDocumentFromResponse,
							},
						);

						return cachedDocumentListInfiniteQueryResponse;
					}

					const prevFirstPageResults =
						cachedDocumentListInfiniteQueryResponse.pages[0]?.results;

					if (!prevFirstPageResults) {
						console.error(
							"[onSuccess] newResults is undefined inside infinite list! This should never happen!",
							{
								cachedDocumentListInfiniteQueryResponse,
								newDocumentFromResponse,
							},
						);

						return cachedDocumentListInfiniteQueryResponse;
					}

					const newFirstPageResults: typeof prevFirstPageResults = [
						...prevFirstPageResults,
					];

					if (!newFirstPageResults) {
						console.error(
							"[onSuccess] newResults is undefined inside infinite list! This should never happen!",
							{
								cachedDocumentListInfiniteQueryResponse,
								newDocumentFromResponse,
							},
						);

						return cachedDocumentListInfiniteQueryResponse;
					}

					newFirstPageResults.unshift(newDocumentFromResponse);

					const oldPage = cachedDocumentListInfiniteQueryResponse.pages[0];

					if (!oldPage) {
						console.error(
							"[onSuccess] oldPage is undefined inside infinite list! This should never happen!",
							{
								cachedDocumentListInfiniteQueryResponse,
								newDocumentFromResponse,
							},
						);

						return cachedDocumentListInfiniteQueryResponse;
					}

					const newPage: (typeof cachedDocumentListInfiniteQueryResponse.pages)[number] =
						{
							...oldPage,
							num_results: oldPage.num_results + 1,
							results: newFirstPageResults,
						};

					const newPages: typeof cachedDocumentListInfiniteQueryResponse.pages =
						cachedDocumentListInfiniteQueryResponse.pages.with(0, newPage);

					const newCachedProjectsInfiniteQueryResponse: typeof cachedDocumentListInfiniteQueryResponse =
						{
							...cachedDocumentListInfiniteQueryResponse,
							pages: newPages,
						};

					console.log(
						"[onSuccess] replaced optimist project metadata in projects infinite list",
						{
							newCachedProjectsInfiniteQueryResponse,
							newDocumentFromResponse,
						},
					);

					return newCachedProjectsInfiniteQueryResponse;
				},
			);
		},
	} satisfies MutationObserverOptions<
		UploadDocumentResponse,
		Error,
		UploadDocumentRequest
	>);

	return useMutation<UploadDocumentResponse, Error, UploadDocumentRequest>({
		retry: false,
		mutationKey,
	});
};
