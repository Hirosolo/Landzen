"use client";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function MarketplaceSearchBar() {
  const pathname = usePathname();
  
  const isDashboard = pathname === "/dashboard";
  const isMarketplace = pathname === "/marketPlace";

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-beige border-none">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img
          src="/logo-landzen.png"
          onClick={() => (window.location.href = "/recuiter/landingPage")}
          alt="Logo"
          className="h-12 w-13 cursor-pointer border-none"
        />
      </div>

      {/* Navigation + Wallet */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className={`text-green font-semibold px-2.5 transition-all duration-200 ${
            isDashboard
              ? "border-b-2 border-green pb-1"
              : "hover:border-b-2 hover:border-green hover:pb-1"
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => {
            window.location.href = "/marketPlace";
          }}
          className={`text-green font-semibold px-2.5 transition-all duration-200 ${
            isMarketplace
              ? "border-b-2 border-green pb-1"
              : "hover:border-b-2 hover:border-green hover:pb-1"
          }`}
        >
          Marketplace
        </button>

        {/* RainbowKit Connect Button */}
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="bg-moss-500 hover:bg-moss-600 text-white rounded-3xl px-4 py-2 text-sm font-semibold transition-colors"
                      >
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-3xl px-4 py-2 text-sm font-semibold transition-colors"
                      >
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="flex items-center gap-2 bg-moss-100 hover:bg-moss-200 text-moss-800 rounded-3xl px-3 py-2 text-sm font-semibold transition-colors"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 16,
                              height: 16,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 16, height: 16 }}
                              />
                            )}
                          </div>
                        )}
                        <span className="text-moss-900">{chain.name}</span>
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="bg-moss-500 hover:bg-moss-600 text-white rounded-3xl px-4 py-2 text-sm font-semibold transition-colors"
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </nav>
  );
}
