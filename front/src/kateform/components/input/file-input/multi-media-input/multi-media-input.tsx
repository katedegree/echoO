"use client";

import { useState } from "react";
import {
  InputWrapper,
  MediaInputLabel,
  MediaInputPreview,
} from "@kateform/internal/components";

export interface MultiMediaInputProps {
  id: string;
  ref?: React.RefObject<HTMLInputElement | null>;
  label?: string;
  placeholder?: string;
  size?: number;
  urls?: string[];
  isDisabled?: boolean;
  isReadOnly?: boolean;
  errorMessage?: string;
  onChange?: {
    upload: (file: File) => Promise<void>;
    remove: (url: string) => void;
  };
  onReadOnly?: () => void;
  spinner?: React.ReactNode;
}

export function MultiMediaInput({
  id,
  ref,
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  errorMessage,
  size = 240,
  placeholder,
  urls = [],
  onChange,
  spinner,
}: MultiMediaInputProps) {
  const [uploadingUrls, setUploadingUrls] = useState<string[]>([]);

  return (
    <div className="w-fit">
      <InputWrapper
        id={id}
        value={urls}
        label={label}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        errorMessage={errorMessage}
        onReadOnly={onReadOnly}
      >
        <input
          id={id}
          ref={ref}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            if (!file) return;

            const baseUrl = URL.createObjectURL(file);
            const fragment = file.type.startsWith("image") ? "#.png" : "#.mp4";
            const url = baseUrl + fragment;

            setUploadingUrls([url, ...uploadingUrls]);
            onChange?.upload(file).finally(() => {
              setUploadingUrls(uploadingUrls.filter((u) => u !== url));
            });
          }}
        />
        <div className="flex [&>*]:flex-shrink-0 [&>*]:overflow-hidden gap-md">
          <MediaInputLabel id={id} size={size} placeholder={placeholder} />
          {uploadingUrls.map((url) => (
            <MediaInputPreview
              key={url}
              size={size}
              url={url}
              isUploading
              spinner={spinner}
            />
          ))}
          {urls.map((url) => (
            <MediaInputPreview
              key={url}
              size={size}
              url={url}
              onRemove={() => onChange?.remove(url)}
              spinner={spinner}
            />
          ))}
        </div>
      </InputWrapper>
    </div>
  );
}
