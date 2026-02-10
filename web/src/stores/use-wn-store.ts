import { create } from "zustand";

interface WnStore {
  isRain: boolean;
  lat: number | null;
  lng: number | null;
  setIsRain: (isRain: boolean) => void;
  setLocation: (lat: number, lng: number) => void;
}

export const useWnStore = create<WnStore>((set) => ({
  isRain: false,
  lat: null,
  lng: null,
  setIsRain: (isRain) => set({ isRain }),
  setLocation: (lat, lng) => set({ lat, lng }),
}));
