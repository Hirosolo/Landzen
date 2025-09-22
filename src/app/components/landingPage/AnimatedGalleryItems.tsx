"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";

type Props = {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>; // ✅ allow null
};

export default function AnimatedGalleryItem({ children, containerRef }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const scaleRaw = useMotionValue(0.85);
  const opacityRaw = useMotionValue(0.6);

  const scale = useSpring(scaleRaw, { stiffness: 170, damping: 26 });
  const opacity = useSpring(opacityRaw, { stiffness: 170, damping: 26 });

  useEffect(() => {
    const el = ref.current;
    const container = containerRef.current;
    if (!el || !container) return;

    let raf = 0;

    const update = () => {
      if (!container || !el) return;
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      const containerCenter = containerRect.left + containerRect.width / 2;
      const elCenter = elRect.left + elRect.width / 2;

      const distance = Math.abs(elCenter - containerCenter);
      const maxDistance = containerRect.width / 2 + elRect.width;
      const t = Math.min(distance / maxDistance, 1);

      const newScale = 1 - 0.15 * t;
      const newOpacity = 1 - 0.5 * t;

      scaleRaw.set(newScale);
      opacityRaw.set(newOpacity);
    };

    const onScrollOrResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();

    container.addEventListener("scroll", onScrollOrResize, { passive: true });
    const ro = new ResizeObserver(onScrollOrResize);
    ro.observe(container);
    ro.observe(el);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      container.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef, scaleRaw, opacityRaw]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className="flex-shrink-0 snap-center will-change-transform"
    >
      {children}
    </motion.div>
  );
}
