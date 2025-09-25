"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { usePropertyBalance, useGetAllProperties } from "@/lib/hooks";
import { PROPERTY_ADDRESSES } from "@/lib/contracts";

export function useUserPortfolioStats() {
  const { address: userAddress } = useAccount();
  const { data: allProperties } = useGetAllProperties();

  return useQuery({
    queryKey: ["userPortfolioStats", userAddress, allProperties],
    queryFn: async () => {
      if (!userAddress || !allProperties) {
        return {
          totalInvestment: 0,
          availableToClaim: 0,
          totalBalance: 0,
          monthlyEarnings: 7.165, // Fixed mock number as requested
        };
      }

      let totalInvestment = 0;
      let availableToClaim = 0;

      // Import viem client to read balances directly
      const { createPublicClient, http } = await import("viem");
      const { baseSepolia } = await import("@/lib/wagmi");
      const { LandABI } = await import("@/lib/abis");

      const client = createPublicClient({
        chain: baseSepolia,
        transport: http("https://sepolia.base.org"),
      });

      // Get balance for each property and calculate stats
      for (const propertyAddress of PROPERTY_ADDRESSES) {
        try {
          // Get user's NFT balance for this property directly from contract
          const balance = await client.readContract({
            address: propertyAddress as `0x${string}`,
            abi: LandABI,
            functionName: "balanceOf",
            args: [userAddress as `0x${string}`],
          });

          const nftBalance = Number(balance);

          if (nftBalance > 0) {
            // Find property data from allProperties
            const property = allProperties.find(
              (p) =>
                p.contractAddress.toLowerCase() ===
                propertyAddress.toLowerCase()
            );

            if (property) {
              // Calculate total investment: share price × number of NFTs owned
              const sharePrice = Number(property.sharePrice) / 1e18; // Convert from wei to USDT
              const investmentValue = sharePrice * nftBalance;
              totalInvestment += investmentValue;

              // Calculate available yield: APY × investment value (simplified monthly calculation)
              const monthlyYield = (property.apy / 100 / 12) * investmentValue; // Monthly yield
              availableToClaim += monthlyYield;

              console.log(`Property ${propertyAddress}:`, {
                name: property.propertyName,
                balance: nftBalance,
                sharePrice: sharePrice.toFixed(2),
                investmentValue: investmentValue.toFixed(2),
                monthlyYield: monthlyYield.toFixed(4),
                apy: property.apy,
              });
            }
          }
        } catch (error) {
          console.error(
            `Error calculating stats for ${propertyAddress}:`,
            error
          );
        }
      }

      const totalBalance = totalInvestment + availableToClaim;

      console.log("Portfolio Stats Summary:", {
        totalInvestment: totalInvestment.toFixed(2),
        availableToClaim: availableToClaim.toFixed(2),
        totalBalance: totalBalance.toFixed(2),
        monthlyEarnings: 7.165,
      });

      return {
        totalInvestment,
        availableToClaim,
        totalBalance,
        monthlyEarnings: 7.165, // Fixed mock number
      };
    },
    enabled: !!userAddress && !!allProperties,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}
