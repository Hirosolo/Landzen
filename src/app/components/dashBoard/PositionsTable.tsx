import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Position = {
  id: string;
  name: string;
  symbol: string;
  protocol: string;
  balance: string;
  balanceDetail: string;
  balancePercent: number;
  price: string;
  icon: string;
  protocolIcon: string;
};

type PositionsTableProps = {
  positions: Position[];
  onAddPosition?: (positionId: string) => void;
};

export default function PositionsTable({ positions, onAddPosition }: PositionsTableProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow space-y-4">
      {/* Header */}
      <div className="grid grid-cols-5 text-sm text-gray-400 font-medium border-b border-gray-700 pb-2">
        <p>Position</p>
        <p>Protocol</p>
        <p>Balance</p>
        <p>Balance %</p>
        <p>Price (24h)</p>
      </div>

      {/* Rows */}
      <div className="space-y-4">
        {positions.map((pos) => (
          <div
            key={pos.id}
            className="grid grid-cols-5 items-center text-sm bg-gray-900/40 rounded-xl p-3 hover:bg-gray-700/40 transition"
          >
            {/* Position */}
            <div className="flex items-center gap-3">
              <img src={pos.icon} alt={pos.name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="font-semibold text-white">{pos.name}</p>
                <p className="text-gray-400 text-xs">{pos.symbol}</p>
              </div>
            </div>

            {/* Protocol */}
            <div className="flex items-center gap-2">
              <img src={pos.protocolIcon} alt={pos.protocol} className="w-5 h-5 rounded-full" />
              <p className="text-white">{pos.protocol}</p>
            </div>

            {/* Balance */}
            <div>
              <p className="text-white font-medium">{pos.balance}</p>
              <p className="text-gray-400 text-xs">{pos.balanceDetail}</p>
            </div>

            {/* Balance % with mini chart */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        { value: pos.balancePercent },
                        { value: 100 - pos.balancePercent },
                      ]}
                      innerRadius={6}
                      outerRadius={12}
                      startAngle={90}
                      endAngle={450}
                      dataKey="value"
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#1f2937" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-white">{pos.balancePercent}%</p>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <p className="text-white">{pos.price}</p>
              <button 
                onClick={() => onAddPosition?.(pos.id)}
                className="ml-3 text-xs px-3 py-1 bg-green-600 text-black rounded-lg hover:bg-green-500 transition"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
