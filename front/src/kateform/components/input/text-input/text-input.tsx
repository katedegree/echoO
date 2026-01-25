"use client";

import { Input, InputField, InputWrapper } from "@kateform/internal/components";

export interface TextInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "id" | "name"> {
  id: string;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onReadOnly?: () => void;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  actionContent?: React.ReactNode;
}

export function TextInput({
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  startContent,
  endContent,
  actionContent,
  ...props
}: TextInputProps) {
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
        <Input {...props} type="text" />
      </InputField>
    </InputWrapper>
  );
}
