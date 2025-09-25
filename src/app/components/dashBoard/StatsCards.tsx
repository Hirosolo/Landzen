"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

type StatsCardsProps = {
  rwaBalance: string;
  rentalYield: string;
  activeProperty: string;
  autoRedeem?: boolean;
  onAutoRedeemChange?: (checked: boolean) => void;
};

// 🔹 Reusable hook to count up without rounding
function useCountUp(target: number, duration = 1.5, decimals = 0) {
  const [value, setValue] = useState(0);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionValue, target, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        // keep the raw increasing value, not rounded up
        setValue(Number(latest));
      },
    });
    return () => controls.stop();
  }, [target, duration, motionValue]);

  return value.toFixed(decimals); // keep decimals but no forced rounding up
}

export default function StatsCards({
  rwaBalance,
  rentalYield,
  activeProperty,
  autoRedeem = false,
  onAutoRedeemChange,
}: StatsCardsProps) {
  // parse values from props
  const rwa = parseFloat(rwaBalance) || 0;
  const rental = parseFloat(rentalYield) || 0;
  const active = parseFloat(activeProperty) || 0;

  // animated numbers
  const rwaAnimated = useCountUp(rwa, 1.5, 2);     // show 2 decimals
  const rentalAnimated = useCountUp(rental, 1.5, 3); // more precise (3 decimals)
  const activeAnimated = useCountUp(active, 1.5, 0); // integer only

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-60">
      {/* Available to claim */}
      <motion.div
        className="bg-gray-800 rounded-xl p-6 flex flex-col items-start justify-center bg-green"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-2xl text-beige-100">Available to claim</p>
        <p className="text-4xl font-bold mt-2 text-beige-100">
          {rwaAnimated}
        </p>
        <label className="mt-3 flex items-center gap-2 text-sm text-green bg-beige-100 rounded rounded-md border px-3 py-2">
          <button>Harvest</button>
        </label>
      </motion.div>

      {/* Monthly Earnings */}
      <motion.div
        className="bg-gray-800 rounded-xl p-6 flex flex-col justify-center bg-green"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p className="text-2xl text-beige-100">Monthly Earnings</p>
        <p className="text-4xl font-bold mt-2 text-beige-100">
          ${rentalAnimated}
        </p>
      </motion.div>

      {/* Total Investment */}
      <motion.div
        className="bg-gray-800 rounded-xl p-6 flex flex-col justify-center bg-green"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p className="text-2xl text-beige-100">Total Investment</p>
        <p className="text-4xl font-bold mt-2 text-beige-100">
          ${activeAnimated}
        </p>
      </motion.div>
    </div>
  );
}
