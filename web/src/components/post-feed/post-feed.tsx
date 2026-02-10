"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { RefObject, useRef } from "react";
import { PostCard } from "../post-card/post-card";

interface Post {
  id: number;
  content: string;
  media: {
    id: number;
    label: string;
    url: string;
  }[];
  likesCount: number;
  isPublic: boolean;
  isMe?: boolean;
}

interface Props {
  posts: Post[];
  containerRef?: RefObject<HTMLElement | null>;
  spacer?: boolean;
}

function ReelItem({
  children,
  containerRef,
}: {
  children: React.ReactNode;
  containerRef?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
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

export function PostFeed({ posts, containerRef, spacer = true }: Props) {
  return (
    <div className="flex flex-col gap-lg">
      {spacer && <div className="h-[30vh]" />}
      {posts.map((post) => (
        <ReelItem key={post.id} containerRef={containerRef}>
          <PostCard {...post} />
        </ReelItem>
      ))}
      {spacer && <div className="h-[30vh]" />}
    </div>
  );
}
