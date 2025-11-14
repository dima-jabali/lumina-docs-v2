"use client";

import { AlertCircle, Check } from "lucide-react";

import { globalStore, useDocType } from "@/contexts/luminaStore";

const missing = ["Address Consistency"];

export const ValidateMetadata: React.FC = () => {
	const applicationList = globalStore.use.applicationList();
	const docType = useDocType()!;

	const validationRules =
		applicationList.find((a) => a.id === docType)?.validationRules || [];

	function handleGoToEmailThread(
		validationRule: (typeof validationRules)[number],
	) {
		globalStore.setState({
			emailThreadChatMessages: validationRule.chatMessages,
			isChatOpen: true,
		});
	}

	return (
		<ul
			className="flex flex-col items-center gap-6"
			aria-label="Edit file metadata"
		>
			{validationRules.map((rule) => (
				<li
					className="w-full border-dashed border border-border-smooth rounded-md p-4 flex flex-col gap-2 hover:bg-black/3"
					key={rule.id}
				>
					<span>{rule.name}</span>

					<div className="flex items-center justify-between gap-10 text-sm text-muted-foreground">
						<p>{rule.description}</p>

						{!rule.missing ? (
							<Check className="size-4 text-green-600" />
						) : (
							<div className="flex flex-col w-1/2 flex-none">
								<span className="flex mt-2 gap-2 items-center text-sm">
									<AlertCircle className="size-4 text-yellow-600" />
									Required field not present!
								</span>

								<button
									className="flex flex-col gap-1 mt-2 p-2 rounded-md h-auto bg-green-300/30 border text-xs border-green-300 text-green-700 hover:bg-green-300/40 active:bg-green-300/60"
									onClick={() => handleGoToEmailThread(rule)}
								>
									Email thread
								</button>
							</div>
						)}
					</div>
				</li>
			))}
		</ul>
	);
};
