"use client";

import { useState } from "react";
import BalanceChart from "../components/dashBoard/BalanceChart";
import StatsCards from "../components/dashBoard/StatsCards";
import PositionsTable from "../components/dashBoard/PositionsTable";
import MarketplaceSearchBar from "../components/marketplace/header";

export default function Dashboard() {
  const [autoRedeem, setAutoRedeem] = useState(false);

  type Position = {
    id: string;
    name: string;

    type: string;
    balance: string;
    balanceDetail: string;
    balancePercent: number;
    price: string;
  };

  const data: Position[] = [
    {
      id: "1",
      name: "Plume USD",
      type: "Residential Home",
      balance: "1.05",
      balanceDetail: "1.051 pUSD",
      balancePercent: 19.7,
      price: "1.00",
    },
    {
      id: "2",
      name: "Nest Credit Vault",

      type: "Co-Living",
      balance: "1.00",
      balanceDetail: "0.9888 nCREDIT",
      balancePercent: 18.8,
      price: "1.01",
    },
  ];

  const handleAddPosition = (positionId: string) => {
    console.log("Adding position:", positionId);
    // Add your logic here
  };

  return (
    <div>
      <MarketplaceSearchBar />
      <main className="h-screen w-screen bg-beige-100 text-white p-4 sm:p-6">
        <div className="w-full h-full flex flex-col gap-6">
          {/* Chart card */}
          <BalanceChart
            balance="$1.18135"
            change="+0.57%"
            date={new Date().toDateString()}
          />

          {/* Stats cards */}
          <StatsCards
            rwaBalance="0"
            rentalYield="7.164"
            activeProperty="9"
            autoRedeem={autoRedeem}
            onAutoRedeemChange={setAutoRedeem}
          />

          {/* Positions table */}
          <PositionsTable positions={data} onAddPosition={handleAddPosition} />
        </div>
      </main>
    </div>
  );
}
