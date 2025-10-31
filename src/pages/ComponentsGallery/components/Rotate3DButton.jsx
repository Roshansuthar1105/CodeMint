import React from "react";
import { motion } from "motion/react";

export default function Rotate3DButton({ label = "Spin Me" }) {
  return (
    <motion.button
      whileHover={{ rotateY: 180 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 rounded-xl text-white font-semibold perspective-1000"
      style={{ transformStyle: "preserve-3d" }}
    >
      {label}
    </motion.button>
  );
}
