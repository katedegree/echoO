import { create } from "zustand";

interface MediaModalStore {
  urls: string[];
  index: number;
  open: (urls: string[], index?: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

export const useMediaModalStore = create<MediaModalStore>((set, get) => ({
  urls: [],
  index: 0,

  open: (urls, index = 0) => set({ urls, index }),

  close: () => set({ urls: [], index: 0 }),

  next: () => {
    const { index, urls } = get();
    if (index < urls.length - 1) {
      set({ index: index + 1 });
    }
  },
  prev: () => {
    const { index } = get();
    if (index > 0) {
      set({ index: index - 1 });
    }
  },
}));
