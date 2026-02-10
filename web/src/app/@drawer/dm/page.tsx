"use client";

import { Icon } from "@/components/icon/icon";
import { MUTATION_STATUS } from "@/constants";
import { dmIndex, DmIndexResponse } from "@/lib/api/dm-index";
import { dmShow } from "@/lib/api/dm-show";
import { mediaStore } from "@/lib/api/media-store";
import { QueryResponse } from "@/lib/query-response";
import { useMeStore } from "@/stores";
import { useDetailStore } from "@/stores/use-detail-store";
import { addToast } from "@/utils";
import { Drawer, MultiMediaInput, TextareaInput } from "@kateform/components";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useScrollLock } from "../use-scroll-lock";
import { useForm } from "react-hook-form";
import { dmRead } from "@/lib/api/dm-read";
import { dmStore, DmStoreRequest } from "@/lib/api/dm-store";
import { DmMessage } from "@/components/dm-message/dm-message";

export default function () {
  const pathname = usePathname();
  const { me } = useMeStore();
  const { detail, pushDetail, closeDetail } = useDetailStore();

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

  useEffect(() => {
    if (!userId) return;
    const { fetcher } = dmRead(userId);
    fetcher();
  }, [userId]);

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
                <p className="text-sm line-clamp-2 break-all">{message.content}</p>
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
            <DmMessage
              key={message.id}
              content={message.content}
              media={message.media}
              isMe={message.isMe}
              avatarUrl={
                message.isMe
                  ? me?.iconUrl ?? "/default-avatar.png"
                  : user?.iconUrl ?? "/default-avatar.png"
              }
              onAvatarClick={() => {
                if (message.isMe) {
                  if (!me) return;
                  pushDetail("/profile", me.id);
                } else {
                  if (!user) return;
                  pushDetail("/profile", user.id);
                }
              }}
            />
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
