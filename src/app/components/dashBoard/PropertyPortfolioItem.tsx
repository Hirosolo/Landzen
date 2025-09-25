"use client";

import { motion } from "framer-motion";
import {
  usePropertyBalance,
  usePropertyName,
  usePropertySymbol,
  useGetTokenStats,
} from "@/lib/hooks";
import DashBoardPropertyCard from "./dashBoardPropertyCard";
import type { PropertyData } from "@/lib/hooks";

interface PropertyPortfolioItemProps {
  propertyAddress: string;
  userAddress: string;
  onSelect: (id: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export default function PropertyPortfolioItem({
  propertyAddress,
  userAddress,
  onSelect,
  isSelected,
  onToggleSelect,
}: PropertyPortfolioItemProps) {
  // Get NFT balance for this property
  const { data: balance } = usePropertyBalance(propertyAddress, userAddress);
  const { data: propertyName } = usePropertyName(propertyAddress);
  const { data: propertySymbol } = usePropertySymbol(propertyAddress);
  const { data: tokenStats } = useGetTokenStats(propertyAddress);

  // Don't render if user has no NFTs for this property
  if (!balance || Number(balance) === 0) {
    return null;
  }

  // Convert to PropertyData format
  const propertyData: PropertyData = {
    id: parseInt(propertyAddress.slice(-6), 16), // Generate ID from address
    contractAddress: propertyAddress,
    propertyOwner: "0x0000000000000000000000000000000000000000",
    propertyName: propertyName || `Property ${propertyAddress.slice(0, 6)}...`,
    propertySymbol: propertySymbol || "LAND",
    totalValue: "1000000", // Mock value - would need to get from contract
    totalShares: tokenStats?.[1]?.toString() || "1000", // maxSupply from tokenStats
    availableShares: tokenStats?.[0]?.toString() || "500", // remainingToMint from tokenStats
    remainingShares: tokenStats?.[0]?.toString() || "500",
    soldShares: (
      Number(tokenStats?.[1] || 1000) - Number(tokenStats?.[0] || 500)
    ).toString(),
    yieldPerBlock: "0",
    yieldReserve: "0",
    propertyType: "1",
    propertyTypeName: "Residential",
    isActive: true,
    createdAt: Date.now().toString(),
    sharePrice: "1000",
    soldPercentage: tokenStats
      ? ((Number(tokenStats[1]) - Number(tokenStats[0])) /
          Number(tokenStats[1])) *
        100
      : 50,
    availabilityPercentage: tokenStats
      ? (Number(tokenStats[0]) / Number(tokenStats[1])) * 100
      : 50,
    apy: 7.2, // Mock APY
  };

  return (
    <motion.div
      layoutId={`dashboard-property-${propertyAddress}`}
      onClick={() => onSelect(propertyAddress)}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
    >
      <DashBoardPropertyCard
        property={propertyData}
        propertyName={propertyData.propertyName}
        isListed={false} // Default as requested
        buyPrice={BigInt(propertyData.sharePrice)}
        statusOverride="Active" // Default as requested
        selected={isSelected}
        onToggleSelect={() => onToggleSelect(propertyAddress)}
        amount={Number(balance)} // NFT balance
      />
    </motion.div>
  );
}
