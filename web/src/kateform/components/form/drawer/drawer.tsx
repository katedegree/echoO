import { cn } from "@kateform/utils";
import { motion, AnimatePresence, type Variants } from "framer-motion";

export interface DrawerProps {
  isOpen: boolean;
  children: React.ReactNode;
  placement: "top" | "bottom" | "left" | "right";
  zIndex?: number;
  onClose?: () => void;
}

export function Drawer({
  isOpen,
  placement,
  zIndex = 40,
  children,
  onClose,
}: DrawerProps) {
  if (!isOpen) return null;

  const key = placement === "top" || placement === "bottom" ? "y" : "x";
  const variants = {
    enter: {
      [key]: 0,
      opacity: 1,
      scale: 1,
      transition: {
        [key]: {
          duration: 0.2,
          ease: [0, 0, 0.2, 1],
        },
      },
    },
    exit: {
      [key]: placement === "top" || placement === "left" ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
      transition: {
        [key]: {
          duration: 0.1,
          ease: [0.4, 0, 1, 1],
        },
      },
    },
  } as Variants;
  const positions = {
    top: "justify-start",
    bottom: "justify-end",
    left: "items-start",
    right: "items-end",
  };
  return (
    <AnimatePresence>
      <div
        className={cn("fixed inset-0 flex flex-col", positions[placement])}
        style={{ zIndex }}
      >
        <div
          className="absolute inset-0 bg-label opacity-20"
          onClick={onClose}
        />
        <motion.div
          className={cn(
            "absolute",
            placement === "top" || placement === "bottom" ? "w-full" : "h-full",
          )}
          variants={variants}
          initial="exit"
          animate="enter"
          exit="exit"
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
