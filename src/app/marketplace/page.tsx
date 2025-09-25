"use client";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import MarketplaceHeader from "@/app/components/investment/header";
import SearchBar from "../components/investment/searchBar";
import FilterSidebar from "../components/investment/filterSidebar";
import DashBoardPropertyCard from "../components/dashBoard/dashBoardPropertyCard";
import { PropertyData } from "@/lib/hooks";

// Mock data (replace with API later)
const properties = [
  {
    id: 1,
    city: "Ho Chi Minh",
    name: "Vinhomes Grand Park",
    value: 1000,
    status: "Expired",
    type: "Residential Home",
    image: "/image-property.png",
    listed: "false",
  },
  {
    id: 2,
    city: "Ho Chi Minh",
    name: "Empire City",
    value: 2000,
    status: "Active",
    type: "Residential Home",
    image: "/image-property.png",
    listed: "true",
  },
];

// Map mock to PropertyData for card
function toPropertyData(p: (typeof properties)[number]): PropertyData {
  const usdt = (amount: number) => BigInt(Math.round(amount * 1_000_000));
  return {
    id: p.id,
    contractAddress: "0x0000000000000000000000000000000000000000",
    propertyOwner: "0x0000000000000000000000000000000000000000",
    propertyName: p.name,
    propertySymbol: "LAND",
    totalValue: usdt(p.value).toString(),
    totalShares: BigInt(1).toString(),
    availableShares: BigInt(1).toString(),
    remainingShares: BigInt(1).toString(),
    soldShares: BigInt(0).toString(),
    yieldPerBlock: BigInt(0).toString(),
    yieldReserve: BigInt(0).toString(),
    propertyType: BigInt(1).toString(),
    propertyTypeName: p.type,
    isActive: p.status !== "Expired",
    createdAt: BigInt(Date.now()).toString(),
    sharePrice: usdt(p.value).toString(),
    soldPercentage: 0,
    availabilityPercentage: 100,
    apy: 0,
  };
}

export default function Marketplace() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedForListing, setSelectedForListing] = useState<
    Record<number, boolean>
  >({});

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const filteredProperties = properties; // later: add filters/search here

  return (
    <LayoutGroup>
      <div>
        <MarketplaceHeader />

        {/* Hero section */}
        <section className="bg-[url('/image-marketplaceBackground.png')] bg-cover bg-center text-white py-30">
          <div className="max-w-4xl mx-auto text-center px-4 rounded-2xl p-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              Invest in Tokenized Real Estate
            </h1>
            <p className="mt-4 text-sm md:text-base font-medium">
              Invest in fractional ownership of premium real estate globally
              with full transparency on blockchain
            </p>
          </div>
        </section>

        {/* search + filter */}
        <SearchBar onFilterToggle={toggleFilter} isFilterOpen={isFilterOpen} />

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 px-4">
          {filteredProperties.map((p) => {
            const mapped = toPropertyData(p);
            const listed = p.listed === "true";
            const statusOverride =
              p.status === "Expired" ? "Expired" : ("Active" as const);
            return (
              <motion.div
                key={p.id}
                layoutId={`dashboard-property-${p.id}`}
                onClick={() => setSelectedId(p.id)}
              >
                <DashBoardPropertyCard
                  property={mapped}
                  propertyName={p.name}
                  isListed={listed}
                  buyPrice={mapped.sharePrice}
                  statusOverride={statusOverride}
                  selected={!!selectedForListing[p.id]}
                  onToggleSelect={(id) => {
                    setSelectedForListing((prev) => ({
                      ...prev,
                      [Number(id)]: !prev[Number(id)],
                    }));
                  }}
                  onListForSale={() => console.log("list for sale", p.id)}
                  onBuy={() => console.log("buy", p.id)}
                  onRedeem={() => console.log("redeem", p.id)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </LayoutGroup>
  );
}
