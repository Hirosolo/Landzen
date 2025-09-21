"use client";
import Image from "next/image";
import { useGetAllProperties } from "@/lib/hooks";
import { formatUSDTSafe, toBigInt } from "@/lib/utils";

type PropertyInfoContentProps = {
  propertyId: number | string;
};

export default function PropertyInfoContent({
  propertyId,
}: PropertyInfoContentProps) {
  const { data: properties, isLoading } = useGetAllProperties();

  // Find the specific property
  const property = properties?.find((p) => p.id === propertyId);

  if (isLoading || !property) {
    return (
      <div className="min-h-screen bg-beige-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Calculate values using your formula
  const totalValue = toBigInt(property.totalValue);
  const totalShares = toBigInt(property.totalShares);
  const availableShares = toBigInt(property.availableShares);
  const soldShares = totalShares - availableShares;

  // Project raised calculation: (totalValue / totalShares) * soldShares
  const sharePrice = totalShares > 0 ? totalValue / totalShares : BigInt(0);
  const projectRaised = sharePrice * soldShares;
  const goal = totalValue;
  const progress = goal > 0 ? Number((projectRaised * BigInt(100)) / goal) : 0;

  // Investment details calculations
  const nftPrice = sharePrice;
  const rentalYield = property.apy;
  const mockAnnualReturn = 10.36; // As discussed, keep this mocked
  const mockProjectLength = "90 days"; // Mock value

  return (
    <div className="min-h-screen bg-beige-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="col-span-2 space-y-4">
          <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md">
            <Image
              src="/image-property.png"
              alt={`Property #${property.id}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative w-full h-28 rounded-xl overflow-hidden shadow"
              >
                <Image
                  src={`/image-property.png`}
                  alt={`Thumbnail ${i}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>

          {/* Property Details */}
          <div className="bg-beigi-100 rounded-2xl shadow p-4 space-y-4 text-moss-600">
            <h2 className="text-xl font-semibold">Properties Details</h2>
            <p className="flex items-center space-x-2 text-moss-600">
              <span>📍</span>
              <span>Ho Chi Minh</span>
            </p>
            <div className="flex space-x-3">
              <span className="px-3 py-1 bg-moss-600 rounded-full text-sm font-medium text-beige-100">
                {property.propertyTypeName}
              </span>
              <span className="px-3 py-1 bg-moss-600 rounded-full text-sm font-medium text-beige-100">
                3 Bedrooms
              </span>
              <span className="px-3 py-1 bg-moss-600 rounded-full text-sm font-medium text-beige-100">
                2 Bathrooms
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Property #{property.id} - A premium real estate investment
              opportunity featuring modern amenities and excellent location.
              This property offers fractional ownership through blockchain
              technology, providing transparent and secure investment
              opportunities with competitive rental yields. The property is
              strategically located in Ho Chi Minh City, one of the
              fastest-growing markets in Southeast Asia, offering significant
              potential for both rental income and capital appreciation.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Project Raised */}
          <div className="bg-moss-500 p-4 rounded-2xl shadow space-y-3">
            <h3 className="font-semibold text-lg">Project Raised</h3>
            <div className="w-full bg-[#78787833] rounded-full h-2.5">
              <div
                className="bg-moss-700 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-100">
              {formatUSDTSafe(projectRaised)}/{formatUSDTSafe(goal)}
            </p>
          </div>

          {/* Financial Returns */}
          <div className="bg-moss-500 p-6 rounded-2xl shadow space-y-6">
            <h3 className="font-semibold text-xl text-moss-900">
              Financial Returns
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex w-full rounded-xl overflow-hidden border border-moss-700">
                <input
                  type="number"
                  defaultValue={1}
                  min={1}
                  max={Number(availableShares)}
                  className="w-full p-3 text-lg font-semibold bg-beige-100 focus:outline-none text-moss-700"
                  readOnly
                />
                <span className="flex items-center px-4 font-bold text-moss-700 bg-beige-100">
                  NFT
                </span>
              </div>
              <button className="bg-moss-700 text-beige-100 px-6 py-3 rounded-xl font-semibold">
                INVEST
              </button>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-beige-100 text-base">
              <p className="font-semibold">Total Paid</p>
              <p className="text-right">{formatUSDTSafe(nftPrice)}</p>
              <p className="font-semibold">Monthly Earned</p>
              <p className="text-right">TBA</p>
              <p className="font-semibold">Annually Earned</p>
              <p className="text-right">TBA</p>
              <p className="font-semibold">Start Date</p>
              <p className="text-right">TBA</p>
              <p className="font-semibold">End Date</p>
              <p className="text-right">TBA</p>
              <p className="font-semibold">Total Profit</p>
              <p className="text-right">TBA</p>
            </div>
          </div>

          {/* Investment Details */}
          <div className="bg-moss-500 p-4 rounded-2xl shadow space-y-4">
            <h3 className="font-semibold text-lg">Investment Details</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-moss-700">
                  {formatUSDTSafe(totalValue)}
                </p>
                <p className="text-xs text-moss-700">Property Value</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-moss-700">{Number(totalShares)}</p>
                <p className="text-xs text-moss-700">Total Supply</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-moss-700">
                  {formatUSDTSafe(nftPrice)}
                </p>
                <p className="text-xs text-moss-700">NFT Price</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-moss-700">
                  {rentalYield.toFixed(2)}%
                </p>
                <p className="text-xs text-moss-700">Rental Yield</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-moss-700">{mockAnnualReturn}%</p>
                <p className="text-xs text-moss-700">Annual Return</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-moss-700">{mockProjectLength}</p>
                <p className="text-xs text-moss-700">Project Length</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
