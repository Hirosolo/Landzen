"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { LandABI } from "@/lib/abis";
import { PROPERTY_ADDRESSES } from "@/lib/contracts";
import { baseSepolia } from "@/lib/wagmi";
import { createPublicClient, http } from "viem";

export function useHarvestYield() {
  const { address: userAddress } = useAccount();
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [harvestStatus, setHarvestStatus] = useState<{
    currentProperty?: string;
    currentIndex?: number;
    totalProperties?: number;
    successful: string[];
    failed: string[];
  }>({ successful: [], failed: [] });

  const startHarvestProcess = async () => {
    if (!userAddress) {
      alert("Please connect your wallet first");
      return;
    }

    setIsHarvesting(true);
    setHarvestStatus({ successful: [], failed: [] });

    try {
      // Create viem client to check balances
      const client = createPublicClient({
        chain: baseSepolia,
        transport: http("https://sepolia.base.org"),
      });

      // Get properties where user has NFTs
      const propertiesWithNFTs = [];

      for (const propertyAddress of PROPERTY_ADDRESSES) {
        try {
          const balance = await client.readContract({
            address: propertyAddress as `0x${string}`,
            abi: LandABI,
            functionName: "balanceOf",
            args: [userAddress as `0x${string}`],
          });

          if (Number(balance) > 0) {
            propertiesWithNFTs.push(propertyAddress);
          }
        } catch (error) {
          console.error(
            `Error checking balance for ${propertyAddress}:`,
            error
          );
        }
      }

      if (propertiesWithNFTs.length === 0) {
        alert("No NFTs found to harvest yield from");
        return;
      }

      console.log(`Found ${propertiesWithNFTs.length} properties with NFTs`);

      // Display message to user about manual harvesting
      const propertyList = propertiesWithNFTs
        .map((addr, i) => `${i + 1}. ${addr}`)
        .join("\n");
      const message = `Found ${propertiesWithNFTs.length} properties with NFTs:\n\n${propertyList}\n\nYou'll need to manually confirm each transaction to harvest yield from all properties.`;

      if (!confirm(message)) {
        return;
      }

      setHarvestStatus({
        successful: [],
        failed: [],
        totalProperties: propertiesWithNFTs.length,
      });

      // Return the properties for manual harvesting
      return propertiesWithNFTs;
    } catch (error) {
      console.error("Error during harvest process:", error);
      alert("Error occurred while checking properties");
    } finally {
      setIsHarvesting(false);
    }
  };

  return {
    startHarvestProcess,
    isHarvesting,
    harvestStatus,
  };
}
