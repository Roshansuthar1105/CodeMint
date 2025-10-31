import React from "react";
import { motion } from "motion/react";

export default function SwirlHoverImage({
  src = "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=580",
  alt = "Abstract Art",
}) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className="w-64 h-64 rounded-xl object-cover shadow-lg"
      whileHover={{ rotate: [0, 5, -5, 0], scale: 1.05 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
  );
}
