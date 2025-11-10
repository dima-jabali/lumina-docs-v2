import { useQueryClient } from "@tanstack/react-query";

import type { InifiteQueryResponseOfFetchDocumentsResponse } from "./fetch/use-fetch-document-metadata-list";
import { useUpdateChatMessage } from "./mutation/use-update-chat-message";
import { useRef } from "react";
import type { Message } from "@/types/organization";
import { globalStore } from "@/contexts/luminaStore";

export function useGetNextMessage() {
	const queryClient = useQueryClient();

	function getNextMessage(index: number) {
		const { fileMetadataUuid, fetchDocumentMetadataListQueryKey } =
			globalStore.getState();

		if (!fileMetadataUuid || !fetchDocumentMetadataListQueryKey) {
			return undefined;
		}

		const cachedDocumentListInfiniteQueryResponse =
			queryClient.getQueryData<InifiteQueryResponseOfFetchDocumentsResponse>(
				fetchDocumentMetadataListQueryKey,
			);

		if (!cachedDocumentListInfiniteQueryResponse) {
			return undefined;
		}

		const flatPages = cachedDocumentListInfiniteQueryResponse.pages.flatMap(
			(page) => page.results,
		);

		const document = flatPages.find(
			(result) => result.file_uuid === fileMetadataUuid,
		);

		const messages = document?.chat_messages
			? Array.from(document.chat_messages.values())
			: undefined;

		return messages?.[index + 1];
	}

	return {
		getNextMessage,
	};
}

export function useOnFakeAiStreamEnd(staleMessage: Message, index: number) {
	const updateMessage = useUpdateChatMessage().mutate;
	const { getNextMessage } = useGetNextMessage();

	const messageRef = useRef(staleMessage);

	messageRef.current = staleMessage;

	function onEndFakeAiStream() {
		// Go to next status:

		const message = messageRef.current;

		const nextStatus = message.statuses?.[(message.statusIndex ?? 0) + 1];
		const currentStatus = message.statuses?.[message.statusIndex ?? 0];

		// console.log('onEndFakeAiStream',{nextStatus, currentStatus, message, index});

		if (nextStatus?.status === "loading") {
			// Wait for the loading to finish, then run this function again.
			setTimeout(() => {
				onEndFakeAiStream();
			}, nextStatus.timeout + 200);
		} else if (
			nextStatus?.status === "success" ||
			currentStatus?.status === "success"
		) {
			// Let's update the next message so it can be shown.
			setTimeout(() => {
				const nextMessage = getNextMessage(index);

				if (nextMessage) {
					updateMessage({
						...nextMessage,
						statusIndex: (nextMessage.statusIndex ?? 0) + 1,
					});
				}
			}, 700);
		}

		if (nextStatus) {
			updateMessage({
				...message,
				statusIndex: (message.statusIndex ?? 0) + 1,
			});
		}
	}

	return {
		onEndFakeAiStream,
	};
}
