
/**
 * Currency conversion utilities for KES, UGX, TZS
 *
 * - All amounts are in minor units (e.g., cents) for accuracy
 * - SupportedCurrency type ensures type safety
 * - Add new currencies by extending SupportedCurrency and updating conversion logic
 * - Use with exchange rate caching (e.g., Redis) for performance
 */

export type SupportedCurrency = 'KES' | 'UGX' | 'TZS';

export interface ExchangeRate {
  from: SupportedCurrency;
  to: SupportedCurrency;
  rate: number;
  updatedAt: Date;
}

// Placeholder: In production, fetch from API or Redis
export async function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: ExchangeRate[]
): Promise<number> {
  if (from === to) return amount;
  const rate = rates.find(r => r.from === from && r.to === to)?.rate;
  if (!rate) throw new Error('Exchange rate not found');
  return amount * rate;
}
