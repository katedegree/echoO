"use client";

import { MUTATION_STATUS } from "@/constants";
import { mediaStore } from "@/lib/api/media-store";
import { postStore, PostStoreRequest } from "@/lib/api/post-store";
import { useMeStore, useSidebarStore } from "@/stores";
import { addToast } from "@/utils";
import { Drawer, MultiMediaInput, TextareaInput } from "@kateform/components";
import { useError } from "@kateform/hooks";
import { cn } from "@kateform/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Porps {
  isOpen: boolean;
  onClose: () => void;
}

export function PostDrawer({ isOpen, onClose }: Porps) {
  const { register, handleSubmit, getValues, setValue, reset } =
    useForm<PostStoreRequest>({
      defaultValues: {
        content: "",
        mediaIds: [],
        isPublic: true,
        lat: 0,
        lng: 0,
      },
    });
  const { setErrors } = useError();
  const { sidebarPos } = useSidebarStore();
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("lat", position.coords.latitude);
          setValue("lng", position.coords.longitude);
        },
        () => {
          addToast(MUTATION_STATUS.ERROR, "位置情報を取得できませんでした。");
        },
      );
    }
  }, [isOpen, setValue]);

  const onSubmit = (values: PostStoreRequest) => {
    if (!values.lat && !values.lng) {
      addToast(MUTATION_STATUS.ERROR, "位置情報を取得できませんでした。");
      return;
    }

    const { fetcher } = postStore();
    fetcher(values).then((res) => {
      switch (res.status) {
        case MUTATION_STATUS.SUCCESS:
          addToast(res.status, res.message);
          onClose();
          reset();
          setMediaUrls([]);
          break;
        case MUTATION_STATUS.ERROR:
          addToast(res.status, res.message);
          break;
        case MUTATION_STATUS.VALIDATION:
          setErrors(res.fieldErrors);
          break;
      }
    });
  };

  const onUpload = (file: File) => {
    const { fetcher } = mediaStore();
    return fetcher({ media: file }).then((res) => {
      switch (res.status) {
        case MUTATION_STATUS.SUCCESS:
          const value = getValues("mediaIds") || [];
          setValue("mediaIds", [...value, res.mediaId]);
          setMediaUrls([...mediaUrls, res.mediaUrl]);
          break;
        case MUTATION_STATUS.ERROR:
          addToast(res.status, res.message);
          break;
        case MUTATION_STATUS.VALIDATION:
          setErrors(res.fieldErrors);
          break;
      }
    });
  };

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} zIndex={60}>
      <form className="relative bg-base rounded-t-base py-xl px-lg outline-2 outline-accent">
        <button
          className={cn(
            "absolute bottom-full mb-md bg-base py-md w-[120px] rounded-base border-2 border-accent hover:border-accent-hover",
            sidebarPos === "left" ? "left-md" : "right-md",
          )}
          type="button"
          onClick={handleSubmit(onSubmit)}
        >
          投稿する
        </button>
        <TextareaInput
          id="content"
          label="投稿"
          placeholder="呼応しよう。"
          {...register("content")}
        />
        <MultiMediaInput
          id="mediaIds"
          size={120}
          urls={mediaUrls}
          onChange={{
            upload: async (file) => onUpload(file),
            remove: (url) => {
              setValue(
                "mediaIds",
                getValues("mediaIds").filter(
                  (_, index) => mediaUrls[index] !== url,
                ),
              );
              setMediaUrls(mediaUrls.filter((u) => u !== url));
            },
          }}
        />
      </form>
    </Drawer>
  );
}
