"use client";

import { useQuery } from "@tanstack/react-query";
import { usePropertyBalance, useGetAllProperties } from "@/lib/hooks";

interface RealPropertyData {
  propertyAddress: string;
  userAddress: string;
}

export function useRealPropertyData({
  propertyAddress,
  userAddress,
}: RealPropertyData) {
  const { data: balance } = usePropertyBalance(propertyAddress, userAddress);
  const { data: allProperties } = useGetAllProperties(); // Use same data source as investment page

  return useQuery({
    queryKey: ["realPropertyData", propertyAddress, userAddress, allProperties],
    queryFn: async () => {
      // Only return data if user has NFTs for this property
      if (!balance || Number(balance) === 0) {
        return null;
      }

      // Find this property in the investment page data
      const propertyData = allProperties?.find(
        (p) => p.contractAddress.toLowerCase() === propertyAddress.toLowerCase()
      );

      if (!propertyData) {
        console.log(`Property ${propertyAddress} not found in allProperties`);
        return null;
      }

      console.log(`Property ${propertyAddress} found:`, {
        name: propertyData.propertyName,
        apy: propertyData.apy,
        propertyTypeName: propertyData.propertyTypeName,
        totalValue: propertyData.totalValue,
      });

      // Convert to the expected format used by the original design, using the same data as investment page
      return {
        id: propertyData.id,
        city: "Ho Chi Minh",
        name: propertyData.propertyName,
        value: Math.round(Number(propertyData.totalValue) / 1e18), // Convert from wei to USDT
        earnings: Math.round(
          ((propertyData.apy / 100) * Number(propertyData.sharePrice)) / 1e18
        ), // Annual yield per token
        amount: Number(balance), // Real NFT balance
        profit: Math.round(
          ((propertyData.apy / 100) *
            Number(propertyData.sharePrice) *
            Number(balance)) /
            1e18
        ), // Real profit for user's holdings
        status: "Active",
        endDate: "01/01/2026",
        type: propertyData.propertyTypeName, // Real property type from investment page
        image: "/image-property.png",
        listed: "false",
        floor: Number(propertyData.sharePrice) / 1e18,
        traitFloor: (Number(propertyData.sharePrice) / 1e18) * 1.1,
        contractAddress: propertyAddress,
        totalSupply: Number(propertyData.totalShares),
        remainingToMint: Number(propertyData.availableShares),
        apy: propertyData.apy, // Use the same APY as investment page!
        rentalYield: propertyData.apy.toFixed(2), // Same as investment page
      };
    },
    enabled: !!balance && Number(balance) > 0 && !!allProperties,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

// Hook to get all properties where user has NFTs
export function useUserOwnedProperties(userAddress?: string) {
  const { PROPERTY_ADDRESSES } = require("@/lib/contracts");

  const propertyData = PROPERTY_ADDRESSES.map((address: string) => {
    // We'll use individual hooks for each property
    return { address, userAddress };
  });

  return propertyData;
}
