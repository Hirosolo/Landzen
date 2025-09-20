"use client";
import { useState } from "react";

type PropertyCardProps = {
  id: number | string;
  isFavorited?: boolean;
  onBuy?: (id: number | string) => void;
};

export default function PropertyCard({
  id,
  isFavorited = false,
  onBuy,
}: PropertyCardProps) {
  const [favourite, setFavourite] = useState(true);

  const current = 500000;
  const total = 1000000;
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      {/* Image with overlay text */}
      <div className="relative">
        <img
          className="w-full h-60 object-cover"
          src="/image-property.png"
          alt="Property"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Location link */}
        <a
          href="https://maps.app.goo.gl/uHn6UMmqy2U7zu3S8"
          className="absolute bottom-3 left-3 flex items-center text-white text-sm font-medium drop-shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-4 h-4 mr-1 text-green-400"
          >
            <path d="M12 21c4.97-4.97 8-8.03 8-11.5A8 8 0 004 9.5C4 13 7.03 16.03 12 21z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
          Ho Chi Minh
        </a>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-4">
        {/* Location */}

        {/* Property title + type */}
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900">VINHOMES GRAND PARK</h3>
          <span className="text-xs bg-moss-100 text-gray-700 font-semibold px-3 py-1 rounded-full">
            Residential Home
          </span>
        </div>

        {/* Info row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-gray-500 text-xs">Property Value</p>
            <p className="font-bold text-gray-900">$1,000</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Rental Yield</p>
            <p className="font-bold text-gray-900">9.32%</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Annual Return</p>
            <p className="font-bold text-gray-900">10.36%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1 text-xs">
            <span className="text-green font-medium">Available</span>
            <span className="text-gray-600">
              {current.toLocaleString()}/{total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Invest button */}
        <button
          onClick={() => onBuy?.(id)}
          className="w-full bg-green-800 hover:bg-green-800 text-white text-sm font-semibold px-4 py-3 rounded-md shadow hover:cursor-pointer"
        >
          INVEST NOW
        </button>
      </div>
    </div>
  );
}
