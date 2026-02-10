import { userUpdate, UserUpdateRequest } from "@/lib/api";
import { mediaStore } from "@/lib/api/media-store";
import { MUTATION_STATUS } from "@/constants";
import { useMeStore } from "@/stores";
import { accessToken, addToast } from "@/utils";
import { Icon } from "@/components/icon/icon";
import { Modal, TextareaInput, TextInput } from "@kateform/components";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useError } from "@kateform/hooks";
import { authDestroy } from "@/lib/api/auth-destroy";
import { authLogout } from "@/lib/api/auth-logout";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { me, setMe } = useMeStore();
  const { setErrors } = useError();
  const [previewUrl, setPreviewUrl] = useState(user.iconUrl);
  const [mode, setMode] = useState<"logout" | "destroy" | null>(null);
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

  const onLogout = () => {
    const { fetcher } = authLogout();
    fetcher().then((res) => {
      if (res.status === MUTATION_STATUS.SUCCESS) {
        accessToken.remove();
        setMe(null);
        onClose();
        addToast("success", res.message);
        router.push("/");
      }
    });
  };

  const onDestroy = () => {
    if (!confirm("本当にアカウントを削除しますか？")) return;
    const { fetcher } = authDestroy();
    fetcher().then((res) => {
      if (res.status === MUTATION_STATUS.SUCCESS) {
        accessToken.remove();
        setMe(null);
        onClose();
        addToast("success", res.message);
        router.push("/");
      }
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
          onClose();
          addToast("success", res.message);
          break;
        case MUTATION_STATUS.ERROR:
          addToast("error", res.message);
          break;
        case MUTATION_STATUS.VALIDATION:
          setErrors(res.fieldErrors);
          break;
      }
    });
  };

  return (
    <>
      {mode === null && (
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

            <div className="w-full flex flex-col gap-xl pb-xl">
              <TextInput id="name" label="名前" {...register("name")} />
              <TextareaInput id="bio" label="自己紹介" {...register("bio")} />
            </div>

            <button
              className="to-accent from-black py-md rounded-base w-1/2 bg-linear-to-br"
              type="submit"
            >
              更新
            </button>

            <div className="flex gap-xl pt-[36px]">
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => setMode("logout")}
              >
                ログアウト
              </button>
              <button
                type="button"
                className="text-error border-b border-error cursor-pointer"
                onClick={() => setMode("destroy")}
              >
                アカウントを削除
              </button>
            </div>
          </form>
        </Modal>
      )}

      <Modal isOpen={mode === "logout"} onClose={() => setMode(null)}>
        <div className="bg-base rounded-base p-xl text-center">
          <p className="mb-xl">ログアウトしますか?</p>

          <div className="grid grid-cols-2 gap-lg w-[300px] h-[44px]">
            <button
              className="bg-main rounded-base"
              onClick={() => setMode(null)}
            >
              キャンセル
            </button>
            <button
              className="border border-error rounded-base"
              onClick={onLogout}
            >
              ログアウト
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={mode === "destroy"} onClose={() => setMode(null)}>
        <div className="bg-base rounded-base p-xl text-center">
          <p className="mb-xl">アカウントを削除しますか?</p>

          <div className="grid grid-cols-2 gap-lg w-[300px] h-[44px]">
            <button
              className="bg-main rounded-base"
              onClick={() => setMode(null)}
            >
              キャンセル
            </button>
            <button
              className="border border-error rounded-base"
              onClick={onDestroy}
            >
              削除
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
