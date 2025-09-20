"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function MarketplaceSearchBar() {
  const pathname = usePathname();
  
  const isDashboard = pathname === "/dashboard";
  const isMarketplace = pathname === "/marketPlace";

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-beige border-none">
      <div className="flex items-center gap-4">
        <img
          src="/logo-landzen.png"
          onClick={() => (window.location.href = "/recuiter/landingPage")}
          alt="Logo"
          className="h-12 w-13 cursor-pointer border-none"
        />
      </div>
      <div>
        <button 
          onClick={()=>{window.location.href="/dashboard"}}
          className={`text-green font-semibold px-2.5 transition-all duration-200 ${
            isDashboard 
              ? 'border-b-2 border-green pb-1' 
              : 'hover:border-b-2 hover:border-green hover:pb-1'
          }`}
        >
          Dashboard
        </button>
        <button 
          onClick={()=>{window.location.href="/marketPlace"}}
          className={`text-green font-semibold px-2.5 transition-all duration-200 ${
            isMarketplace 
              ? 'border-b-2 border-green pb-1' 
              : 'hover:border-b-2 hover:border-green hover:pb-1'
          }`}
        >
          Marketplace
        </button>
        <button className="ml-5 bg-moss-700 hover:bg-moss-800 rounded rounded-3xl px-4 py-3">Connect Wallet</button>
      </div>
    </nav>
  );
}
