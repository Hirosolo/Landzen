// Utility functions for handling BigInt serialization and conversion

export function serializeBigInt(obj: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

export function toObject(obj: unknown): unknown {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value // return everything else unchanged
  ));
}

export function deserializeBigInt(obj: Record<string, unknown>, bigintFields: string[]): Record<string, unknown> {
  const result = { ...obj };
  bigintFields.forEach(field => {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = BigInt(result[field] as string);
    }
  });
  return result;
}

// Helper to safely convert to BigInt
export function toBigInt(value: bigint | string | number): bigint {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'string') return BigInt(value);
  if (typeof value === 'number') return BigInt(value);
  return BigInt(0);
}

// Helper to safely convert BigInt to number for display
export function bigIntToNumber(value: bigint | string | number): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (typeof value === 'bigint') return Number(value);
  return 0;
}

// Format USDT with BigInt support (18 decimals for Mock USDT)
export function formatUSDTSafe(amount: bigint | string | number): string {
  const value = bigIntToNumber(amount);
  const dollars = value / 1e18; // 18 decimals for Mock USDT
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(dollars);
}
