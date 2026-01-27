"use client";

import { Icon } from "@/components/icon/icon";
import { MUTATION_STATUS } from "@/constants";
import { postIndex, postLike, userShow } from "@/lib/api";
import { useMeStore, useSidebarStore } from "@/stores";
import { addToast } from "@/utils";
import { Drawer } from "@kateform/components";
import { cn } from "@kateform/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

const DEFAULT_LIMIT = 20;

export default function () {
  const router = useRouter();
  const pathname = usePathname();
  const { me } = useMeStore();
  const [userId, setId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) setId(Number(id));
  }, [pathname]);

  const handlePostLike = (postId: number) => {
    const { fetcher } = postLike(postId);
    fetcher().then((res) => {
      switch (res.status) {
        case MUTATION_STATUS.SUCCESS:
          addToast("success", res.message);
          break;
        case MUTATION_STATUS.ERROR:
          addToast("error", res.message);
          break;
      }
    });
  };

  const { key: userShowKey, fetcher: userShowFetcher } = userShow(userId!);
  const { data: userShowData } = useSWR(
    userId ? userShowKey : null,
    userShowFetcher,
  );
  const {
    data: postIndexData,
    // size,
    // setSize,
    // isLoading,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.data?.length) return null;
      return ["posts", userId, pageIndex];
    },
    async ([_, userId, pageIndex]) => {
      const { fetcher } = postIndex({
        limit: DEFAULT_LIMIT,
        offset: pageIndex * DEFAULT_LIMIT,
        userId,
      });
      const response = await fetcher();
      return response.data;
    },
  );

  const user = userShowData?.data;
  const posts = postIndexData ? postIndexData.flatMap((page) => page) : [];

  if (!user) return null;

  // postsの全データを平坦化
  const allPosts = posts?.flatMap((page) => page) || [];

  return (
    <Drawer
      isOpen={pathname === "/profile"}
      placement="right"
      onClose={() => router.push("/")}
    >
      <div className="bg-base h-screen max-h-screen overflow-y-auto">
        <div className="relative">
          <Image
            className="w-screen h-[100vw]"
            src={user.iconUrl ?? "/test.PNG"}
            alt="avatar"
            width={200}
            height={200}
          />
          <div className="absolute top-0 w-full h-[100vw] bg-radial-[circle_at_50%_50%] from-transparent via-transparent to-(--color-bg-base)" />
          <div className="absolute top-0 w-full h-[100vw] bg-linear-to-b from-transparent to-(--color-bg-base)" />
        </div>

        <div className="relative -mt-[50vw] z-20 px-xl">
          <div className="flex justify-between">
            <p className="sticky top-xl text-[24px] font-bold">{user.name}</p>
            <p className="text-md">
              総いいね数: <span className="text-lg">{user.likesCount}</span>
            </p>
          </div>
          <p className="h-[160px] whitespace-pre overflow-hidden line-clamp-5">
            {user.bio}
          </p>
          {allPosts.map((post) => (
            <div
              className="border-b border-[color-mix(in_srgb,var(--color-bg-base),var(--color-text-base))] p-lg"
              key={post.id}
            >
              <div className="grid grid-cols-2 rounded-base overflow-hidden">
                {post.media.map((media, index) => {
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
              <p className="pt-md">{post.content}</p>
              <button
                className={cn(
                  "bg-main w-fit min-w-[120px] flex items-center justify-center gap-md cursor-pointer mx-auto mr-xl py-sm rounded-base mt-md",
                  me?.likedPostIds.includes(post.id) && "bg-like",
                )}
                onClick={() => {
                  if (me?.likedPostIds.includes(post.id)) {
                    return;
                  }
                  handlePostLike(post.id);
                }}
              >
                <Icon name="heart" />
                <span className="text-lg font-bold">{post.likesCount}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}
