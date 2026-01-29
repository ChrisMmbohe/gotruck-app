import { NextRequest, NextResponse } from 'next/server';
import { fetchExchangeRates, updateExchangeRates, getCachedExchangeRates } from '@/lib/finance/exchange-rates';

// GET /api/finance/exchange-rates
  try {
    // Optionally force update with ?refresh=1
    const { searchParams } = new URL(req.url);
    const refresh = searchParams.get('refresh');
    if (refresh) {
      await updateExchangeRates();
    }
    const rates = await getCachedExchangeRates() || await fetchExchangeRates();
    return NextResponse.json({ rates });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
