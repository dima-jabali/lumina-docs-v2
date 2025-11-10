import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export enum AsideTab {
	DashboardList = "Dashboard List",
	None = "None",
	Dev = "Dev",
}

type AsideTabState = {
	sidebarTab: AsideTab;
};

const initialValue: AsideTabState = {
	sidebarTab: AsideTab.None,
};

export const useAsideTab = create(subscribeWithSelector(() => initialValue));

export const { getState: getAsideTabState, setState: setAsideTabState } =
	useAsideTab;

export const resetSidebarTab = () => {
	setAsideTabState(initialValue);
};

const selectAsideTabState = (state: AsideTabState) => state.sidebarTab;
export const useAsideTabState = () => useAsideTab(selectAsideTabState);
