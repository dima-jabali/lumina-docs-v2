import { Bot, CheckCheck, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

import { useOnFakeAiStreamEnd } from "@/hooks/use-get-next-message";
import { closeDetails } from "@/lib/utils";
import { FakeAIStream } from "./FakeAIStream";
import { LOADER } from "./Loader";
import type { Message } from "@/types/organization";

type Props = {
	message: Message;
	index: number;
};

const ANIMATED_DOTS = (
	<span className="ml-0.5 min-w-fit" title="Loading...">
		<span className="dot-with-animation bg-black" />
		<span className="dot-with-animation bg-black" />
		<span className="dot-with-animation bg-black" />
	</span>
);

export function HandleStepsBotMessage({ message, index }: Props) {
	const detailsRef = useRef<HTMLDetailsElement>(null);

	const { onEndFakeAiStream } = useOnFakeAiStreamEnd(message, index);

	const status = message.statuses?.[message.statusIndex ?? 0];
	const isMessageComplete = status?.status === "success";
	const showSender = message.showSender ?? true;

	// console.log('steps',{message, index})

	useEffect(() => {
		if (isMessageComplete && detailsRef.current) {
			closeDetails(detailsRef.current);
		}
	}, [isMessageComplete]);

	if (status?.status === "hidden") {
		return null;
	}

	const date = new Date(message.createdAt);
	const minutes = `${date.getMinutes()}`.padStart(2, "0");
	const utcDate = date.toUTCString();
	const hour = date.getHours();
	return (
		<article
			className="@container flex w-full max-w-full group list-none gap-2.5 word-break pr-2.5 min-w-24"
			data-uuid={message.uuid}
			title="Steps"
			data-steps
		>
			<div
				className="size-8 rounded-full bg-indigo-800 p-1.5 data-[show-sender=false]:opacity-0"
				data-show-sender={showSender}
			>
				<Bot className="size-5 text-white" />
			</div>

			<div
				className="flex w-full flex-col gap-1 max-w-full simple-scrollbar data-[show-sender=false]:pl-[2.625rem]"
				data-show-sender={showSender}
			>
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

				<details className="w-full group" open ref={detailsRef}>
					<summary className="z-10 @[450px]:ml-[31%] w-fit flex relative px-0 select-none cursor-pointer">
						<div className="z-10 bg-white px-3.5 w-fit text-nowrap flex items-center gap-1">
							<span className="group-open:rotate-90">
								<ChevronRight className="size-3 stroke-black" />
							</span>

							<p className="whitespace-pre-wrap font-bold text-sm">
								{message.toggleText}
							</p>

							{isMessageComplete ? (
								<CheckCheck className="size-3 stroke-black" />
							) : (
								ANIMATED_DOTS
							)}
						</div>
					</summary>

					<div className="relative -top-3 z-0 h-fit w-full rounded-xl border-2 border-border-smooth p-4 flex flex-col gap-3">
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
					</div>
				</details>

				{status?.status === "loading" ? (
					<span className="size-6 flex">{LOADER}</span>
				) : null}
			</div>
		</article>
	);
}
