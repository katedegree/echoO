import { forwardRef } from "react";
import { cn } from "@kateform/utils";

export interface TextareaProps extends Omit<
  React.ComponentProps<"textarea">,
  "id"
> {
  id: string;
  height?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ height = 160, ...props }, ref) => {
    return (
      <textarea
        {...props}
        autoComplete="off"
        className={cn(
          "w-full outline-none autofill:bg-transparent bg-clip-text",
          "placeholder:text-placeholder caret-value [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-value)]]",
          "no-scrollbar resize-none",
          props.className,
        )}
        style={{ height }}
        ref={ref}
      />
    );
  },
);
