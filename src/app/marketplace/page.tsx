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
    name: "Saigon Pearl Residence",
    totalValue: 150000, // $150k property value
    totalShares: 1250, // Makes each NFT worth $120
    availableShares: 500,
    status: "Active",
    type: "Residential",
    image: "/image-property.png",
    listed: "false",
    apy: 5.2,
  },
  {
    id: 2,
    city: "Ho Chi Minh",
    name: "Empire City Tower",
    totalValue: 180000, // $180k property value
    totalShares: 1500, // Makes each NFT worth $120
    availableShares: 300,
    status: "Active",
    type: "Commercial",
    image: "/image-property.png",
    listed: "true",
    apy: 6.8,
  },
];

// Map mock to PropertyData for card
function toPropertyData(p: (typeof properties)[number]): PropertyData {
  const usdt = (amount: number) => BigInt(Math.round(amount * 1e18)); // Convert to USDT (18 decimals to match utils)
  const soldShares = p.totalShares - p.availableShares;
  const sharePrice = p.totalValue / p.totalShares; // $120 per NFT
  const soldPercentage = (soldShares / p.totalShares) * 100;
  const availabilityPercentage = (p.availableShares / p.totalShares) * 100;

  return {
    id: p.id,
    contractAddress: "0x0000000000000000000000000000000000000000",
    propertyOwner: "0x0000000000000000000000000000000000000000",
    propertyName: p.name,
    propertySymbol: p.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase(),
    totalValue: usdt(p.totalValue).toString(),
    totalShares: BigInt(p.totalShares).toString(),
    availableShares: BigInt(p.availableShares).toString(),
    remainingShares: BigInt(p.availableShares).toString(),
    soldShares: BigInt(soldShares).toString(),
    yieldPerBlock: BigInt(0).toString(),
    yieldReserve: BigInt(0).toString(),
    propertyType:
      p.type === "Residential" ? BigInt(1).toString() : BigInt(2).toString(),
    propertyTypeName: p.type,
    isActive: p.status !== "Expired",
    createdAt: BigInt(Date.now()).toString(),
    sharePrice: usdt(sharePrice).toString(),
    soldPercentage: Math.round(soldPercentage),
    availabilityPercentage: Math.round(availabilityPercentage),
    apy: p.apy,
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
