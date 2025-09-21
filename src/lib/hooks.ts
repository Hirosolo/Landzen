'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { LandTokenizerABI, LandABI } from './abis'
import { CONTRACT_ADDRESSES } from './contracts'
import { baseSepolia } from './wagmi'

// Types for property data
export interface PropertyInfo {
  contractAddress: string;
  propertyOwner: string;
  totalValue: bigint;
  totalShares: bigint;
  yieldPerBlock: bigint;
  createdAt: bigint;
  propertyType: bigint;
  isActive: boolean;
}

export interface PropertyDetails {
  totalValue: bigint;
  totalShares: bigint;
  availableShares: bigint;
  yieldPerBlock: bigint;
  isActive: boolean;
  propertyOwner: string;
  yieldReserve: bigint;
  propertyType: bigint;
}

export interface PropertyData {
  id: number;
  contractAddress: string;
  propertyOwner: string;
  totalValue: bigint | string;
  totalShares: bigint | string;
  availableShares: bigint | string;
  remainingShares: bigint | string;
  soldShares: bigint | string;
  yieldPerBlock: bigint | string;
  yieldReserve: bigint | string;
  propertyType: bigint | string;
  propertyTypeName: string;
  isActive: boolean;
  createdAt: bigint | string;
  // Calculated fields
  sharePrice: bigint | string;
  soldPercentage: number;
  availabilityPercentage: number;
  apy: number; // Annual Percentage Yield
}

// Serialized version for API responses
export interface SerializedPropertyData {
  id: number;
  contractAddress: string;
  propertyOwner: string;
  totalValue: string;
  totalShares: string;
  availableShares: string;
  remainingShares: string;
  soldShares: string;
  yieldPerBlock: string;
  yieldReserve: string;
  propertyType: string;
  propertyTypeName: string;
  isActive: boolean;
  createdAt: string;
  sharePrice: string;
  soldPercentage: number;
  availabilityPercentage: number;
  apy: number;
}

// Property type mapping
const PROPERTY_TYPES: { [key: number]: { name: string; icon: string; color: string } } = {
  1: { name: "Residential", icon: "🏠", color: "#10B981" },
  2: { name: "Commercial", icon: "🏢", color: "#3B82F6" },
  3: { name: "Industrial", icon: "🏭", color: "#8B5CF6" },
  4: { name: "Mixed-Use", icon: "🏘️", color: "#F59E0B" },
  5: { name: "Retail", icon: "🛍️", color: "#EF4444" }
};

// Hook to get total number of properties
export function useGetTotalProperties() {
  return useReadContract({
    abi: LandTokenizerABI,
    address: CONTRACT_ADDRESSES.LAND_TOKENIZER as `0x${string}`,
    functionName: 'getTotalProperties',
    chainId: baseSepolia.id,
  })
}

// Hook to get property info from tokenizer contract
export function useGetPropertyInfo(propertyId: number) {
  return useReadContract({
    abi: LandTokenizerABI,
    address: CONTRACT_ADDRESSES.LAND_TOKENIZER as `0x${string}`,
    functionName: 'getPropertyInfo',
    args: [BigInt(propertyId)],
    chainId: baseSepolia.id,
  })
}

