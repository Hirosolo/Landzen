import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, polygon, arbitrum } from 'wagmi/chains';
// Base Sepolia testnet config
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
    default: { http: ['https://sepolia.base.org'] },
    public: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: "Landzen",
  projectId: "5c992b50e8871ed27bdb8e9f96975888",
  chains: [mainnet, sepolia, polygon, arbitrum, baseSepolia],
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}