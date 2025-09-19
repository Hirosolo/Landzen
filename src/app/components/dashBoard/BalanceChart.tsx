"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type BalanceChartProps = {
  balance: string;
  change: string;
  date: string;
};

export default function BalanceChart({ balance, change, date }: BalanceChartProps) {
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

  return (
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
            {balance}{" "}
            <span className="text-green-500 text-lg">{change}</span>
          </p>
          <p className="text-gray-400 text-md pt-2">{date}</p>
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
  );
}
