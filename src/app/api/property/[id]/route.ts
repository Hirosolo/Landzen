import { NextRequest, NextResponse } from 'next/server'
import { fetchPropertyData } from '@/lib/hooks'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = parseInt(params.id)
    
    if (isNaN(propertyId) || propertyId < 1) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    const propertyData = await fetchPropertyData(propertyId)
    
    if (!propertyData) {
      return NextResponse.json(
        { error: 'Property not found or inactive' },
        { status: 404 }
      )
    }

    // Convert BigInt values to strings for JSON serialization
    const serializedData = {
      ...propertyData,
      totalValue: propertyData.totalValue.toString(),
      totalShares: propertyData.totalShares.toString(),
      availableShares: propertyData.availableShares.toString(),
      remainingShares: propertyData.remainingShares.toString(),
      soldShares: propertyData.soldShares.toString(),
      yieldPerBlock: propertyData.yieldPerBlock.toString(),
      yieldReserve: propertyData.yieldReserve.toString(),
      propertyType: propertyData.propertyType.toString(),
      createdAt: propertyData.createdAt.toString(),
      sharePrice: propertyData.sharePrice.toString(),
    }

    return NextResponse.json(serializedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
