"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";
import { http } from "wagmi";

export const wagmiConfig = getDefaultConfig({
  appName: "My dApp",
  projectId: "5c992b50e8871ed27bdb8e9f96975888",
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: true,
});
