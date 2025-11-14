import { ArrowUp } from "lucide-react";
import { useRef } from "react";

import { sleep } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useCreateChatMessage } from "@/hooks/mutation/use-create-chat-message";
import {
	LuminaDocsTab,
	useLuminaDocsTab,
} from "@/hooks/url/use-lumina-docs-tab";
import {
	createISODate,
	createMessageUuid,
	type Message,
} from "@/types/organization";
import { globalStore, useDocType } from "@/contexts/luminaStore";

export const LOAN_RISK_SUBSTRING = "mortgage loan risk";
export const AMOUNT_SUBSTRING = "amount";
export const VOLUME_SUBSTRING = "volume";

export function MessageInput({
	scrollRef,
}: {
	scrollRef: React.RefObject<HTMLOListElement | null>;
}) {
	const emailThreadChatMessages = globalStore.use.emailThreadChatMessages();
	const applicationList = globalStore.use.applicationList();
	const isStreaming = globalStore.use.isStreaming();
	const createMessage = useCreateChatMessage();
	const [luminaDocsTab] = useLuminaDocsTab();
	const docType = useDocType()!;

	const inputRef = useRef<HTMLTextAreaElement>(null);

	async function handleSendMessage() {
		if (emailThreadChatMessages) {
			const nextMessageIndex = emailThreadChatMessages.findIndex(
				(email) => email.statuses[email.statusIndex]?.status === "hidden",
			);
			if (nextMessageIndex !== -1) {
				const nextMessage = emailThreadChatMessages[nextMessageIndex]!;
				const isLastMessage =
					nextMessageIndex === emailThreadChatMessages.length - 1;

				globalStore.setState({
					emailThreadChatMessages: [
						...emailThreadChatMessages.slice(0, nextMessageIndex),
						{
							...nextMessage,
							statuses: [
								...nextMessage.statuses.slice(0, nextMessage.statusIndex),
								{
									...nextMessage.statuses[nextMessage.statusIndex],
									status: "success",
								},
							],
						},
						...emailThreadChatMessages.slice(nextMessageIndex + 1),
					],
				});

				if (isLastMessage) {
					const validationRules =
						applicationList.find((a) => a.id === docType)?.validationRules ||
						[];

					const updatedValidationRules = validationRules.map((r) => {
						return { ...r, missing: false };
					});

					const updatedApplicationList = applicationList.map((a) => {
						if (a.id === docType) {
							return { ...a, validationRules: updatedValidationRules };
						}

						return a;
					});

					globalStore.setState({
						applicationList: updatedApplicationList,
					});
				}
			}

			return;
		}

		const text = inputRef.current?.value ?? "";

		if (!text || isStreaming) {
			return;
		}

		const newMessage: Message = {
			statuses: [{ status: "success" }],
			createdAt: createISODate(),
			uuid: createMessageUuid(),
			showFooter: true,
			showSender: true,
			type: "default",
			statusIndex: 0,
			sender: "user",
			toggleText: "",
			text,
		};

		globalStore.setState({ isStreaming: true });

		if (luminaDocsTab === LuminaDocsTab.Dashboard) {
			globalStore.setState((prev) => ({
				dashboardChatMessages: [...prev.dashboardChatMessages, newMessage],
			}));
		} else {
			createMessage.mutate([newMessage]);
		}

		if (inputRef.current) {
			inputRef.current.value = "";
		}

		requestAnimationFrame(() => {
			if (scrollRef.current) {
				scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
			}
		});

		await sleep(1);

		if (luminaDocsTab === LuminaDocsTab.Dashboard) {
			if (text.includes(LOAN_RISK_SUBSTRING)) {
				const newMessage: Message = {
					text: "Certainly! This bar chart illustrates your mortgage loan risk exposure across different regions of the Philippines.\n\nHere's what it tells us:\n\n• Highest Exposure: The National Capital Region (NCR) stands out with the highest mortgage loan risk exposure at ₱75 billion. This is significantly higher than any other region.\n\n• Next Major Hubs: Following NCR, CALABARZON (Region IV-A) at ₱58 billion and Central Luzon (Region III) at ₱42 billion also show substantial exposure. These three regions combined represent the majority of your risk.\n\n• Mid-Range Exposure: Regions like Central Visayas (Region VII) at ₱33 billion and Western Visayas (Region VI) at ₱25 billion present moderate levels of exposure.\n\n• Lower Exposure: Regions such as Eastern Visayas (Region VIII) at ₱8 billion, Soccsksargen (Region XII) at ₱10 billion, and Bicol Region (Region V) at ₱12 billion have the lowest recorded mortgage loan exposure.\n\nIn essence, your mortgage loan risk is heavily concentrated in the major economic and population centers, particularly in Luzon (NCR, CALABARZON, Central Luzon). This distribution suggests that risk mitigation strategies might need to be most robustly applied in these high-exposure areas.\n\nWould you like to explore the contributing factors to this regional distribution, or perhaps delve into the types of loans contributing to the exposure in specific regions?",
					statuses: [{ status: "streaming" }, { status: "success" }],
					createdAt: createISODate(),
					uuid: createMessageUuid(),
					sender: "add-chart",
					showFooter: true,
					showSender: true,
					type: "default",
					statusIndex: 0,
					toggleText: "",
				};

				globalStore.setState((prev) => ({
					dashboardChatMessages: [...prev.dashboardChatMessages, newMessage],
				}));

				requestAnimationFrame(() => {
					if (scrollRef.current) {
						scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
					}
				});
			} else if (text.includes(VOLUME_SUBSTRING)) {
				// What's the typical throughput of documents with the IDP system compared to manual processing?

				const newMessage: Message = {
					text: "Based on the latest data from the chart, our IDP system demonstrates a significantly higher typical throughput compared to manual processing.\n\nLooking at the most recent months, the IDP system consistently processes documents in the range of 90,000 to over 100,000 documents per month. For instance, in November, IDP processed 100,000 documents, and in December, it handled 105,000 documents.\n\nIn stark contrast, manual processing has seen a declining throughput, currently processing around 4,000 to 5,000 documents per month in the same recent period.\n\nThis difference clearly highlights the scalability advantage of the IDP system, allowing our bank to handle massive volumes of documents much more efficiently than would be possible with traditional manual methods, without needing proportional increases in human resources.",
					statuses: [{ status: "streaming" }, { status: "success" }],
					createdAt: createISODate(),
					uuid: createMessageUuid(),
					sender: "add-chart",
					showFooter: true,
					showSender: true,
					type: "default",
					statusIndex: 0,
					toggleText: "",
				};

				globalStore.setState((prev) => ({
					dashboardChatMessages: [...prev.dashboardChatMessages, newMessage],
				}));

				requestAnimationFrame(() => {
					if (scrollRef.current) {
						scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
					}
				});
			} else if (text.includes(AMOUNT_SUBSTRING)) {
				// can you show me the total unpaid amount by due date?

				const newMessage: Message = {
					text: "I'll create a chart of cumulative unpaid amounts by due date over the next 60 days.",
					statuses: [{ status: "streaming" }, { status: "success" }],
					createdAt: createISODate(),
					uuid: createMessageUuid(),
					sender: "add-chart",
					showFooter: true,
					showSender: true,
					type: "default",
					statusIndex: 0,
					toggleText: "",
				};

				globalStore.setState((prev) => ({
					dashboardChatMessages: [...prev.dashboardChatMessages, newMessage],
				}));

				requestAnimationFrame(() => {
					if (scrollRef.current) {
						scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
					}
				});
			}
		}

		await sleep(1_000);

		globalStore.setState({ isStreaming: false });
	}

	function handleOnKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
			handleSendMessage();
		}
	}

	function handleSendNextMessage() {}

	return (
		<div className="flex gap-1 rounded-2xl w-[90%] min-h-8 mx-auto bg-gray-200">
			<div className="relative z-10 flex w-full h-full items-center overflow-hidden rounded-xl border p-[1.5px]">
				<div
					className="invisible data-[is-streaming=true]:animate-rotate data-[is-streaming=true]:visible absolute inset-0 h-full w-full rounded-full bg-[conic-gradient(var(--accent)_20deg,transparent_120deg)]"
					data-is-streaming={isStreaming}
				></div>

				<div className="relative z-20 flex items-center w-full h-full bg-gray-200 rounded-[calc(var(--radius-2xl)-4px)]">
					<textarea
						className="resize-none simple-scrollbar w-full h-10 focus-visible:outline-none p-2"
						placeholder="Click here to reply..."
						onKeyDown={handleOnKeyDown}
						ref={inputRef}
					/>

					<Tooltip delayDuration={50}>
						<TooltipTrigger asChild>
							<button
								className="bg-black flex items-center justify-center rounded-full size-8 aspect-square button-hover my-auto group"
								onClick={handleSendMessage}
							>
								{isStreaming ? (
									<span className="size-2.5 rounded-xs animate-pulse group-hover:bg-black group-active:bg-black bg-white" />
								) : (
									<ArrowUp className="size-4 group-hover:stroke-black group-active:stroke-black stroke-white" />
								)}
							</button>
						</TooltipTrigger>

						<TooltipContent
							className="bg-popover rounded-lg border border-border-smooth  px-2 py-1 text-xs text-primary"
							sideOffset={5}
							side="left"
						>
							{isStreaming ? "Stop streaming" : "Send message"}
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}
