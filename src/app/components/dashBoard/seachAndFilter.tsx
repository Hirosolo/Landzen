"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchFilterBar() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name-asc");

  return (
    <div className="w-full  rounded-xl shadow p-4 flex items-center gap-4 mb-6">
      {/* Show filters button */}
      <button className="h-10 w-40 border border-gray-300 rounded-lg px-4 text-sm bg-gray-50 hover:bg-gray-100 text-green">
        Show filters
      </button>

      {/* Search box */}
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-green bg-white" />
        <input
          type="text"
          placeholder="Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      {/* Sort dropdown */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="h-10 w-48 border border-gray-300 rounded-lg px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-green"
      >
        <option value="name-asc">Sort by name (A-Z)</option>
        <option value="name-desc">Sort by name (Z-A)</option>
        <option value="value-asc">Property Value (Low → High)</option>
        <option value="value-desc">Property Value (High → Low)</option>
      </select>
    </div>
  );
}
