import { useToastStore } from "@kateform/internal/stores";
import { cn } from "@kateform/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export interface ToastProviderProps<T extends string> {
  component: React.ComponentType<{
    type: T;
    message: string;
  }>;
  placement?:
    | "bottom-right"
    | "bottom-left"
    | "bottom-center"
    | "top-right"
    | "top-left"
    | "top-center";
  zIndex?: number;
}

export function ToastProvider<T extends string>({
  component: ToastComponent,
  placement = "bottom-right",
  zIndex = 50,
}: ToastProviderProps<T>) {
  const { toasts, stopTimer, startTimer } = useToastStore();
  const [isHovered, setIsHovered] = useState(false);

  const getExit = () => {
    // left, rightを優先する
    if (placement.includes("right")) return { x: 100, opacity: 0 };
    if (placement.includes("left")) return { x: -100, opacity: 0 };
    if (placement.includes("top")) return { y: -50, opacity: 0 };
    if (placement.includes("bottom")) return { y: 50, opacity: 0 };
    return { opacity: 0 };
  };

  const toastClassName = (positionFromNewest: number) =>
    cn(
      "absolute",
      placement.includes("center") && "left-1/2 transform -translate-x-1/2",
      placement.includes("right") && "right-0",
      placement.includes("bottom") && "bottom-0",
      positionFromNewest === 0 && "z-1000",
      positionFromNewest === 1 &&
        cn(
          "z-999 scale-95",
          placement.includes("top")
            ? "pt-(--kateform-spacing-md)"
            : "pb-(--kateform-spacing-md)",
        ),
      positionFromNewest === 2 &&
        cn(
          "z-998 scale-90",
          placement.includes("top")
            ? "pt-[calc(var(--kateform-spacing-md)*2)]"
            : "pb-[calc(var(--kateform-spacing-md)*2)]",
        ),
    );

  return (
    <div
      className={cn(
        "fixed z-50",
        placement.includes("top") && "top-md",
        placement.includes("bottom") && "bottom-md",
        placement.includes("left") && "left-md",
        placement.includes("right") && "right-md",
        placement.includes("center") && "left-1/2 -translate-x-1/2",
      )}
      style={{ zIndex }}
      onMouseEnter={() => {
        setIsHovered(true);
        stopTimer();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        startTimer();
      }}
    >
      <div className="relative">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => {
            // 最新3つだけ表示（古い方は非表示）
            if (index < toasts.length - 3) return null;

            const positionFromNewest = toasts.length - 1 - index;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={getExit()}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={
                  isHovered
                    ? "not-last:mb-md"
                    : toastClassName(positionFromNewest)
                }
                layout
              >
                <ToastComponent
                  type={toast.type as T}
                  message={toast.message}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
