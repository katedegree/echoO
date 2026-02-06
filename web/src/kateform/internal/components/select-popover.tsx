import { motion } from "framer-motion";
import { SelectCheckIcon } from "./icons/select-check-icon";

interface SelectPopoverProps<T extends string | number> {
  popoverRef?: React.RefObject<HTMLDivElement | null>;
  options: { value: T; label: string }[] | undefined;
  selected: T[];
  onSelect: ((v: T) => void) | undefined;
  notFoundText: string;
}

export function SelectPopover<T extends string | number>({
  popoverRef,
  options,
  selected,
  onSelect,
  notFoundText,
}: SelectPopoverProps<T>) {
  return (
    <motion.div
      ref={popoverRef}
      initial="initial"
      animate="enter"
      exit="exit"
      variants={{
        initial: {
          opacity: 0,
          transform: "scale(0.8)",
        },
        enter: {
          opacity: 1,
          transform: "scale(1)",
          transition: {
            type: "spring",
            bounce: 0,
            duration: 0.3,
          },
        },
        exit: {
          opacity: 0,
          transform: "scale(0.96)",
          transition: {
            type: "tween",
            ease: "easeOut",
            duration: 0.15,
          },
        },
      }}
      className="*:p-md fixed z-99 text-option p-sm rounded-input bg-popover border border-popover-hover overflow-y-auto shadow shadow-popover-hover no-scrollbar"
    >
      {options?.length === 0 && <p>{notFoundText}</p>}
      {options?.map((option) => (
        <div
          key={option.value}
          className="flex items-center gap-sm hover:bg-popover-hover rounded-[calc(var(--kateform-radius-input)-var(--kateform-spacing-sm))]"
          onClick={() => onSelect?.(option.value)}
        >
          {selected.includes(option.value) && <SelectCheckIcon />}
          {option.label}
        </div>
      ))}
    </motion.div>
  );
}
