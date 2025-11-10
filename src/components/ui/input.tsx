import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				className,
			)}
			{...props}
		/>
	);
}

export type InputWithIconsProps = React.ComponentProps<"input"> & {
	wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
	iconRight?: React.ReactNode;
	iconLeft?: React.ReactNode;
	disabled?: boolean;
};

export function InputWithIcons({
	wrapperProps: { className: wrapperClassName = "", ...restWrapperProps } = {},
	className: inputClassName,
	type = "text",
	iconRight,
	disabled,
	iconLeft,
	ref,
	...restInputProps
}: InputWithIconsProps) {
	return (
		<div
			className={cn(
				"flex h-10 w-full items-center gap-2 rounded-md border border-border-smooth bg-popover p-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium text-primary aria-disabled:cursor-not-allowed aria-disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-secondary",
				wrapperClassName,
			)}
			aria-disabled={disabled}
			{...restWrapperProps}
		>
			{iconLeft}

			<input
				className={cn(
					"w-full bg-transparent leading-8 outline-hidden disabled:cursor-not-allowed",
					inputClassName,
				)}
				{...restInputProps}
				disabled={disabled}
				type={type}
				ref={ref}
			/>

			{iconRight}
		</div>
	);
}

export { Input };
