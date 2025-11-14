import type { Message } from "@/types/organization";
import { ActionsMessage } from "./ActionsMessage";
import { AddChartBotMessage } from "./AddChartBotMessage";
import { BotMessage } from "./BotMessage";
import { HandleStepsBotMessage } from "./HandleStepsBotMessage";
import { UserMessage } from "./UserMessage";
import { BotMessageEmail } from "./BotMessageEmail";
import { UserMessageEmail } from "./UserMessageEmail";
import { Button } from "./ui/button";

export function RenderMessage(message: Message, index: number) {
	switch (message.type) {
		case "default": {
			switch (message.sender) {
				case "bot": {
					return (
						<BotMessage message={message} key={message.uuid} index={index} />
					);
				}

				case "user": {
					return <UserMessage message={message} key={message.uuid} />;
				}

				case "add-chart": {
					return <AddChartBotMessage message={message} key={message.uuid} />;
				}

				case "steps": {
					return (
						<HandleStepsBotMessage
							key={message.uuid}
							message={message}
							index={index}
						/>
					);
				}

				case "action": {
					return (
						<ActionsMessage
							message={message}
							key={message.uuid}
							index={index}
						/>
					);
				}

				default: {
					console.error("Unknown message type", message);

					return null;
				}
			}
		}

		case "email": {
			switch (message.sender) {
				case "bot": {
					return (
						<BotMessageEmail
							message={message}
							key={message.uuid}
							index={index}
						/>
					);
				}

				case "user": {
					return <UserMessageEmail message={message} key={message.uuid} />;
				}

				default: {
					console.error("Unknown message type", message);

					return null;
				}
			}
		}
	}
}
