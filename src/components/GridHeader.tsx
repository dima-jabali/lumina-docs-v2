"use client";

import * as Portal from "@radix-ui/react-portal";
import { useEffect, useState } from "react";

import { Dashboard } from "@/app-ui/AsideTabs/views/Dashboard";
import { FilesTable } from "@/app-ui/AsideTabs/views/FilesTable";
import {
	LUMINA_DOCS_TABS,
	LuminaDocsTab,
	useLuminaDocsTab,
} from "@/hooks/url/use-lumina-docs-tab";
import { MAIN_HTML_ELEMENT_ID } from "@/lib/utils";
import { DefaultSuspenseAndErrorBoundary } from "./DefaultSuspenseAndErrorBoundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GoToMainPageLogoImage } from "./GoToMainPageLogoImage";
import { OrganizationSwitcherPopover } from "./OrganizationSwitcherPopover";
import { Admin } from "@/app-ui/AsideTabs/views/admin/Admin";

export const GridHeader: React.FC = () => {
	const [mainGridElementContainer, setMainGridElementContainer] =
		useState<HTMLElement | null>(null);
	const [luminaDocsTab, setLuminaDocsTab] = useLuminaDocsTab();

	const onTabChange = async (tab: string) => {
		await setLuminaDocsTab(tab as LuminaDocsTab);
	};

	useEffect(() => {
		setMainGridElementContainer(document.getElementById(MAIN_HTML_ELEMENT_ID));
	}, []);

	return (
		<header className="absolute top-0 left-0 flex h-[50px] items-center justify-between overflow-hidden bg-secondary transition-none [grid-area:header] max-w-full select-none w-screen px-5 border-b border-border-smooth shadow-md z-5 shadow-black/10">
			<GoToMainPageLogoImage />

			<div className="flex h-16 items-center justify-between w-full gap-4 pl-1.5">
				<Tabs value={luminaDocsTab} onValueChange={onTabChange}>
					<TabsList className="bg-transparent gap-6 pl-6">
						{LUMINA_DOCS_TABS.map((tab) => (
							<TabsTrigger
								overwriteClassName="text-sm font-medium data-[state=inactive]:text-muted-foreground text-primary hover:text-primary hover:underline underline-offset-2 data-[state=active]:underline"
								value={tab}
								key={tab}
							>
								{tab}
							</TabsTrigger>
						))}
					</TabsList>

					<Portal.Root
						className="h-full max-h-full overflow-hidden"
						container={mainGridElementContainer}
					>
						<TabsContent
							className="m-0 focus-visible:ring-transparent outline-hidden focus-visible:ring-offset-transparent max-h-full"
							value={LuminaDocsTab.FilesTable}
						>
							<DefaultSuspenseAndErrorBoundary
								failedText="Something went wrong!"
								fallbackClassName="min-h-[80vh]"
							>
								<FilesTable />
							</DefaultSuspenseAndErrorBoundary>
						</TabsContent>

						<TabsContent
							className="m-0 focus-visible:ring-transparent outline-hidden focus-visible:ring-offset-transparent"
							value={LuminaDocsTab.Dashboard}
						>
							<DefaultSuspenseAndErrorBoundary
								fallbackClassName="min-h-[80vh]"
								failedText="Something went wrong!"
							>
								<Dashboard />
							</DefaultSuspenseAndErrorBoundary>
						</TabsContent>

						<TabsContent
							className="m-0 focus-visible:ring-transparent outline-hidden focus-visible:ring-offset-transparent "
							value={LuminaDocsTab.Admin}
						>
							<DefaultSuspenseAndErrorBoundary
								fallbackClassName="min-h-[80vh]"
								failedText="Something went wrong!"
							>
								<Admin />
							</DefaultSuspenseAndErrorBoundary>
						</TabsContent>
					</Portal.Root>
				</Tabs>
			</div>

			<OrganizationSwitcherPopover />
		</header>
	);
};
