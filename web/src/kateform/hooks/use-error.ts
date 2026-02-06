import { _useErrorStore } from "@kateform/internal/stores";

export const useError = () => {
  const setErrors = _useErrorStore((s) => s.setErrors);
  return { setErrors };
};
