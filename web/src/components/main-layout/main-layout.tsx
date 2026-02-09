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
import { useEffect, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { authMe, AuthMeResponse } from "@/lib/api";
import { isRain } from "@/lib/api/israin";
import { PostDrawer } from "../post-drawer/post-drawer";
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { MediaModal } from "../media-modal/meida-modal";

interface Props {
  children: React.ReactNode;
}

export function MainLayout({ children }: Props) {
  const router = useRouter();
  const { sidebarRef, isShow, sidebarVariants } = useSidebar();
  const { me, setMe } = useMeStore();
  const { sidebarPos, toggleSidebar } = useSidebarStore();
  const [isOpen, setIsOpen] = useState(false);

  const { key, fetcher } = authMe();
  const { data, isLoading } = useSWR<AuthMeResponse | null>(
    key,
    () => fetcher().then(({ data }) => data || null),
    {
      onError: () => {
        setMe(null);
      },
    },
  );

  useEffect(() => {
    if (isLoading) return;
    setMe(data ?? null);
  }, [data, isLoading, setMe]);

  useEffect(() => {
    if (!me) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const { fetcher } = isRain();
      fetcher({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, [me]);

  // if (me === undefined) return;

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
        <Header />
        <ToastProvider<ToastType> component={Toast} placement="top-center" />
        <main>{children}</main>

        <AnimatePresence mode="wait">
          {isShow && (
            <div ref={sidebarRef} className="relative">
              <motion.nav
                key={`nav-${sidebarPos}`}
                className={cn(
                  "fixed top-1/2 w-fit h-fit text-base bg-main/70 z-50",
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
                  <button
                    onClick={() => {
                      if (!me) {
                        router.push("/login");
                        return;
                      }
                      setIsOpen(true);
                    }}
                  >
                    <Icon name="post" />
                  </button>

                  <button
                    className="absolute bg-main/70 aspect-square rounded-base top-full mt-sm overflow-hidden"
                    onClick={() =>
                      router.push(me ? `/profile?id=${me.id}` : "/login")
                    }
                  >
                    {me ? (
                      <div className="w-full h-full">
                        <Image
                          className="object-cover"
                          src={me.iconUrl || "/default-avatar.png"}
                          alt="icon"
                          fill
                        />
                      </div>
                    ) : (
                      <Icon name="login" />
                    )}
                  </button>
                </div>
              </motion.nav>
              <motion.button
                key={`button-${sidebarPos}`}
                className={cn(
                  "fixed top-1/2 bg-main/70 p-md rounded-base z-50",
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
        <PostDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <MediaModal />
        <Footer />
      </KateFormProvider>
    </ThemeProvider>
  );
}
