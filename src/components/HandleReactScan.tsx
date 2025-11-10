"use client";

import { useScan } from "react-scan";

export const isDev = process.env.NEXT_PUBLIC_VERCEL_ENV === "development";

export function HandleReactScan() {
	return isDev ? <UseReactScan /> : null;
}

function UseReactScan() {
	useScan({
		trackUnnecessaryRenders: true,
		animationSpeed: "off",
	});

	return null;
}