// Hook to get all active properties
export function useGetAllProperties() {
  const { data: totalProperties } = useGetTotalProperties()
  
  return useQuery({
    queryKey: ['allProperties', totalProperties ? Number(totalProperties) : 0],
    queryFn: async (): Promise<PropertyData[]> => {
      try {
        if (!totalProperties) {
          console.log('No total properties found, returning mock data')
          return getMockProperties().map(property => toObject(property)) as PropertyData[]
        }
        
        const total = Number(totalProperties)
        console.log(`Fetching ${total} properties from blockchain`)
        
        const results: PropertyData[] = []
        
        // Import viem client here to avoid SSR issues
        const { createPublicClient, http } = await import('viem')
        
        const client = createPublicClient({
          chain: baseSepolia,
          transport: http('https://sepolia.base.org')
        })
        
        // Fetch properties sequentially to avoid rate limiting
        for (let propertyId = 1; propertyId <= Math.min(total, 10); propertyId++) { // Limit to 10 for testing
          try {
            console.log(`Fetching property ${propertyId}`)
            
            // Get property info from tokenizer
            const propertyInfo = await client.readContract({
              address: CONTRACT_ADDRESSES.LAND_TOKENIZER as `0x${string}`,
              abi: LandTokenizerABI,
              functionName: 'getPropertyInfo',
              args: [BigInt(propertyId)]
            }) as [PropertyInfo, bigint, bigint, bigint, boolean]
            
            const [info, , availableShares, yieldReserve] = propertyInfo
            
            console.log(`Property ${propertyId} active:`, info.isActive)
            
            if (info.isActive) {
              // Calculate derived values
              const soldShares = BigInt(Number(info.totalShares) - Number(availableShares))
              const sharePrice = calculateSharePrice(info.totalValue, info.totalShares)
              const soldPercentage = Number((soldShares * BigInt(100)) / info.totalShares)
              const availabilityPercentage = Number((availableShares * BigInt(100)) / info.totalShares)
              const apy = calculateAPY(info.yieldPerBlock, sharePrice)
              
              const propertyData: PropertyData = {
                id: propertyId,
                contractAddress: info.contractAddress,
                propertyOwner: info.propertyOwner,
                totalValue: info.totalValue,
                totalShares: info.totalShares,
                availableShares,
                remainingShares: availableShares,
                soldShares,
                yieldPerBlock: info.yieldPerBlock,
                yieldReserve,
                propertyType: info.propertyType,
                propertyTypeName: PROPERTY_TYPES[Number(info.propertyType)]?.name || "Unknown",
                isActive: info.isActive,
                createdAt: info.createdAt,
                sharePrice,
                soldPercentage,
                availabilityPercentage,
                apy
              }
              
              results.push(propertyData)
              console.log(`Added property ${propertyId} to results`)
            }
          } catch (error) {
            console.error(`Error fetching property ${propertyId}:`, error)
          }
        }
        
        console.log(`Returning ${results.length} properties`)
        // Serialize BigInt values before returning
        const serializedResults = results.length > 0 ? results : getMockProperties()
        return serializedResults.map(property => ({
          ...property,
          totalValue: property.totalValue.toString(),
          totalShares: property.totalShares.toString(),
          availableShares: property.availableShares.toString(),
          remainingShares: property.remainingShares.toString(),
          soldShares: property.soldShares.toString(),
          yieldPerBlock: property.yieldPerBlock.toString(),
          yieldReserve: property.yieldReserve.toString(),
          propertyType: property.propertyType.toString(),
          createdAt: property.createdAt.toString(),
          sharePrice: property.sharePrice.toString(),
        })) as unknown as PropertyData[]
      } catch (error) {
        console.error('Error in useGetAllProperties:', error)
        const mockData = getMockProperties()
        return mockData.map(property => ({
          ...property,
          totalValue: property.totalValue.toString(),
          totalShares: property.totalShares.toString(),
          availableShares: property.availableShares.toString(),
          remainingShares: property.remainingShares.toString(),
          soldShares: property.soldShares.toString(),
          yieldPerBlock: property.yieldPerBlock.toString(),
          yieldReserve: property.yieldReserve.toString(),
          propertyType: property.propertyType.toString(),
          createdAt: property.createdAt.toString(),
          sharePrice: property.sharePrice.toString(),
        })) as unknown as PropertyData[]
      }
    },
    enabled: true, // Always enabled, will fallback to mock data
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  })
}

// Mock properties for testing - using string-based BigInt to avoid serialization issues
function getMockProperties(): PropertyData[] {
  const now = Date.now();
  
  const mockData = [
    {
      id: 1,
      contractAddress: "0x1234567890123456789012345678901234567890",
      propertyOwner: "0x7EA634e331CF7b503df2e224f77a7C589462F1F2",
      totalValue: "1000000000000", // $1M in USDT (6 decimals)
      totalShares: "1000",
      availableShares: "500",
      remainingShares: "500",
      soldShares: "500",
      yieldPerBlock: "1000000000", // $1000 per block in USDT
      yieldReserve: "50000000000", // $50k in USDT
      propertyType: "1",
      propertyTypeName: "Residential",
      isActive: true,
      createdAt: now.toString(),
      sharePrice: "1000000000", // $1000 per share in USDT
      soldPercentage: 50,
      availabilityPercentage: 50,
      apy: 12.5
    },
    {
      id: 2,
      contractAddress: "0x2345678901234567890123456789012345678901",
      propertyOwner: "0x7EA634e331CF7b503df2e224f77a7C589462F1F2",
      totalValue: "2000000000000", // $2M
      totalShares: "2000",
      availableShares: "800",
      remainingShares: "800",
      soldShares: "1200",
      yieldPerBlock: "2000000000", // $2000 per block
      yieldReserve: "100000000000", // $100k
      propertyType: "2",
      propertyTypeName: "Commercial",
      isActive: true,
      createdAt: now.toString(),
      sharePrice: "1000000000", // $1000 per share
      soldPercentage: 60,
      availabilityPercentage: 40,
      apy: 15.2
    },
    {
      id: 3,
      contractAddress: "0x3456789012345678901234567890123456789012",
      propertyOwner: "0x7EA634e331CF7b503df2e224f77a7C589462F1F2",
      totalValue: "1500000000000", // $1.5M
      totalShares: "1500",
      availableShares: "300",
      remainingShares: "300",
      soldShares: "1200",
      yieldPerBlock: "1500000000", // $1500 per block
      yieldReserve: "75000000000", // $75k
      propertyType: "4",
      propertyTypeName: "Mixed-Use",
      isActive: true,
      createdAt: now.toString(),
      sharePrice: "1000000000", // $1000 per share
      soldPercentage: 80,
      availabilityPercentage: 20,
      apy: 18.7
    },
    {
      id: 4,
      contractAddress: "0x4567890123456789012345678901234567890123",
      propertyOwner: "0x7EA634e331CF7b503df2e224f77a7C589462F1F2",
      totalValue: "800000000000", // $800k
      totalShares: "800",
      availableShares: "600",
      remainingShares: "600",
      soldShares: "200",
      yieldPerBlock: "800000000", // $800 per block
      yieldReserve: "40000000000", // $40k
      propertyType: "1",
      propertyTypeName: "Residential",
      isActive: true,
      createdAt: now.toString(),
      sharePrice: "1000000000", // $1000 per share
      soldPercentage: 25,
      availabilityPercentage: 75,
      apy: 9.8
    },
    {
      id: 5,
      contractAddress: "0x5678901234567890123456789012345678901234",
      propertyOwner: "0x7EA634e331CF7b503df2e224f77a7C589462F1F2",
      totalValue: "3000000000000", // $3M
      totalShares: "3000",
      availableShares: "1000",
      remainingShares: "1000",
      soldShares: "2000",
      yieldPerBlock: "3000000000", // $3000 per block
      yieldReserve: "150000000000", // $150k
      propertyType: "3",
      propertyTypeName: "Industrial",
      isActive: true,
      createdAt: now.toString(),
      sharePrice: "1000000000", // $1000 per share
      soldPercentage: 67,
      availabilityPercentage: 33,
      apy: 14.3
    }
  ];

  // Convert string values to BigInt for internal use
  return mockData.map(property => ({
    ...property,
    totalValue: BigInt(property.totalValue),
    totalShares: BigInt(property.totalShares),
    availableShares: BigInt(property.availableShares),
    remainingShares: BigInt(property.remainingShares),
    soldShares: BigInt(property.soldShares),
    yieldPerBlock: BigInt(property.yieldPerBlock),
    yieldReserve: BigInt(property.yieldReserve),
    propertyType: BigInt(property.propertyType),
    createdAt: BigInt(property.createdAt),
    sharePrice: BigInt(property.sharePrice),
  })) as PropertyData[];
}

