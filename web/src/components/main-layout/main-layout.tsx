"use client";

import { KateFormProvider, ToastProvider } from "@kateform/components";
import { ThemeProvider } from "next-themes";
import { Icon } from "../icon/icon";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/main-layout/use-sidebar";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { cn } from "@kateform/utils";
import { useRouter } from "next/navigation";
import { Toast, ToastType } from "../toast/toast";
import { useMeStore } from "@/stores";
import { useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import { authMe, AuthMeResponse } from "@/lib/api";

interface Props {
  children: React.ReactNode;
}

export function MainLayout({ children }: Props) {
  const router = useRouter();
  const { sidebarRef, isShow, sidebarVariants } = useSidebar();
  const { me, setMe } = useMeStore();
  const { sidebarPos, toggleSidebar } = useSidebarStore();

  const { key, fetcher } = authMe();
  const { data } = useSWR<AuthMeResponse | null>(
    key,
    () => fetcher().then(({ data }) => data),
    {
      onError: (err) => {
        console.warn(err);
      },
      fallbackData: null,
    },
  );

  useEffect(() => {
    if (data !== undefined) {
      setMe(data);
    }
  }, [data, setMe]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <KateFormProvider
        color={{
          light: {
            text: {
              error: "var(--color-error)",
            },
          },
          dark: {
            text: {
              error: "var(--color-error)",
            },
          },
        }}
      >
        <ToastProvider<ToastType> component={Toast} placement="top-center" />
        <main>{children}</main>

        <AnimatePresence mode="wait">
          {isShow && (
            <div ref={sidebarRef} className="relative">
              <motion.nav
                key={`nav-${sidebarPos}`}
                className={cn(
                  "fixed top-1/2 w-fit h-fit text-base bg-main z-50",
                  sidebarPos === "left"
                    ? "left-0 pl-sm rounded-r-base"
                    : "right-0 pr-sm rounded-l-base",
                )}
                variants={sidebarVariants(sidebarPos)}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="relative *:cursor-pointer flex flex-col gap-md py-md *:w-[44px] *:h-[44px] *:flex *:items-center *:justify-center">
                  <button onClick={() => router.push("/")}>
                    <Icon name="home" />
                  </button>
                  <button>
                    <Icon name="message" />
                  </button>
                  <button onClick={() => router.push("/post")}>
                    <Icon name="post" />
                  </button>

                  <button
                    className="absolute bg-main aspect-square rounded-base top-full mt-sm overflow-hidden"
                    onClick={() =>
                      router.push(me ? `/profile?id=${me.id}` : "/login")
                    }
                  >
                    {me ? (
                      <Image
                        className="w-full h-full"
                        src={me.iconUrl || "/default-avatar.png"}
                        alt="icon"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <Icon name="login" />
                    )}
                  </button>
                </div>
              </motion.nav>
              <motion.button
                key={`button-${sidebarPos}`}
                className={cn(
                  "fixed top-1/2 bg-main p-md rounded-base z-50",
                  sidebarPos === "left" ? "mr-sm right-0" : "ml-sm left-0",
                )}
                onClick={() => toggleSidebar()}
                variants={sidebarVariants(
                  sidebarPos === "left" ? "right" : "left",
                )}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {sidebarPos === "left" ? (
                  <Icon name="right" />
                ) : (
                  <Icon name="left" />
                )}
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </KateFormProvider>
    </ThemeProvider>
  );
}
