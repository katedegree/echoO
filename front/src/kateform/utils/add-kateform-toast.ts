import { toastStoreApi } from "@kateform/internal/stores";

export const addKateFormToast = (
  ...args: Parameters<ReturnType<typeof toastStoreApi.getState>["addToast"]>
) => {
  toastStoreApi.getState().addToast(...args);
};
