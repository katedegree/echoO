import { AuthMeResponse } from "@/lib/api";
import { create } from "zustand";

interface MeStore {
  me: AuthMeResponse | null | undefined;
  setMe: (me: AuthMeResponse | null) => void;
}

export const useMeStore = create<MeStore>((set) => ({
  me: undefined,
  setMe: (me) => set({ me }),
}));
