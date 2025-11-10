import {
	MutationObserverOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

import {
	useFetchDocumentMetadataList,
	type InifiteQueryResponseOfFetchDocumentsResponse,
} from "../fetch/use-fetch-document-metadata-list";
import type { Message } from "@/types/organization";
import { globalStore } from "@/contexts/luminaStore";

type UpdateChatMessageRequest = Message;

type UpdateChatMessageResponse = null;

const mutationKey = ["update-chat-message"];

export const useUpdateChatMessage = () => {
	useFetchDocumentMetadataList();

	const fileMetadataUuid = globalStore.use.fileMetadataUuid();
	const queryClient = useQueryClient();

	queryClient.setMutationDefaults(["update-chat-message"], {
		mutationFn: async (msg) => {
			const { fetchDocumentMetadataListQueryKey } = globalStore.getState();

			if (!fetchDocumentMetadataListQueryKey || !fileMetadataUuid) {
				throw new Error("No file metadata or no query key");
			}

			let error = "";

			queryClient.setQueryData<InifiteQueryResponseOfFetchDocumentsResponse>(
				fetchDocumentMetadataListQueryKey,
				(cachedDocumentListInfiniteQueryResponse) => {
					if (!cachedDocumentListInfiniteQueryResponse) {
						error = "No cachedDocumentListInfiniteQueryResponse";

						return cachedDocumentListInfiniteQueryResponse;
					}

					const path = { pagesIndex: -1, resultIndex: -1 };

					let pageIndex = 0,
						resultIndex = 0;
					findPath: for (const page of cachedDocumentListInfiniteQueryResponse.pages) {
						for (const result of page.results) {
							if (result.file_uuid === fileMetadataUuid) {
								path.resultIndex = resultIndex;
								path.pagesIndex = pageIndex;

								break findPath;
							}

							++resultIndex;
						}

						++pageIndex;
					}

					if (path.pagesIndex === -1 || path.resultIndex === -1) {
						error = "No path";

						return cachedDocumentListInfiniteQueryResponse;
					}

					const page =
						cachedDocumentListInfiniteQueryResponse.pages[path.pagesIndex];
					const oldDocument = page?.results[path.resultIndex];

					if (!oldDocument) {
						error = "No oldDocument";

						return cachedDocumentListInfiniteQueryResponse;
					}

					if (!oldDocument.chat_messages) {
						oldDocument.chat_messages = new Map();
					}

					if (oldDocument.chat_messages.has(msg.uuid)) {
						oldDocument.chat_messages.set(msg.uuid, msg);
					} else {
						error = "No old message";

						return cachedDocumentListInfiniteQueryResponse;
					}

					return structuredClone(cachedDocumentListInfiniteQueryResponse);
				},
			);

			if (error) {
				throw new Error(error);
			}

			return null;
		},
		onError: (error) => {
			console.error("Error updating chat message:", error);
		},
	} satisfies MutationObserverOptions<
		UpdateChatMessageResponse,
		Error,
		UpdateChatMessageRequest
	>);

	return useMutation<
		UpdateChatMessageResponse,
		Error,
		UpdateChatMessageRequest
	>({
		retry: false,
		mutationKey,
	});
};
