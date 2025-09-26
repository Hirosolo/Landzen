import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from 'viem'

// Base Sepolia testnet config with fallback RPCs
export const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    // Use Alchemy as primary RPC and public endpoint as fallback
    default: {
      http: [
        `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        'https://sepolia.base.org',
        'https://1rpc.io/base-sepolia'
      ]
    },
    public: {
      http: [
        `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        'https://sepolia.base.org',
        'https://1rpc.io/base-sepolia'
      ]
    }
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: "Landzen",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "5c992b50e8871ed27bdb8e9f96975888",
  chains: [baseSepolia], // Only include Base Sepolia
  ssr: true,
  transports: {
    [baseSepolia.id]: http()
  }
});

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}