import { motion } from "framer-motion";

export function MediaSpinnerIcon() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </motion.svg>
  );
}
