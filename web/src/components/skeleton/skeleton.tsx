import { motion } from "framer-motion";

export function Skeleton({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden bg-[gray]/20 rounded ${className}`}
    >
      <motion.div
        className="
          absolute inset-0
          bg-linear-to-r
          from-transparent
          via-white/60
          to-transparent
        "
        style={{
          transform: "translateX(-100%) rotate(20deg)",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.4,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </div>
  );
}
