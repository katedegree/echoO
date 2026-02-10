import { create } from "zustand";

interface DmUnreadStore {
  unreadCounts: Record<string, number>;
  totalUnreadCount: number;
  setUnreadCounts: (counts: Record<string, number>) => void;
  clearUnread: (userId: number) => void;
}

export const useDmUnreadStore = create<DmUnreadStore>((set) => ({
  unreadCounts: {},
  totalUnreadCount: 0,
  setUnreadCounts: (counts) =>
    set({
      unreadCounts: counts,
      totalUnreadCount: Object.values(counts).reduce((a, b) => a + b, 0),
    }),
  clearUnread: (userId) =>
    set((state) => {
      const { [String(userId)]: _, ...rest } = state.unreadCounts;
      return {
        unreadCounts: rest,
        totalUnreadCount: Object.values(rest).reduce((a, b) => a + b, 0),
      };
    }),
}));
