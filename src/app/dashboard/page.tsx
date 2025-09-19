// app/page.tsx
"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,PieChart, Pie, Cell,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [tab, setTab] = useState("1M");

  // Mock data for different tabs
  const dataMap: Record<string, { date: string; price: number }[]> = {
    "1W": [
      { date: "Mon", price: 1.12 },
      { date: "Tue", price: 1.14 },
      { date: "Wed", price: 1.10 },
      { date: "Thu", price: 1.16 },
      { date: "Fri", price: 1.18 },
      { date: "Sat", price: 1.17 },
      { date: "Sun", price: 1.19 },
    ],
    "1M": [
      { date: "Week 1", price: 1.08 },
      { date: "Week 2", price: 1.12 },
      { date: "Week 3", price: 1.15 },
      { date: "Week 4", price: 1.18 },
    ],
    "1Y": [
      { date: "Jan", price: 0.95 },
      { date: "Mar", price: 1.05 },
      { date: "Jun", price: 1.12 },
      { date: "Sep", price: 1.18 },
      { date: "Dec", price: 1.25 },
    ],
  };

  const chartData = dataMap[tab];

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
  
  const data: Position[] = [
    {
      id: "1",
      name: "Plume USD",
      symbol: "pUSD",
      protocol: "Plume",
      balance: "$1.05",
      balanceDetail: "1.051 pUSD",
      balancePercent: 19.7,
      price: "$1.00",
      icon: "/icons/plume-usd.png", // replace with your asset
      protocolIcon: "/icons/plume.png",
    },
    {
      id: "2",
      name: "Nest Credit Vault",
      symbol: "nCREDIT",
      protocol: "Nest",
      balance: "$1.00",
      balanceDetail: "0.9888 nCREDIT",
      balancePercent: 18.8,
      price: "$1.01",
      icon: "/icons/nest-credit.png", // replace with your asset
      protocolIcon: "/icons/nest.png",
    },
  ];

  return (
    <main className="h-screen w-screen bg-gray-900 text-white p-4 sm:p-6">
      {/* Full screen column layout */}
      <div className="w-full h-full flex flex-col gap-6">
        
        {/* Chart card */}
        <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow flex-1 flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="w-6 h-6 rounded-full"
                />
                BALANCE 
              </h2>
              <p className="text-5xl font-bold mt-1">
                $1.18135{" "}
                <span className="text-green-500 text-lg">+0.57%</span>
              </p>
              <p className="text-gray-400 text-md pt-2">Thu Sep 18 2025</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {["1W", "1M", "1Y"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    tab === t
                      ? "bg-green-500 text-black"
                      : "bg-black text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#aaa" />
                <YAxis stroke="#aaa" domain={["dataMin - 0.05", "dataMax + 0.05"]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                  labelStyle={{ color: "#9ca3af" }}
                  cursor={{ stroke: "#4ade80", strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-60">
          <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-start justify-center">
            <p className="text-gray-400 text-2xl">My RWA Balance</p>
            <p className="text-4xl font-bold mt-2">0</p>
            <label className="mt-3 flex items-center gap-2 text-sm text-gray-400">
              <input type="checkbox" className="accent-green-500" />
              Auto Redeem
            </label>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 flex flex-col justify-center">
            <p className="text-gray-400 text-2xl">Rental Yield</p>
            <p className="text-4xl font-bold mt-2 text-green-400">7.164%</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 flex flex-col justify-center">
            <p className="text-gray-400 text-2xl">Ann. Return</p>
            <p className="text-4xl font-bold mt-2 text-green-400">9.324%</p>
          </div>
        </div>

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
            {data.map((pos) => (
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
                <button className="ml-3 text-xs px-3 py-1 bg-green-600 text-black rounded-lg hover:bg-green-500 transition">
                    Add
                </button>
                </div>
            </div>
            ))}
        </div>
        </div>
      </div>
      
    </main>
    
  );
}
