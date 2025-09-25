"use client";
 
import { motion } from "framer-motion";
 
export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-beige-100 z-50">
      <motion.div
        className="w-20 h-20 border-4 border-green rounded-full"
        animate={{
          rotate: 360,
          borderTopColor: "#2B342B",
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}