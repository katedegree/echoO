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
        className="flex flex-col justify-center items-center gap-md text-placeholder bg-flat hover:bg-flat-hover rounded-input"
        style={{
          width: size,
          height: size,
        }}
      >
        <div className="w-1/2 aspect-square max-w-[40px]">
          <MediaUploadIcon />
        </div>
        {placeholder && (
          <span className="text-sm whitespace-nowrap">{placeholder}</span>
        )}
      </div>
    </label>
  );
}
