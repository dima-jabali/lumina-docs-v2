"use client";

import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useState, type PropsWithChildren } from "react";

import { cn } from "@/lib/utils";
import type { DivProps } from "@/types/utils";
import { LOADER } from "./Loader";
import { Button } from "./ui/button";
import { isAxiosError } from "axios";

export function FallbackLoader({ className, ...rest }: DivProps) {
	return (
		<div
			className={cn(
				"w-full h-full flex items-center justify-center",
				className,
			)}
			title="Loading..."
			{...rest}
		>
			{LOADER}
		</div>
	);
}

export function LoadError({
	failedText,
	failedClassName,
	error,
	...rest
}: {
	failedClassName?: string;
	failedText: string;
	error?: Error;
} & DivProps) {
	const { resetBoundary } = useErrorBoundary();

	console.log({ error });

	return (
		<div
			className={cn(
				"text-primary text-sm relative before:inset-0 before:bg-white bg-red-300/30 p-4 flex flex-col items-center justify-center gap-4 w-full h-full",
				failedClassName,
			)}
			{...rest}
		>
			<span>{failedText}</span>

			<details className="text-xs">
				<summary
					className="cursor-pointer max-w-full simple-scrollbar flex"
					title="Open to see error stack"
				>
					{isAxiosError(error)
						? error.response?.data?.error?.message
						: error?.message}
				</summary>

				<div
					className="max-w-full simple-scrollbar rounded-md bg-destructive/30 p-4 flex flex-col gap-3"
					title="Error stack"
				>
					<p className="whitespace-pre-wrap">{error?.stack}</p>
				</div>
			</details>

			<Button onClick={resetBoundary} size="sm">
				Retry
			</Button>
		</div>
	);
}

export function DefaultSuspenseAndErrorBoundary({
	children,
	failedText,
	fallbackClassName,
	failedClassName,
}: PropsWithChildren<{
	fallbackClassName?: string;
	failedClassName?: string;
	failedText: string;
}>) {
	const [error, setError] = useState<Error>();

	return (
		<Suspense fallback={<FallbackLoader className={fallbackClassName} />}>
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary
						fallback={
							<LoadError
								failedClassName={failedClassName}
								failedText={failedText}
								error={error}
							/>
						}
						onError={(error) => setError(error)}
						onReset={reset}
					>
						{children}
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</Suspense>
	);
}
