"use client";
import MarketplaceHeader from "@/app/components/marketplace/header";
import NavBar from "@/app/components/marketplace/navBar";
import PropertyList from "@/app/components/marketplace/propertyList";
import Paging from "@/app/components/marketplace/paging";
import { useState } from "react";
import PropertyInfoContent from "@/app/components/propertyInfo/PropertyInfoContent";
import SearchBar from "../components/marketplace/searchBar";
import FilterSidebar from "../components/marketplace/filterSidebar";

export default function Marketplace() {
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const closeModal = () => setSelectedId(null);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  return (
    <div>
      <MarketplaceHeader />
      {/*welcome message */}
      <section className="bg-green text-white py-30">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            Marketplace for Tokenized Real Estate
          </h1>

          <p className="mt-4 text-sm md:text-base font-medium">
            Invest in fractional ownership of premium real estate globally with
            full transparency on blockchain
          </p>
        </div>
      </section>

      {/*navigation bar*/}
      <NavBar />

      {/*Favorite filter */}
      <div className="w-full flex border-b border-black border-md">
        <button className="ml-5 text-black font-bold hover:bg-gray-400 px-4 py-2 rounded rounded-md">All</button>
        <button className="text-black font-bold hover:bg-gray-400 px-4 py-2 rounded rounded-md">Favourite</button>
      </div>

{/* search and filter */}
<SearchBar onFilterToggle={toggleFilter} />

{/* main content with sidebar + list */}
<div className="flex">
  {isFilterOpen && (
    <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
  )}
  <div className="flex-1">
    <PropertyList onBuy={setSelectedId} />
  </div>
</div>

      {/*paging */}
      <Paging />

      {/* Filter Sidebar */}
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {/* PropertyInfo modal overlay */}
      {selectedId !== null && (
        <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            <div className="p-4">
              <PropertyInfoContent id={selectedId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
