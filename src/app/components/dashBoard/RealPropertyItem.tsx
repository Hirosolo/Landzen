"use client";

import { motion } from "framer-motion";
import { useRealPropertyData } from "./useRealPropertyData";
import DashBoardPropertyCard from "./dashBoardPropertyCard";
import type { PropertyData } from "@/lib/hooks";

interface RealPropertyItemProps {
  propertyAddress: string;
  userAddress: string;
  selectedForListing: Record<string, boolean>;
  onToggleSelect: (id: string) => void;
  onSelect: (id: string) => void;
}

// Helper: convert real data to PropertyData format expected by the card
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPropertyData(p: Record<string, any>): PropertyData {
  const usdt = (amount: number) => BigInt(Math.round(amount * 1_000_000));
  return {
    id: p.id,
    contractAddress: p.contractAddress,
    propertyOwner: "0x0000000000000000000000000000000000000000",
    propertyName: p.name,
    propertySymbol: "LAND",
    totalValue: usdt(p.value).toString(),
    totalShares: BigInt(p.totalSupply).toString(),
    availableShares: BigInt(p.remainingToMint).toString(),
    remainingShares: BigInt(p.remainingToMint).toString(),
    soldShares: BigInt(p.totalSupply - p.remainingToMint).toString(),
    yieldPerBlock: BigInt(0).toString(),
    yieldReserve: BigInt(0).toString(),
    propertyType: BigInt(1).toString(),
    propertyTypeName: p.type,
    isActive: p.status !== "Expired",
    createdAt: BigInt(Date.now()).toString(),
    sharePrice: usdt(p.value).toString(),
    soldPercentage: ((p.totalSupply - p.remainingToMint) / p.totalSupply) * 100,
    availabilityPercentage: (p.remainingToMint / p.totalSupply) * 100,
    apy: 7.2,
  };
}

export default function RealPropertyItem({
  propertyAddress,
  userAddress,
  selectedForListing,
  onToggleSelect,
  onSelect,
}: RealPropertyItemProps) {
  const { data: propertyData } = useRealPropertyData({
    propertyAddress,
    userAddress,
  });

  // Don't render if user doesn't own any NFTs for this property
  if (!propertyData) {
    return null;
  }

  const mapped = toPropertyData(propertyData);
  const listed = propertyData.listed === "true";
  const statusOverride =
    propertyData.status === "Expired" ? "Expired" : ("Active" as const);

  return (
    <motion.div
      key={propertyData.id}
      layoutId={`dashboard-property-${propertyData.id}`}
      onClick={() => onSelect(propertyAddress)}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
    >
      <DashBoardPropertyCard
        property={mapped}
        propertyName={propertyData.name}
        isListed={listed}
        buyPrice={mapped.sharePrice}
        statusOverride={statusOverride}
        selected={!!selectedForListing[propertyAddress]}
        onToggleSelect={(id) => {
          onToggleSelect(propertyAddress);
        }}
      />
    </motion.div>
  );
}
