type StatsCardsProps = {
  rwaBalance: string;
  rentalYield: string;
  activeProperty: string;
  autoRedeem?: boolean;
  onAutoRedeemChange?: (checked: boolean) => void;
};

export default function StatsCards({ 
  rwaBalance, 
  rentalYield, 
  activeProperty, 
  autoRedeem = false,
  onAutoRedeemChange 
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-60 " >
      <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-start justify-center bg-green">
        <p className="text-2xl text-beige-100">Available to claim</p>
        <p className="text-4xl font-bold mt-2 text-beige-100">{rwaBalance}</p>
        <label className="mt-3 flex items-center gap-2 text-sm text-green bg-beige-100 rounded rounded-md border px-3 py-2">
          <button>Harvest</button>
        </label>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 flex flex-col justify-center bg-green">
        <p className="text-2xl text-beige-100">Monthly Earnings</p>
        <p className="text-4xl font-bold mt-2 text-beige-100">${rentalYield}</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 flex flex-col justify-center bg-green">
        <p className="text-2xl text-beige-100">Active Properties</p>
        <p className="text-4xl font-bold mt-2 text-beige-100">{activeProperty}</p>
      </div>
    </div>
  );
}
