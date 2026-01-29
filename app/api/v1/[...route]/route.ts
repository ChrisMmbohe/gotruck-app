// Example API route handler using response, error, pagination, and rate limiter utilities
import { NextRequest, NextResponse } from 'next/server';
import { apiResponse } from '@/lib/api/response-handler';
import { apiError } from '@/lib/api/error-handler';
import { parsePagination, buildOffsetPaginationResult, paginationQuerySchema } from '@/lib/api/pagination';
import { rateLimit, RateLimitError } from '@/lib/api/rate-limiter';
import { shipmentSchema } from '@/lib/validation/schemas';
import { translateError } from '@/lib/validation/i18n-errors';
import { sanitizeDeep } from '@/lib/validation/sanitize';
import { ZodError } from 'zod';


// GET: Paginated, validated, i18n error example
export async function GET(req: NextRequest) {
  try {
    // Rate limit by IP (per minute)
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const rl = await rateLimit(ip, 100, 60);
    if (!rl.allowed) throw new RateLimitError();

    // Parse and validate query params with Zod
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    const validated = paginationQuerySchema.safeParse(query);
    if (!validated.success) {
      // Example: translate first error to Swahili
      const locale = 'sw';
      const firstErr = validated.error.errors[0];
      const translated = translateError(firstErr.message, locale);
      return NextResponse.json(apiResponse({ error: translated, status: 400 }), { status: 400 });
    }
    const { page, limit } = parsePagination(validated.data);

    // Example data (replace with DB query)
    const total = 100;
    const data = Array.from({ length: limit }, (_, i) => ({ id: (page - 1) * limit + i + 1, name: `Item ${(page - 1) * limit + i + 1}` }));
    const result = buildOffsetPaginationResult(data, total, page, limit);
    return NextResponse.json(
      apiResponse({
        data: result,
        meta: {
          pagination: {
            page,
            limit,
            total,
            totalPages: result.totalPages,
          },
          rateLimit: rl,
        },
      })
    );
  } catch (e) {
    return apiError(e);
  }
}

// POST: Validate, sanitize, EAC validators, i18n error, rate limit
export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP (per minute)
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const rl = await rateLimit(ip, 50, 60);
    if (!rl.allowed) throw new RateLimitError();

    // Parse and validate body with Zod (shipmentSchema)
    const body = await req.json();
    const result = shipmentSchema.safeParse(body);
    if (!result.success) {
      // Translate first error to French as example
      const locale = 'fr';
      const firstErr = result.error.errors[0];
      const translated = translateError(firstErr.message, locale);
      return NextResponse.json(apiResponse({ error: translated, status: 400 }), { status: 400 });
    }
    // result.data is sanitized and validated
    const shipment = result.data;

    // Simulate DB write (would use sanitized shipment)
    // const saved = await db.shipment.create({ data: shipment });

    return NextResponse.json(
      apiResponse({
        data: shipment,
        meta: { rateLimit: rl },
      }),
      { status: 201 }
    );
  } catch (e) {
    if (e instanceof ZodError) {
      // Translate all errors to English as fallback
      const locale = 'en';
      const errors = e.errors.map(err => translateError(err.message, locale));
      return NextResponse.json(apiResponse({ error: errors.join('; '), status: 400 }), { status: 400 });
    }
    return apiError(e);
  }
}
