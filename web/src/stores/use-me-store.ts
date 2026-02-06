import { AuthMeResponse } from "@/lib/api";
import { create } from "zustand";

interface MeStore {
  me: AuthMeResponse | null;
  setMe: (me: AuthMeResponse | null) => void;
}

export const useMeStore = create<MeStore>((set) => ({
  me: null,
  setMe: (me) => set({ me }),
}));
