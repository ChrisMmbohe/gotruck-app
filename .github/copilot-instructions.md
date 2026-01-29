
# GoTruck App – AI Coding Agent Instructions

## Project Architecture & Key Patterns

- **Monorepo structure**: All code is in a single Next.js 16 app (React 19, TypeScript strict mode).
- **App Router**: Use `/app` for all pages, with locale-aware routing (`[locale]/`). Group layouts for `(auth)` and `(root)`.
- **API**: Next.js API routes in `/app/api/`, versioned under `/api/v1/`. All endpoints return `{ success, data, error, meta }` and use Zod for validation.
- **State**: React Query (server/client) and Zustand (client) for state management.
- **Styling**: Tailwind CSS + Radix UI. Use design tokens from `globals.css`.
- **Auth**: Clerk for multi-tenant auth (drivers, shippers, admins). Auth UI in `/app/[locale]/(auth)/`. Integrate Clerk hooks in `AuthForm.tsx` and `SocialProviders.tsx`.
- **Data**: MongoDB (freight, users), PostgreSQL (finance), Redis (cache/queue), Cloudinary/S3 (files). Use Mongoose/Prisma clients in `/lib/db/`.
- **Realtime**: Socket.io for GPS tracking (see `/services/socketio/`).
- **i18n**: All UI and errors must support English, Swahili, French. Use `next-intl` and translation files in `/messages/`.
- **PWA**: Service worker in `/public/sw.js`, manifest in `/public/manifest.json`.
- **DevOps**: Docker, docker-compose, GitHub Actions, Vercel. See `SETUP_COMPLETE.md` for build/run steps.

## Essential Workflows

- **Install**: `npm install` (Node 20+)
- **Dev server**: `npm run dev` (default port 3000, auto-increments)
- **Type check**: `npm run type-check`
- **Lint**: `npm run lint`
- **Build**: `npm run build`
- **Docker**: `docker-compose up` or `docker build`/`docker run`
- **Test**: (Add Jest/Playwright as needed)

## Project Conventions

- **TypeScript everywhere**; strict mode enforced
- **Server Components by default**; use Client Components only for interactivity
- **API responses**: Always wrap in `{ success, data, error, meta }`
- **Validation**: Use Zod schemas for all API/form input; see `/lib/validation/`
- **Error handling**: Use error boundaries and `/lib/api/error-handler.ts`
- **Pagination/filtering**: Use `/lib/api/pagination.ts` helpers
- **Multi-currency**: Use `/lib/finance/currency.ts` and `/lib/finance/exchange-rates.ts`
- **RBAC**: Use `/lib/auth/permissions.ts` and `/hooks/use-permissions.ts` for role checks
- **Responsive**: All UI must be mobile-first, touch targets ≥44px
- **Accessibility**: Follow WCAG 2.1 AA; use semantic HTML, ARIA, and focus states
- **i18n**: All user-facing strings must be translatable; use translation keys
- **Docs**: See `/docs/` for feature guides and `/DEVELOPMENT_ROADMAP.md` for phase/task breakdown

## Integration Points

- **Clerk**: Configure in `/lib/auth/clerk-config.ts`, use hooks in auth components
- **Stripe**: Payment logic in `/lib/payments/`, API in `/app/api/payments/`
- **Mapbox**: Map logic in `/components/maps/`, config in `/lib/maps/`
- **Socket.io**: Server in `/services/socketio/`, client hooks in `/hooks/`
- **BullMQ/Redis**: Queue logic in `/lib/queue/`
- **Cloudinary/S3**: File upload in `/lib/storage/`

## Examples

- **API handler**: `/app/api/v1/shipments/route.ts` – validates input, wraps response, handles errors, paginates
- **Auth form**: `/components/auth/AuthForm.tsx` – uses Clerk hooks, Zod validation, loading/error states
- **Dashboard page**: `/app/[locale]/dashboard/overview/page.tsx` – server component, fetches data via React Query

## Quick Troubleshooting

- **Port in use**: `npm run dev -- --port 3003`
- **Type errors**: `npm run type-check`
- **Mapbox not loading**: Check `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local`
- **Auth not working**: Check Clerk keys and integration in `/lib/auth/`

---
For detailed phase/task breakdown, see `/DEVELOPMENT_ROADMAP.md`. For auth UI/logic, see `/docs/AUTH_README.md` and `/docs/AUTH_PAGES_IMPLEMENTATION.md`.
