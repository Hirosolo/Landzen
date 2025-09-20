"use client";
import MarketplaceHeader from "@/app/components/marketplace/header";
import NavBar from "@/app/components/marketplace/navBar";
import PropertyList from "@/app/components/marketplace/propertyList";
import Paging from "@/app/components/marketplace/paging";
import { useState } from "react";
import PropertyInfoContent from "@/app/components/propertyInfo/PropertyInfoContent";
import SearchBar from "../components/marketplace/searchBar";
import FilterSidebar from "../components/marketplace/filterSidebar";


type Property = {
  propertyID?: number | string;
  propertyName?: string;
  description?: string;
  propertyAddress?: string;
  googleMapUrl?: string;
  images?: string;
};

export default function Marketplace() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const closeModal = () => setSelectedProperty(null);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const [walletConnected, setConnected] = useState(false);
  const [favourited, setFavourited] = useState("all");

  return (
    <div>
      <MarketplaceHeader />
      {/*welcome message */}
      <section className="bg-[url('/image-marketplaceBackground.png')] bg-cover bg-center text-white py-30">
        <div className="max-w-4xl mx-auto text-center px-4  rounded-2xl p-6">
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
        <button
          onClick={() => setFavourited("all")}
          className={`ml-5 font-bold pt-4 pb-2 mb-2 py-2 w-12 ${
            favourited === "all" ? "text-green-600 border-b-4" : "text-black"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFavourited("favourite")}
          className={`font-bold pt-4 pb-2 mb-2 ml-5 py-2 ${
            favourited === "favourite"
              ? "text-green-600 border-b-4"
              : "text-black"
          }`}
        >
          Favourite
        </button>
      </div>

      {/* search and filter */}
      <SearchBar onFilterToggle={toggleFilter} isFilterOpen={isFilterOpen} />

      {/* main content with sidebar + list */}
      <div className="flex">
        {isFilterOpen && (
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        )}
        <div className="flex-1">
          {favourited === "favourite" && !walletConnected ? (
            <div className="p-6 text-center text-red-600 font-semibold">
              <div>You need to connect to wallet first</div>
              <button className="mt-10 ml-5 bg-moss-700 hover:bg-moss-800 rounded rounded-3xl px-4 py-3 text-beige-100">
                Connect Wallet
              </button>
            </div>
          ) : (
            <PropertyList onBuy={setSelectedProperty} />
          )}
        </div>
      </div>

      {/*paging */}
      <Paging />

      {/* PropertyInfo modal overlay */}
      {selectedProperty !== null && (
        <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            <div className="p-4">
              <PropertyInfoContent property={selectedProperty} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
