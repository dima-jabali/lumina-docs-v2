import { useEffect } from "react";

import { useCurrentStep } from "@/hooks/fetch/use-fetch-organization-list";
import { useCreateChatMessage } from "@/hooks/mutation/use-create-chat-message";

export function HandleShowChatMessagesWhenVisible() {
	const createMessages = useCreateChatMessage().mutate;
	const step = useCurrentStep();

	useEffect(() => {
		if (!step) return;

		const timeout = setTimeout(() => {
			// console.log("creating messages", step);

			createMessages(step.chatMessages);
		}, 50);

		return () => {
			clearTimeout(timeout);
		};
	}, [createMessages, step]);

	return null;
}
