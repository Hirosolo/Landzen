"use client";
import { useState } from "react";

type FilterSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterOptions = [
    "Galxe Score Holders",
    "Galxe Passport Holders", 
    "Galxe Plus Subscribers",
    "X Engagement",
    "Discord Voice Channel",
    "Discord Engagement",
    "Telegram Engagement",
    "Quiz Engagement",
    "Snapshot Voter",
    "Github Contributor",
    "On-chain Activity",
    "Lenster Engagement",
    "Worldcoin Verification"
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white shadow-xl p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Filter Content */}
      <div className="flex flex-col overflow-y-auto pb-6" style={{ maxHeight: '368px' }}>
        {filterOptions.map((option, index) => (
          <div 
            key={index}
            className="flex items-center gap-3 cursor-pointer mb-5 last:mb-0"
            onClick={() => toggleFilter(option)}
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={selectedFilters.includes(option)}
              className={`peer h-[22px] w-[22px] shrink-0 rounded-[4px] transition-all duration-300 text-white ${
                selectedFilters.includes(option) 
                  ? 'bg-green-500' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {selectedFilters.includes(option) && (
                <svg 
                  className="w-3 h-3 text-white mx-auto" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
            </button>
            <div className="flex-1 truncate text-gray-700">
              {option}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => setSelectedFilters([])}
          className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
