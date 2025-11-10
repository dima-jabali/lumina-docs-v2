import { Bot } from "lucide-react";

import { MessageFooter } from "./MessageFooter";
import type { Message } from "@/types/organization";
import { useOnFakeAiStreamEnd } from "@/hooks/use-get-next-message";
import { FakeAIStream } from "./FakeAIStream";
import { LOADER } from "./Loader";

type Props = {
	message: Message;
	index: number;
};

export function BotMessage({ message, index }: Props) {
	const { onEndFakeAiStream } = useOnFakeAiStreamEnd(message, index);

	const status = message.statuses?.[message.statusIndex ?? 0];

	// console.log('bot',{message, index})

	if (status?.status === "hidden") {
		return null;
	}

	const date = new Date(message.createdAt);
	const minutes = `${date.getMinutes()}`.padStart(2, "0");
	const showSender = message.showSender ?? true;
	const showFooter = message.showFooter ?? true;

	const utcDate = date.toUTCString();
	const hour = date.getHours();

	return (
		<article
			className="flex w-full max-w-full group list-none gap-2.5 word-break pr-2.5 min-w-24"
			data-uuid={message.uuid}
			contentEditable={false}
			title="AI Response"
			data-ai-response
		>
			<div
				className="size-8 rounded-full bg-indigo-800 p-1.5 data-[show-sender=false]:opacity-0"
				data-show-sender={showSender}
			>
				<Bot className="size-5 text-white" />
			</div>

			<div className="flex w-full flex-col gap-1 max-w-full simple-scrollbar">
				<section
					className="flex items-center gap-2 data-[show-sender=false]:opacity-0"
					aria-label="Name and hour"
					data-show-sender={showSender}
				>
					<p className="text-sm font-bold" contentEditable={false}>
						Bot
					</p>

					<p
						className="text-xs tabular-nums text-primary"
						contentEditable={false}
						title={utcDate}
					>
						{hour}:{minutes}
					</p>
				</section>

				<FakeAIStream
					className="min-h-5 font-var-inter whitespace-pre-wrap break-words"
					enabled={status?.status !== "success"}
					paused={status?.status === "loading"}
					onEnd={onEndFakeAiStream}
					fullText={message.text}
					characterPerStep={4}
					key={message.uuid}
					startFaking
					speed={20}
				/>

				{status?.status === "loading" ? (
					<span className="size-6 flex">{LOADER}</span>
				) : null}

				{status?.status === "success" && showFooter ? <MessageFooter /> : null}
			</div>
		</article>
	);
}
