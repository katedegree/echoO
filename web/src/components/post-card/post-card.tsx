import { cn } from "@kateform/utils";
import Image from "next/image";
import { Icon } from "../icon/icon";
import { useMeStore } from "@/stores";
import { likeStore } from "@/lib/api";
import { MUTATION_STATUS } from "@/constants";
import { addToast } from "@/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaModalStore } from "@/stores/use-media-modal-store";

interface Props {
  id: number;
  content: string;
  media: {
    id: number;
    label: string;
    url: string;
  }[];
  likesCount: number;
  isPublic?: boolean;
  isMe?: boolean;
}

export function PostCard({
  id,
  content,
  media,
  likesCount,
  isPublic = true,
  isMe = false,
}: Props) {
  const router = useRouter();
  const { me, setMe } = useMeStore();
  const { open } = useMediaModalStore();
  const isLiked = (me?.likedPostIds ?? []).includes(id);
  const [optimisticIncrement, setOptimisticIncrement] = useState(0);

  const handlePostLike = (postId: number) => {
    if (isLiked) return;

    if (!me) {
      addToast("error", "ログインしてください");
      router.push("/login");
      return;
    }

    // 楽観的更新
    setMe({
      ...me,
      likedPostIds: [...me.likedPostIds, postId],
    });
    setOptimisticIncrement(1);
    addToast("success", "いいねしました。");

    const { fetcher } = likeStore({ postId });
    fetcher().then((res) => {
      if (res.status === MUTATION_STATUS.ERROR) {
        addToast("error", res.message);
        setMe({
          ...me,
          likedPostIds: me.likedPostIds.filter((id) => id !== postId),
        });
        setOptimisticIncrement(0);
      }
    });
  };

  return (
    <div className="bg-glass rounded-base p-lg relative" key={id}>
      {!isPublic && isMe && (
        <>
          <div className="absolute top-md right-md">
            <Icon name="password" size={28} />
          </div>
          <div className="h-[52px]" />
        </>
      )}
      <div className="grid grid-cols-2 rounded-base overflow-hidden gap-sm">
        {media.map((m, i) => {
          const isVideo = media ? /\.(mp4|mov|webm|ogg)$/i.test(m.url) : false;

          return (
            <div
              key={`${m.id}-${i}`}
              className="relative w-full aspect-square overflow-hidden"
              onClick={() =>
                open(
                  media.map((m) => m.url),
                  i,
                )
              }
            >
              {isVideo ? (
                <video
                  src={m.url}
                  controls
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
                />
              ) : (
                <Image src={m.url} alt="media" fill className="object-cover" />
              )}
            </div>
          );
        })}
      </div>
      <p className="pt-md whitespace-pre-wrap">{content}</p>
      <button
        className={cn(
          "bg-main w-fit min-w-[120px] flex items-center justify-center gap-md cursor-pointer mx-auto mr-xl py-sm rounded-base mt-md",
          isLiked && "bg-like",
        )}
        onClick={() => handlePostLike(id)}
      >
        <Icon name="heart" />
        <span className="text-lg font-bold">
          {likesCount + optimisticIncrement}
        </span>
      </button>
    </div>
  );
}
