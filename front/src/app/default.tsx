"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// NOTE: loginでリロードすると閲覧可能
export default function () {
  return (
    <div className="h-[50vh] flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          y: ["-25%", "0%", "-25%", "0%", "-25%", "0%"],
          opacity: [0, 1],
        }}
        transition={{
          duration: 2,
          ease: [
            [0.8, 0, 1, 1],
            [0, 0, 0.2, 1],
            [0.8, 0, 1, 1],
            [0, 0, 0.2, 1],
            [0.8, 0, 1, 1],
          ],
        }}
      >
        <Image src="/logo-big-dark.png" alt="logo" width={240} height={240} />
      </motion.div>
    </div>
  );
}
