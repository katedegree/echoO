"use client";

import { Icon } from "@/components/icon/icon";
import { PostFeed } from "@/components/post-feed/post-feed";
import { postIndex, userShow } from "@/lib/api";
import { useMeStore } from "@/stores";
import { Drawer } from "@kateform/components";
import Image from "next/image";
import { useRef, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useScrollLock } from "../use-scroll-lock";
import { ProfileModal } from "@/components/profile-modal/profile-modal";
import { useDetailStore } from "@/stores/use-detail-store";
import { usePathname } from "next/navigation";

const DEFAULT_LIMIT = 20;

export default function () {
  const pathname = usePathname();
  const { me } = useMeStore();
  const { detail, closeDetail } = useDetailStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const isOpen = pathname === "/profile" && detail?.path === "/profile";
  const userId = isOpen ? detail.id : null;
  useScrollLock(isOpen);

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
  } = useSWRInfinite(infiniteKey(userId), async ([_, _userId, cursor]) => {
    return await postIndexFetcher({
      limit: DEFAULT_LIMIT,
      cursor,
      userId,
    });
  });

  const user = userShowData?.data;
  const isMe = me && userId === me.id;
  const name = isMe ? me.name : user?.name;
  const iconUrl = isMe ? me.iconUrl : user?.iconUrl;
  const bio = isMe ? me.bio : user?.bio;
  const posts = postIndexData ? postIndexData.flatMap((page) => page.data) : [];

  if (!user) return null;

  // postsの全データを平坦化
  const allPosts = posts?.flatMap((page) => page) || [];

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => closeDetail()}
        zIndex={50} // 基本は30
      >
        <div
          ref={scrollRef}
          className="relative w-screen bg-base h-screen max-h-screen overflow-y-auto bg-gradient"
        >
          {isMe && (
            <div
              className="absolute top-xl right-xl z-50 cursor-pointer"
              onClick={() => setOpenModal(true)}
            >
              <Icon name="setting" size={36} />
            </div>
          )}
          <div className="absolute inset-x-0 top-0 z-0">
            <div className="relative w-screen h-[100vw]">
              <Image
                className="object-cover"
                src={iconUrl ?? "/default-avatar.png"}
                alt="avatar"
                fill
              />
              <div className="absolute top-0 w-full h-[100vw] bg-radial-[circle_at_50%_50%] from-transparent via-transparent to-(--color-bg-base)" />
              <div className="absolute top-0 w-full h-[100vw] bg-linear-to-b from-transparent to-(--color-bg-base)" />
            </div>
            <div className="relative -mt-[50vw] px-xl">
              <div className="flex justify-between">
                <p className="text-[24px] font-bold">{name}</p>
                <p className="text-md">
                  総いいね数: <span className="text-lg">{user.likesCount}</span>
                </p>
              </div>
              <p className="h-[160px] whitespace-pre-wrap overflow-hidden line-clamp-5">
                {bio}
              </p>
            </div>
          </div>

          {/* 前面: 投稿リスト */}
          <div className="relative z-10 px-xl py-[30vw]">
            <PostFeed posts={allPosts} containerRef={scrollRef} />
          </div>
        </div>
      </Drawer>
      <ProfileModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        user={{ ...user, name: name!, iconUrl: iconUrl ?? null, bio: bio! }}
      />
    </>
  );
}
