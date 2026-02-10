import { forwardRef } from "react";
import { cn } from "@kateform/utils";

export interface TextareaProps
  extends Omit<React.ComponentProps<"textarea">, "id"> {
  id: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return (
      <textarea
        rows={5}
        {...props}
        autoComplete="off"
        className={cn(
          "w-full outline-none autofill:bg-transparent bg-clip-text",
          "placeholder:text-placeholder caret-value [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-value)]]",
          "no-scrollbar resize-none",
          props.className,
        )}
        ref={ref}
      />
    );
  },
);
