import React from "react";
import { motion, Variants } from "framer-motion";
import ConnectWalletModal from "./connectWallet";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1], // cubic-bezier (easeOut)
    },
  }),
};

export default function LandingPageGuide() {
  return (
    <section className="w-screen bg-beige-100 mx-auto px-6 py-12 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-semibold">
          Effortless Property Investment in 3 Steps
        </h2>
        <p className="mt-3 text-sm md:text-base text-slate-600">
          Unlock the world of property investment with ease through Landshare
          and RWA tokens. Our simple, 3-step process lets you invest in real
          estate without the complexities of traditional methods.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
        {[
          {
            step: "1",
            title: "Connect Wallet",
            content: (
              <>
                <ConnectWalletModal />
                <button className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-beige-100 text-darkGreen text-sm shadow-sm hover:bg-beige-300 transition-colors">
                  Connect Wallet
                </button>
              </>
            ),
          },
          {
            step: "2",
            title: "Invest in NFT",
            content: (
              <>
                <div className="flex flex-col justify-between w-64 h-69 rounded-xl shadow p-4 bg-beige-100">
                  <div>
                    <h3 className="text-lg font-semibold">Invest Properties</h3>
                    <p className="text-sm text-gray-500">
                      Own properties instantly
                    </p>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 px-4 py-2 rounded-full bg-moss-500 text-gray-800 font-medium hover:scale-105 transition-transform">
                      Invest
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-full bg-darkGreen text-white font-medium hover:scale-105 transition-transform">
                      Harvest
                    </button>
                  </div>
                </div>
                <button className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-beige-100 text-darkGreen text-sm shadow-sm hover:bg-beige-300 transition-colors">
                  View Projects
                </button>
              </>
            ),
          },
          {
            step: "3",
            title: "Hold & Earn",
            content: (
              <>
                <img src="/image-hold.svg" alt="" className="w-90" />
                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-beige-100 text-darkGreen text-sm shadow-sm hover:bg-beige-300 transition-colors"
                >
                  Go to Dashboard
                </button>
              </>
            ),
          },
        ].map((card, i) => (
          <motion.article
            key={card.step}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-darkGreen flex flex-col items-center gap-4 p-6 border rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-4 pr-5">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-beige-100 text-darkGreen font-semibold">
                {card.step}
              </div>
              <h3 className="text-lg font-medium font-semibold text-beige-100">
                {card.title}
              </h3>
            </div>
            {card.content}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
