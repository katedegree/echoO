import { forwardRef } from "react";
import { cn } from "@kateform/internal/utils";

export interface InputProps extends Omit<React.ComponentProps<"input">, "id"> {
  id: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      {...props}
      autoComplete="off"
      className={cn(
        "w-full outline-none autofill:bg-transparent bg-clip-text",
        "placeholder:text-placeholder caret-value [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-value)]",
        props.className
      )}
      ref={ref}
    />
  );
});
