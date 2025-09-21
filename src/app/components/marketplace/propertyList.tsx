"use client";

import PropertyCard from "./propertyCard";
import { useGetAllProperties } from "@/lib/hooks";

type PropertyListProps = {
  onBuy?: (id: number | string) => void;
};

export default function PropertyList({ onBuy }: PropertyListProps) {
  const { data: properties, isLoading, error } = useGetAllProperties();

  if (isLoading) {
    return (
      <div className="pt-4 w-full flex justify-center">
        <div className="w-full max-w-8xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white animate-pulse"
            >
              <div className="w-full h-60 bg-gray-300"></div>
              <div className="p-4 space-y-4">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-gray-300 rounded"></div>
                  <div className="h-12 bg-gray-300 rounded"></div>
                  <div className="h-12 bg-gray-300 rounded"></div>
                </div>
                <div className="h-2 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-4 w-full flex justify-center">
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">Error loading properties</p>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="pt-4 w-full flex justify-center">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No active properties found</p>
          <p className="text-gray-500 mt-2">
            Check back later for new investment opportunities
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 w-full flex justify-center">
      <div className="w-full max-w-8xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} onBuy={onBuy} />
        ))}
      </div>
    </div>
  );
}
