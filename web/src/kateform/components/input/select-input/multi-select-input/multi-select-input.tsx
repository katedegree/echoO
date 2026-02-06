"use client";

import {
  Input,
  InputField,
  InputWrapper,
  MultiSelectRemoveIcon,
  SelectChevronIcon,
} from "@kateform/internal/components";
import { usePopover } from "@kateform/internal/hooks/use-popover";
import { SelectPopover } from "@kateform/internal/components/select-popover";
import { useEffect, useState } from "react";

export interface MultiSelectInputProps<T extends string | number> extends Omit<
  React.ComponentProps<"input">,
  "type" | "id" | "name" | "onChange" | "value"
> {
  id: string;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onReadOnly?: () => void;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  actionContent?: (isOpen: boolean) => React.ReactNode;
  options?: { value: T; label: string }[];
  onChange?: (v: T[]) => void;
  value?: T[];
  popoverHeight?: number;
  notFoundText?: string;
}

export function MultiSelectInput<T extends string | number>({
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  startContent,
  endContent,
  actionContent = (isOpen) => <SelectChevronIcon isOpen={isOpen} />,
  options = [],
  onChange,
  value = [],
  popoverHeight = 160,
  notFoundText = "Not Found.",
  ...props
}: MultiSelectInputProps<T>) {
  const { isOpen, inputRef, wrapperRef, popoverRef } = usePopover(
    props.ref,
    popoverHeight,
  );

  const [search, setSearch] = useState("");
  useEffect(() => {
    if (value) setSearch("");
  }, [value]);

  return (
    <InputWrapper
      id={props.id}
      value={value}
      label={label}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      onReadOnly={onReadOnly}
    >
      <div ref={wrapperRef}>
        <InputField
          startContent={startContent}
          endContent={endContent}
          actionContent={actionContent(isOpen)}
        >
          {value.length > 0 && (
            <div className="overflow-x-auto flex *:shrink-0 gap-sm no-scrollbar">
              {options
                .filter((option) => value.includes(option.value))
                .map((option) => (
                  <div
                    className="flex items-center bg-popover whitespace-nowrap rounded-[calc(var(--kateform-radius-input)-var(--kateform-spacing-md))] overflow-hidden"
                    key={option.value}
                  >
                    <p className="pl-md pr-sm">{option.label}</p>
                    <div
                      role="button"
                      className="h-full flex items-center px-sm hover:bg-error hover:text-popover cursor-pointer"
                      onMouseDown={() => {
                        onChange?.(value.filter((v) => v !== option.value));
                      }}
                    >
                      <MultiSelectRemoveIcon />
                    </div>
                  </div>
                ))}
            </div>
          )}
          <Input
            {...props}
            placeholder={value.length > 0 ? "" : props.placeholder}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onBlur={() => setSearch("")}
            ref={inputRef}
            className={value.length > 0 ? "not-focus:absolute" : ""}
          />
        </InputField>
        {isOpen && (
          <SelectPopover
            popoverRef={popoverRef}
            options={options?.filter((o) => o.label.includes(search))}
            selected={value}
            notFoundText={notFoundText}
            onSelect={(v) =>
              onChange?.(
                value.includes(v)
                  ? value.filter((i) => i !== v)
                  : [...value, v],
              )
            }
          />
        )}
      </div>
    </InputWrapper>
  );
}
