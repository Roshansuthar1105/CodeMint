import React from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

export default function MagneticImageHover({
  src = "https://images.unsplash.com/photo-1549049950-48d5887197a0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928",
  w = 320,
  h = 200,
  radius = 14
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-1, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [-1, 1], [-10, 10]);

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="overflow-hidden"
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        perspective: 1000,
      }}
    >
      <motion.img
        src={src}
        alt="magnetic"
        className="w-full h-full object-cover rounded-xl"
        style={{
          rotateX,
          rotateY,
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
        }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
      />
    </motion.div>
  );
}
