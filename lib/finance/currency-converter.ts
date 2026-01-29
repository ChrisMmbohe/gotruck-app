// Currency conversion utility for KES, UGX, TZS
import { convertCurrency as convert, SupportedCurrency } from './exchange-rates';

/**
 * Convert an amount from one currency to another using up-to-date exchange rates.
 * @param amount Amount to convert
 * @param from Source currency (KES, UGX, TZS)
 * @param to Target currency (KES, UGX, TZS)
 * @returns Converted amount
 */
export async function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): Promise<number> {
  return convert(amount, from, to);
}
