import React from "react";
import { motion } from "motion/react";

export default function PulseRingAvatar({
  src = "https://images.unsplash.com/photo-1740252117070-7aa2955b25f8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=580",
}) {
  return (
    <div className="relative w-24 h-24">
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-cyan-400"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <img
        src={src}
        alt="avatar"
        className="rounded-full w-full h-full object-cover z-10"
      />
    </div>
  );
}
