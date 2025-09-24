"use client";

import { useState, useRef, useEffect } from "react";
import PropertyCard from "../invesment/propertyCard";

export default function LandingPageNavBars() {
  const tabs = ["Projects", "About", "Apartments", "How To Start", "FAQs"];
  const [activeTab, setActiveTab] = useState("All Projects");
  const [highlightStyle, setHighlightStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null);

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
            onClick={() => setActiveTab(tab)}
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
