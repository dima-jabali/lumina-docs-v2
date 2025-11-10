"use client";

import { PlusIcon } from "lucide-react";

import { DefaultSuspenseAndErrorBoundary } from "@/components/DefaultSuspenseAndErrorBoundary";
import { makeDashboardProjectUuid } from "@/helpers/utils";
import { ListColumnForAside } from "./ListColumnForAside";
import { globalStore } from "@/contexts/luminaStore";

export function LuminaDocsDashboardListTab() {
	const handleAddDashboard = async () => {
		globalStore.setState((prev) => ({
			dashboardList: [
				...prev.dashboardList,
				{
					uuid: makeDashboardProjectUuid(),
					name: "New Dashboard",
					items: [],
				},
			],
		}));
	};

	return (
		<div className="flex flex-col overflow-hidden">
			<header className="flex items-center justify-between gap-2 w-full p-2 flex-none">
				<button
					className="flex gap-2 p-2 items-center button-hover text-sm rounded-lg w-full text-primary"
					onClick={handleAddDashboard}
					title="Create a new project"
				>
					<PlusIcon className="size-4" />

					<span>New Dashboard</span>
				</button>
			</header>

			<hr className="mb-2 border-border-smooth " />

			<span className="text-sm font-bold text-primary mx-4 my-2">
				Dashboards
			</span>

			<DefaultSuspenseAndErrorBoundary failedText="Couldn't load tags!">
				<ListColumnForAside />
			</DefaultSuspenseAndErrorBoundary>

			<div className="size-1 flex-none"></div>
		</div>
	);
}
