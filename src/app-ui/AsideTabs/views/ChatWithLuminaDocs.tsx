import { useLayoutEffect, useRef } from "react";
import Markdown from "react-markdown";

import { AutoScrollIfOnBottom } from "@/components/AutoScrollIfOnBottom";
import { MessageInput } from "@/components/MessageInput";
import { RenderMessage } from "@/components/RenderMessage";
import { Button } from "@/components/ui/button";
import { globalStore } from "@/contexts/luminaStore";
import { useDocumentChatMessages } from "@/hooks/fetch/use-fetch-document-metadata-list";
import { useCurrentOrganization } from "@/hooks/fetch/use-fetch-organization-list";
import { useCreateChatMessage } from "@/hooks/mutation/use-create-chat-message";
import {
	LuminaDocsTab,
	useLuminaDocsTab,
} from "@/hooks/url/use-lumina-docs-tab";
import { formattedDate } from "@/lib/utils";
import type { Message } from "@/types/organization";
import { Bot, Forward, Reply, User } from "lucide-react";

export function ChatWithLuminaDocs() {
	const emailThreadChatMessages = globalStore.use.emailThreadChatMessages();
	const dashboardMessages = globalStore.use.dashboardChatMessages();
	const selectedSubFile = globalStore.use.selectedSubFile();
	const createMessage = useCreateChatMessage().mutate;
	const [luminaDocsTab] = useLuminaDocsTab();
	const messages = useDocumentChatMessages();
	const org = useCurrentOrganization();

	const scrollRef = useRef<HTMLOListElement>(null);

	const currentStep = org?.currentStep;

	useLayoutEffect(() => {
		let timeout: ReturnType<typeof setTimeout> | undefined;

		if (selectedSubFile && currentStep === 1) {
			const newMessages: Array<Message> = selectedSubFile.chat_messages ?? [];

			timeout = setTimeout(() => {
				createMessage(newMessages);
			}, 500);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [currentStep, selectedSubFile, createMessage]);

	return (
		<div className="flex h-full w-full simple-scrollbar flex-col gap-2 pt-4">
			<ol
				className="list-none relative flex h-full px-4 pr-[calc(2.5rem-15px)] max-h-full flex-col gap-6 overflow-auto simple-scrollbar pb-10"
				ref={scrollRef}
			>
				{emailThreadChatMessages ? (
					<div className="mx-auto max-w-5xl">
						{/* Email Thread */}
						<div className="p-6">
							{/* Subject */}
							<div className="mb-6">
								<div className="flex items-center gap-2">
									<span className="inline-flex items-center rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
										Inbox
									</span>
								</div>
							</div>

							{/* Email Messages */}
							<div className="space-y-4">
								{emailThreadChatMessages.map((email) => {
									const status = email.statuses?.[email.statusIndex ?? 0];

									if (status?.status === "hidden") {
										return null;
									}

									return (
										<div
											className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
											key={email.uuid}
										>
											{/* Email Header */}
											<div className="mb-4 flex items-start gap-4">
												{email.sender === "bot" ? (
													<div className="size-10  rounded-full bg-indigo-800 aspect-square flex items-center justify-center">
														<Bot className="size-5 text-white" />
													</div>
												) : (
													<div className="size-10 rounded-full bg-muted/10 aspect-square flex items-center justify-center">
														<User className="size-5 stroke-1" />
													</div>
												)}

												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between gap-2">
														<div className="flex-1">
															<div className="flex items-center gap-2">
																<span className="font-medium text-card-foreground capitalize text-sm">
																	{email.sender}
																</span>
															</div>

															{/* <div className="mt-0.5 text-sm text-muted-foreground">
                        {email.text}
                      </div> */}
														</div>
														<div className="flex items-center gap-2">
															<span className="text-xs text-muted-foreground whitespace-nowrap">
																{formattedDate.format(
																	new Date(email.createdAt),
																)}
															</span>
														</div>
													</div>
												</div>
											</div>

											{/* Email Content */}
											<div className="ml-14 space-y-3">
												<Markdown>{email.text}</Markdown>

												{/* Email Actions */}
												<div className="flex items-center gap-2 pt-2">
													<Button variant="outline" size="sm" className="gap-2">
														<Reply className="h-4 w-4" />
														Reply
													</Button>

													<Button variant="outline" size="sm" className="gap-2">
														<Forward className="h-4 w-4" />
														Forward
													</Button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				) : luminaDocsTab === LuminaDocsTab.Dashboard ? (
					dashboardMessages.map(RenderMessage)
				) : (
					Array.from(messages.values()).map(RenderMessage)
				)}

				<AutoScrollIfOnBottom scrollParentRef={scrollRef} />
			</ol>

			<MessageInput scrollRef={scrollRef} />
		</div>
	);
}
