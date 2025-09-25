"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import DashBoardPropertyInfo from "./dashBoardPropertyInfo";
import DashBoardPropertyCard from "./dashBoardPropertyCard";
import type { PropertyData } from "@/lib/hooks";
import { FiSearch } from "react-icons/fi";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

// Mock data
const properties = [
  {
    id: 1,
    city: "Ho Chi Minh",
    name: "Vinhomes Grand Park",
    value: 1000,
    earnings: 1000,
    amount: 1,
    profit: 1000,
    status: "Expired",
    endDate: "01/01/2025",
    type: "Residential Home",
    image: "/image-property.png",
    listed: "false",
    floor: 0.0222,
    traitFloor: 0.0248,
  },
  {
    id: 2,
    city: "Ho Chi Minh",
    name: "Vinhomes Grand Park",
    value: 1000,
    earnings: 1000,
    amount: 1,
    profit: 1000,
    status: "Expired",
    endDate: "01/01/2025",
    type: "Residential Home",
    image: "/image-property.png",
    listed: "true",
    floor: 0.0848,
    traitFloor: 8.9,
  },
  {
    id: 3,
    city: "Ho Chi Minh",
    name: "Vinhomes Grand Park",
    value: 1000,
    earnings: 1000,
    amount: 1,
    profit: 1000,
    status: "Active",
    endDate: "01/01/2025",
    type: "Residential Home",
    image: "/image-property.png",
    listed: "false",
    floor: 0.0848,
    traitFloor: 8.9,
  },
  {
    id: 4,
    city: "Ho Chi Minh",
    name: "Vinhomes Grand Park",
    value: 1000,
    earnings: 1000,
    amount: 1,
    profit: 1000,
    status: "Active",
    endDate: "01/01/2025",
    type: "Residential Home",
    image: "/image-property.png",
    listed: "true",
    floor: 0.0848,
    traitFloor: 8.9,
  },
];

// Helper: map local mock to PropertyData minimal shape for the card
function toPropertyData(p: (typeof properties)[number]): PropertyData {
  const usdt = (amount: number) => BigInt(Math.round(amount * 1_000_000));
  return {
    id: p.id,
    contractAddress: "0x0000000000000000000000000000000000000000",
    propertyOwner: "0x0000000000000000000000000000000000000000",
    totalValue: usdt(p.value),
    totalShares: BigInt(1),
    availableShares: BigInt(1),
    remainingShares: BigInt(1),
    soldShares: BigInt(0),
    yieldPerBlock: BigInt(0),
    yieldReserve: BigInt(0),
    propertyType: BigInt(1),
    propertyTypeName: p.type,
    isActive: p.status !== "Expired",
    createdAt: BigInt(Date.now()),
    sharePrice: usdt(p.value),
    soldPercentage: 0,
    availabilityPercentage: 100,
    apy: 0,
  };
}

export default function MyPositionSection() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showListingDrawer, setShowListingDrawer] = useState(false);
  const [selectedForListing, setSelectedForListing] = useState<
    Record<number, boolean>
  >({});

  // Filter + Sort
  const filteredProperties = properties
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      if (sort === "value-asc") return a.value - b.value;
      if (sort === "value-desc") return b.value - a.value;
      return 0;
    });

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

          {/* Sort dropdown */}
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
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredProperties.map((p) => {
            const mapped: PropertyData = toPropertyData(p);
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
      </section>

      {/* Property Info Modal */}
      <AnimatePresence>
        {selectedId !== null && (
          <motion.div
            className="fixed inset-0 bg-gray-500/30 backdrop-blur-xs flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto relative"
              layoutId={`dashboard-property-${selectedId}`}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
              <div className="p-4">
                {(() => {
                  const source = filteredProperties.find(
                    (p) => p.id === selectedId
                  );
                  const mapped = source ? toPropertyData(source) : undefined;
                  return (
                    <DashBoardPropertyInfo
                      propertyId={selectedId}
                      propertyData={mapped}
                    />
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md px-6 py-3 flex items-center gap-3 z-40">
        {/* List Items button */}
        <button
          onClick={() => setShowListingDrawer(true)}
          disabled={
            Object.values(selectedForListing).filter(Boolean).length === 0
          }
          className={`px-4 py-2 rounded-md font-semibold ${
            Object.values(selectedForListing).filter(Boolean).length === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-400 text-white hover:bg-blue-500"
          }`}
        >
          {Object.values(selectedForListing).filter(Boolean).length > 0
            ? `${
                Object.values(selectedForListing).filter(Boolean).length
              } List Item${
                Object.values(selectedForListing).filter(Boolean).length > 1
                  ? "s"
                  : ""
              }`
            : "List Items"}
        </button>

        {/* Cancel Listings button */}
        <button
          onClick={() => setSelectedForListing({})} // 🔹 Clear all selections
          disabled={
            !filteredProperties.some(
              (p) => selectedForListing[p.id] && p.listed === "true"
            )
          }
          className={`px-4 py-2 rounded-md font-semibold ${
            !filteredProperties.some(
              (p) => selectedForListing[p.id] && p.listed === "true"
            )
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          Cancel listings
        </button>

        {/* Accept Offers button (still disabled for now) */}
        <button
          disabled
          className="bg-gray-100 text-gray-400 px-4 py-2 rounded-md font-semibold cursor-not-allowed"
        >
          Accept offers
        </button>
      </div>

      {/* Bottom Drawer with Backdrop */}
      <AnimatePresence>
        {showListingDrawer && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dark backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowListingDrawer(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative bg-white shadow-lg border-t border-gray-200 w-screen rounded-t-xl"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-bold">Create listings</h2>
                <button
                  onClick={() => setShowListingDrawer(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Table - selected items */}
              <div className="px-6 py-4 overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Table header */}
                  <div className="grid grid-cols-6 gap-4 text-base font-semibold text-moss-700 border-b pb-2 mb-3">
                    <div className="col-span-2">Item</div>
                    <div>Collection floor</div>
                    <div>Top offer</div>
                    <div>Last sale</div>
                    <div className="text-right">Listed as</div>
                  </div>

                  {/* Table rows - only selected */}
                  {filteredProperties
                    .filter((p) => selectedForListing[p.id])
                    .map((p) => (
                      <div
                        key={p.id}
                        className="grid grid-cols-6 gap-4 items-center text-base text-moss-700 border-b py-3"
                      >
                        {/* Item */}
                        <div className="col-span-2 flex items-center gap-3">
                          <Image
                            src={p.image}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="rounded-md"
                          />
                          <span className="font-semibold">{p.name}</span>
                        </div>
                        <div className="font-semibold">
                          ${p.value.toLocaleString()}
                        </div>
                        <div>-</div>
                        <div>-</div>
                        <div className="flex items-center justify-end">
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <input
                              type="number"
                              defaultValue={1}
                              className="w-16 px-2 py-1 outline-none"
                            />
                            <span className="px-3 py-1 bg-gray-100">USDT</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Totals */}
              <div className="px-6 py-6 space-y-4 text-lg text-moss-700 border-t bg-beige-100">
                <div className="flex justify-between">
                  <span>Platform fee</span>
                  <span className="font-semibold">$100</span>
                </div>
                <div className="flex justify-between">
                  <span>Total est. proceeds</span>
                  <span className="font-semibold">$100</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end items-center gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
                <select className="border rounded-md px-3 py-2">
                  <option>6 months</option>
                  <option>3 months</option>
                  <option>1 month</option>
                </select>
                <button className="bg-blue-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-600">
                  Review listings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
