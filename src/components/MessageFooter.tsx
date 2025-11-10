import {
	CheckIcon,
	ClipboardIcon,
	RotateCcw,
	ThumbsDown,
	ThumbsUp,
	X,
} from "lucide-react";
import { useRef, useState } from "react";

import {
	handleCopyTextToClipboard,
	ResponseLike,
	TIMEOUT_TO_CHANGE_COPY_ICON,
} from "@/helpers/handleCopyTextToClipboard";

export function MessageFooter() {
	const [hasCopiedTextSuccessfully, setHasCopiedTextSuccessfully] =
		useState<boolean>();
	const [responseLike, setResponseLike] = useState<ResponseLike>();

	const footerRef = useRef<HTMLDivElement>(null);

	const handleSetAsGoodResponse = async () => {
		setResponseLike(ResponseLike.Good);
	};

	const handleSetAsBadResponse = async () => {
		setResponseLike(ResponseLike.Bad);
	};

	const handleCopyPlainText = async () => {
		if (!footerRef.current) {
			setHasCopiedTextSuccessfully(false);

			setTimeout(() => {
				setHasCopiedTextSuccessfully(undefined);
			}, TIMEOUT_TO_CHANGE_COPY_ICON);

			return;
		}

		let plainText = "";

		footerRef.current.parentElement
			?.querySelectorAll("[data-copy-text=true]")
			?.forEach((el) => {
				plainText += el.textContent ?? "";
			});

		await handleCopyTextToClipboard(plainText, setHasCopiedTextSuccessfully);
	};

	return (
		<footer
			className="flex w-full items-center justify-start gap-1 text-primary mb-4"
			ref={footerRef}
		>
			<button
				className="rounded-md p-1 button-hover"
				title="Copy plain text to clipboard"
				onClick={handleCopyPlainText}
			>
				{hasCopiedTextSuccessfully === true ? (
					<CheckIcon className="size-4 stroke-positive" />
				) : hasCopiedTextSuccessfully === false ? (
					<X className="size-4 stroke-destructive" />
				) : (
					<ClipboardIcon className="size-4" />
				)}
			</button>

			<button
				className="rounded-md p-1 button-hover"
				title="Regenerate message"
			>
				<RotateCcw className="size-4" />
			</button>

			<button
				className="rounded-md p-1 button-hover"
				onClick={handleSetAsGoodResponse}
				title="Good response"
			>
				<ThumbsUp
					className="size-4 fill-none data-[is-active=true]:fill-positive data-[is-active=false]:stroke-primary"
					data-is-active={responseLike === ResponseLike.Good}
				/>
			</button>

			<button
				className="rounded-md p-1 button-hover"
				onClick={handleSetAsBadResponse}
				title="Bad response"
			>
				<ThumbsDown
					className="size-4 fill-none data-[is-active=true]:fill-destructive data-[is-active=false]:stroke-primary"
					data-is-active={responseLike === ResponseLike.Bad}
				/>
			</button>
		</footer>
	);
}
