import { create } from "@kateform/internal/store";
import type { StoreApi } from "@kateform/internal/store";

type ErrorState = {
  errors: Record<string, string>;
  setError: (key: string, message: string) => void;
  setErrors: (messages: Record<string, string>) => void;
};

let state: ErrorState;
const listeners = new Set<() => void>();

const storeApi: StoreApi<ErrorState> = {
  getState: () => state,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

const notify = () => listeners.forEach((l) => l());

state = {
  errors: {},
  setError: (key, message) => {
    const currentValue = state.errors[key] ?? "";
    if (currentValue === message) return;
    if (message === "") {
      const { [key]: _, ...rest } = state.errors;
      state = {
        ...state,
        errors: rest,
      };
    } else {
      state = {
        ...state,
        errors: {
          ...state.errors,
          [key]: message,
        },
      };
    }
    notify();
  },
  setErrors: (messages) => {
    state = {
      ...state,
      errors: { ...messages },
    };
    notify();
  },
};

export const _useErrorStore = create(storeApi);

export const useErrorStore = (id: string) => {
  const error = _useErrorStore((s) => s.errors[id] ?? "");
  const setError = _useErrorStore((s) => s.setError);

  return { error, setError };
};
