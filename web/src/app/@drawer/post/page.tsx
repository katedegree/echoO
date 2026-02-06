"use client";

import { useSidebarStore } from "@/stores";
import {
  Drawer,
  MultiMediaInput,
  TextareaInput,
  TextInput,
} from "@kateform/components";
import { cn } from "@kateform/utils";
import { usePathname, useRouter } from "next/navigation";

export default function () {
  const router = useRouter();
  const pathname = usePathname();

  const { sidebarPos } = useSidebarStore();

  return (
    <Drawer
      isOpen={pathname === "/post"}
      placement="bottom"
      onClose={() => router.push("/")}
      zIndex={60}
    >
      <div className="relative bg-base rounded-t-base py-xl px-lg outline-2 outline-accent">
        <button
          className={cn(
            "absolute bottom-full mb-md bg-base py-md w-[120px] rounded-base border-2 border-accent hover:border-accent-hover",
            sidebarPos === "left" ? "left-md" : "right-md",
          )}
        >
          投稿する
        </button>
        <TextareaInput id="content" label="投稿" placeholder="呼応しよう。" />
        <MultiMediaInput id="media" size={80} />
      </div>
    </Drawer>
  );
}
