import { create, useShallow } from "@kateform/internal/store";
import type { StoreApi } from "@kateform/internal/store";

type ErrorState = {
  errorMessages: Record<string, string>;
  setErrorMessage: (key: string, message: string) => void;
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
  errorMessages: {},
  setErrorMessage: (key, message) => {
    state = {
      ...state,
      errorMessages: {
        ...state.errorMessages,
        [key]: message,
      },
    };
    notify();
  },
};

const _useError = create(storeApi);

export const useError = () =>
  _useError(
    useShallow((s) => ({
      errorMessages: s.errorMessages,
      setErrorMessage: s.setErrorMessage,
    }))
  );
