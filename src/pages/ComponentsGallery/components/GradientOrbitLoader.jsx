import React from "react";
import { motion } from "motion/react";

export default function GradientOrbitLoader({ size = 80 }) {
  const dots = Array.from({ length: 6 });

  return (
    <div className="flex items-center justify-center h-48">
      <div className="relative" style={{ width: size, height: size }}>
        {dots.map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              background: `conic-gradient(from ${i * 60}deg, #06b6d4, #7c3aed)`,
              transformOrigin: "center -30px"
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2 + i * 0.2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
}
