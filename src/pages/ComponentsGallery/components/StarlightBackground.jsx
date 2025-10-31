import React from "react";
import { motion } from "motion/react";

export default function StarlightBackground() {
  const stars = Array.from({ length: 30 });

  return (
    <div className="relative w-full h-64 overflow-hidden bg-black rounded-xl">
      {stars.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          animate={{ y: ["100%", "-10%"], opacity: [0.3, 1, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 3 + Math.random() * 3,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
