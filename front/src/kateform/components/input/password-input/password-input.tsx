"use client";

import { useState } from "react";
import {
  Input,
  InputField,
  InputWrapper,
  PasswordVisibilityIcon,
} from "@kateform/internal/components";

export interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "id" | "name"> {
  id: string;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onReadOnly?: () => void;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  actionContent?: (isVisible: boolean) => React.ReactNode;
}

export function PasswordInput({
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  errorMessage,
  startContent,
  endContent,
  actionContent = (isVisible) => (
    <PasswordVisibilityIcon isVisible={isVisible} />
  ),
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputWrapper
      id={props.id}
      value={props.value}
      label={label}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      errorMessage={errorMessage}
      onReadOnly={onReadOnly}
    >
      <InputField
        startContent={startContent}
        endContent={endContent}
        actionContent={
          <button onClick={() => setIsVisible(!isVisible)}>
            {actionContent(isVisible)}
          </button>
        }
      >
        <Input {...props} type={isVisible ? "text" : "password"} />
      </InputField>
    </InputWrapper>
  );
}
