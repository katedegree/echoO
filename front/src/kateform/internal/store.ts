import { useSyncExternalStore, useRef } from "react";

type Listener = () => void;

export type StoreApi<T> = {
  getState: () => T;
  subscribe: (listener: Listener) => () => void;
};

export function useStore<T, U>(api: StoreApi<T>, selector: (state: T) => U): U {
  return useSyncExternalStore(api.subscribe, () => selector(api.getState()));
}

export const create = <T>(api: StoreApi<T>) => {
  const useBoundStore = <U>(selector: (state: T) => U) =>
    useStore(api, selector);

  return Object.assign(useBoundStore, api);
};

export function useShallow<S, U extends Record<string, any>>(
  selector: (state: S) => U
): (state: S) => U {
  const prev = useRef<U | undefined>(undefined);

  return (state) => {
    const next = selector(state);

    if (
      prev.current &&
      Object.keys(next).length === Object.keys(prev.current).length &&
      Object.keys(next).every((key) => Object.is(next[key], prev.current![key]))
    ) {
      return prev.current;
    }

    prev.current = next;
    return next;
  };
}
