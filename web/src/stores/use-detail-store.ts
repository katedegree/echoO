import { create } from "zustand";

interface Detail {
  id: number;
  path: string;
}

type Push = (path: string) => void;

interface DetailStore {
  detail: Detail | null;
  pushDetail: (path: string, id: number) => void;
  closeDetail: () => void;
  // useEffct内で使用すること
  initDetail: (push: Push, pathname: string) => void;
}

let _push: Push | null = null;

export const useDetailStore = create<DetailStore>((set, get) => ({
  detail: null,
  pushDetail: (path, id) => {
    set({ detail: { path, id } });
    _push?.(`${path}?id=${id}`);
  },
  closeDetail: () => {
    set({ detail: null });
    window.history.replaceState(null, "", window.location.pathname);
  },
  initDetail: (push, pathname) => {
    _push = push;
    if (!get().detail) {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id && !isNaN(Number(id))) {
        set({ detail: { path: pathname, id: Number(id) } });
      }
    }
  },
}));
