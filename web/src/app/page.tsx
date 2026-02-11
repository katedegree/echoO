"use client";

import { PostFeed } from "@/components/post-feed/post-feed";
import { postIndex } from "@/lib/api";
import useSWRInfinite from "swr/infinite";

const DEFAULT_LIMIT = 20;

export default function () {
  const { infiniteKey, fetcher } = postIndex();
  const { data, isLoading } = useSWRInfinite(
    infiniteKey(null),
    async ([_, _userId, _lat, cursor]) => {
      return await fetcher({
        limit: DEFAULT_LIMIT,
        cursor,
        userId: null,
        lat: null,
        lng: null,
      });
    },
    { refreshInterval: 15000 },
  );

  const posts = data ? data.flatMap((page) => page.data) : [];
  return (
    <div className="px-xl">
      <PostFeed posts={posts} isLoading={isLoading} />
    </div>
  );
}
