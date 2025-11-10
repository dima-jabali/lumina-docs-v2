"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { UUID } from "@/types/general";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getRandomInt(min: number, max: number) {
	max = Math.floor(max);
	min = Math.ceil(min);

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const hasErrorMessage = (error: unknown): error is { message: string } =>
	isRecord(error) && "message" in error && typeof error.message === "string";

export const isRecord = (obj: unknown): obj is Record<string, unknown> =>
	typeof obj === "object" && obj !== null;

export const PLEASE_REFRESH_PAGE = "Please, refresh page.";

export const isValidNumber = (value: unknown): value is number =>
	value === 0 ? true : Number.isFinite(value || undefined);

export const stopPropagation = (e: React.MouseEvent) => {
	e.stopPropagation();
};

export const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
	year: "numeric",
	day: "numeric",
	month: "short",
});

export const pesoFormatter = new Intl.NumberFormat(undefined, {
	currencyDisplay: "symbol",
	style: "currency",
	currency: "PHP",
});

export const sleep = (ms: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const createUUID = () => (globalThis.crypto?.randomUUID() || "") as UUID;

export const isObjectEmpty = (arg: unknown) => {
	if (!isRecord(arg)) {
		console.log("isObjectEmpty() argument:", { arg });

		throw new Error("Argument must be an object");
	}

	for (const _ in arg) {
		return false;
	}

	return true;
};

export function closeDetails(detailsElement: HTMLDetailsElement) {
	detailsElement.removeAttribute("open");
}

export const MAIN_HTML_ELEMENT_ID = "main-html-element-id";

export const FADE_IN_MOTION_ANIMATION_PROPS = {
	initial: { opacity: 0, y: "20%" },
	animate: { opacity: 1, y: 0 },
	transition: {
		type: "spring",
		duration: 0.4,
		delay: 0.4,
	},
} as const;
