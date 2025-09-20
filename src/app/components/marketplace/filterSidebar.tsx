"use client";
import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

type FilterSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Category = {
  name: string;
  options: string[];
};

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const categories: Category[] = [
    {
      name: "Location",
      options: [
        "An Giang","Ba Ria - Vung Tau","Bac Lieu","Bac Giang","Bac Kan","Bac Ninh",
        "Ben Tre","Binh Duong","Binh Dinh","Binh Phuoc","Binh Thuan","Ca Mau","Cao Bang",
        "Can Tho","Da Nang","Dak Lak","Dak Nong","Dien Bien","Dong Nai","Dong Thap",
        "Gia Lai","Ha Giang","Ha Nam","Ha Noi","Ha Tinh","Hai Duong","Hai Phong",
        "Hau Giang","Hoa Binh","Ho Chi Minh","Hung Yen","Khanh Hoa","Kien Giang",
        "Kon Tum","Lai Chau","Lam Dong","Lang Son","Lao Cai","Long An","Nam Dinh",
        "Nghe An","Ninh Binh","Ninh Thuan","Phu Tho","Phu Yen","Quang Binh",
        "Quang Nam","Quang Ngai","Quang Ninh","Quang Tri","Soc Trang","Son La",
        "Tay Ninh","Thai Binh","Thai Nguyen","Thanh Hoa","Thua Thien Hue",
        "Tien Giang","Tra Vinh","Tuyen Quang","Vinh Long","Vinh Phuc","Yen Bai",
      ],
    },
    {
      name: "Asset type",
      options: ["Residential home", "Apartment", "Co-living", "Hospitality"],
    },
    {
      name: "Property value",
      options: ["<1 billion VND", "1 billion - <5 billions VND", ">5 billions VND"],
    },
    {
      name: "Earning models",
      options: ["Rental income", "Property growth"],
    },
  ];

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || [];
      return current.includes(option)
        ? { ...prev, [category]: current.filter((o) => o !== option) }
        : { ...prev, [category]: [...current, option] };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-beige-200 shadow-xl p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        <button onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      {/* Categories */}
      {categories.map((cat) => (
        <Collapsible.Root
          key={cat.name}
          open={!!openCategories[cat.name]}
          onOpenChange={() => toggleCategory(cat.name)}
        >
          {/* Category header */}
          <Collapsible.Trigger asChild>
            <div className="flex items-center justify-between py-4 border-t border-gray-300 cursor-pointer">
              <span className="text-gray-900 font-semibold">{cat.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  openCategories[cat.name] ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </Collapsible.Trigger>

          {/* Options (scrollable if too long) */}
          <Collapsible.Content className="pb-4">
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
              {cat.options.map((opt) => (
                <div
                  key={opt}
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleFilter(cat.name, opt)}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={selectedFilters[cat.name]?.includes(opt) || false}
                    className={`h-[22px] w-[22px] shrink-0 rounded-[4px] flex items-center justify-center transition-colors ${
                      selectedFilters[cat.name]?.includes(opt)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {selectedFilters[cat.name]?.includes(opt) && (
                      <svg
                        className="w-3 h-3 text-white"
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
                  <span className="flex-1 truncate text-gray-700">{opt}</span>
                </div>
              ))}
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      ))}

      {/* Footer */}
      <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
        <button
          onClick={() => setSelectedFilters({})}
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
