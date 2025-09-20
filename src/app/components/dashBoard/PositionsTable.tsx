import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Position = {
  id: string;
  name: string;
  type: string;
  balance: string;
  balanceDetail: string;
  balancePercent: number;
  price: string;
};

type PositionsTableProps = {
  positions: Position[];
  onAddPosition?: (positionId: string) => void;
};

export default function PositionsTable({
  positions,
  onAddPosition,
}: PositionsTableProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow space-y-4 bg-green">
      {/* Header */}
      <div className="grid grid-cols-5 text-sm text-gray-400 font-medium border-b border-gray-700 pb-2">
        <p>Position</p>
        <p>Type</p>
        <p>Amount</p>
        <p>Monthly Payout</p>
        <p>Price (24h)</p>
        <p>End Date</p>
      </div>

      {/* Rows */}
      <div className="space-y-4">
        {positions.map((pos) => (
          <div
            key={pos.id}
            className="grid grid-cols-5 items-center text-sm bg-green-600 rounded-xl p-3 hover:bg-gray-700/40 transition"
          >
            {/* Position */}
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold text-white">{pos.name}</p>
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center justify-between">
              <p className="text-white">{pos.type}</p>
            </div>

            {/* Amount */}
            <div>
              <p className="text-white font-medium">{pos.balance}</p>
            </div>

            {/* Monthly Payout */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6"></div>
              <p className="w-6 h-6 text-white">{pos.balancePercent}%</p>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <p className="text-white">${pos.price}</p>
              <button
                onClick={() => onAddPosition?.(pos.id)}
                className="ml-3 text-xs px-3 py-2 bg-green-600 text-black rounded-lg hover:bg-green-500 transition"
              >
                Unavailable
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
