import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, polygon, arbitrum } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: "Landzen",
  projectId: "5c992b50e8871ed27bdb8e9f96975888",
  chains: [mainnet, sepolia, polygon, arbitrum],
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
