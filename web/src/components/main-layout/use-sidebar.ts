import { useEffect, useRef, useState } from "react";

const HOLD_MS = 500;

export function useSidebar() {
  const [isShow, setIsShow] = useState(true);
  const [isTouching, setIsTouching] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    let scrollTimer: number | null = null;
    const onScroll = (e: Event) => {
      if (sidebarRef.current?.contains(e.target as Node)) return;
      setIsShow(false);
      if (scrollTimer !== null) {
        window.clearTimeout(scrollTimer);
      }
      scrollTimer = window.setTimeout(() => {
        if (!isTouching) {
          setIsShow(true);
        }
      }, 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
    };
  }, [isTouching]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (sidebarRef.current?.contains(e.target as Node)) return;
      holdTimerRef.current = window.setTimeout(() => {
        setIsTouching(true);
        setIsShow(false);
      }, HOLD_MS);
    };
    const onTouchEnd = () => {
      if (holdTimerRef.current !== null) {
        window.clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      setIsTouching(false);
      setIsShow(true);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      if (
        (e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement) &&
        !sidebarRef.current?.contains(e.target)
      ) {
        setIsShow(false);
      }
    };
    const onFocusOut = () => {
      setIsShow(true);
    };
    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);
    return () => {
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return { isShow, sidebarVariants, sidebarRef };
}
