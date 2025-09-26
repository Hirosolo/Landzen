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

interface RawPropertyData {
  id: string | number;
  contractAddress?: string;
  propertyOwner?: string;
  name?: string;
  propertyName?: string;
  propertySymbol?: string;
  apy?: number;
  value?: number;
  totalAmount?: number;
  totalSupply?: number;
  remainingToMint?: number;
  yieldPerBlock?: string;
  yieldReserve?: string;
  propertyType?: string;
  type?: string;
  propertyTypeName?: string;
  status?: string;
  createdAt?: string;
  floor?: number;
  pricePerShare?: number;
  listed?: string;
}

// Helper: convert real data to PropertyData format expected by the card
function toPropertyData(
  p: RawPropertyData,
  tokenIndex: number
): PropertyData {
  // Convert to USDT wei format (18 decimals) for consistency with other components
  const toUSDTWei = (amount: number) => BigInt(Math.round(amount * 1e18));

  return {
    id: (typeof p.id === "string" ? parseInt(p.id) : p.id) + tokenIndex, // Unique ID for each NFT
    contractAddress: p.contractAddress || "", // Use real contract address
    propertyOwner: p.propertyOwner || "",
    propertyName: p.name || p.propertyName || "",
    propertySymbol: p.propertySymbol || "",
    apy: p.apy || 0,
    totalValue: toUSDTWei(p.value || p.totalAmount || 0).toString(), // Real property value in wei
    totalShares: BigInt(p.totalSupply || 0).toString(),
    availableShares: BigInt(p.remainingToMint || 0).toString(),
    remainingShares: BigInt(p.remainingToMint || 0).toString(),
    soldShares: BigInt(
      (p.totalSupply || 0) - (p.remainingToMint || 0)
    ).toString(),
    yieldPerBlock: p.yieldPerBlock || "0",
    yieldReserve: p.yieldReserve || "0",
    propertyType: p.propertyType || "",
    propertyTypeName: p.type || p.propertyTypeName || "",
    isActive: p.status !== "Expired",
    createdAt: p.createdAt || "",
    sharePrice: toUSDTWei(p.floor || p.pricePerShare || 0).toString(),
    soldPercentage: p.totalSupply
      ? (((p.totalSupply || 0) - (p.remainingToMint || 0)) /
          (p.totalSupply || 1)) *
        100
      : 0,
    availabilityPercentage: p.totalSupply
      ? ((p.remainingToMint || 0) / (p.totalSupply || 1)) * 100
      : 100,
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
        onToggleSelect={() => {
          onToggleSelect(uniqueId);
        }}
      />
    </motion.div>
  );
}
