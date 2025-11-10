import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";

import { useLuminaDashboardUuid } from "@/hooks/url/use-lumina-dashboard-uuid";
import { DashboardGrid } from "./Dashboard/DashboardGrid";
import { ChatWithLuminaDocs } from "./ChatWithLuminaDocs";
import { globalStore } from "@/contexts/luminaStore";

const HANDLE_CLASSES_CONTAINER = {
	left: "bg-button-hover/50 button-hover z-0 w-1!",
};
const ENABLED_CONTAINER = {
	bottomRight: false,
	bottomLeft: false,
	topRight: false,
	topLeft: false,
	bottom: false,
	right: false,
	left: true,
	top: false,
};
const DISABLED_CONTAINER = {
	bottomRight: false,
	bottomLeft: false,
	topRight: false,
	topLeft: false,
	bottom: false,
	right: false,
	left: false,
	top: false,
};

export const Dashboard: React.FC = () => {
	const [isChatOpen, setIsChatOpen] = useState(false);

	const [luminaDashboardUuid] = useLuminaDashboardUuid();

	useEffect(() => {
		globalStore.setState({ fileMetadataUuid: null, dashboardChatMessages: [] });
	}, [luminaDashboardUuid]);

	return luminaDashboardUuid ? (
		<section
			className="flex gap-2 w-full h-full max-h-[calc(100vh-50px)] min-w-1 overflow-hidden"
			aria-label="Lumina Docs Dashboard"
			data-chat-open={isChatOpen}
			key={luminaDashboardUuid}
		>
			<DashboardGrid isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />

			<Resizable
				className="flex h-full max-h-full flex-col gap-2 data-[is-chat-open=false]:hidden"
				enable={isChatOpen ? ENABLED_CONTAINER : DISABLED_CONTAINER}
				handleClasses={HANDLE_CLASSES_CONTAINER}
				data-is-chat-open={isChatOpen}
				maxWidth={700}
				minWidth={370}
			>
				<ChatWithLuminaDocs />
			</Resizable>
		</section>
	) : null;
};
