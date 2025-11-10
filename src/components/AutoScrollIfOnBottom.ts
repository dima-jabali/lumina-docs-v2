import { useEffect } from "react";

export const AutoScrollIfOnBottom: React.FC<{
	scrollParentRef: React.RefObject<HTMLElement | null>;
}> = ({ scrollParentRef }) => {
	useEffect(() => {
		const scrollableElement = scrollParentRef.current;

		if (!scrollableElement) {
			console.log('ScrollIfOnBottom: "scrollableElement" not found', {
				scrollParentRef,
			});

			return;
		}

		// Scroll to bottom when it first appears:
		Reflect.set(scrollableElement, "scrollTop", scrollableElement.scrollHeight);

		let shouldScrollToBottom = true;

		const handleScroll = () => {
			const isCloseToBottom =
				Math.abs(
					scrollableElement.scrollHeight -
						scrollableElement.clientHeight -
						scrollableElement.scrollTop,
				) <= 10;

			shouldScrollToBottom = isCloseToBottom;
		};

		const domMutationObserver = new MutationObserver(() => {
			if (shouldScrollToBottom) {
				scrollableElement.scrollTop = scrollableElement.scrollHeight;
			}
		});

		// Configure the MutationObserver to observe child list changes
		// Start observing the target node for configured mutations
		domMutationObserver.observe(scrollableElement, {
			characterData: true,
			childList: true,
			subtree: true,
		});

		scrollableElement.addEventListener("scroll", handleScroll, {
			passive: true,
		});

		return () => {
			scrollableElement.removeEventListener("scroll", handleScroll);
			domMutationObserver.disconnect();
		};
	}, [scrollParentRef]);

	return null;
};
