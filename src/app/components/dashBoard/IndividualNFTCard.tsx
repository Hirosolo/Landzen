"use client";

import { motion } from "framer-motion";
import { useRealPropertyData } from "./useRealPropertyData";
import DashBoardPropertyCard from "./dashBoardPropertyCard";
import type { PropertyData } from "@/lib/hooks";

interface IndividualNFTCardProps {
  propertyAddress: string;
  userAddress: string;
  tokenIndex: number; // Which NFT token (0, 1, 2, etc.)
  selectedForListing: Record<string, boolean>;
  onToggleSelect: (id: string) => void;
  onSelect: (id: string) => void;
}

// Helper: convert real data to PropertyData format expected by the card
function toPropertyData(p: any, tokenIndex: number): PropertyData {
  // Convert to USDT wei format (18 decimals) for consistency with other components
  const toUSDTWei = (amount: number) => BigInt(Math.round(amount * 1e18));

  return {
    id: p.id + tokenIndex, // Unique ID for each NFT
    contractAddress: p.contractAddress,
    propertyOwner: "0x0000000000000000000000000000000000000000",
    propertyName: p.name,
    propertySymbol: "LAND",
    totalValue: toUSDTWei(p.value).toString(), // Real property value in wei
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
    sharePrice: toUSDTWei(p.floor).toString(),
    soldPercentage: ((p.totalSupply - p.remainingToMint) / p.totalSupply) * 100,
    availabilityPercentage: (p.remainingToMint / p.totalSupply) * 100,
    apy: p.apy || 7.2, // Real APY from contract calculation
  };
}

export default function IndividualNFTCard({
  propertyAddress,
  userAddress,
  tokenIndex,
  selectedForListing,
  onToggleSelect,
  onSelect,
}: IndividualNFTCardProps) {
  const { data: propertyData } = useRealPropertyData({
    propertyAddress,
    userAddress,
  });

  // Don't render if user doesn't own any NFTs for this property
  if (!propertyData) {
    return null;
  }

  const mapped = toPropertyData(propertyData, tokenIndex);
  const listed = propertyData.listed === "true";
  const statusOverride =
    propertyData.status === "Expired" ? "Expired" : ("Active" as const);

  const uniqueId = `${propertyAddress}-${tokenIndex}`;

  return (
    <motion.div
      key={uniqueId}
      layoutId={`dashboard-nft-${uniqueId}`}
      onClick={() => onSelect(uniqueId)}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
    >
      <DashBoardPropertyCard
        property={mapped}
        propertyName={`${propertyData.name} #${tokenIndex + 1}`} // Add token number
        isListed={listed}
        buyPrice={BigInt(mapped.sharePrice)}
        statusOverride={statusOverride}
        selected={!!selectedForListing[uniqueId]}
        onToggleSelect={(id) => {
          onToggleSelect(uniqueId);
        }}
      />
    </motion.div>
  );
}
