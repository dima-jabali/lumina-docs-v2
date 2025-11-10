"use client";

import { Suspense, useState, type PropsWithChildren } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AllProviders({ children }: PropsWithChildren) {
	const [queryClient] = useState(() => {
		return new QueryClient({
			defaultOptions: {
				queries: {
					experimental_prefetchInRender: true,
					refetchOnWindowFocus: false,
					staleTime: 1_000,
					gcTime: 1_000,
				},
			},
		});
	});

	return (
		<Suspense>
			<NuqsAdapter>
				<QueryClientProvider client={queryClient}>
					<ReactQueryDevtools initialIsOpen={false} />

					<TooltipProvider>{children}</TooltipProvider>
				</QueryClientProvider>
			</NuqsAdapter>
		</Suspense>
	);
}
