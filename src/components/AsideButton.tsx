import type { PropsWithChildren } from "react";
import Link from "next/link";

type SideButtonProps = {
	isActive?: boolean;
	title: string;
	href?: string;
	onClick?: () => void;
};

export function AsideButton({
	isActive = false,
	children,
	href,
	...rest
}: PropsWithChildren<SideButtonProps>) {
	return href ? (
		<Link
			className="flex h-9 w-12 cursor-pointer items-center justify-center rounded-lg data-[is-active=true]:bg-button-hover button-hover [&_svg]:w-5 text-secondary *:stroke-primary!"
			data-is-active={isActive}
			replace={false}
			href={href}
			{...rest}
			shallow
		>
			{children}
		</Link>
	) : (
		<button
			className="flex h-9 w-12 items-center justify-center rounded-lg data-[is-active=true]:bg-button-hover button-hover [&_svg]:w-5 text-secondary *:stroke-primary!"
			data-is-active={isActive}
			type="button"
			{...rest}
		>
			{children}
		</button>
	);
}
