"use client";

import { InputField, InputWrapper } from "@kateform/internal/components";
import { Textarea } from "@kateform/internal/components/textarea";

export interface TextareaInputProps extends Omit<
  React.ComponentProps<"textarea">,
  "id" | "name"
> {
  id: string;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onReadOnly?: () => void;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  actionContent?: React.ReactNode;
}

export function TextareaInput({
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  startContent,
  endContent,
  actionContent,
  ...props
}: TextareaInputProps) {
  return (
    <InputWrapper
      id={props.id}
      value={props.value}
      label={label}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      onReadOnly={onReadOnly}
    >
      <InputField
        startContent={startContent}
        endContent={endContent}
        actionContent={actionContent}
      >
        <Textarea {...props} />
      </InputField>
    </InputWrapper>
  );
}
