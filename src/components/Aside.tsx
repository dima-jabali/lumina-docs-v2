"use client";

import {
	CheckSquare,
	FolderOpen,
	LayoutGrid, List, Settings,
	Upload
} from "lucide-react";
import { Resizable } from "re-resizable";
import { useEffect } from "react";

import { LuminaDocsDashboardListTab } from "@/app-ui/AsideTabs/DashboardListTab";
import { DevTab } from "@/app-ui/AsideTabs/DevTab";
import { AdminTab, globalStore } from "@/contexts/luminaStore";
import { useFetchOrganizationList } from "@/hooks/fetch/use-fetch-organization-list";
import {
	LuminaDocsTab,
	useLuminaDocsTab,
} from "@/hooks/url/use-lumina-docs-tab";
import {
	AsideTab,
	setAsideTabState,
	useAsideTabState,
} from "@/hooks/use-aside-tab";
import { AsideButton } from "./AsideButton";
import { DefaultSuspenseAndErrorBoundary } from "./DefaultSuspenseAndErrorBoundary";

const HANDLE_CLASSES_CONTAINER = {
	right: "button-hover z-0",
};

const DEFAULT_SIZE_CONTAINER = {
	height: "100%",
	width: "230px",
};

const ENABLE_CONTAINER = {
	bottomRight: false,
	bottomLeft: false,
	topRight: false,
	topLeft: false,
	bottom: false,
	left: false,
	right: true,
	top: false,
};

const navIcons = {
	[AdminTab.DocumentTypes]: LayoutGrid,
	[AdminTab.Applications]: FolderOpen,
	[AdminTab.ReviewQueue]: CheckSquare,
	[AdminTab.Settings]: Settings,
	[AdminTab.Upload]: Upload,
};

export function Aside() {
	useFetchOrganizationList();

	const adminTab = globalStore.use.adminTab();
	const [luminaDocsTab] = useLuminaDocsTab();
	const asideTab = useAsideTabState();

	const isOnDashboardPage = luminaDocsTab === LuminaDocsTab.Dashboard;
	const isAnyTabOpen = asideTab !== AsideTab.None;




	useEffect(() => {
		setAsideTabState({
			sidebarTab:
				luminaDocsTab === LuminaDocsTab.Dashboard
					? AsideTab.DashboardList
					: AsideTab.None,
		});
	}, [luminaDocsTab]);

	useEffect(() => {
		function handleKeyPress(event: KeyboardEvent) {
			if (event.key === "b" && (event.ctrlKey || event.metaKey)) {
				setAsideTabState((prev) => ({
					sidebarTab:
						prev.sidebarTab === AsideTab.Dev ? AsideTab.None : AsideTab.Dev,
				}));
			}
		}

		window.addEventListener("keypress", handleKeyPress);

		return () => {
			window.removeEventListener("keypress", handleKeyPress);
		};
	}, []);

	const handleToggleTabOf = (of: AsideTab) => {
		setAsideTabState({ sidebarTab: asideTab === of ? AsideTab.None : of });
	};

		function handleGoTo(tab: AdminTab) {
		globalStore.setState({
			adminTab: tab,
		});
	}

	if (luminaDocsTab === LuminaDocsTab.FilesTable) {
		return null;
	}
	
	if (luminaDocsTab === LuminaDocsTab.Admin) {
		return 					<aside
			className="flex flex-col gap-1 p-2 border-r border-border-smooth w-56 h-full [grid-area:aside]"
			data-is-any-tab-open={isAnyTabOpen}
			data-should-take-footer-space
			data-no-print
		>
				<span className="text-xs text-muted font-semibold my-2">
					Navigation
				</span>

				{Object.values(AdminTab).map((tab) => {
					const isActive = adminTab === tab;
					const Icon = navIcons[tab];

					return (
						<button
							className="button-hover w-full flex items-center justify-start py-1 px-2 gap-2 text-sm rounded-md data-[active=true]:font-semibold data-[active=true]:bg-button-active"
							onClick={() => handleGoTo(tab)}
							data-active={isActive}
							key={tab}
						>
							{<Icon className="size-4 flex-none" />}

							{tab}
						</button>
					);
				})}
			</aside>

	}

	return (
		<aside
			className="grid max-h-[calc(100vh-50px)] grid-cols-[60px_1fr] grid-rows-[1fr] bg-secondary [grid-area:aside] [grid-template-areas:'const-aside-nav_tab']"
			data-is-any-tab-open={isAnyTabOpen}
			data-should-take-footer-space
			data-no-print
		>
			<div className="flex h-full flex-col items-center justify-between gap-2 rounded-lg border border-border-smooth bg-secondary pt-3 [grid-area:const-aside-nav]">
				<ul className="flex flex-col gap-2">
					{isOnDashboardPage ? (
						<AsideButton
							onClick={() => handleToggleTabOf(AsideTab.DashboardList)}
							isActive={asideTab === AsideTab.DashboardList}
							title={AsideTab.DashboardList}
						>
							<List className="size-5 text-primary" />
						</AsideButton>
					) : null}
				</ul>
			</div>

			{isAnyTabOpen ? (
				<Resizable
					className="flex max-h-[calc(100vh-50px)] flex-col overflow-hidden pr-1.5 [grid-area:tab] bg-secondary border-r border-border-smooth"
					handleClasses={HANDLE_CLASSES_CONTAINER}
					defaultSize={DEFAULT_SIZE_CONTAINER}
					enable={ENABLE_CONTAINER}
					minWidth="230px"
					maxWidth="50vw"
				>
					<DefaultSuspenseAndErrorBoundary failedText="Something went wrong!">
						{(() => {
							switch (asideTab) {
								case AsideTab.DashboardList:
									return <LuminaDocsDashboardListTab />;

								case AsideTab.Dev:
									return <DevTab />;

								default:
									return null;
							}
						})()}
					</DefaultSuspenseAndErrorBoundary>
				</Resizable>
			) : null}
		</aside>
	);
}
