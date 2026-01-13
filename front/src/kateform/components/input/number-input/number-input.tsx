"use client";

import type React from "react";
import {
  Input,
  InputField,
  InputWrapper,
  NumberCounterIcon,
} from "@kateform/internal/components";

export interface NumberInputProps
  extends Omit<
    React.ComponentProps<"input">,
    "id" | "type" | "value" | "onChange" | "name"
  > {
  id: string;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onReadOnly?: () => void;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  actionContent?: React.ReactNode;
  value?: number | null | undefined;
  onChange?: (v: number) => void;
}

export function NumberInput({
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  errorMessage,
  startContent,
  endContent,
  actionContent = (
    <NumberCounterIcon
      onClick={(e) => {
        const svg = e.currentTarget;
        const { top, height } = svg.getBoundingClientRect();
        const clickY = e.clientY - top;
        const current = props.value ?? 0;
        props.onChange?.(clickY < height / 2 ? current + 1 : current - 1);
      }}
    />
  ),
  ...props
}: NumberInputProps) {
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
        actionContent={actionContent}
      >
        <Input
          {...props}
          className="[&::-webkit-inner-spin-button]:[-webkit-appearance:none]"
          onWheel={(e) => {
            e.currentTarget.blur();
            props.onWheel?.(e);
          }}
          onChange={(e) => {
            props.onChange?.(Number(e.target.value));
          }}
          type="number"
          inputMode="numeric"
          value={props.value || ""}
        />
      </InputField>
    </InputWrapper>
  );
}
