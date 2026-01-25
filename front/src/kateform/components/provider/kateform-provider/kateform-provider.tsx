"use client";

import { useEffect } from "react";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type KateFormProviderProps = DeepPartial<{
  children: React.ReactNode;
  mode: {
    thema: "light" | "dark";
    input: "flat" | "bordered";
  };
  color: {
    light: {
      text: {
        label: string; // --kateform-color-label
        value: string; // --kateform-color-value
        option: string; // --kateform-color-option
        error: string; // --kateform-color-error
      };
      background: {
        flat: string; // --kateform-color-flat
        flatHover: string; // --kateform-color-flat-hover
        popover: string; // --kateform-color-popover
        popoverHover: string; // --kateform-color-popover-hover
      };
      border: {
        bordered: string; // --kateform-color-bordered
        borderedHover: string; // --kateform-color-bordered-hover
      };
    };
    dark: {
      text: {
        label: string;
        value: string;
        option: string;
        error: string;
      };
      background: {
        flat: string;
        flatHover: string;
        popover: string;
        popoverHover: string;
      };
      border: {
        bordered: string;
        borderedHover: string;
      };
    };
  };
  text: {
    md: string; // kateform-text-md
    sm: string; // kateform-text-sm
  };
  spacing: {
    "1": string; // kateform-spacing-1
    sm: string; // kateform-spacing-sm
    md: string; // kateform-spacing-md
    lg: string; // kateform-spacing-lg
  };
  radius: {
    input: string; // kateform-radius-input
  };
}>;

export function KateFormProvider({
  children,
  mode,
  color,
  text,
  spacing,
  radius,
}: KateFormProviderProps) {
  const themaMode = mode?.thema;
  // TODO: Add input mode
  // const inputMode = mode?.input;

  const { light = {}, dark = {} } = color ?? {};
  const {
    text: ltText = {},
    background: ltBg = {},
    border: ltBorder = {},
  } = light;
  const {
    text: dkText = {},
    background: dkBg = {},
    border: dkBorder = {},
  } = dark;

  const lightLabelColor = ltText.label;
  const lightValueColor = ltText.value;
  const lightOptionColor = ltText.option;
  const lightErrorColor = ltText.error;
  const lightFlatColor = ltBg.flat;
  const lightFlatHoverColor = ltBg.flatHover || lightFlatColor;
  const lightPopoverColor = ltBg.popover;
  const lightPopoverHoverColor = ltBg.popoverHover || lightPopoverColor;
  const lightBorderedColor = ltBorder.bordered;
  const lightBorderedHoverColor = ltBorder.borderedHover || lightBorderedColor;

  const darkLabelColor = dkText.label;
  const darkValueColor = dkText.value;
  const darkOptionColor = dkText.option;
  const darkErrorColor = dkText.error;
  const darkFlatColor = dkBg.flat;
  const darkFlatHoverColor = dkBg.flatHover || darkFlatColor;
  const darkPopoverColor = dkBg.popover;
  const darkPopoverHoverColor = dkBg.popoverHover || darkPopoverColor;
  const darkBorderedColor = dkBorder.bordered;
  const darkBorderedHoverColor = dkBorder.borderedHover || darkBorderedColor;

  const mdText = text?.md;
  const smText = text?.sm;

  const spacing1 = spacing?.["1"];
  const spacingSm = spacing?.sm;
  const spacingMd = spacing?.md;
  const spacingLg = spacing?.lg;

  const radiusInput = radius?.input;

  const setCSSVariables = (
    root: HTMLElement,
    map: Record<string, string | undefined>,
  ) => {
    Object.entries(map).forEach(([key, value]) => {
      if (value) root.style.setProperty(key, value);
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    themaMode === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
  }, [themaMode]);

  useEffect(() => {
    const root = document.documentElement;
    (setCSSVariables(root, {
      "--kateform-color-light-label": lightLabelColor,
      "--kateform-color-light-value": lightValueColor,
      "--kateform-color-light-option": lightOptionColor,
      "--kateform-color-light-error": lightErrorColor,
      "--kateform-color-light-flat": lightFlatColor,
      "--kateform-color-light-flat-hover": lightFlatHoverColor,
      "--kateform-color-light-popover": lightPopoverColor,
      "--kateform-color-light-popover-hover": lightPopoverHoverColor,
      "--kateform-color-light-bordered": lightBorderedColor,
      "--kateform-color-light-bordered-hover": lightBorderedHoverColor,

      "--kateform-color-dark-label": darkLabelColor,
      "--kateform-color-dark-value": darkValueColor,
      "--kateform-color-dark-option": darkOptionColor,
      "--kateform-color-dark-error": darkErrorColor,
      "--kateform-color-dark-flat": darkFlatColor,
      "--kateform-color-dark-flat-hover": darkFlatHoverColor,
      "--kateform-color-dark-popover": darkPopoverColor,
      "--kateform-color-dark-popover-hover": darkPopoverHoverColor,
      "--kateform-color-dark-bordered": darkBorderedColor,
      "--kateform-color-dark-bordered-hover": darkBorderedHoverColor,
    }),
      [color]);
  });

  useEffect(() => {
    const root = document.documentElement;
    setCSSVariables(root, {
      "--kateform-text-sm": smText,
      "--kateform-text-md": mdText,
    });
  }, [text]);

  useEffect(() => {
    const root = document.documentElement;
    setCSSVariables(root, {
      "--kateform-spacing-1": spacing1,
      "--kateform-spacing-sm": spacingSm,
      "--kateform-spacing-md": spacingMd,
      "--kateform-spacing-lg": spacingLg,
    });
  }, [spacing]);

  useEffect(() => {
    const root = document.documentElement;
    setCSSVariables(root, {
      "--kateform-radius-input": radiusInput,
    });
  }, [radius]);

  return <>{children}</>;
}
