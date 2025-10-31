import React from "react";
import { motion } from "motion/react";

export default function ReflectiveGlassButton({ label = "CodeMint" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      className="relative px-6 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white font-medium shadow-lg overflow-hidden"
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}
