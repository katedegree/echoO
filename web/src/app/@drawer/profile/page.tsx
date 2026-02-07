"use client";

import { Icon } from "@/components/icon/icon";
import { PostCard } from "@/components/post-card/post-card";
import { postIndex, postLike, userShow } from "@/lib/api";
import { Drawer } from "@kateform/components";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

const DEFAULT_LIMIT = 20;

export default function () {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) setId(Number(id));
  }, [pathname]);

  const { key: userShowKey, fetcher: userShowFetcher } = userShow(userId!);
  const { data: userShowData } = useSWR(
    userId ? userShowKey : null,
    userShowFetcher,
  );
  const { infiniteKey, fetcher: postIndexFetcher } = postIndex();
  const {
    data: postIndexData,
    // size,
    // setSize,
    // isLoading,
  } = useSWRInfinite(infiniteKey(userId), async ([_, _userId, pageIndex]) => {
    const response = await postIndexFetcher({
      limit: DEFAULT_LIMIT,
      offset: pageIndex * DEFAULT_LIMIT,
      userId,
    });
    return response.data;
  });

  const user = userShowData?.data;
  const posts = postIndexData ? postIndexData.flatMap((page) => page) : [];

  if (!user) return null;

  // postsの全データを平坦化
  const allPosts = posts?.flatMap((page) => page) || [];

  return (
    <>
      {pathname === "/profile" && (
        <div className="fixed top-xl right-xl z-50 cursor-pointer">
          <Icon name="setting" size={36} />
        </div>
      )}
      <Drawer
        isOpen={pathname === "/profile"}
        placement="right"
        onClose={() => router.push("/")}
        zIndex={30}
      >
        <div className="bg-base h-screen max-h-screen overflow-y-auto bg-gradient">
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
              <p className="text-[24px] font-bold">{user.name}</p>
              <p className="text-md">
                総いいね数: <span className="text-lg">{user.likesCount}</span>
              </p>
            </div>
            <p className="h-[160px] whitespace-pre overflow-hidden line-clamp-5">
              {user.bio}
            </p>
            <div className="pb-xl">
              {allPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
