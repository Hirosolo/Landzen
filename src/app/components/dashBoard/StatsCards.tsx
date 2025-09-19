type StatsCardsProps = {
  rwaBalance: string;
  rentalYield: string;
  annualReturn: string;
  autoRedeem?: boolean;
  onAutoRedeemChange?: (checked: boolean) => void;
};

export default function StatsCards({ 
  rwaBalance, 
  rentalYield, 
  annualReturn, 
  autoRedeem = false,
  onAutoRedeemChange 
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-60">
      <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-start justify-center">
        <p className="text-gray-400 text-2xl">My RWA Balance</p>
        <p className="text-4xl font-bold mt-2">{rwaBalance}</p>
        <label className="mt-3 flex items-center gap-2 text-sm text-gray-400">
          <input 
            type="checkbox" 
            className="accent-green-500" 
            checked={autoRedeem}
            onChange={(e) => onAutoRedeemChange?.(e.target.checked)}
          />
          Auto Redeem
        </label>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 flex flex-col justify-center">
        <p className="text-gray-400 text-2xl">Rental Yield</p>
        <p className="text-4xl font-bold mt-2 text-green-400">{rentalYield}</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 flex flex-col justify-center">
        <p className="text-gray-400 text-2xl">Ann. Return</p>
        <p className="text-4xl font-bold mt-2 text-green-400">{annualReturn}</p>
      </div>
    </div>
  );
}
