"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useAccount } from "wagmi";
import { PROPERTY_ADDRESSES } from "@/lib/contracts";
import PropertyNFTs from "./PropertyNFTs";
import { FiSearch } from "react-icons/fi";
import { ChevronDown } from "lucide-react";

export default function MyPositionSection() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedForListing, setSelectedForListing] = useState<
    Record<string, boolean>
  >({});

  // Get connected wallet address
  const { address: userAddress } = useAccount();

  // If wallet not connected, show connect message
  if (!userAddress) {
    return (
      <section className="bg-green p-6 md:p-8 min-h-screen">
        <h1 className="text-white text-2xl md:text-[28px] font-extrabold tracking-wide mb-6">
          MY POSITION
        </h1>
        <div className="bg-white rounded-[12px] p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-500">
            Connect your wallet to view your NFT portfolio
          </p>
        </div>
      </section>
    );
  }

  return (
    <LayoutGroup>
      <section className="bg-green p-6 md:p-8 min-h-screen">
        {/* Title */}
        <h1 className="text-white text-2xl md:text-[28px] font-extrabold tracking-wide mb-6">
          MY POSITION
        </h1>

        {/* Filter + Search row */}
        <div className="w-full flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 mb-6">
          <button className="h-[48px] w-full md:w-[280px] bg-white text-left px-4 rounded-[10px] border border-transparent hover:border-white/80 text-sm font-medium text-green">
            Show filters
          </button>

          {/* Search box */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search your properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-gray-200 focus:border-white focus:ring-2 focus:ring-white/20 text-sm"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select className="h-[48px] w-full md:w-[180px] bg-white text-left px-4 pr-8 rounded-[10px] border border-transparent hover:border-white/80 text-sm font-medium text-green appearance-none cursor-pointer">
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="value-asc">Value Low-High</option>
              <option value="value-desc">Value High-Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          </div>
        </div>

        {/* Cards Grid */}
        <motion.div
          className="grid gap-6 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {PROPERTY_ADDRESSES.map((propertyAddress) => (
            <PropertyNFTs
              key={propertyAddress}
              propertyAddress={propertyAddress}
              userAddress={userAddress}
              selectedForListing={selectedForListing}
              onToggleSelect={(id: string) => {
                setSelectedForListing((prev) => ({
                  ...prev,
                  [id]: !prev[id],
                }));
              }}
              onSelect={(id: string) => setSelectedId(id)}
            />
          ))}
        </motion.div>
      </section>
    </LayoutGroup>
  );
}
