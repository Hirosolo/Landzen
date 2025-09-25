"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { LandABI } from "@/lib/abis";
import { PROPERTY_ADDRESSES } from "@/lib/contracts";
import { baseSepolia } from "@/lib/wagmi";
import { createPublicClient, http } from "viem";
import { motion } from "framer-motion";

interface HarvestModalProps {
  onClose: () => void;
  availableToClaim: number;
}

interface PropertyWithNFTs {
  address: string;
  balance: number;
  isHarvesting: boolean;
  isComplete: boolean;
  hash?: `0x${string}`;
}

export function HarvestModal({ onClose, availableToClaim }: HarvestModalProps) {
  const { address: userAddress } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const [properties, setProperties] = useState<PropertyWithNFTs[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Scan for properties with NFTs when modal opens
  useEffect(() => {
    const scanProperties = async () => {
      if (!userAddress) return;

      const client = createPublicClient({
        chain: baseSepolia,
        transport: http("https://sepolia.base.org"),
      });

      const propertiesWithNFTs: PropertyWithNFTs[] = [];

      for (const propertyAddress of PROPERTY_ADDRESSES) {
        try {
          const balance = await client.readContract({
            address: propertyAddress as `0x${string}`,
            abi: LandABI,
            functionName: "balanceOf",
            args: [userAddress as `0x${string}`],
          });

          if (Number(balance) > 0) {
            propertiesWithNFTs.push({
              address: propertyAddress,
              balance: Number(balance),
              isHarvesting: false,
              isComplete: false,
            });
          }
        } catch (error) {
          console.error(
            `Error checking balance for ${propertyAddress}:`,
            error
          );
        }
      }

      setProperties(propertiesWithNFTs);
      setIsScanning(false);
    };

    scanProperties();
  }, [userAddress]);

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && hash) {
      setProperties((prev) =>
        prev.map((p) =>
          p.isHarvesting ? { ...p, isHarvesting: false, isComplete: true } : p
        )
      );
    }
  }, [isConfirmed, hash]);

  const harvestFromProperty = (propertyAddress: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.address === propertyAddress ? { ...p, isHarvesting: true } : p
      )
    );

    writeContract({
      abi: LandABI,
      address: propertyAddress as `0x${string}`,
      functionName: "withdrawYield",
      args: [],
      chainId: baseSepolia.id,
    });
  };

  const harvestAll = () => {
    const firstIncomplete = properties.find(
      (p) => !p.isComplete && !p.isHarvesting
    );
    if (firstIncomplete) {
      harvestFromProperty(firstIncomplete.address);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Harvest Yield</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            Available to claim:{" "}
            <span className="font-bold text-green-600">
              ${availableToClaim.toFixed(2)}
            </span>
          </p>
        </div>

        {isScanning ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Scanning properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No properties found with NFTs</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Found {properties.length} properties with NFTs
              </p>
              <button
                onClick={harvestAll}
                disabled={properties.every((p) => p.isComplete)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Harvest All
              </button>
            </div>

            {properties.map((property, index) => (
              <div key={property.address} className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Property #{index + 1}
                    </p>
                    <p className="text-xs text-gray-500">
                      {property.address.slice(0, 10)}...
                      {property.address.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {property.balance} NFTs
                    </p>
                  </div>
                  <button
                    onClick={() => harvestFromProperty(property.address)}
                    disabled={property.isHarvesting || property.isComplete}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {property.isComplete
                      ? "✅ Done"
                      : property.isHarvesting
                      ? "Harvesting..."
                      : "Harvest"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
