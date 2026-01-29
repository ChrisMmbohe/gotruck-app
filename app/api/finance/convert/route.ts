import { NextRequest, NextResponse } from 'next/server';
import { convertCurrency } from '@/lib/finance/currency-converter';
import { z } from 'zod';
import { translateError } from '@/lib/validation/i18n-errors';
import { sanitizeDeep } from '@/lib/validation/sanitize';
import { ZodError } from 'zod';

// POST /api/finance/convert
// Body: { amount: number, from: 'KES'|'UGX'|'TZS', to: 'KES'|'UGX'|'TZS' }
  try {
    const schema = z.object({
      amount: z.number().nonnegative(),
      from: z.enum(['KES', 'UGX', 'TZS']),
      to: z.enum(['KES', 'UGX', 'TZS']),
    });
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const locale = 'en';
      const firstErr = result.error.errors[0];
      const translated = translateError(firstErr.message, locale);
      return NextResponse.json({ error: translated }, { status: 400 });
    }
    const { amount, from, to } = result.data;
    const converted = await convertCurrency(amount, from, to);
    return NextResponse.json({ amount, from, to, converted });
  } catch (e) {
    if (e instanceof ZodError) {
      const errors = e.errors.map(err => translateError(err.message, 'en'));
      return NextResponse.json({ error: errors.join('; ') }, { status: 400 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
