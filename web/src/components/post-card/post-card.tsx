import { cn } from "@kateform/utils";
import Image from "next/image";
import { Icon } from "../icon/icon";
import { useMeStore } from "@/stores";
import { postLike } from "@/lib/api";
import { MUTATION_STATUS } from "@/constants";
import { addToast } from "@/utils";

interface Props {
  id: number;
  content: string;
  media: {
    id: number;
    label: string;
    url: string;
  }[];
  likesCount: number;
}

export function PostCard({ id, content, media, likesCount }: Props) {
  const { me, setMe } = useMeStore();

  const handlePostLike = (postId: number) => {
    if (!me) return;
    const { fetcher } = postLike(postId);
    fetcher().then((res) => {
      switch (res.status) {
        case MUTATION_STATUS.SUCCESS:
          addToast("success", res.message);
          setMe({
            ...me,
            likedPostIds: [...me.likedPostIds, postId],
          });
          break;
        case MUTATION_STATUS.ERROR:
          addToast("error", res.message);
          break;
      }
    });
  };

  return (
    <div className="bg-glass rounded-base p-lg" key={id}>
      <div className="grid grid-cols-2 rounded-base overflow-hidden gap-sm">
        {media.map((media, index) => {
          const isVideo = media
            ? /\.(mp4|mov|webm|ogg)$/i.test(media.url)
            : false;

          return (
            <div
              key={`${media.id}-${index}`}
              className="relative w-full aspect-square overflow-hidden"
            >
              {isVideo ? (
                <video
                  src={media.url}
                  controls
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
                />
              ) : (
                <Image
                  src={media.url}
                  alt="media"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="pt-md whitespace-pre-wrap">{content}</p>
      <button
        className={cn(
          "bg-main w-fit min-w-[120px] flex items-center justify-center gap-md cursor-pointer mx-auto mr-xl py-sm rounded-base mt-md",
          (me?.likedPostIds ?? []).includes(id) && "bg-like",
        )}
        onClick={() => {
          if (me?.likedPostIds.includes(id)) {
            return;
          }
          handlePostLike(id);
        }}
      >
        <Icon name="heart" />
        <span className="text-lg font-bold">{likesCount}</span>
      </button>
    </div>
  );
}
