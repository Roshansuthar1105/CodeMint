import React from "react";
import { motion } from "motion/react";

export default function WaveTextAnimation({ text = "Code Mint ✨" }) {
  return (
    <div className="flex justify-center mt-12 space-x-1 text-3xl font-semibold text-white">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 0 }}
          animate={{ y: [0, -8, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            delay: i * 0.08,
            ease: "easeInOut"
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}
