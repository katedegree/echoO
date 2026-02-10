"use client";

import { Icon } from "@/components/icon/icon";
import { MUTATION_STATUS } from "@/constants";
import { dmIndex, DmIndexResponse } from "@/lib/api/dm-index";
import { dmShow } from "@/lib/api/dm-show";
import { mediaStore } from "@/lib/api/media-store";
import { QueryResponse } from "@/lib/query-response";
import { useMediaModalStore, useMeStore } from "@/stores";
import { useDetailStore } from "@/stores/use-detail-store";
import { addToast } from "@/utils";
import { Drawer, MultiMediaInput, TextareaInput } from "@kateform/components";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useScrollLock } from "../use-scroll-lock";
import { useForm } from "react-hook-form";
import { dmStore, DmStoreRequest } from "@/lib/api/dm-store";

export default function () {
  const pathname = usePathname();
  const { me } = useMeStore();
  const { detail, pushDetail, closeDetail } = useDetailStore();
  const { open } = useMediaModalStore();

  const { register, handleSubmit, reset } = useForm<DmStoreRequest>();

  const onSubmit = (values: DmStoreRequest) => {
    if (!userId) return;
    const { fetcher } = dmStore();
    fetcher({ ...values, receiverUserId: userId, mediaIds }).then((res) => {
      switch (res.status) {
        case MUTATION_STATUS.SUCCESS:
          addToast(res.status, res.message);
          reset();
          setMediaIds([]);
          setMediaUrls([]);
          break;
        case MUTATION_STATUS.ERROR:
          addToast(res.status, res.message);
          break;
        case MUTATION_STATUS.VALIDATION:
          Object.values(res.fieldErrors).forEach((message) => {
            addToast(MUTATION_STATUS.ERROR, message);
          });
          break;
      }
    });
  };
  const { key, fetcher } = dmIndex();
  const { data } = useSWR<QueryResponse<DmIndexResponse>>(key, fetcher);
  const messages = data?.data ?? [];

  const userId = detail?.path === "/dm" ? detail.id : null;
  const user = messages.find((m) => m.user.id === userId)?.user ?? null;

  const { infiniteKey, fetcher: dmShowFetcher } = dmShow(userId!);
  const { data: dmShowData } = useSWRInfinite(
    userId ? infiniteKey : () => null,
    async ([_, _userId, cursor]) => {
      return await dmShowFetcher({ limit: 20, cursor });
    },
  );
  const dmMessages = dmShowData
    ? dmShowData.flatMap((page) => page.data).reverse()
    : [];

  const [mediaIds, setMediaIds] = useState<number[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const onUpload = (file: File) => {
    const { fetcher } = mediaStore();
    return fetcher({ media: file }).then((res) => {
      switch (res.status) {
        case MUTATION_STATUS.SUCCESS:
          setMediaIds([...mediaIds, res.mediaId]);
          setMediaUrls([...mediaUrls, res.mediaUrl]);
          break;
        case MUTATION_STATUS.ERROR:
          addToast(res.status, res.message);
          break;
        case MUTATION_STATUS.VALIDATION:
          Object.values(res.fieldErrors).forEach((message) => {
            addToast(MUTATION_STATUS.ERROR, message);
          });
          break;
      }
    });
  };

  const isOpen = pathname === "/dm";
  useScrollLock(isOpen);

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" zIndex={20}>
        <div className="bg-base bg-gradient w-screen h-screen py-[100px] px-lg flex flex-col gap-lg overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex gap-lg"
              onClick={() => pushDetail("/dm", message.user.id)}
            >
              <div className="relative">
                <div
                  className="relative w-[64px] h-[64px] rounded-full overflow-hidden shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    pushDetail("/profile", message.user.id);
                  }}
                >
                  <Image
                    className="object-cover"
                    src={message.user.iconUrl ?? "/default-avatar.png"}
                    alt="avatar"
                    fill
                  />
                </div>
                {message.unreadCount > 0 && (
                  <div className="absolute text-[12px] top-0 right-0 bg-like rounded-full w-[20px] h-[20px] flex items-center justify-center">
                    {message.unreadCount}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm ine-clamp-1 pb-sm">{message.user.name}</p>
                <p className="text-sm line-clamp-2">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </Drawer>

      <Drawer
        isOpen={pathname === "/dm" && userId !== null}
        placement="right"
        zIndex={40}
      >
        <div
          className="px-lg fixed top-0 inset-x-0 z-50 h-[100px] bg-linear-to-b from-(--color-bg-base) to-transparent flex items-center"
          onClick={() => {
            if (!user) return;
            pushDetail("/profile", user.id);
          }}
        >
          <div className="flex items-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeDetail();
              }}
              className="mr-lg"
            >
              <Icon name="left" size={36} />
            </button>
            <div className="relative w-[48px] h-[48px] rounded-full overflow-hidden shrink-0">
              <Image
                className="object-cover"
                src={user?.iconUrl ?? "/default-avatar.png"}
                alt="avatar"
                fill
              />
            </div>
            <p className="px-md">{user?.name}</p>
          </div>
        </div>

        <div className="bg-base w-screen h-screen bg-gradient py-[100px] px-lg flex flex-col gap-md overflow-y-auto">
          {dmMessages.map((message) => (
            <div key={message.id}>
              {message.isMe ? (
                <div className="flex gap-sm ml-auto w-fit max-w-[calc(100%-var(--spacing-xl))]">
                  <div className="bg-glass rounded-base rounded-tr-none p-md">
                    {message.media.length > 0 && (
                      <div className="grid grid-cols-2 rounded-base overflow-hidden gap-sm mt-sm pb-md w-full">
                        {message.media.map((url, i) => {
                          const isVideo = /\.(mp4|mov|webm|ogg)$/i.test(url);

                          return (
                            <div
                              key={`${url}-${i}`}
                              className="relative aspect-square overflow-hidden"
                              onClick={() => open(message.media, i)}
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

                    <p className="whitespace-pre-wrap break-all">
                      {message.content}
                    </p>
                  </div>
                  <div
                    className="relative w-[36px] h-[36px] rounded-full overflow-hidden shrink-0"
                    onClick={() => {
                      if (!me) return;
                      pushDetail("/profile", me.id);
                    }}
                  >
                    <Image
                      className="object-cover"
                      src={me?.iconUrl ?? "/default-avatar.png"}
                      alt="avatar"
                      fill
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-sm mr-auto w-fit max-w-[calc(100%-var(--spacing-xl))]">
                  <div
                    className="relative w-[36px] h-[36px] rounded-full overflow-hidden shrink-0"
                    onClick={() => {
                      if (!user) return;
                      pushDetail("/profile", user.id);
                    }}
                  >
                    <Image
                      className="object-cover"
                      src={user?.iconUrl ?? "/default-avatar.png"}
                      alt="avatar"
                      fill
                    />
                  </div>
                  <p className="bg-glass rounded-base rounded-tl-none p-md">
                    {message.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 inset-x-0 z-40 h-[100px] bg-linear-to-t from-(--color-bg-base) to-transparent px-lg flex items-center gap-md">
          <div className="relative w-full">
            <TextareaInput
              id="content"
              {...register("content")}
              placeholder="メッセージを入力..."
              rows={2}
            />

            <div className="absolute bottom-full">
              <MultiMediaInput
                id="media"
                size={64}
                urls={mediaUrls}
                onChange={{
                  upload: async (file) => onUpload(file),
                  remove: (url) => {
                    setMediaIds(
                      mediaIds.filter((_, index) => mediaUrls[index] !== url),
                    );
                    setMediaUrls(mediaUrls.filter((u) => u !== url));
                  },
                }}
              />
            </div>
          </div>
          <button
            className="bg-linear-to-br from-main to-accent w-[48px] h-[48px] flex items-center justify-center rounded-full shrink-0"
            type="button"
            onClick={handleSubmit(onSubmit)}
          >
            <Icon name="send" />
          </button>
        </div>
      </Drawer>
    </>
  );
}
