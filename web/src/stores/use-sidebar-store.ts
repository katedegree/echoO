import { create } from "zustand";

interface SidebarState {
  sidebarPos: "left" | "right";
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  sidebarPos: "right",
  toggleSidebar: () =>
    set({ sidebarPos: get().sidebarPos === "left" ? "right" : "left" }),
}));
