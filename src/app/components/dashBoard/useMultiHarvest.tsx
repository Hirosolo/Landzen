"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { LandABI } from "@/lib/abis";
import { PROPERTY_ADDRESSES } from "@/lib/contracts";
import { baseSepolia } from "@/lib/wagmi";
import { createPublicClient, http } from "viem";

interface PropertyHarvestData {
  address: string;
  hasNFTs: boolean;
  balance: number;
  isLoading: boolean;
  hash?: `0x${string}`;
}

export function useMultiHarvest() {
  const { address: userAddress } = useAccount();
  const { writeContract } = useWriteContract();
  const [properties, setProperties] = useState<PropertyHarvestData[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const scanPropertiesForNFTs = async () => {
    if (!userAddress) return;

    setIsScanning(true);
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http("https://sepolia.base.org"),
    });

    const propertyData: PropertyHarvestData[] = [];

    for (const propertyAddress of PROPERTY_ADDRESSES) {
      try {
        const balance = await client.readContract({
          address: propertyAddress as `0x${string}`,
          abi: LandABI,
          functionName: "balanceOf",
          args: [userAddress as `0x${string}`],
        });

        propertyData.push({
          address: propertyAddress,
          hasNFTs: Number(balance) > 0,
          balance: Number(balance),
          isLoading: false,
        });
      } catch (error) {
        console.error(`Error checking balance for ${propertyAddress}:`, error);
        propertyData.push({
          address: propertyAddress,
          hasNFTs: false,
          balance: 0,
          isLoading: false,
        });
      }
    }

    setProperties(propertyData);
    setIsScanning(false);
  };

  const harvestFromProperty = async (propertyAddress: string) => {
    try {
      setProperties((prev) =>
        prev.map((p) =>
          p.address === propertyAddress ? { ...p, isLoading: true } : p
        )
      );

      writeContract({
        abi: LandABI,
        address: propertyAddress as `0x${string}`,
        functionName: "withdrawYield",
        args: [],
        chainId: baseSepolia.id,
      });
    } catch (error) {
      console.error(`Error harvesting from ${propertyAddress}:`, error);
      setProperties((prev) =>
        prev.map((p) =>
          p.address === propertyAddress ? { ...p, isLoading: false } : p
        )
      );
    }
  };

  const harvestAllSequentially = async () => {
    const propertiesWithNFTs = properties.filter((p) => p.hasNFTs);

    for (const property of propertiesWithNFTs) {
      await harvestFromProperty(property.address);
      // Wait a bit between transactions
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  };

  return {
    properties,
    isScanning,
    scanPropertiesForNFTs,
    harvestFromProperty,
    harvestAllSequentially,
  };
}
