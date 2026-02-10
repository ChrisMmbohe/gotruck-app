# UnrecognizedActionError Fix

## Problem
The application was throwing an **UnrecognizedActionError** with message:
```
Server Action "7ff3bcff3e0e4963d442329cc947dc540d4f96f1f9" was not found on the server.
```

## Root Cause
The Next.js configuration had **Server Actions enabled** in the `experimental` settings, but the entire codebase was architected to use **standard API routes** instead of Server Actions.

**Issue Timeline:**
1. `next.config.ts` configured Server Actions: `experimental.serverActions`
2. No `.ts` or `.tsx` files used `'use server'` directive
3. No Server Actions were actually defined
4. Server reference manifest was empty
5. Any code that unexpectedly tried to use a Server Action pattern would fail

## Root Cause Details

### What was enabled:
```typescript
// next.config.ts
experimental: {
  serverActions: {
    bodySizeLimit: '10mb',
  },
},
```

### What was actually being used:
- Standard Next.js API routes (`/app/api/**/route.ts`)
- React Hook Form with `fetch()` calls
- No 'use server' directives anywhere
- No Server Action definitions

### Server Reference Manifest:
The `.next/server/server-reference-manifest.js` was empty:
```json
{
  "node": {},
  "edge": {},
  "encryptionKey": "..."
}
```

This empty manifest meant any attempt to call a Server Action would fail because Next.js couldn't find the action in its registry.

## Solution
**Disabled Server Actions** in `next.config.ts` since they're not used in this application:

```typescript
// ✅ FIXED: Commented out unused Server Actions configuration
// Server Actions disabled - app uses standard API routes instead
// experimental: {
//   serverActions: {
//     bodySizeLimit: '10mb',
//   },
// },
```

## Architecture Implemented
The app correctly uses:

### API Routes Pattern
- `POST /api/shipments` - Create shipments
- `PUT /api/users/profile` - Update user profile  
- `POST /api/users/profile/upload` - Image uploads
- `POST /api/gps/update` - GPS location updates
- `POST /api/onboarding/complete` - Onboarding completion
- And more...

### Form Submission Pattern
```typescript
// Client component
const onSubmit = async (data) => {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
```

### Libraries Used
- **React Hook Form** - Form state management
- **TanStack React Query** - Server state management
- **Clerk** - Authentication
- **Zod** - Input validation

## What This Fixes
✅ Removes the UnrecognizedActionError from Next.js  
✅ Eliminates misleading Server Action configuration  
✅ Aligns configuration with actual architecture  
✅ Improves build clarity and reduces confusion  

## Verification
After this fix:
1. Next.js dev server rebuilt successfully
2. No Server Action initialization errors
3. Standard API routes work as expected
4. Form submissions via fetch work normally

## Files Changed
- `next.config.ts` - Disabled `experimental.serverActions`

## Notes
If you ever want to migrate to Server Actions in the future:
1. Re-enable this configuration
2. Create `.ts` files with `'use server'` directives
3. Export async functions that will become Server Actions
4. Next.js will automatically register them in the manifest
5. Use function references directly in forms/event handlers

But for now, the app is correctly architected using standard API routes, which is a solid, well-established pattern that provides good separation of concerns and explicit control over server communication.

## Testing
- ✓ Development server rebuilds without errors
- ✓ No UnrecognizedActionError in browser console
- ✓ API routes continue to function normally
