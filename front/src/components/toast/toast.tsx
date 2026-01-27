import { MUTATION_STATUS } from "@/constants";
import { cn } from "@kateform/utils";

export type ToastType =
  | typeof MUTATION_STATUS.SUCCESS
  | typeof MUTATION_STATUS.ERROR;

export interface ToastProps {
  type: ToastType;
  message: string;
}

export function Toast({ type, message }: ToastProps) {
  return (
    <div
      className={cn(
        "bg-main rounded-base p-lg w-[calc(100vw-var(--spacing-xl))] border",
        type === "success" ? "border-success" : "border-error",
      )}
    >
      {message}
    </div>
  );
}
