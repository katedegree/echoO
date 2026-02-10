import { useMediaModalStore } from "@/stores";
import { cn } from "@kateform/utils";
import Image from "next/image";

interface Props {
  content: string;
  media: string[];
  isMe: boolean;
  avatarUrl: string;
  onAvatarClick: () => void;
}

export function DmMessage({
  content,
  media,
  isMe,
  avatarUrl,
  onAvatarClick,
}: Props) {
  const { open } = useMediaModalStore();

  const avatar = (
    <div
      className="relative w-[36px] h-[36px] rounded-full overflow-hidden shrink-0"
      onClick={onAvatarClick}
    >
      <Image className="object-cover" src={avatarUrl} alt="avatar" fill />
    </div>
  );

  const bubble = (
    <div
      className={cn(
        "bg-glass rounded-base p-md",
        isMe ? "rounded-tr-none" : "rounded-tl-none",
      )}
    >
      {media.length > 0 && (
        <div className="grid grid-cols-2 rounded-base overflow-hidden gap-sm mt-sm pb-md w-[240px]">
          {media.map((url, i) => {
            const isVideo = /\.(mp4|mov|webm|ogg)$/i.test(url);

            return (
              <div
                key={`${url}-${i}`}
                className="relative aspect-square overflow-hidden"
                onClick={() => open(media, i)}
              >
                {isVideo ? (
                  <video
                    src={url}
                    controls
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
                  />
                ) : (
                  <Image
                    src={url}
                    alt="media"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="whitespace-pre-wrap break-all">{content}</p>
    </div>
  );

  return (
    <div
      className={cn(
        "flex gap-sm w-fit max-w-[calc(100%-var(--spacing-xl))]",
        isMe ? "ml-auto" : "mr-auto",
      )}
    >
      {isMe ? (
        <>
          {bubble}
          {avatar}
        </>
      ) : (
        <>
          {avatar}
          {bubble}
        </>
      )}
    </div>
  );
}
