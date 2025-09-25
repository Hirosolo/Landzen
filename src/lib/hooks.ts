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
  propertyName: string;
  propertySymbol: string;
  totalValue: string;
  totalShares: string;
  availableShares: string;
  yieldPerBlock: string;
  yieldReserve: string;
  propertyType: string;
  isActive: boolean;
  createdAt: string;
  sharePrice: string;
}

export interface PropertyData {
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

export interface InvestmentOpportunity {
  id: number;
  ownerAddress: string;
  landContract: string;
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

// Clean implementation of useGetAllProperties hook
export function useGetAllProperties() {
  return useQuery({
    queryKey: ['allProperties'],
    queryFn: async (): Promise<PropertyData[]> => {
      try {
        console.log('Fetching properties from blockchain...')
        
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
        console.log(`Total properties found: ${totalCount}`)
        
        if (totalCount === 0) {
          return []
        }
        
        const results: PropertyData[] = []
        
        // Loop through each property ID (starting from 1)
        for (let propertyId = 1; propertyId <= totalCount; propertyId++) {
          try {
            console.log(`Fetching property ${propertyId}...`)
            
            // Get basic property info from tokenizer
            const basicInfo = await client.readContract({
              address: CONTRACT_ADDRESSES.LAND_TOKENIZER as `0x${string}`,
              abi: LandTokenizerABI,
              functionName: 'getPropertyBasics',
              args: [BigInt(propertyId)],
            })
            
            const [landContract, paymentToken, propertyName, totalValue, totalSupply, active] = basicInfo as [string, string, string, bigint, bigint, boolean]
            
            console.log(`Property ${propertyId}:`, {
              landContract,
              propertyName,
              active
            })
            
            if (!active) {
              console.log(`Property ${propertyId} is not active, skipping`)
              continue
            }
            
            // Get land type and yield rate from the Land contract
            let landType = BigInt(1) // Default to Residential
            let yieldRate = BigInt(0) // Yield per block per token
            
            try {
              console.log(`Getting land type and yield rate for property ${propertyId} from contract ${landContract}`)
              
              // Get land type
              landType = await client.readContract({
                address: landContract as `0x${string}`,
                abi: LandABI,
                functionName: 'i_landType',
              }) as bigint
              
              // Get yield rate
              yieldRate = await client.readContract({
                address: landContract as `0x${string}`,
                abi: LandABI,
                functionName: 'yieldRate',
              }) as bigint
              
              console.log(`Property ${propertyId} - land type: ${landType}, yield rate: ${yieldRate}`)
            } catch (landContractError) {
              console.error(`Failed to get land contract data for property ${propertyId}:`, landContractError)
            }
            
            // Calculate basic values
            const propertySymbol = propertyName.substring(0, 5).toUpperCase().replace(/\s/g, '')
            const sharePrice = totalSupply > BigInt(0) ? totalValue / totalSupply : BigInt(0)
            const soldShares = BigInt(0) // For now, assume no shares are sold
            const availableShares = totalSupply
            const soldPercentage = 0
            const availabilityPercentage = 100
            
            // Calculate real APY from yield rate
            // yieldRate is per block per token, convert to annual percentage
            // Assuming 12 second block time: (365 * 24 * 60 * 60) / 12 = 2,628,000 blocks per year
            const blocksPerYear = 2628000
            let apy = 0
            if (sharePrice > BigInt(0) && yieldRate > BigInt(0)) {
              const annualYieldPerToken = yieldRate * BigInt(blocksPerYear)
              apy = Number(annualYieldPerToken * BigInt(100)) / Number(sharePrice)
            }
            
            // Map land type to property type name
            const propertyTypeData = PROPERTY_TYPES[Number(landType)]
            const propertyTypeName = propertyTypeData?.name || `Type ${Number(landType)}`
            
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
              yieldPerBlock: "0",
              yieldReserve: "0",
              propertyType: landType.toString(),
              propertyTypeName: propertyTypeName,
              isActive: active,
              createdAt: Date.now().toString(),
              sharePrice: sharePrice.toString(),
              soldPercentage,
              availabilityPercentage,
              apy
            }
            
            console.log(`Property ${propertyId} final data:`, {
              id: propertyData.id,
              propertyTypeName: propertyData.propertyTypeName,
              landType: landType.toString()
            })
            
            results.push(propertyData)
            
          } catch (propertyError) {
            console.error(`Error fetching property ${propertyId}:`, propertyError)
          }
        }
        
        console.log(`Successfully fetched ${results.length} properties`)
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

// Mock properties for testing - keeping for fallback
function getMockProperties(): PropertyData[] {
  return [
    {
      id: 1,
      contractAddress: "0x123...",
      propertyOwner: CONTRACT_ADDRESSES.DEPLOYER,
      propertyName: "Saigon Pearl Residence",
      propertySymbol: "SAIGO",
      totalValue: "150000000000000000000000",
      totalShares: "500",
      availableShares: "500",
      remainingShares: "500",
      soldShares: "0",
      yieldPerBlock: "0",
      yieldReserve: "0",
      propertyType: "1",
      propertyTypeName: "Residential",
      isActive: true,
      createdAt: Date.now().toString(),
      sharePrice: "300000000000000000000",
      soldPercentage: 0,
      availabilityPercentage: 100,
      apy: 5.5
    }
  ]
}

// Get property details hook
export function useGetPropertyDetails(propertyId: number) {
  return useQuery({
    queryKey: ['propertyDetails', propertyId],
    queryFn: async (): Promise<PropertyInfo | null> => {
      try {
        const { createPublicClient, http } = await import('viem')
        
        const client = createPublicClient({
          chain: baseSepolia,
          transport: http('https://sepolia.base.org')
        })
        
        const info = await client.readContract({
          address: CONTRACT_ADDRESSES.LAND_TOKENIZER as `0x${string}`,
          abi: LandTokenizerABI,
          functionName: 'getPropertyInfo',
          args: [BigInt(propertyId)],
        })
        
        const [contractAddress, paymentToken, propertyName, propertySymbol, totalValue, totalSupply, yieldRate, startDate, landType, deployer, deployedAt, active] = info as [string, string, string, string, bigint, bigint, bigint, bigint, bigint, string, bigint, boolean]
        
        return {
          contractAddress,
          propertyOwner: deployer,
          propertyName,
          propertySymbol,
          totalValue: totalValue.toString(),
          totalShares: totalSupply.toString(),
          availableShares: totalSupply.toString(),
          yieldPerBlock: yieldRate.toString(),
          yieldReserve: "0",
          propertyType: landType.toString(),
          isActive: active,
          createdAt: deployedAt.toString(),
          sharePrice: (totalValue / totalSupply).toString()
        }
      } catch (error) {
        console.error('Error fetching property details:', error)
        return null
      }
    },
    enabled: propertyId > 0,
    staleTime: 30000,
  })
}

// Investment hook
export function useInvestInProperty() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  
  const investInProperty = async (propertyAddress: string, shareAmount: number, userAddress: string) => {
    // Note: Land contract's mint() function only mints 1 NFT per call
    // For multiple NFTs, we need to call mint() multiple times
    // For now, let's mint just 1 NFT - we can enhance this later for batch minting
    
    if (shareAmount > 1) {
      console.warn(`Requested ${shareAmount} NFTs, but currently only minting 1 NFT per transaction. Consider implementing batch minting.`)
    }
    
    writeContract({
      address: propertyAddress as `0x${string}`,
      abi: LandABI,
      functionName: 'mint',
      args: [userAddress], // mint(address to) - recipient address
    })
  }
  
  return {
    investInProperty,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

// Purchase shares hook (alias for investment hook)
export function usePurchaseShares() {
  return useInvestInProperty()
}

// Faucet hook for minting USDT
export function useMintUSDT() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  
  const mintUSDT = (to: string, amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.USDT as `0x${string}`,
      abi: MockUSDTABI,
      functionName: 'mint',
      args: [to, amount],
    })
  }
  
  return {
    mintUSDT,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

// Hook to get USDT balance
export function useUSDTBalance(address?: string) {
  return useReadContract({
    abi: MockUSDTABI,
    address: CONTRACT_ADDRESSES.USDT as `0x${string}`,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
  })
}

// Hook to approve USDT spending
export function useApproveUSDT() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  
  const approveUSDT = (spender: string, amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.USDT as `0x${string}`,
      abi: MockUSDTABI,
      functionName: 'approve', 
      args: [spender, amount],
    })
  }
  
  return {
    approveUSDT,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

// Hook to check USDT allowance
export function useUSDTAllowance(owner?: string, spender?: string) {
  return useReadContract({
    abi: MockUSDTABI,
    address: CONTRACT_ADDRESSES.USDT as `0x${string}`,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    chainId: baseSepolia.id,
  })
}

// Hook to get token statistics from Land contract
export function useGetTokenStats(landContractAddress?: string) {
  return useReadContract({
    abi: LandABI,
    address: landContractAddress as `0x${string}`,
    functionName: 'getTokenStats',
    args: [],
    chainId: baseSepolia.id,
    query: {
      enabled: !!landContractAddress,
    },
  })
}

// Hook to get NFT balance for a specific property
export function useNFTBalance(propertyAddress: string, userAddress?: string) {
  return useReadContract({
    abi: LandABI,
    address: propertyAddress as `0x${string}`,
    functionName: 'balanceOf',
    args: [userAddress as `0x${string}`],
    chainId: baseSepolia.id,
    query: {
      enabled: !!propertyAddress && !!userAddress,
    },
  })
}

// Individual property balance hook
export function usePropertyBalance(propertyAddress: string, userAddress?: string) {
  return useReadContract({
    abi: LandABI,
    address: propertyAddress as `0x${string}`,
    functionName: 'balanceOf',
    args: [userAddress as `0x${string}`],
    chainId: baseSepolia.id,
    query: {
      enabled: !!propertyAddress && !!userAddress,
    },
  })
}

// Hook to get property name
export function usePropertyName(propertyAddress: string) {
  return useReadContract({
    abi: LandABI,
    address: propertyAddress as `0x${string}`,
    functionName: 'name',
    args: [],
    chainId: baseSepolia.id,
    query: {
      enabled: !!propertyAddress,
    },
  })
}

// Hook to get property symbol
export function usePropertySymbol(propertyAddress: string) {
  return useReadContract({
    abi: LandABI,
    address: propertyAddress as `0x${string}`,
    functionName: 'symbol',
    args: [],
    chainId: baseSepolia.id,
    query: {
      enabled: !!propertyAddress,
    },
  })
}

// Hook to get property type
export function usePropertyType(propertyAddress: string) {
  return useReadContract({
    abi: LandABI,
    address: propertyAddress as `0x${string}`,
    functionName: 'i_landType',
    args: [],
    chainId: baseSepolia.id,
    query: {
      enabled: !!propertyAddress,
    },
  })
}

// Hook to get property initial value
export function usePropertyValue(propertyAddress: string) {
  return useReadContract({
    abi: LandABI,
    address: propertyAddress as `0x${string}`,
    functionName: 'i_initialValue',
    args: [],
    chainId: baseSepolia.id,
    query: {
      enabled: !!propertyAddress,
    },
  })
}

// Hook to get yield rate
export function usePropertyYieldRate(propertyAddress: string) {
  return useReadContract({
    abi: LandABI,
    address: propertyAddress as `0x${string}`,
    functionName: 'yieldRate',
    args: [],
    chainId: baseSepolia.id,
    query: {
      enabled: !!propertyAddress,
    },
  })
}

// Hook to withdraw yield from a single property
export function useWithdrawYield(propertyAddress: string) {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const withdrawYield = () => {
    writeContract({
      abi: LandABI,
      address: propertyAddress as `0x${string}`,
      functionName: 'withdrawYield',
      args: [],
      chainId: baseSepolia.id,
    })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    withdrawYield,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}