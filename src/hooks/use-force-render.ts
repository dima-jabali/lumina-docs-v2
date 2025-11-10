import { useReducer } from "react";

export const useForceRender = () => {
	const [, forceRender] = useReducer((prev: boolean) => !prev, true);

	return forceRender;
};
