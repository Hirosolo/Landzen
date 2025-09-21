// Contract addresses on Base Sepolia
export const CONTRACT_ADDRESSES = {
  USDT: "0x6030fD1803a5bE7bAa994F9065995d1F0777f567",
  LAND_TOKENIZER: "0x5A6C7b515328E1598d3F1B62E2404f8B525D4E86",
  DEPLOYER: "0x7EA634e331CF7b503df2e224f77a7C589462F1F2"
} as const;

// Property type mapping
export const PROPERTY_TYPES = {
  1: { name: "Residential" },
  2: { name: "Commercial" },
  3: { name: "Industrial" },
  4: { name: "Mixed-Use" },
  5: { name: "Retail" }
} as const;

// Helper functions for USDT formatting (6 decimals)
export const formatUSDT = (amount: bigint): string => {
  const value = Number(amount) / 1e6;
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
};

export const parseUSDT = (amount: string): bigint => {
  return BigInt(Math.floor(parseFloat(amount) * 1e6));
};

// Helper functions for calculations
export const calculateSharePrice = (totalValue: bigint, totalShares: bigint): bigint => {
  return totalValue / totalShares;
};

export const calculateOwnership = (shareAmount: bigint, totalShares: bigint): number => {
  return Number((shareAmount * BigInt(100)) / totalShares);
};

export const calculateAPY = (yieldPerBlock: bigint, sharePrice: bigint, sharePercentage: bigint): number => {
  const BLOCKS_PER_YEAR = BigInt((365 * 24 * 60 * 60) / 12); 
  const annualYield = yieldPerBlock * BLOCKS_PER_YEAR * sharePercentage / BigInt(10000);
  const apy = Number(annualYield * BigInt(100) / sharePrice);
  return apy;
};
