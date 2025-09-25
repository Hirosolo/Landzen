'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { LandTokenizerABI, LandABI, MockUSDTABI } from './abis'
import { CONTRACT_ADDRESSES, PROPERTY_TYPES } from './contracts'
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
  propertyName: string;
  propertySymbol: string;
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
  propertyName: string;
  propertySymbol: string;
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

// Property type mapping imported from contracts.ts

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

// Hook to get all active properties from blockchain
export function useGetAllProperties() {
  return useQuery({
    queryKey: ['allProperties'],
    queryFn: async (): Promise<PropertyData[]> => {
      try {
        console.log('🚀 STARTING: Fetching properties from blockchain...')
        console.log('🔧 Hook is definitely being called!')
        
        // Force server-side logging
        if (typeof window === 'undefined') {
          console.log('SERVER SIDE: Hook called')
        } else {
          console.log('CLIENT SIDE: Hook called')
        }
        
        // Import viem client here to avoid SSR issues
        const { createPublicClient, http } = await import('viem')
        
        const client = createPublicClient({
          chain: baseSepolia,
          transport: http('https://sepolia.base.org')
        })
        
        // First get total number of properties
        const totalProperties = await client.readContract({
          address: CONTRACT_ADDRESSES.LAND_TOKENIZER as `0x${string}`,
          abi: LandTokenizerABI,
          functionName: 'getTotalProperties',
        }) as bigint
        
        const totalCount = Number(totalProperties)
        console.log(`Fetching ${totalCount} properties from blockchain`)
        
        if (totalCount === 0) {
          return []
        }
        
        const results: PropertyData[] = []
        
        // Loop through property IDs (1 to totalCount)
        for (let propertyId = 1; propertyId <= totalCount; propertyId++) {
          try {
            // Get basic property info from tokenizer
            const basicInfo = await client.readContract({
              address: CONTRACT_ADDRESSES.LAND_TOKENIZER as `0x${string}`,
              abi: LandTokenizerABI,
              functionName: 'getPropertyBasics',
              args: [BigInt(propertyId)]
            })
            
            // getPropertyBasics returns: landContract, paymentToken, propertyName, totalValue, totalSupply, active
            const basicInfoArray = basicInfo as [string, string, string, bigint, bigint, boolean]
            const [
              landContract, 
              paymentToken, 
              propertyName, 
              totalValue, 
              totalSupply, 
              active
            ] = basicInfoArray
            
            console.log(`Property ${propertyId} landContract: ${landContract}`)
            
            // Set default values for missing fields
            const propertySymbol = propertyName.substring(0, 5).toUpperCase().replace(/\s/g, '')
            const yieldRate = BigInt(0) // We'll get this from Land contract
            const landType = BigInt(1) // Default to Residential
            const deployedAt = BigInt(Date.now())
            

            
            if (active) {
              // Get additional details from the Land contract
              let availableShares = totalSupply
              let yieldReserve = BigInt(0)
              let actualYieldRate = BigInt(0)
              let actualLandType = BigInt(1)
              
              try {
                // Get available shares from Land contract
                const landAvailableShares = await client.readContract({
                  address: landContract as `0x${string}`,
                  abi: LandABI,
                  functionName: 'availableShares',
                }) as bigint
                
                availableShares = landAvailableShares
                
                // Get yield reserve
                const reserve = await client.readContract({
                  address: landContract as `0x${string}`,
                  abi: LandABI,
                  functionName: 'yieldReserve',
                }) as bigint
                
                yieldReserve = reserve
                
                // Get yield rate
                const landYieldRate = await client.readContract({
                  address: landContract as `0x${string}`,
                  abi: LandABI,
                  functionName: 'yieldRate',
                }) as bigint
                
                actualYieldRate = landYieldRate
                
                // Get land type using i_landType()
                console.log(`🔍 About to call i_landType() for property ${propertyId} at contract ${landContract}`)
                
                // TEMPORARY TEST: Use hardcoded addresses to verify the issue
                let testAddress = landContract;
                if (propertyId === 1) testAddress = '0xb32559bc7924e175fb3285d46f3f7fd7d441123e'
                if (propertyId === 2) testAddress = '0x292c1c0ea88a461625010c49738da0ba10237ee6'  
                if (propertyId === 3) testAddress = '0xb897fb791a67884699629a9e65afb08812a1168e'
                
                console.log(`Using test address: ${testAddress} for property ${propertyId}`)
                
                const landTypeFromContract = await client.readContract({
                  address: testAddress as `0x${string}`,
                  abi: LandABI,
                  functionName: 'i_landType',
                }) as bigint
                
                console.log(`✅ Successfully got land type for property ${propertyId}:`, {
                  rawValue: landTypeFromContract.toString(),
                  bigintValue: landTypeFromContract,
                  numberValue: Number(landTypeFromContract),
                  contractAddress: landContract
                })
                
                actualLandType = landTypeFromContract
                console.log(`Property ${propertyId} - Land Type from contract: ${actualLandType}, Mapped to: ${PROPERTY_TYPES[Number(actualLandType)]?.name}`)
                
              } catch (landError) {
                console.error(`❌ ERROR fetching Land contract details for property ${propertyId}:`)
                console.error(`   - Original landContract: ${landContract}`) 
                console.error(`   - Error details:`, landError)
                console.error(`   - Error message:`, (landError as Error)?.message || 'Unknown error')
                console.error(`   - This is why property ${propertyId} defaults to land type 1 (Residential)`)
                // Use defaults
                availableShares = totalSupply
                yieldReserve = BigInt(0)
                actualYieldRate = BigInt(0)
                actualLandType = BigInt(1)
              }
              
              // Calculate derived values
              const soldShares = totalSupply - availableShares
              const sharePrice = totalSupply > BigInt(0) ? totalValue / totalSupply : BigInt(0)
              const soldPercentage = totalSupply > BigInt(0) ? Number((soldShares * BigInt(100)) / totalSupply) : 0
              const availabilityPercentage = totalSupply > BigInt(0) ? Number((availableShares * BigInt(100)) / totalSupply) : 100
              const apy = calculateAPY(actualYieldRate, sharePrice)
              
              console.log(`🏠 Property ${propertyId}:`, {
                actualLandType: actualLandType.toString(),
                numberLandType: Number(actualLandType),
                propertyTypeMapping: PROPERTY_TYPES[Number(actualLandType)],
                allPropertyTypes: PROPERTY_TYPES
              })
              
              const propertyData: PropertyData = {
                id: propertyId,
                contractAddress: landContract,
                propertyOwner: CONTRACT_ADDRESSES.DEPLOYER,
                propertyName: propertyName,
                propertySymbol: propertySymbol,
                totalValue: totalValue.toString(),
                totalShares: totalSupply.toString(),
                availableShares: availableShares.toString(),
                remainingShares: availableShares.toString(),
                soldShares: soldShares.toString(),
                yieldPerBlock: actualYieldRate.toString(),
                yieldReserve: yieldReserve.toString(),
                propertyType: actualLandType.toString(),
                propertyTypeName: PROPERTY_TYPES[Number(actualLandType)]?.name || `Type ${Number(actualLandType)}`,
                isActive: active,
                createdAt: deployedAt.toString(),
                sharePrice: sharePrice.toString(),
                soldPercentage,
                availabilityPercentage,
                apy: Math.max(apy, 0)
              }
              
              results.push(propertyData)
            }
          } catch (propertyError) {
            console.error(`Error fetching property ${propertyId}:`, propertyError)
          }
        }
        
        console.log(`Successfully fetched ${results.length}/${totalCount} properties from blockchain`)
        return results
        
      } catch (error) {
        console.error('Error fetching blockchain data:', error)
        return []
      }
    },
    enabled: true,
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
      propertyName: "Sunset Villa Miami",
      propertySymbol: "SVMIA",
      totalValue: "150000000000000000000000", // $150k in USDT (18 decimals)
      totalShares: "500",
      availableShares: "250",
      remainingShares: "250",
      soldShares: "250",
      yieldPerBlock: "1000000000000000", // Yield per block
      yieldReserve: "50000000000000000000000", // $50k in USDT
      propertyType: "1",
      propertyTypeName: "Residential",
      isActive: true,
      createdAt: now.toString(),
      sharePrice: "300000000000000000000", // $300 per share
      soldPercentage: 50,
      availabilityPercentage: 50,
      apy: 6.0
    },
    {
      id: 2,
      contractAddress: "0x2345678901234567890123456789012345678901",
      propertyOwner: "0x7EA634e331CF7b503df2e224f77a7C589462F1F2",
      propertyName: "Downtown Office Seattle",
      propertySymbol: "DOSEA",
      totalValue: "180000000000000000000000", // $180k
      totalShares: "600",
      availableShares: "240",
      remainingShares: "240",
      soldShares: "360",
      yieldPerBlock: "2000000000000000", // Yield per block
      yieldReserve: "100000000000000000000000", // $100k
      propertyType: "2",
      propertyTypeName: "Commercial",
      isActive: true,
      createdAt: now.toString(),
      sharePrice: "300000000000000000000", // $300 per share
      soldPercentage: 60,
      availabilityPercentage: 40,
      apy: 7.0
    },
    {
      id: 3,
      contractAddress: "0x3456789012345678901234567890123456789012",
      propertyOwner: "0x7EA634e331CF7b503df2e224f77a7C589462F1F2",
      propertyName: "Mixed Use Complex NY",
      propertySymbol: "MUCNY",
      totalValue: "200000000000000000000000", // $200k
      totalShares: "800",
      availableShares: "160",
      remainingShares: "160",
      soldShares: "640",
      yieldPerBlock: "1500000000000000", // Yield per block
      yieldReserve: "75000000000000000000000", // $75k
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

export function calculateAPY(yieldPerBlock: bigint | string, sharePrice: bigint | string): number {
  const yieldBigInt = typeof yieldPerBlock === 'string' ? BigInt(yieldPerBlock) : yieldPerBlock;
  const priceBigInt = typeof sharePrice === 'string' ? BigInt(sharePrice) : sharePrice;
  
  if (priceBigInt === BigInt(0)) return 0;
  
  // Assuming 12-second blocks (Base chain): 365 * 24 * 60 * 60 / 12 = 2,628,000 blocks/year
  const BLOCKS_PER_YEAR = BigInt(2628000);
  const annualYield = yieldBigInt * BLOCKS_PER_YEAR;
  const apy = Number((annualYield * BigInt(100)) / priceBigInt);
  return Math.round(apy * 100) / 100; // Round to 2 decimal places
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
      propertyName: `Property #${propertyId}`, // Default name
      propertySymbol: `PROP${propertyId}`, // Default symbol
      totalValue: info.totalValue,
      totalShares: info.totalShares,
      availableShares,
      remainingShares: availableShares,
      soldShares,
      yieldPerBlock: info.yieldPerBlock,
      yieldReserve,
      propertyType: info.propertyType,
      propertyTypeName: PROPERTY_TYPES[Number(info.propertyType)]?.name || `Type ${Number(info.propertyType)}`,
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

// Hook for minting USDT (faucet)
export function useMintUSDT() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const mintUSDT = async (toAddress: string, amount: bigint) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.USDT as `0x${string}`,
        abi: MockUSDTABI,
        functionName: 'mint',
        args: [toAddress as `0x${string}`, amount],
      })
    } catch (err) {
      console.error('Error minting USDT:', err)
      throw err
    }
  }

  return {
    mintUSDT,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash
  }
}