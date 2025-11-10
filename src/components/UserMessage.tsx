import { CheckCheck, CheckIcon, Clipboard, User, X } from "lucide-react";
import { useState } from "react";

import { handleCopyTextToClipboard } from "@/helpers/handleCopyTextToClipboard";
import type { Message } from "@/types/organization";

type Props = {
	message: Message;
};

export function UserMessage({ message }: Props) {
	const [wasCopiedSuccessfully, setWasCopiedSuccessfully] = useState<boolean>();

	const date = new Date(message.createdAt);
	const minutes = `${date.getMinutes()}`.padStart(2, "0");
	const utcDate = date.toUTCString();
	const hour = date.getHours();

	return (
		<article
			className="flex w-full list-none flex-row-reverse gap-2.5 max-w-[94%] justify-end"
			data-uuid={message.uuid}
			contentEditable={false}
			title="User message"
			data-user-message
		>
			<div className="size-8 rounded-full bg-muted/10 aspect-square flex items-center justify-center">
				<User className="size-5 stroke-1" />
			</div>

			<div className="flex w-full flex-col gap-1" contentEditable={false}>
				<section
					aria-label="Name and hour"
					className="flex flex-row-reverse items-center gap-2"
					contentEditable={false}
				>
					<p className="text-sm font-bold" contentEditable={false}>
						User
					</p>

					<p
						className="text-xs tabular-nums text-primary"
						contentEditable={false}
						title={utcDate}
					>
						{hour}:{minutes}
					</p>
				</section>

				<pre
					className="simple-scrollbar whitespace-pre-wrap font-inter font-features-inter user-message-markdown-custom-styles w-full max-w-full flex justify-end"
					aria-label="Message text"
				>
					{message.text}
				</pre>

				<footer className="flex w-full items-center justify-end gap-1 text-primary">
					<button
						className="rounded-md p-1 button-hover"
						title="Copy message to clipboard"
						onClick={async () => {
							await handleCopyTextToClipboard(
								message.text,
								setWasCopiedSuccessfully,
							);
						}}
					>
						{wasCopiedSuccessfully === true ? (
							<CheckIcon className="size-4 stroke-positive" />
						) : wasCopiedSuccessfully === false ? (
							<X className="size-4 stroke-destructive" />
						) : (
							<Clipboard className="size-4" />
						)}
					</button>

					<span
						className="flex items-center justify-center p-1"
						title="Message sent"
					>
						<CheckCheck
							className="size-4 stroke-primary data-[has-failed-to-send=true]:stroke-destructive data-[is-message-sent=true]:stroke-positive"
							data-is-message-sent
						/>
					</span>
				</footer>
			</div>
		</article>
	);
}
