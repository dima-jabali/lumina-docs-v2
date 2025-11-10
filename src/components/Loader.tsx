import { cn } from "@/lib/utils";

type Props = {
	className?: string;
};

export function Loader({ className = "" }: Props) {
	return (
		<span
			className={cn(
				"aspect-square size-4 flex-none animate-spin rounded-full border-2 border-transparent border-t-accent-foreground duration-500",
				className,
			)}
		/>
	);
}

export const LOADER = <Loader className="size-4 flex-none border-t-primary" />;
