import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { type PropsWithChildren } from "react";

import "./globals.css";

import { HandleReactScan } from "@/components/HandleReactScan";

const inter = Inter({
	variable: "--loaded-font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Lumina Docs",
	description: "",
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" className={inter.className}>
			<head>
				<HandleReactScan />
			</head>

			{children}
		</html>
	);
}
