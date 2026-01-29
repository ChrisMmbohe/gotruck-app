# API v1 Documentation (OpenAPI Scaffold)

This is the starting point for GoTruck API v1 documentation.

## Conventions
- All endpoints return a standard response: `{ success, data, error, meta }`
- Errors are mapped to HTTP status codes and user-friendly messages
- Pagination/filtering via query params: `?page=1&limit=20&sort=createdAt`
- All input is validated with Zod
- Rate limiting is enforced per-user and per-IP (429)
- Versioning: All endpoints are under `/api/v1/`

## Example Endpoints

### GET /api/finance/exchange-rates
- Fetches current exchange rates (optionally refresh with `?refresh=1`)

### POST /api/finance/convert
- Converts an amount between KES, UGX, TZS
- Body: `{ amount: number, from: 'KES'|'UGX'|'TZS', to: 'KES'|'UGX'|'TZS' }`
- Returns: `{ amount, from, to, converted }`

### UI Usage
Import and use the CurrencyConverter component:

```tsx
import CurrencyConverter from '@/components/finance/CurrencyConverter';
// ...
<CurrencyConverter />
```

---

## OpenAPI/Swagger (To be expanded)
- Add endpoint definitions here as code evolves.
- Use JSDoc comments in route files for auto-generation.
