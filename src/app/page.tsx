"use client";

import { Aside } from "@/components/Aside";
import { GridHeader } from "@/components/GridHeader";
import { Toaster } from "@/components/ui/sonner";
import { AllProviders } from "@/contexts/AllProviders";

import { MAIN_HTML_ELEMENT_ID } from "@/lib/utils";

export default function Home() {
	return (
		<body className="antialiased h-screen w-screen overflow-hidden bg-background text-foreground grid [grid-template-rows:50px_1fr] [grid-template-columns:0.01fr_1fr] [grid-template-areas:'header_header'_'aside_main']">
			<AllProviders>
				<GridHeader />

				<Aside />

				<main
					className="[grid-area:main] w-full h-full max-w-full max-h-full simple-scrollbar"
					id={MAIN_HTML_ELEMENT_ID}
				></main>

				<Toaster />
			</AllProviders>
		</body>
	);
}
