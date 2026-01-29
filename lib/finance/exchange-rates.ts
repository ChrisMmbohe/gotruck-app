// Exchange rate API integration and Redis caching for KES, UGX, TZS
import Redis from 'ioredis';

export type SupportedCurrency = 'KES' | 'UGX' | 'TZS';

export interface ExchangeRate {
  from: SupportedCurrency;
  to: SupportedCurrency;
  rate: number;
  updatedAt: Date;
}

const REDIS_KEY = 'exchange_rates';
const redis = new Redis(process.env.REDIS_URL || '');

// Fetch rates from external API (placeholder)
export async function fetchExchangeRates(): Promise<ExchangeRate[]> {
  // Replace with real API call
  return [
    { from: 'KES', to: 'UGX', rate: 30.0, updatedAt: new Date() },
    { from: 'KES', to: 'TZS', rate: 18.0, updatedAt: new Date() },
    { from: 'UGX', to: 'KES', rate: 0.033, updatedAt: new Date() },
    { from: 'UGX', to: 'TZS', rate: 0.6, updatedAt: new Date() },
    { from: 'TZS', to: 'KES', rate: 0.056, updatedAt: new Date() },
    { from: 'TZS', to: 'UGX', rate: 1.7, updatedAt: new Date() },
  ];
}

// Cache rates in Redis
export async function cacheExchangeRates(rates: ExchangeRate[]): Promise<void> {
  await redis.set(REDIS_KEY, JSON.stringify(rates));
}

// Get rates from Redis cache
export async function getCachedExchangeRates(): Promise<ExchangeRate[] | null> {
  const data = await redis.get(REDIS_KEY);
  if (!data) return null;
  return JSON.parse(data);
}

// Convert currency using cached or fetched rates
export async function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): Promise<number> {
  let rates = await getCachedExchangeRates();
  if (!rates) {
    rates = await fetchExchangeRates();
    await cacheExchangeRates(rates);
  }
  if (from === to) return amount;
  const rate = rates.find(r => r.from === from && r.to === to)?.rate;
  if (!rate) throw new Error('Exchange rate not found');
  return amount * rate;
}

// Update rates periodically (e.g., every hour)
export async function updateExchangeRates(): Promise<void> {
  const rates = await fetchExchangeRates();
  await cacheExchangeRates(rates);
}
