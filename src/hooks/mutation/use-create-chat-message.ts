import {
	MutationObserverOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

import type { Document } from "@/types/document";
import {
	useFetchDocumentMetadataList,
	type InifiteQueryResponseOfFetchDocumentsResponse,
} from "../fetch/use-fetch-document-metadata-list";
import type { Message, MessageUuid } from "@/types/organization";
import { globalStore } from "@/contexts/luminaStore";

const mutationKey = ["create-chat-message"];

type CreateChatMessageRequest = Array<Message>;

type CreateChatMessageResponse = {
	alreadyPresentMessages: Set<MessageUuid>;
	addedMessages: Set<MessageUuid>;
};

export const useCreateChatMessage = () => {
	useFetchDocumentMetadataList();

	const fileMetadataUuid = globalStore.use.fileMetadataUuid();
	const queryClient = useQueryClient();

	queryClient.setMutationDefaults(mutationKey, {
		mutationFn: async (newMessages) => {
			const { fetchDocumentMetadataListQueryKey } = globalStore.getState();

			if (!fetchDocumentMetadataListQueryKey || !fileMetadataUuid) {
				throw new Error("No fetchDocumentMetadataListQueryKey or fileMetadata");
			}

			const returnValue: CreateChatMessageResponse = {
				alreadyPresentMessages: new Set(),
				addedMessages: new Set(),
			};
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

					const newChatMessages = new Map(oldDocument.chat_messages);

					for (const newMessage of newMessages) {
						if (newChatMessages.has(newMessage.uuid)) {
							returnValue.alreadyPresentMessages.add(newMessage.uuid);
						} else {
							newChatMessages.set(newMessage.uuid, newMessage);
							returnValue.addedMessages.add(newMessage.uuid);
						}
					}

					const newDocument: Document = {
						...oldDocument,
						chat_messages: newChatMessages,
					};

					const newCache = structuredClone(
						cachedDocumentListInfiniteQueryResponse,
					);

					newCache.pages[path.pagesIndex]!.results[path.resultIndex] =
						newDocument;

					// console.log({ newDocument, oldDocument });

					return newCache;
				},
			);

			if (error) {
				throw new Error(error);
			}

			// console.log(returnValue)

			return returnValue;
		},
		onError: (error) => {
			console.error("Error creating chat message", error);
		},
	} satisfies MutationObserverOptions<
		CreateChatMessageResponse,
		Error,
		CreateChatMessageRequest
	>);

	return useMutation<
		CreateChatMessageResponse,
		Error,
		CreateChatMessageRequest
	>({
		retry: false,
		mutationKey,
	});
};
