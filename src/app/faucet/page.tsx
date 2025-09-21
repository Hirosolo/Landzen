"use client";
import { useAccount } from "wagmi";
import { useMintUSDT } from "@/lib/hooks";
import { formatUSDT } from "@/lib/contracts";

export default function Faucet() {
  const { address, isConnected } = useAccount();
  const { mintUSDT, isPending, isConfirming, isSuccess, error } = useMintUSDT();

  // Fixed amount: 250,000 USDT (with 6 decimals)
  const MINT_AMOUNT = BigInt(250000 * 1e6);

  const handleMintUSDT = async () => {
    if (!address) return;

    try {
      await mintUSDT(address, MINT_AMOUNT);
    } catch (err) {
      console.error("Mint failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">USDT Faucet</h1>
          <p className="text-gray-600">
            Get test USDT tokens for investing in tokenized real estate
          </p>
        </div>

        <div className="space-y-6">
          {/* Mint Amount Display */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Mint Amount</p>
              <p className="text-2xl font-bold text-green-600">
                {formatUSDT(MINT_AMOUNT)}
              </p>
            </div>
          </div>

          {/* Wallet Connection Status */}
          {isConnected ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Connected Wallet</p>
              <p className="font-mono text-sm text-blue-600 break-all">
                {address}
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-center text-yellow-700">
                Please connect your wallet to mint USDT
              </p>
            </div>
          )}

          {/* Mint Button */}
          <button
            onClick={handleMintUSDT}
            disabled={!isConnected || isPending || isConfirming}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors text-lg"
          >
            {isPending
              ? "Confirm in Wallet..."
              : isConfirming
              ? "Minting USDT..."
              : "Mint 250,000 USDT"}
          </button>

          {/* Status Messages */}
          {isSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    Successfully minted {formatUSDT(MINT_AMOUNT)} USDT!
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    Error: {error.message || "Failed to mint USDT"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">How to use:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. Connect your wallet</li>
              <li>2. Click &quot;Mint 250,000 USDT&quot;</li>
              <li>3. Confirm the transaction</li>
              <li>4. Use USDT to invest in properties</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
