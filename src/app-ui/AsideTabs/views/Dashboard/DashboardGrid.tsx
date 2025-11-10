import { ChevronsLeftIcon } from "lucide-react";

import { useLuminaDashboardUuid } from "@/hooks/url/use-lumina-dashboard-uuid";
import { RenderChartItem } from "./RenderChartItem";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { globalStore } from "@/contexts/luminaStore";

type Props = {
	isChatOpen: boolean;
	setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DashboardGrid: React.FC<Props> = ({
	isChatOpen,
	setIsChatOpen,
}) => {
	const [luminaDashboardUuid] = useLuminaDashboardUuid();

	const dashboardProject = globalStore.use
		.dashboardList()
		.find((p) => p.uuid === luminaDashboardUuid);

	if (!luminaDashboardUuid || !dashboardProject) return null;

	return (
		<section
			className="@container flex flex-col gap-4 h-[calc(100vh-50px)] w-full px-5 py-3 simple-scrollbar"
			aria-label="Dashboard Grid"
		>
			<header className="flex gap-4 justify-between">
				<h2 className="text-2xl font-semibold pl-1.5 py-2">
					{dashboardProject.name}
				</h2>

				<Tooltip delayDuration={50}>
					<TooltipTrigger
						className="aspect-square rounded-lg flex items-center justify-center button-hover size-6"
						title="Toggle open Lumina Docs Dashboard Chat"
						onClick={() => setIsChatOpen((prev) => !prev)}
					>
						<ChevronsLeftIcon
							className="size-4 data-[is-open=true]:rotate-180 text-primary"
							data-is-open={isChatOpen}
						/>
					</TooltipTrigger>

					<TooltipContent
						className="bg-popover rounded-lg border border-border-smooth  px-2 py-1 text-xs text-primary"
						sideOffset={5}
						side="left"
					>
						Toggle open Lumina Docs Dashboard Chat
					</TooltipContent>
				</Tooltip>
			</header>

			<div className="grid grid-cols-1 @2xl:grid-cols-2 w-full gap-3 mb-3 px-2">
				{dashboardProject.items.map((item) => (
					<RenderChartItem key={item.uuid} item={item} />
				))}

				{/* Prevent margin collapse */}
				<footer className="h-[1px] flex-none"></footer>
			</div>
		</section>
	);
};
