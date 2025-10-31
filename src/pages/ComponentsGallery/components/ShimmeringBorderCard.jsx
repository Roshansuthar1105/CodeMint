import React from "react";
import { motion } from "motion/react";

export default function ShimmeringBorderCard({
  title = "Code Mint",
  description = "A glowing animated border card.",
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 220, damping: 15 }}
      className="relative w-80 p-6 rounded-2xl overflow-hidden bg-[#0a0a0a] text-white"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          background: [
            "conic-gradient(from 0deg, #06b6d4, #7c3aed, #06b6d4)",
            "conic-gradient(from 360deg, #06b6d4, #7c3aed, #06b6d4)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
          padding: 2,
        }}
      />
      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
}
