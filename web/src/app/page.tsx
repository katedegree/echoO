"use client";

import { PostCard } from "@/components/post-card/post-card";
import { postIndex } from "@/lib/api";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import useSWRInfinite from "swr/infinite";

const DEFAULT_LIMIT = 20;

function ReelItem({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1],
    [0.7, 0.8, 0.92, 1.05, 0.92, 0.8, 0.7],              
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1],
    [60, 40, 15, 0, -15, -40, -60],
  );

  return (
    <motion.div ref={ref} style={{ scale, y }}>
      {children}
    </motion.div>
  );
}

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
    <div className="px-xl flex flex-col gap-lg">
      {posts.map((post) => (
        <ReelItem key={post.id}>
          <PostCard {...post} />
        </ReelItem>
      ))}
    </div>
  );
}
