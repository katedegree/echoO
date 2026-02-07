"use client";

import { Icon } from "@/components/icon/icon";
import { Drawer, PasswordInput, TextInput } from "@kateform/components";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useError } from "@kateform/hooks";
import { accessToken, addToast } from "@/utils";
import { useForm } from "react-hook-form";
import { MUTATION_STATUS } from "@/constants";
import { useMeStore } from "@/stores";
import {
  authLogin,
  AuthLoginRequest,
  authMe,
  authRegister,
  AuthRegisterRequest,
} from "@/lib/api";
import { mutate } from "swr";
import { MutationResponse } from "@/lib/mutation-response";

export default function () {
  const router = useRouter();
  const pathname = usePathname();
  const { register, handleSubmit } = useForm<AuthRegisterRequest>();
  const { setErrors } = useError();
  const { setMe } = useMeStore();
  const [mode, setMode] = useState<"login" | "register" | null>(null);
  const [showTruck, setShowTruck] = useState(true);
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleAuth = async (res: MutationResponse<{ accessToken: string }>) => {
    switch (res.status) {
      case MUTATION_STATUS.SUCCESS:
        accessToken.set(res.accessToken);
        const { key, fetcher } = authMe();

        const result = await mutate(key, fetcher(), { revalidate: true });

        if (result?.data) {
          setMe(result.data);
          addToast("success", res.message);
          router.push("/");
        }
        break;
      case MUTATION_STATUS.ERROR:
        addToast("error", res.message);
        break;
      case MUTATION_STATUS.VALIDATION:
        setErrors(res.fieldErrors);
        break;
    }
  };

  const handleLogin = (values: AuthLoginRequest) => {
    const { fetcher } = authLogin();
    fetcher(values).then(handleAuth);
  };

  const handleRegister = (values: AuthRegisterRequest) => {
    const { fetcher } = authRegister();
    if (values.password !== passwordConfirm) {
      setErrors({ passwordConfirm: "パスワードが一致しません" });
      return;
    }
    fetcher(values).then(handleAuth);
  };

  useEffect(() => {
    if (pathname !== "/login") {
      return;
    }
    const updateModeFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const value = params.get("mode");
      setMode(value === "register" ? "register" : "login");
    };
    updateModeFromURL();
    window.addEventListener("popstate", updateModeFromURL);
    return () => {
      window.removeEventListener("popstate", updateModeFromURL);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/login") return;
    const interval = setInterval(() => {
      setShowTruck((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <Drawer
      isOpen={pathname === "/login"}
      onClose={() => {
        setMode(null);
        router.push("/");
      }}
      placement="bottom"
      zIndex={60}
    >
      <form className="flex flex-col justify-center bg-base rounded-t-base py-xl px-lg outline-2 outline-accent">
        <Image
          className="w-[200px] h-auto mx-auto pb-lg"
          src="/logo-dark.png"
          alt="logo"
          width={200}
          height={200}
        />

        <AnimatePresence mode="wait">
          {mode === "register" ? (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-md"
            >
              <TextInput
                id="name"
                label="名前"
                placeholder="名前"
                startContent={<Icon name="user" />}
                {...register("name")}
              />
              <TextInput
                id="email"
                label="メールアドレス"
                placeholder="メールアドレス"
                startContent={<Icon name="mail" />}
                {...register("email")}
              />
              <PasswordInput
                id="password"
                label="パスワード"
                placeholder="パスワード"
                startContent={<Icon name="password" />}
                {...register("password")}
              />
              <PasswordInput
                id="passwordConfirm"
                label="パスワード(確認)"
                placeholder="パスワード(確認)"
                startContent={<Icon name="password" />}
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-md"
            >
              <TextInput
                id="email"
                label="メールアドレス"
                placeholder="メールアドレス"
                startContent={<Icon name="mail" />}
                {...register("email")}
              />
              <PasswordInput
                id="password"
                label="パスワード"
                placeholder="パスワード"
                startContent={<Icon name="password" />}
                {...register("password")}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-xl flex flex-col items-center gap-md">
          <div className="relative">
            <button
              className="py-md rounded-base border-2 border-accent hover:border-accent-hover text-base w-[200px] flex justify-center items-center cursor-pointer"
              onClick={handleSubmit(
                mode === "login" ? handleLogin : handleRegister,
              )}
              type="button"
            >
              <AnimatePresence mode="wait">
                {showTruck ? (
                  <motion.div
                    className="flex gap-sm"
                    key="truck"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p>
                      {mode === "login" ? "新規登録" : "ログイン"}は右から
                    </p>
                    <Icon name="right" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.5 }}
                  >
                    {mode === "login" ? "ログイン" : "新規登録"}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button
              className="absolute top-1/2 left-[calc(100%+(100vw-200px)/4)] -translate-y-1/2 -translate-x-1/2 cursor-pointer"
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                if (mode === "login") {
                  params.set("mode", "register");
                } else {
                  params.delete("mode");
                }
                window.history.replaceState(
                  null,
                  "",
                  `${window.location.pathname}?${params.toString()}`,
                );
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              type="button"
            >
              <Icon size={32} name="refresh" />
            </button>
          </div>
        </div>
      </form>
    </Drawer>
  );
}
