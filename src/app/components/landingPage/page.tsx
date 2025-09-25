"use client";

import { useState, useRef, useEffect } from "react";
import PropertyCard from "../invesment/propertyCard";

export default function LandingPageNavBars() {
  const tabs = ["Projects", "About Us", "Guide", "FAQ", "Sponsor"];
  const [activeTab, setActiveTab] = useState("Projects");
  const [highlightStyle, setHighlightStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const tabToId = (tab: string) =>
    tab
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

  const idToTab = (id: string) => {
    switch (id) {
      case "projects":
        return "Projects";
      case "about-us":
        return "About Us";
      case "guide":
        return "Guide";
      case "faq":
        return "FAQ";
      case "sponsor":
        return "Sponsor";
      default:
        return "Projects";
    }
  };

  // Update highlight position on tab change
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeButton = container.querySelector<HTMLButtonElement>(
      `button[data-tab="${activeTab}"]`
    );

    if (activeButton) {
      const { offsetLeft, offsetWidth } = activeButton;
      setHighlightStyle({
        left: offsetLeft,
        width: offsetWidth,
        opacity: 1,
      });
    }
  }, [activeTab]);

  // Keep highlight aligned on resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      const activeButton = container.querySelector<HTMLButtonElement>(
        `button[data-tab="${activeTab}"]`
      );
      if (activeButton) {
        const { offsetLeft, offsetWidth } = activeButton;
        setHighlightStyle((prev) => ({ ...prev, left: offsetLeft, width: offsetWidth }));
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  // Scroll spy: observe sections and update active tab
  useEffect(() => {
    const sectionIds = tabs.map(tabToId);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry closest to viewport center
        const viewportCenter = window.innerHeight / 2;
        let best: IntersectionObserverEntry | null = null;
        let bestDistance = Number.POSITIVE_INFINITY;
        for (const entry of entries) {
          const rect = (entry.target as HTMLElement).getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const distance = Math.abs(sectionCenter - viewportCenter);
          if (distance < bestDistance) {
            best = entry;
            bestDistance = distance;
          }
        }
        if (best?.target?.id) {
          const nextTab = idToTab(best.target.id);
          if (nextTab && nextTab !== activeTab) setActiveTab(nextTab);
        }
      },
      {
        // Focus around the center of the screen
        root: null,
        rootMargin: "-50% 0px -50% 0px",
        threshold: [0, 0.01, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    observerRef.current = observer;
    // Fallback: lightweight scroll handler
    const onScroll = () => {
      const centerY = window.scrollY + window.innerHeight / 2;
      let closestId: string | null = null;
      let closestDist = Number.POSITIVE_INFINITY;
      for (const sec of sections) {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const mid = top + height / 2;
        const dist = Math.abs(mid - centerY);
        if (dist < closestDist) {
          closestDist = dist;
          closestId = sec.id;
        }
      }
      if (closestId) {
        const nextTab = idToTab(closestId);
        if (nextTab && nextTab !== activeTab) setActiveTab(nextTab);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [tabs]);

  return (
    <div className="w-full flex justify-center px-4 mt-5 top-5 z-50 h-17">
        <div
          ref={containerRef}
          className="relative bg-white shadow shadow-md shadow-gray-400 rounded-full px-1 py-0.5 flex space-x-1 text-black items-center font-function-pro overflow-x-auto scrollbar-hide md:overflow-x-visible w-full md:w-auto max-w-[300px] md:max-w-none pointer-events-auto "
        >
        {tabs.map((tab) => (
          <button
            key={tab}
            data-tab={tab}
            onClick={(e) => {
              e.preventDefault();
              const id = tabToId(tab);
              const el = document.getElementById(id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveTab(tab);
                // Optionally update URL hash without jumping
                history.replaceState(null, "", `#${id}`);
              }
            }}
            className={`cursor-pointer relative z-10 px-1 md:px-8 py-3 rounded-2xl transition-colors duration-300 flex items-center space-x-2 font-function-pro whitespace-nowrap flex-shrink-0 font-semibold ${
              activeTab === tab
                ? "text-white"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <span className="font-function-pro text-sm md:text-base">
              {tab}
            </span>
          </button>
        ))}

        {/* Highlight pill */}
        <li
          className="absolute z-0 h-12 list-none rounded-3xl bg-green transition-all duration-300 ease-in-out"
          style={highlightStyle as React.CSSProperties}
        ></li>
      </div>
    </div>
  );
}
