import React from "react";
import { motion } from "motion/react";

export default function FloatingGlassCard({
  title = "Glass Card",
  description = "A floating translucent card with subtle animation.",
  w = 300,
  h = 180
}) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      style={{
        width: w,
        height: h,
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      className="rounded-2xl p-5 shadow-xl flex flex-col justify-between"
    >
      <h3 className="text-white text-lg font-semibold">{title}</h3>
      <p className="text-sm text-white/70">{description}</p>
      <motion.div
        className="self-end text-white/70 text-xs"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        ✦
      </motion.div>
    </motion.div>
  );
}
