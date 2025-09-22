"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { ChevronDown } from "lucide-react";
import Image from "next/image";


// Mock data
const properties = [
  {
    id: 1,
    city: "Ho Chi Minh",
    title: "VINHOMES GRAND PARK",
    value: 1000,
    earnings: 1000,
    amount: 1,
    profit: 1000,
    status: "Active",
    endDate: "01/01/2025",
    type: "Residential Home",
    image: "/image-property.png", // Put your image in public folder
  },
  {
    id: 2,
    city: "Ho Chi Minh",
    title: "VINHOMES GRAND PARK",
    value: 1000,
    earnings: 1000,
    amount: 1,
    profit: 1000,
    status: "Active",
    endDate: "01/01/2025",
    type: "Residential Home",
    image: "/image-property.png",
  },
  {
    id: 3,
    city: "Ho Chi Minh",
    title: "VINHOMES GRAND PARK",
    value: 1000,
    earnings: 1000,
    amount: 1,
    profit: 1000,
    status: "Active",
    endDate: "01/01/2025",
    type: "Residential Home",
    image: "/image-property.png",
  },
];

// Property Card
function PropertyCard({ property }: { property: (typeof properties)[0] }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      {/* Image */}
      <div className="relative">
        <Image
          src={property.image}
          alt={property.title}
          width={800}
          height={320}
          className="w-full h-56 object-cover"
        />
        
      </div>

      {/* Info */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 
                 .896-2 2 .896 2 2 2zM12 22s8-4.5 8-11c0-4.418-3.582-8-8-8S4 
                 6.582 4 11c0 6.5 8 11 8 11z"
            />
          </svg>
          {property.city}
        </div>

        {/* Title + Badge */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>
          <span className="bg-moss-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
            {property.type}
          </span>
        </div>

        {/* Stats Grid to match design (3 columns x 2 rows) */}
        <div className="grid grid-cols-3 gap-6 text-sm text-gray-700">
          <div>
            <p className="text-gray-600">Property Value</p>
            <p className="font-bold text-black">${property.value}</p>
          </div>
          <div>
            <p className="text-gray-600">Monthly Earnings</p>
            <p className="font-bold text-black">${property.earnings}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-bold text-green-600">{property.status}</p>
          </div>
          <div>
            <p className="text-gray-600">Amount</p>
            <p className="font-bold text-black">{property.amount}</p>
          </div>
          <div>
            <p className="text-gray-600">Cumulative profit</p>
            <p className="font-bold text-black">${property.profit}</p>
          </div>
          <div>
            <p className="text-gray-600">End date</p>
            <p className="font-bold text-black">{property.endDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Section
export default function MyPositionSection() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name-asc");

  // Filter + Sort
  const filteredProperties = properties
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "name-asc") return a.title.localeCompare(b.title);
      if (sort === "name-desc") return b.title.localeCompare(a.title);
      if (sort === "value-asc") return a.value - b.value;
      if (sort === "value-desc") return b.value - a.value;
      return 0;
    });

  return (
    <section className="bg-green p-6 md:p-8">
      {/* Title */}
      <h1 className="text-white text-2xl md:text-[28px] font-extrabold tracking-wide mb-6">MY POSITION</h1>

      {/* Filter + Search row */}
      <div className="w-full flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 mb-6">
        {/* Show filters */}
        <button className="h-[48px] w-full md:w-[280px] bg-white text-left px-4 rounded-[10px] border border-transparent hover:border-white/80 text-sm font-medium text-green">
          Show filters
        </button>

        {/* Search box */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[48px] pl-10 pr-4 rounded-[10px] border border-transparent bg-white/90 text-[15px] focus:outline-none text-green"
          />
        </div>

        {/* Sort dropdown (styled like input with chevron) */}
        <div className="relative w-full md:w-[300px]">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none w-full h-[48px] rounded-[10px] bg-white/90 border border-transparent pl-4 pr-10 text-[15px] focus:outline-none text-green"
          >
            <option value="name-asc">Sort by name (A-Z)</option>
            <option value="name-desc">Sort by name (Z-A)</option>
            <option value="value-asc">Property Value (Low → High)</option>
            <option value="value-desc">Property Value (High → Low)</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
