"use client";

import { memo } from "react";

import { useLogo } from "@/hooks/fetch/use-fetch-organization-list";
import { globalStore } from "@/contexts/luminaStore";

export const GoToMainPageLogoImage: React.FC = memo(
	function GoToMainPageLogoImage() {
		const logo = useLogo();

		function handleReset() {
			globalStore.setState(globalStore.getInitialState());
		}

		return (
			<button
				className="relative flex h-full items-center justify-center flex-none text-primary cursor-pointer"
				onClick={handleReset}
				title="Go Home"
			>
				{logo ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img className="size-7" src={logo} alt="Logo" />
				) : (
					<span className="size-7"></span>
				)}
			</button>
		);
	},
);
