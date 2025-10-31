import React from "react";
import { motion } from "motion/react";

export default function NeonPulseButton({ children = "Click Me", onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative px-6 py-3 rounded-lg font-semibold text-white uppercase tracking-wider"
      style={{
        background: "linear-gradient(90deg,#06b6d4,#7c3aed)",
        boxShadow: "0 0 12px rgba(124,58,237,0.6), 0 0 30px rgba(6,182,212,0.25)"
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      animate={{ boxShadow: ["0 0 10px rgba(124,58,237,0.6)", "0 0 30px rgba(6,182,212,0.6)"] }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.6 }}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute inset-0 rounded-lg"
        style={{
          mixBlendMode: "screen",
          opacity: 0.18
        }}
      />
    </motion.button>
  );
}
