import { Check } from "lucide-react";
import { useRef, useState } from "react";

import { Loader } from "./Loader";
import { MessageFooter } from "./MessageFooter";
import { useOnFakeAiStreamEnd } from "@/hooks/use-get-next-message";
import type { Message } from "@/types/organization";

type Props = {
	message: Message;
	index: number;
};

export function ActionsMessage({ message, index }: Props) {
	const [isActionDone, setIsActionDone] = useState<boolean | undefined>(false);

	const hasOnEndRunRef = useRef(false);

	const { onEndFakeAiStream } = useOnFakeAiStreamEnd(message, index);

	const status = message.statuses?.[message.statusIndex ?? 0];

	if (status?.status === "hidden") {
		return null;
	}

	if (status?.status === "success" && !hasOnEndRunRef.current) {
		hasOnEndRunRef.current = true;
		onEndFakeAiStream();
	}

	const showFooter = message.showFooter ?? true;

	function handleSendEmail() {
		if (isActionDone) return;

		setIsActionDone(undefined);

		setTimeout(() => {
			setIsActionDone(true);
		}, 3_000);
	}

	return (
		<article
			className="@container flex flex-col w-full max-w-full group list-none gap-2.5 word-break pr-2.5 min-w-24 pl-[2.625rem]"
			data-uuid={message.uuid}
			title="Steps"
			data-steps
		>
			<button
				className="rounded-lg flex items-center gap-1.5 p-2 hover:bg-green-200 active:bg-green-300 bg-green-100 border border-green-300 w-fit text-xs text-green-600 font-semibold active:text-green-900 active:border-green-900"
				onClick={handleSendEmail}
			>
				{isActionDone ? (
					<>
						<Check className="size-4 text-green" />

						<p>{message.text}</p>
					</>
				) : isActionDone === undefined ? (
					<>
						<Loader className="size-4 border-t-green-600" />

						<p>{message.text}</p>
					</>
				) : (
					message.text
				)}
			</button>

			{status?.status === "success" && showFooter ? <MessageFooter /> : null}
		</article>
	);
}
