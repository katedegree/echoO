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
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  actionContent?: (isVisible: boolean) => React.ReactNode;
}

export function PasswordInput({
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
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
      onReadOnly={onReadOnly}
    >
      <InputField
        startContent={startContent}
        endContent={endContent}
        actionContent={
          <button
            className="cursor-pointer"
            type="button"
            onClick={() => setIsVisible(!isVisible)}
          >
            {actionContent(isVisible)}
          </button>
        }
      >
        <Input {...props} type={isVisible ? "text" : "password"} />
      </InputField>
    </InputWrapper>
  );
}
