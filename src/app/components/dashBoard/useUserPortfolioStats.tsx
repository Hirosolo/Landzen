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

              // Get yield rate and lastWithdraw for dynamic yield calculation
              const [yieldRateResult, lastWithdrawResult, currentBlockResult] =
                await Promise.all([
                  client.readContract({
                    address: propertyAddress as `0x${string}`,
                    abi: LandABI,
                    functionName: "yieldRate",
                    args: [],
                  }),
                  client.readContract({
                    address: propertyAddress as `0x${string}`,
                    abi: LandABI,
                    functionName: "lastWithdraw",
                    args: [userAddress as `0x${string}`],
                  }),
                  client.getBlockNumber(),
                ]);

              const yieldRate = Number(yieldRateResult);
              const lastWithdrawBlock = Number(lastWithdrawResult);
              const currentBlock = Number(currentBlockResult);

              // Calculate blocks passed since last withdrawal
              const blocksPassed = currentBlock - lastWithdrawBlock;

              // Calculate accumulated yield: yieldRate * blocksPassed * userBalance
              const accumulatedYield =
                (yieldRate * blocksPassed * nftBalance) / 1e18; // Convert from wei to USDT
              availableToClaim += accumulatedYield;

              console.log(`Property ${propertyAddress}:`, {
                name: property.propertyName,
                balance: nftBalance,
                sharePrice: sharePrice.toFixed(2),
                investmentValue: investmentValue.toFixed(2),
                yieldRate: yieldRate.toString(),
                lastWithdrawBlock,
                currentBlock,
                blocksPassed,
                accumulatedYield: accumulatedYield.toFixed(6),
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
        availableToClaim: availableToClaim.toFixed(6),
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
    staleTime: 5000, // Refresh every 5 seconds for dynamic yield
    refetchInterval: 5000, // Auto-refresh every 5 seconds to show growing yield
  });
}
