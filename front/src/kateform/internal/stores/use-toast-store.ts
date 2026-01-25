import { create, useShallow } from "@kateform/internal/store";
import type { StoreApi } from "@kateform/internal/store";

export type Toast = {
  id: number;
  message: string;
  type: string;
};

type ToastState = {
  toasts: Toast[];
  // type は各プロジェクト側でラップして型安全に扱う前提の低レベル API
  addToast: (type: string, message: string) => void;
  stopTimer: () => void;
  startTimer: () => void;
};

let state: ToastState;
const listeners = new Set<() => void>();

const storeApi: StoreApi<ToastState> = {
  getState: () => state,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

const notify = () => listeners.forEach((l) => l());

// グローバルタイマーを管理
let dismissTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleDismiss = () => {
  if (dismissTimer) {
    clearTimeout(dismissTimer);
  }
  dismissTimer = setTimeout(() => {
    if (state.toasts.length > 0) {
      const newToasts = state.toasts.slice(0, -1);
      state = {
        ...state,
        toasts: newToasts,
      };
      notify();
      if (newToasts.length > 0) {
        scheduleDismiss();
      }
    }
  }, 3000);
};

state = {
  toasts: [],
  addToast: (type, message) => {
    const id = Date.now() + Math.random();
    state = {
      ...state,
      toasts: [...state.toasts, { id, type, message }],
    };
    notify();
    scheduleDismiss();
  },
  stopTimer: () => {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
  },
  startTimer: () => {
    if (state.toasts.length > 0) {
      scheduleDismiss();
    }
  },
};

const _useToastStore = create(storeApi);

export const toastStoreApi = storeApi;
export const useToastStore = () =>
  _useToastStore(
    useShallow((s) => ({
      toasts: s.toasts,
      addToast: s.addToast,
      stopTimer: s.stopTimer,
      startTimer: s.startTimer,
    })),
  );
