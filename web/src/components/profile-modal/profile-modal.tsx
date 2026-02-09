import { userUpdate, UserUpdateRequest } from "@/lib/api";
import { mediaStore } from "@/lib/api/media-store";
import { MUTATION_STATUS } from "@/constants";
import { useMeStore } from "@/stores";
import { addToast } from "@/utils";
import { Icon } from "@/components/icon/icon";
import { Modal, TextareaInput, TextInput } from "@kateform/components";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    bio: string | null;
    iconUrl: string | null;
  };
}

export function ProfileModal({ isOpen, onClose, user }: Props) {
  const { me, setMe } = useMeStore();
  const [previewUrl, setPreviewUrl] = useState(user.iconUrl);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { dirtyFields },
  } = useForm<UserUpdateRequest>({
    defaultValues: {
      name: user.name,
      bio: user.bio || "",
    },
  });

  const [isUploading, setIsUploading] = useState(false);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);

    const { fetcher } = mediaStore();
    fetcher({ media: file })
      .then((res) => {
        switch (res.status) {
          case MUTATION_STATUS.SUCCESS:
            setValue("iconId", res.mediaId);
            setPreviewUrl(res.mediaUrl);
            break;
          case MUTATION_STATUS.ERROR:
            addToast("error", res.message);
            setPreviewUrl(user.iconUrl);
            break;
          case MUTATION_STATUS.VALIDATION:
            addToast("error", res.fieldErrors.media);
            setPreviewUrl(user.iconUrl);
            break;
        }
      })
      .finally(() => {
        URL.revokeObjectURL(localUrl);
        setIsUploading(false);
      });
  };

  const onSubmit = (data: UserUpdateRequest) => {
    const patch: Partial<UserUpdateRequest> = Object.fromEntries(
      Object.keys(dirtyFields).map((key) => [
        key,
        data[key as keyof UserUpdateRequest],
      ]),
    );

    const iconId = getValues("iconId");
    if (iconId !== undefined) {
      patch.iconId = iconId;
    }

    if (!me) return;

    const { fetcher } = userUpdate();
    fetcher(patch as UserUpdateRequest).then((res) => {
      switch (res.status) {
        case MUTATION_STATUS.SUCCESS:
          setMe({
            ...me,
            ...(patch.name !== undefined && { name: patch.name as string }),
            ...(patch.bio !== undefined && { bio: patch.bio as string }),
            ...(previewUrl !== user.iconUrl && { iconUrl: previewUrl }),
          });
          addToast("success", res.message);
          onClose();
          break;
        case MUTATION_STATUS.ERROR:
          addToast("error", res.message);
          break;
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} zIndex={50}>
      <form
        className="bg-base w-[calc(100vw-var(--spacing-xl))] p-xl rounded-base flex flex-col items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="hidden"
          id="iconUrl"
          type="file"
          accept="image/*"
          onChange={onUpload}
        />
        <label
          htmlFor="iconUrl"
          className="block relative w-[200px] h-[200px] rounded-full overflow-hidden"
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              fill
              alt="Profile"
              className="object-cover"
            />
          ) : (
            <Image
              src="/default-avatar.png"
              fill
              alt="Default Profile"
              className="object-cover"
            />
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Icon name="spinner" size={40} />
            </div>
          )}
        </label>

        <div className="w-full">
          <TextInput id="name" label="名前" {...register("name")} />
          <TextareaInput id="bio" label="自己紹介" {...register("bio")} />
        </div>

        <button
          className="to-accent from-black py-md rounded-base w-1/2 bg-linear-to-br"
          type="submit"
        >
          更新
        </button>
      </form>
    </Modal>
  );
}
