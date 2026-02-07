"use client";

import { PostFeed } from "@/components/post-feed/post-feed";
import { postIndex } from "@/lib/api";
import useSWRInfinite from "swr/infinite";

const DEFAULT_LIMIT = 20;

export default function () {
  const { infiniteKey, fetcher } = postIndex();
  const { data } = useSWRInfinite(
    infiniteKey(null),
    async ([_, _userId, pageIndex]) => {
      const response = await fetcher({
        limit: DEFAULT_LIMIT,
        offset: pageIndex * DEFAULT_LIMIT,
        userId: null,
      });
      return response.data;
    },
  );

  const posts = data ? data.flatMap((page) => page) : [];

  return (
    <div className="px-xl">
      <PostFeed posts={posts} />
    </div>
  );
}
