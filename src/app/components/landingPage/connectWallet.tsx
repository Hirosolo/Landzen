import React from "react";

export default function ConnectWalletModal() {
  return (
    <div className=" flex items-center justify-center p-4 w-96 ">
      <div className="w-full max-w-sm bg-beige-100 text-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-center p-4 border-xs border-gray-400">
          <h2 className="text-base font-medium text-darkGreen font-semibold">Connect Wallet</h2>
        </div>

        {/* Wallet List */}
        <div className="flex flex-col divide-y divide-white/10">
          {/* Rabby Wallet */}
          <div className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer border-xs border-gray-400">
            <div className="flex items-center gap-3 text-darkGreen">
              <img src="/logo-rabby.png" alt="" />
              <span>Rabby Wallet</span>
            </div>
          </div>

          {/* OKX Wallet */}
          <div className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer border-xs border-gray-400">
            <div className="flex items-center gap-3 text-darkGreen">
            <img src="/logo-OKX.png" alt="" />
              <span>OKX Wallet</span>
            </div>
          </div>

          {/* MetaMask */}
          <div className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer">
            <div className="flex items-center gap-3 text-darkGreen">
            <img src="/logo-metamask.png" alt="" />
              <span>MetaMask</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
