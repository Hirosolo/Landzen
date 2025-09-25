// Contract addresses on Base Sepolia
export const CONTRACT_ADDRESSES = {
  USDT: "0xc6ed2ebaf52Ba37f128230f6DF5427097B15f009",
  LAND_TOKENIZER: "0xf4815b459D0e5296e3cAb8b39aEE594248086cD1",
  DEPLOYER: "0x7EA634e331CF7b503df2e224f77a7C589462F1F2",
  MARKETPLACE:"0xFa6090830515B1099d12B3eec323989CF1cc7D0c"
} as const;

// Token metadata for Mock Stable Token
export const USDT_TOKEN = {
  address: CONTRACT_ADDRESSES.USDT,
  name: "Tether USD",
  symbol: "USDT",
  decimals: 18,
} as const;

// Property type mapping
export const PROPERTY_TYPES: { [key: number]: { name: string; color: string } } = {
  1: { name: "Residential", color: "bg-blue-500" },
  2: { name: "Apartment", color: "bg-green-500" },
  3: { name: "Co-living", color: "bg-purple-500" },
  4: { name: "Hospitality", color: "bg-orange-500" },
};

// Helper functions for USDT formatting (18 decimals for lzUSDT)
export const formatUSDT = (amount: bigint): string => {
  const value = Number(amount) / 1e18;
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
};

export const parseUSDT = (amount: string): bigint => {
  return BigInt(Math.floor(parseFloat(amount) * 1e18));
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
