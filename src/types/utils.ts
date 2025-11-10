import type { JSX } from "react";

export type DivProps = JSX.IntrinsicElements["div"];

export type DeepNullable<T> = {
	[P in keyof T]: T[P] extends object ? Nullable<T[P]> | null : T[P] | null;
};

export type Nullable<T> = { [P in keyof T]: T[P] | null };
