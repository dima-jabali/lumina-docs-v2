import { cn } from "@/lib/utils";
import {
	useEffect,
	useRef,
	useState,
	type ComponentProps,
	type PropsWithChildren,
} from "react";

type FakeAIStreamProps = {
	characterPerStep?: number;
	startFaking?: boolean;
	onEnd?: () => void;
	enabled?: boolean;
	fullText: string;
	paused?: boolean;
	speed?: number; // milliseconds per character
};

function textWithLineBreaks(text: string) {
	return text.replaceAll(/\\n/g, "\n").replaceAll(/\\t/g, "\t");
}

export const FakeAIStream: React.FC<
	PropsWithChildren<FakeAIStreamProps & ComponentProps<"p">>
> = ({
	characterPerStep = 1,
	startFaking = false,
	enabled = true,
	paused = false,
	speed = 40,
	className,
	fullText,
	children,
	onEnd,
	...props
}) => {
	const [prevFullText, setPrevFullText] = useState(startFaking ? "" : fullText);
	const [displayedText, setDisplayedText] = useState("");

	const hasEndedNaturallyRef = useRef(false);
	const hasRunOnEndFnRef = useRef(false);
	const onEndRef = useRef(onEnd);
	const indexRef = useRef(0);

	const shouldFakeStream =
		enabled && prevFullText !== fullText && displayedText !== fullText;

	onEndRef.current = onEnd;

	useEffect(() => {
		if (paused) return;

		if (hasEndedNaturallyRef.current && !hasRunOnEndFnRef.current) {
			hasRunOnEndFnRef.current = true;
			onEndRef.current?.();
		}

		if (!shouldFakeStream) {
			setDisplayedText(fullText);
			setPrevFullText(fullText);

			return;
		}

		const fullTextLength = fullText.length + characterPerStep;

		const interval = setInterval(() => {
			if (indexRef.current <= fullTextLength) {
				const nextDisplayedText = fullText.slice(0, indexRef.current);

				setDisplayedText(nextDisplayedText);

				indexRef.current += characterPerStep;

				if (indexRef.current >= fullTextLength) {
					hasEndedNaturallyRef.current = true;
					setPrevFullText(fullText);
					clearInterval(interval);
				}
			} else {
				hasEndedNaturallyRef.current = true;
				setPrevFullText(fullText);
				clearInterval(interval);
			}
		}, speed);

		return () => clearInterval(interval); // cleanup if the component unmounts
	}, [characterPerStep, enabled, fullText, paused, shouldFakeStream, speed]);

	return (
		<p className={cn(className, "whitespace-pre-wrap")} {...props}>
			{textWithLineBreaks(displayedText)}

			{children}
		</p>
	);
};
