import { useLayoutEffect, useRef } from "react";

import { AutoScrollIfOnBottom } from "@/components/AutoScrollIfOnBottom";
import { MessageInput } from "@/components/MessageInput";
import { RenderMessage } from "@/components/RenderMessage";
import { useDocumentChatMessages } from "@/hooks/fetch/use-fetch-document-metadata-list";
import { useCurrentOrganization } from "@/hooks/fetch/use-fetch-organization-list";
import { useCreateChatMessage } from "@/hooks/mutation/use-create-chat-message";
import {
	LuminaDocsTab,
	useLuminaDocsTab,
} from "@/hooks/url/use-lumina-docs-tab";
import type { Message } from "@/types/organization";
import { globalStore } from "@/contexts/luminaStore";

export function ChatWithLuminaDocs() {
	const dashboardMessages = globalStore.use.dashboardChatMessages();
	const selectedSubFile = globalStore.use.selectedSubFile();
	const createMessage = useCreateChatMessage().mutate;
	const [luminaDocsTab] = useLuminaDocsTab();
	const messages = useDocumentChatMessages();
	const org = useCurrentOrganization();

	const scrollRef = useRef<HTMLOListElement>(null);

	const currentStep = org?.currentStep;

	useLayoutEffect(() => {
		let timeout: ReturnType<typeof setTimeout> | undefined;

		if (selectedSubFile && currentStep === 1) {
			const newMessages: Array<Message> = selectedSubFile.chat_messages ?? [];

			timeout = setTimeout(() => {
				createMessage(newMessages);
			}, 500);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [currentStep, selectedSubFile, createMessage]);

	return (
		<div className="flex h-full w-full simple-scrollbar flex-col gap-2 pt-4">
			<ol
				className="list-none relative flex h-full px-4 pr-[calc(2.5rem-15px)] max-h-full flex-col gap-6 overflow-auto simple-scrollbar pb-10"
				ref={scrollRef}
			>
				{luminaDocsTab === LuminaDocsTab.Dashboard
					? dashboardMessages.map(RenderMessage)
					: Array.from(messages.values()).map(RenderMessage)}

				<AutoScrollIfOnBottom scrollParentRef={scrollRef} />
			</ol>

			<MessageInput scrollRef={scrollRef} />
		</div>
	);
}
