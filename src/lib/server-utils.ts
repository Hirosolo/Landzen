import { createPublicClient, http } from 'viem'
import { baseSepolia } from './wagmi'
import { CONTRACT_ADDRESSES, PROPERTY_TYPES } from './contracts'
import { LandTokenizerABI, LandABI } from './abis'
import type { PropertyData } from './hooks'

export async function fetchPropertyData(propertyId: number): Promise<PropertyData | null> {
  try {
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http('https://sepolia.base.org')
    })
    
    // Get basic property info from tokenizer
    const basicInfo = await client.readContract({
      address: CONTRACT_ADDRESSES.LAND_TOKENIZER as `0x${string}`,
      abi: LandTokenizerABI,
      functionName: 'getPropertyBasics',
      args: [BigInt(propertyId)],
    })
    
    const [landContract, paymentToken, propertyName, totalValue, totalSupply, active] = basicInfo as [string, string, string, bigint, bigint, boolean]
    
    if (!active) {
      return null
    }
    
    // Get land type and yield rate from the Land contract
    const landType = await client.readContract({
      address: landContract as `0x${string}`,
      abi: LandABI,
      functionName: 'i_landType',
    }) as bigint
    
    const yieldRate = await client.readContract({
      address: landContract as `0x${string}`,
      abi: LandABI,
      functionName: 'yieldRate',
    }) as bigint
    
    // Calculate basic values
    const propertySymbol = propertyName.substring(0, 5).toUpperCase().replace(/\\s/g, '')
    const sharePrice = totalSupply > BigInt(0) ? totalValue / totalSupply : BigInt(0)
    const soldShares = BigInt(0) // For now, assume no shares are sold
    const availableShares = totalSupply
    const soldPercentage = 0
    const availabilityPercentage = 100
    
    // Calculate APY
    const blocksPerYear = 2628000
    let apy = 0
    if (sharePrice > BigInt(0) && yieldRate > BigInt(0)) {
      const annualYieldPerToken = yieldRate * BigInt(blocksPerYear)
      apy = Number(annualYieldPerToken * BigInt(100)) / Number(sharePrice)
    }
    
    // Map land type to property type name
    const propertyTypeData = PROPERTY_TYPES[Number(landType)]
    const propertyTypeName = propertyTypeData?.name || `Type ${Number(landType)}`
    
    return {
      id: propertyId,
      contractAddress: landContract,
      propertyOwner: CONTRACT_ADDRESSES.DEPLOYER,
      propertyName,
      propertySymbol,
      totalValue: totalValue.toString(),
      totalShares: totalSupply.toString(),
      availableShares: availableShares.toString(),
      remainingShares: availableShares.toString(),
      soldShares: soldShares.toString(),
      yieldPerBlock: yieldRate.toString(),
      yieldReserve: "0",
      propertyType: landType.toString(),
      propertyTypeName,
      isActive: active,
      createdAt: Date.now().toString(),
      sharePrice: sharePrice.toString(),
      soldPercentage,
      availabilityPercentage,
      apy
    }
  } catch (error) {
    console.error('Error fetching property data:', error)
    return null
  }
}