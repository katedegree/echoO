import { useEffect } from "react";
import { cn } from "../utils";
import { motion } from "framer-motion";
import { useError } from "../hooks";

export interface InputWrapperProps<T> {
  id: string;
  label: string | undefined;
  children: React.ReactNode;
  onReadOnly: (() => void) | undefined;
  isDisabled: boolean;
  isReadOnly: boolean;
  errorMessage: string | undefined;
  value: T;
}

export function InputWrapper<T>({
  id,
  value,
  label,
  children,
  onReadOnly,
  isDisabled,
  isReadOnly,
  errorMessage,
}: InputWrapperProps<T>) {
  const { errorMessages, setErrorMessage } = useError();

  useEffect(() => {
    setErrorMessage(id, "");
  }, [value]);
  useEffect(() => {
    setErrorMessage(id, errorMessage || "");
  }, [errorMessage]);

  return (
    <div>
      <label
        className="w-fit block pl-sm pb-sm font-bold text-label text-sm"
        htmlFor={isReadOnly || isDisabled ? undefined : id}
      >
        {label}
      </label>

      <motion.div
        className={cn(
          "relative rounded-input outline-solid",
          isDisabled && "opacity-80"
        )}
        animate={
          errorMessages[id]
            ? {
                outlineWidth: "1px",
                outlineOffset: "1px",
                outlineColor: "var(--kateform-color-error)",
              }
            : {
                outlineWidth: "0px",
                outlineOffset: "0px",
                outlineColor: "transparent",
              }
        }
        transition={{
          type: "tween",
          duration: 0.2,
        }}
      >
        {children}
        {isReadOnly && (
          <div className="absolute inset-[0]" onClick={onReadOnly} />
        )}
        {isDisabled && (
          <div className="absolute inset-[0] hover:cursor-not-allowed" />
        )}
      </motion.div>
      <p
        className={cn(
          "h-[1lh] pt-1 text-sm text-error",
          !errorMessages[id] && "opacity-0"
        )}
      >
        {errorMessages[id]}
      </p>
    </div>
  );
}