// Utility functions
export function formatUSDT(amount: bigint): string {
  const dollars = Number(amount) / 1e6;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(dollars);
}

// BigInt serialization utility
export function toObject(data: unknown): unknown {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value // return everything else unchanged
  ));
}

export function calculateAPY(yieldPerBlock: bigint, sharePrice: bigint): number {
  if (sharePrice === BigInt(0)) return 0;
  
  // Assuming 12-second blocks (Base chain)
  const BLOCKS_PER_YEAR = BigInt((365 * 24 * 60 * 60) / 12);
  const annualYield = yieldPerBlock * BLOCKS_PER_YEAR;
  const apy = Number((annualYield * BigInt(100)) / sharePrice);
  return apy;
}

export function calculateSharePrice(totalValue: bigint, totalShares: bigint): bigint {
  if (totalShares === BigInt(0)) return BigInt(0);
  return totalValue / totalShares;
}

// Simple property data fetcher using direct contract calls
export async function fetchPropertyData(propertyId: number): Promise<PropertyData | null> {
  try {
    // This would be used in the API route
    const { createPublicClient, http } = await import('viem')
    
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http('https://sepolia.base.org')
    })
    
    // Get property info from tokenizer
    const propertyInfo = await client.readContract({
      address: CONTRACT_ADDRESSES.LAND_TOKENIZER as `0x${string}`,
      abi: LandTokenizerABI,
      functionName: 'getPropertyInfo',
      args: [BigInt(propertyId)]
    }) as [PropertyInfo, bigint, bigint, bigint, boolean]
    
    const [info, , availableShares, yieldReserve] = propertyInfo
    
    if (!info.isActive) return null
    
    // Calculate derived values
    const soldShares = BigInt(Number(info.totalShares) - Number(availableShares))
    const sharePrice = calculateSharePrice(info.totalValue, info.totalShares)
    const soldPercentage = Number((soldShares * BigInt(100)) / info.totalShares)
    const availabilityPercentage = Number((availableShares * BigInt(100)) / info.totalShares)
    const apy = calculateAPY(info.yieldPerBlock, sharePrice)
    
    return {
      id: propertyId,
      contractAddress: info.contractAddress,
      propertyOwner: info.propertyOwner,
      totalValue: info.totalValue,
      totalShares: info.totalShares,
      availableShares,
      remainingShares: availableShares,
      soldShares,
      yieldPerBlock: info.yieldPerBlock,
      yieldReserve,
      propertyType: info.propertyType,
      propertyTypeName: PROPERTY_TYPES[Number(info.propertyType)]?.name || "Unknown",
      isActive: info.isActive,
      createdAt: info.createdAt,
      sharePrice,
      soldPercentage,
      availabilityPercentage,
      apy
    }
  } catch (error) {
    console.error(`Error fetching property ${propertyId}:`, error)
    return null
  }
}

// Hook for purchasing shares
export function usePurchaseShares() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const purchaseShares = async (contractAddress: string, shareAmount: number) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: LandABI,
        functionName: 'purchaseShares',
        args: [BigInt(shareAmount)],
      })
    } catch (err) {
      console.error('Error purchasing shares:', err)
      throw err
    }
  }

  return {
    purchaseShares,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash
  }
}