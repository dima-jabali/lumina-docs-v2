export enum ResponseLike {
	Good,
	Bad,
}

export const DOTS_WITH_ANIMATION = (
	<span className="ml-0.5 min-w-fit" title="Loading...">
		<span className="dot-with-animation bg-primary" />
		<span className="dot-with-animation bg-primary" />
		<span className="dot-with-animation bg-primary" />
	</span>
);

export const TIMEOUT_TO_CHANGE_COPY_ICON = 500;

export const handleCopyTextToClipboard = async (
	text: string,
	setWasCopiedSuccessfully: React.Dispatch<
		React.SetStateAction<boolean | undefined>
	>,
) => {
	try {
		await navigator.clipboard.writeText(text);

		setWasCopiedSuccessfully(true);

		setTimeout(() => {
			setWasCopiedSuccessfully(undefined);
		}, TIMEOUT_TO_CHANGE_COPY_ICON);
	} catch (error) {
		console.error("Failed to copy message:", error);

		setWasCopiedSuccessfully(false);

		setTimeout(() => {
			setWasCopiedSuccessfully(undefined);
		}, TIMEOUT_TO_CHANGE_COPY_ICON);
	}
};
