"use client";
import { useState } from "react";

type PropertyCardProps = {
  id: number | string;
  isFavorited?: boolean;
  onBuy?: (id: number | string) => void;
};

export default function PropertyCard({ id, isFavorited = false, onBuy }: PropertyCardProps) {
  const [favourite, setFavourite] = useState(true);
  // Example values
  const current = 500000;
  const total = 1000000;

  // Calculate percentage
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="w-full rounded-2xl overflow-hidden shadow-lg border bg-white border-gray-300">
        <div className="relative">
          {/* image */}
          <img
            className="w-full h-48 object-cover"
            src="/image-property.png"
            alt="Property"
          />
          {isFavorited && (
            <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1 shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-red-500"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.197 3 12.931 3 10.5 3 8.015 5.015 6 7.5 6c1.357 0 2.66.56 3.595 1.505L12 8.41l.905-.905A5.077 5.077 0 0116.5 6C18.985 6 21 8.015 21 10.5c0 2.431-1.688 4.697-3.989 6.007a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.003a.75.75 0 01-.666 0z" />
              </svg>
            </div>
          )}
          <h2 className="absolute bottom-4 left-4 text-white text-2xl font-bold drop-shadow-md">
            Vinhomes Grand Park
          </h2>
        </div>

        {/* card content */}
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-800 font-bold">VINHOMES GRAND PARK</h3>
            <span className="text-sm bg-green-100 text-green-600 font-semibold px-2 py-1 rounded">
              APY 10%
            </span>
          </div>

          {/* location */}
          <div className="flex items-center text-gray-600 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 mr-1 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21c4.97-4.97 8-8.03 8-11.5A8 8 0 004 9.5C4 13 7.03 16.03 12 21z"
              />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            Ho Chi Minh
          </div>

          {/* progress */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                Available
              </span>
              <span className="text-xs text-gray-600">
                {current.toLocaleString()}/{total.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* buy button */}
          <div className="flex justify-center">
            <button
              onClick={() => onBuy?.(id)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 my-2 rounded-md shadow"
            >
              BUY NOW
            </button>
          </div>

          {/* property details */}
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <p className="text-gray-500">PROPERTY VALUE</p>
              <p className="font-bold text-black">$1,000</p>
            </div>
            <div>
              <p className="text-gray-500">PRICE PER TOKEN</p>
              <p className="font-bold text-black">$0.01</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popup handled at page level via onBuy */}
    </div>
  );
}
