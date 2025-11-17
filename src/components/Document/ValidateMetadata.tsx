"use client";

import { AlertCircle, Check } from "lucide-react";

import { globalStore, useDocType } from "@/contexts/luminaStore";

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
					<span
						className="flex items-center gap-4 group"
						data-error={
							// @ts-expect-error
							rule.missing
						}
					>
						{
							// @ts-expect-error
							!rule.missing ? (
								<Check className="size-4 text-green-600" />
							) : (
								<AlertCircle className="size-4 text-red-800" />
							)
						}

						<span className="group-data-[error=true]:text-red-800">
							{rule.name}
						</span>
					</span>

					<div className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
						<p>{rule.description}</p>

						{
							// @ts-expect-error
							!rule.missing ? null : (
								<button
									className="flex flex-col gap-1 mt-2 p-2 rounded-md h-auto bg-green-300/30 border text-xs border-green-300 text-green-700 hover:bg-green-300/40 active:bg-green-300/60"
									onClick={() => handleGoToEmailThread(rule)}
								>
									Email thread
								</button>
							)
						}
					</div>
				</li>
			))}
		</ul>
	);
};
