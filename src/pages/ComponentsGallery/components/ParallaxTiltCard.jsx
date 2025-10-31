import React from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

export default function ParallaxTiltCard({ image, title = "Product", w = 320, h = 420 }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateY = useTransform(mouseX, [-1, 1], [-12, 12]);
  const rotateX = useTransform(mouseY, [-1, 1], [12, -12]);
  const shadowX = useTransform(mouseX, [-1, 1], [-30, 30]);
  const shadowY = useTransform(mouseY, [-1, 1], [-30, 30]);

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseX.set(px * 2 - 1);
    mouseY.set(py * 2 - 1);
  }

  function handleLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      className="rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 p-4"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ width: w, height: h, perspective: 1000 }}
    >
      <motion.div
        className="relative rounded-xl overflow-hidden bg-white/5 border border-white/5"
        style={{
          width: "100%",
          height: "100%",
          rotateX,
          rotateY,
          boxShadow: "0 20px 40px rgba(2,6,23,0.6)"
        }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
      >
        <motion.img
          src={image || "https://plus.unsplash.com/premium_photo-1670537994863-5ad53a3214e0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870"}
          alt={title}
          className="w-full h-3/4 object-cover"
          style={{ translateZ: 60 }}
        />
        <div className="p-4">
          <h3 className="text-white font-semibold">{title}</h3>
          <p className="text-sm text-white/80 mt-1">A parallax-tilt card with depth and motion.</p>
        </div>
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.25))",
            transform: "translateZ(40px)"
          }}
        />
      </motion.div>
    </motion.div>
  );
}
