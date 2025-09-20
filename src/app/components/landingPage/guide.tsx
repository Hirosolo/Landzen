import React from "react";
import ConnectWalletModal from "./connectWallet";

export default function LandingPageGuide() {
  return (
    <section className="w-screen bg-beige-100 mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Effortless Property Investment in 3 Steps
        </h2>
        <p className="mt-3 text-sm md:text-base text-slate-600">
          Unlock the world of property investment with ease through Landshare
          and RWA tokens. Our simple, 3-step process lets you invest in real
          estate without the complexities of traditional methods.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
        {/* Step 1 */}
        <article className="bg-darkGreen flex flex-col items-center gap-4 p-6 border rounded-2xl hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 pr-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-beige-100 text-darkGreen font-semibold">
              1
            </div>
            <h3 className="text-lg font-medium font-semibold text-beige-100">
              Connect Wallet
            </h3>
          </div>
          <ConnectWalletModal />
          <button className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-beige-100 text-darkGreen text-sm shadow-sm hover:bg-beige-300">
            Connect Wallet
          </button>
        </article>

        {/* Step 2 */}
        <article className="bg-darkGreen flex flex-col items-center gap-4 p-6 border rounded-2xl hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 pr-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-beige-100 text-darkGreen font-semibold">
              2
            </div>
            <h3 className="text-lg font-medium font-semibold text-beige-100">
              Invest in NFT
            </h3>
          </div>

          <div className="flex flex-col justify-between w-64 h-69 rounded-xl shadow p-4 bg-beige-100">
            {/* Header */}
            <div>
              <h3 className="text-lg font-semibold">Invest Properties</h3>
              <p className="text-sm text-gray-500">Own properties instantly</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-auto">
              <button className="flex-1 px-4 py-2 rounded-full bg-moss-500 text-gray-800 font-medium">
                Invest
              </button>
              <button className="flex-1 px-4 py-2 rounded-full bg-darkGreen text-white font-medium">
                Harvest
              </button>
            </div>
          </div>

          <button className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-beige-100 text-darkGreen text-sm shadow-sm hover:bg-beige-300">
            View Projects
          </button>
        </article>

        {/* Step 3 */}
        <article className="bg-darkGreen flex flex-col items-center gap-4 p-6 border rounded-2xl hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 pr-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-beige-100 text-darkGreen font-semibold">
              3
            </div>
            <h3 className="text-lg font-medium font-semibold text-beige-100">
              Hold & Earn
            </h3>
          </div>
          <img src="/image-hold.svg" alt="" className="w-90" />
          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-beige-100 text-darkGreen text-sm shadow-sm hover:bg-beige-300"
          >
            Go to Dashboard
          </button>
        </article>
      </div>
    </section>
  );
}
