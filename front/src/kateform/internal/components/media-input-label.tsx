import { MediaUploadIcon } from "./icons/media-upload-icon";

interface MediaInputLabelProps {
  id: string;
  size: number;
  placeholder: string | undefined;
}

export function MediaInputLabel({
  id,
  size,
  placeholder,
}: MediaInputLabelProps) {
  return (
    <label htmlFor={id} className="block">
      <div
        className="flex flex-col justify-center items-center gap-md h-auto aspect-square text-placeholder bg-flat hover:bg-flat-hover rounded-input"
        style={{
          width: size,
        }}
      >
        <MediaUploadIcon />
        {placeholder && (
          <span className="text-sm whitespace-nowrap">{placeholder}</span>
        )}
      </div>
    </label>
  );
}
