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

interface Props {
  children: React.ReactNode;
}

export function MainLayout({ children }: Props) {
  const router = useRouter();
  const { sidebarRef, isShow } = useSidebar();
  const { sidebarPos, toggleSidebar } = useSidebarStore();

  const sidebarVariants = (side: "left" | "right") => ({
    hidden: {
      opacity: 0,
      x: side === "left" ? -50 : 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      } as const,
    },
    exit: {
      opacity: 0,
      x: side === "left" ? -40 : 40,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      } as const,
    },
  });

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
                  "fixed top-1/2 w-fit h-fit text-base bg-base",
                  sidebarPos === "left"
                    ? "left-0 pl-sm rounded-r-base"
                    : "right-0 pr-sm rounded-l-base",
                )}
                variants={sidebarVariants(sidebarPos)}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="relative *:cursor-pointer flex flex-col *:p-md gap-md py-md">
                  <button onClick={() => router.push("/")}>
                    <Icon name="home" />
                  </button>
                  <button>
                    <Icon name="message" />
                  </button>
                  <button>
                    <Icon name="post" />
                  </button>

                  <div className="absolute bg-base aspect-square flex items-center justify-center rounded-base top-full mt-sm">
                    <button onClick={() => router.push("/login")}>
                      <Icon name="login" />
                    </button>
                  </div>
                </div>
              </motion.nav>
              <motion.button
                key={`button-${sidebarPos}`}
                className={cn(
                  "fixed top-1/2 bg-base p-md rounded-base",
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
