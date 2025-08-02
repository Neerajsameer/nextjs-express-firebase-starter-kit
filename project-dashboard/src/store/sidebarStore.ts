import { create } from "zustand";

export type AppState = {
  showNav: boolean;
};

type AppActions = {
  setShowNav: (show: boolean) => void;
};

const PAGE_SIZE = 20; // used for paginating and cursors

export const useSidebarStore = create<AppState & AppActions>((set, get) => ({
  showNav: true,
  setShowNav: (show) => {
    set({ showNav: show });
    localStorage.setItem("show_nav", show + "");
  },
}));
