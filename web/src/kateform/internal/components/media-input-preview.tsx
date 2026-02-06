import { MediaRemoveIcon } from "./icons/media-remove-icon";
import { MediaSpinnerIcon } from "./icons/media-spinner-icon";

interface MediaInputPreviewProps {
  size: number;
  url: string | undefined;
  isUploading?: boolean;
  spinner: React.ReactNode | undefined;
  onRemove?: (() => void) | undefined;
}

export function MediaInputPreview({
  size,
  url,
  isUploading = false,
  spinner = <MediaSpinnerIcon />,
  onRemove,
}: MediaInputPreviewProps) {
  const isVideo = url ? /\.(mp4|mov|webm|ogg)$/i.test(url) : false;
  const mediaClassName = "w-full h-full object-cover object-center";

  return (
    <div
      className="relative aspect-square overflow-hidden rounded-input bg-flat hover:bg-flat-hover"
      style={{ width: size }}
    >
      {isVideo ? (
        <video src={url} className={mediaClassName} muted playsInline />
      ) : (
        <img className={mediaClassName} src={url} />
      )}
      <button className="absolute right-sm top-sm" onClick={onRemove}>
        <MediaRemoveIcon />
      </button>
      {isUploading && (
        <div className="absolute inset-[0] flex justify-center items-center text-value bg-flat opacity-50">
          {spinner}
        </div>
      )}
    </div>
  );
}
