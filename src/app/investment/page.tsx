"use client";
import MarketplaceHeader from "@/app/components/investment/header";
import PropertyList from "@/app/components/investment/propertyList";
import Paging from "@/app/components/investment/paging";
import { useState } from "react";
import PropertyInfoContent from "@/app/components/propertyInfo/PropertyInfoContent";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import SearchBar from "../components/investment/searchBar";
import FilterSidebar from "../components/investment/filterSidebar";
import { PropertyData } from "@/lib/hooks";

export default function Marketplace() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(
    null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedProperty(null);
      setIsClosing(false);
    }, 250);
  };
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const [walletConnected, setConnected] = useState(false);

  const handleBuy = (property: PropertyData) => {
    setSelectedProperty(property);
  };

  return (
    <LayoutGroup>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <MarketplaceHeader />

        {/*welcome message */}
        <section className="bg-[url('/image-marketplaceBackground.png')] bg-cover bg-center text-white py-30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center px-4 rounded-2xl p-6"
          >
            <h1 className="text-2xl md:text-3xl font-bold">
              Blockchain Real Estate Investment
            </h1>
            <p className="mt-4 text-sm md:text-base font-medium">
              Invest in tokenized real estate properties directly from the
              blockchain. All data fetched live from Base Sepolia network.
            </p>
          </motion.div>
        </section>

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
            <PropertyList onBuy={handleBuy} />
          </div>
        </div>

        {/*paging */}
        <Paging />

        {/* PropertyInfo modal overlay with shared layout animation */}
        <AnimatePresence>
          {(selectedProperty !== null || isClosing) && (
            <motion.div
              className="fixed inset-0 bg-gray-500/30 backdrop-blur-xs flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
                <div className="p-4">
                  {selectedProperty !== null && (
                    <PropertyInfoContent property={selectedProperty} />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
