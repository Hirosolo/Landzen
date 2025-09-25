"use client";

import { useRef, useEffect, useState } from "react";
import { useGetAllProperties, PropertyData } from "@/lib/hooks";
import LandingPagePropertyCard from "./landingPagePropertyCard";
import AnimatedGalleryItem from "../landingPage/AnimatedGalleryItems";


type PropertyListProps = {
  onBuy?: (property: PropertyData) => void; // update type
};



export default function LandingPagePropertyList({ onBuy }: PropertyListProps) {
  const { data: properties, isLoading, error } = useGetAllProperties();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // For momentum
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const momentumId = useRef<number | null>(null);

  // --- Drag scroll with velocity tracking ---
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsDown(true);
      setStartX(e.pageX - el.offsetLeft);
      setScrollLeft(el.scrollLeft);

      // cancel any ongoing momentum
      if (momentumId.current) cancelAnimationFrame(momentumId.current);
      velocityRef.current = 0;
      lastXRef.current = e.pageX;
      lastTimeRef.current = Date.now();
    };

    const handleMouseLeave = () => setIsDown(false);

    const handleMouseUp = () => {
      setIsDown(false);

      // Start momentum after release
      const momentum = () => {
        if (!el) return;
        el.scrollLeft -= velocityRef.current;
        velocityRef.current *= 0.95; // friction

        if (Math.abs(velocityRef.current) > 0.5) {
          momentumId.current = requestAnimationFrame(momentum);
        }
      };
      momentum();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();

      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.2;
      el.scrollLeft = scrollLeft - walk;

      // measure velocity
      const now = Date.now();
      const dx = e.pageX - lastXRef.current;
      const dt = now - lastTimeRef.current;
      if (dt > 0) {
        velocityRef.current = dx / dt * 15; // multiplier for momentum strength
      }
      lastXRef.current = e.pageX;
      lastTimeRef.current = now;
    };

    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mouseup", handleMouseUp);
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("dragstart", (e) => e.preventDefault());

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("dragstart", (e) => e.preventDefault());
    };
  }, [isDown, startX, scrollLeft]);

  // --- Infinite loop setup ---
  const loopedProperties = properties ? [...properties, ...properties, ...properties] : [];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !properties?.length) return;

    const singleWidth = el.scrollWidth / 3; // since we repeated 3 times
    const checkLoop = () => {
      if (el.scrollLeft <= 0) {
        el.scrollLeft = singleWidth;
      } else if (el.scrollLeft >= singleWidth * 2) {
        el.scrollLeft = singleWidth;
      }
    };

    el.addEventListener("scroll", checkLoop);
    el.scrollLeft = singleWidth; // start centered

    return () => {
      el.removeEventListener("scroll", checkLoop);
    };
  }, [properties]);

  // --- Loading/Error states ---
  if (isLoading) {
    return (
      <div className="pt-4 w-full flex justify-center">
        <p className="text-gray-500">Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-4 w-full flex justify-center">
        <p className="text-red-600">Error loading properties</p>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="pt-4 w-full flex justify-center">
        <p className="text-gray-600">No active properties found</p>
      </div>
    );
  }

  return (
    <div className="pt-4 w-full">
      <div
        ref={scrollRef}
        className="relative flex items-center space-x-6 overflow-x-scroll scrollbar-hide px-8 py-8 cursor-grab active:cursor-grabbing select-none"
        style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
      >
        {loopedProperties.map((property, idx) => (
          <AnimatedGalleryItem key={`${property.id}-${idx}`} containerRef={scrollRef}>
            <LandingPagePropertyCard property={property} onBuy={onBuy} />
          </AnimatedGalleryItem>
        ))}
      </div>
    </div>
  );
}
