import React from "react";
import { motion } from "motion/react";

export default function GlowingDivider() {
  return (
    <motion.div
      className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ repeat: Infinity, duration: 2 }}
    />
  );
}
