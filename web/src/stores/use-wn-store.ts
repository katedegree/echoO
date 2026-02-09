import { create } from "zustand";

interface WnStore {
  isRain: boolean;
  setIsRain: (isRain: boolean) => void;
}

export const useWnStore = create<WnStore>((set) => ({
  isRain: false,
  setIsRain: (isRain) => set({ isRain }),
}));
