"use client";

import { KateFormProvider, ToastProvider } from "@kateform/components";
import { ThemeProvider } from "next-themes";
import { Icon } from "../icon/icon";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/main-layout/use-sidebar";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { cn } from "@kateform/utils";
import { usePathname, useRouter } from "next/navigation";
import { Toast, ToastType } from "../toast/toast";
import { useDmUnreadStore, useMeStore, useWnStore } from "@/stores";
import { useEffect, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { authMe, AuthMeResponse } from "@/lib/api";
import { wnIsRain } from "@/lib/api/wn-israin";
import { useDetailStore } from "@/stores/use-detail-store";
import { PostDrawer } from "../post-drawer/post-drawer";
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { MediaModal } from "../media-modal/meida-modal";
import { addToast } from "@/utils";
import { dmUnread } from "@/lib/api/dm-unread";

interface Props {
  children: React.ReactNode;
}

export function MainLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarRef, isShow, sidebarVariants } = useSidebar();
  const { me, setMe } = useMeStore();
  const { sidebarPos, toggleSidebar } = useSidebarStore();
  const { pushDetail, initDetail } = useDetailStore();
  const wn = useWnStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isAlt, setIsAlt] = useState(false);
  const [isStart, setIsStart] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!wn.isRain) {
      setIsAlt(false);
      return;
    }

    const id = setInterval(() => {
      setIsAlt((prev) => !prev);
    }, 2000);

    return () => clearInterval(id);
  }, [wn.isRain]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStart(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    initDetail(router.push, pathname);
  }, []);

  useEffect(() => {
    const messages = [
      "雨の日”だけ”前の投稿が覗ける。",
      "秘密の投稿は晴れてから広がる。",
      "雨の日は秘密の投稿をしませんか？",
    ];
    const index = Math.floor(Math.random() * messages.length);
    setMessage(messages[index]);
  }, []);

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

  const { totalUnreadCount, setUnreadCounts } = useDmUnreadStore();

  useEffect(() => {
    if (isLoading) return;
    setMe(data ?? null);
  }, [data, isLoading, setMe]);

  useEffect(() => {
    if (!me) return;
    const fetch = () => {
      const { fetcher } = dmUnread();
      fetcher().then((res) => setUnreadCounts(res.data));
    };
    fetch();
    const id = setInterval(fetch, 60000);
    return () => clearInterval(id);
  }, [me?.id]);

  useEffect(() => {
    if (!me) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      wn.setLocation(lat, lng);
      const { fetcher } = wnIsRain();
      fetcher({ lat, lng }).then((res) => {
        wn.setIsRain(res.data.isRain);

        if (res.data.isRain) {
          addToast("success", "雨の日です。こっそり秘密の投稿しませんか？");
        }
        if (res.data.isPosted) {
          addToast("success", "雨の日の投稿が公開されました、どうなるかな");
        }
      });
    });
  }, [me?.id]);

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
        <ToastProvider<ToastType>
          component={Toast}
          placement="top-center"
          zIndex={100}
        />

        <main>{children}</main>

        <AnimatePresence>
          {(isStart || me === undefined) && (
            <motion.div
              className="fixed inset-0 z-60 bg-base bg-gradient flex flex-col gap-md items-center justify-center"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src="/logo-dark.png"
                alt="logo"
                width={160}
                height={62.11}
              />

              <AnimatePresence mode="wait">
                {message && (
                  <motion.p
                    key={message}
                    className="text-sm font-bold text-white"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

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
                  <button
                    onClick={() => {
                      if (!me) {
                        router.push("/login");
                        return;
                      }
                      if (pathname !== "/dm") {
                        router.push("/dm");
                      }
                    }}
                    className="relative"
                  >
                    {totalUnreadCount > 0 && (
                      <div className="absolute top-0 right-0 bg-like rounded-full w-[20px] h-[20px] flex items-center justify-center text-[12px]">
                        {totalUnreadCount}
                      </div>
                    )}
                    <Icon name="message" />
                  </button>
                  <motion.button
                    onClick={() => {
                      if (!me) {
                        router.push("/login");
                        return;
                      }
                      setIsOpen(true);
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {wn.isRain ? (
                        <motion.div
                          key={isAlt ? "rain" : "post"}
                          className="text-accent"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isAlt ? <Icon name="rain" /> : <Icon name="post" />}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="post-default"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon name="post" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <button
                    className="absolute bg-main/70 aspect-square rounded-base top-full mt-sm overflow-hidden"
                    onClick={() => {
                      if (!me) {
                        router.push("/login");
                        return;
                      }
                      pushDetail("/profile", me.id);
                    }}
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
                <Icon name="reverse" />
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
