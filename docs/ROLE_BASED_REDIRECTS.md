# Role-Based Portal Redirects

## Overview
After successful onboarding or sign-in, users are automatically redirected to their role-specific portal based on their assigned role.

## Implementation

### Portal Routes

| Role | Portal Name | Route | Features |
|------|------------|-------|----------|
| **Driver** | Driver Portal | `/dashboard/tracking` | GPS tracking, shipment updates, earnings |
| **Shipper** | Shipper Dashboard | `/dashboard` | Full dashboard with shipments, fleet, analytics |
| **Admin** | Admin Portal | `/dashboard/analytics` | Analytics, user management, compliance |

### Redirect Flow

#### 1. After Onboarding Completion
```typescript
// components/onboarding/OnboardingWizard.tsx
const userRole = formData.role || user?.publicMetadata?.role;
const redirectPath = DEFAULT_REDIRECTS[userRole];
router.push(`${redirectPath}?onboarding=complete`);
```

**Flow:**
1. User completes onboarding wizard
2. `OnboardingWizard` determines user role
3. Uses `DEFAULT_REDIRECTS` from `lib/auth/roles.ts`
4. Redirects to role-specific portal with `?onboarding=complete` flag

#### 2. On Sign-In (via Middleware)
```typescript
// middleware.ts
if (userRole && pathWithoutLocale === '/dashboard') {
  const defaultPath = DEFAULT_REDIRECTS[userRole];
  const redirectUrl = new URL(`/${locale}${defaultPath}`, req.url);
  return NextResponse.redirect(redirectUrl);
}
```

**Flow:**
1. User signs in and accesses `/dashboard`
2. Middleware extracts role from Clerk session
3. Automatically redirects to role-specific portal
4. Prevents manual navigation to unauthorized routes

#### 3. API Response
```typescript
// app/api/onboarding/complete/route.ts
return NextResponse.json({
  success: true,
  redirectUrl: roleRedirects[role] || '/dashboard',
});
```

The API provides the redirect URL in the response for additional client-side routing flexibility.

### Role-Specific Features

#### Driver Portal (`/dashboard/tracking`)
- **Primary Focus:** Real-time GPS tracking
- **Features:**
  - Live shipment tracking map
  - Delivery updates
  - Earnings overview
  - Route optimization
- **Permissions:**
  - View assigned shipments
  - Update GPS location
  - Access personal settings

#### Shipper Dashboard (`/dashboard`)
- **Primary Focus:** Comprehensive shipment management
- **Features:**
  - Shipment overview stats
  - Fleet management
  - Create/manage shipments
  - Analytics and reports
- **Permissions:**
  - Full dashboard access
  - Create shipments
  - Assign drivers
  - View fleet and analytics

#### Admin Portal (`/dashboard/analytics`)
- **Primary Focus:** Platform analytics and management
- **Features:**
  - Advanced analytics
  - User management
  - Compliance monitoring
  - System settings
- **Permissions:**
  - Full platform access
  - Manage all users
  - View all data
  - Configure system settings

## Configuration

### Default Redirects
Defined in `lib/auth/roles.ts`:
```typescript
export const DEFAULT_REDIRECTS = {
  [UserRole.DRIVER]: '/dashboard/tracking',
  [UserRole.SHIPPER]: '/dashboard',
  [UserRole.ADMIN]: '/dashboard/analytics',
} as const;
```

### Protected Routes
Role-based route protection in `lib/auth/roles.ts`:
```typescript
export const PROTECTED_ROUTES = {
  driver: [
    '/dashboard/tracking',
    '/dashboard/shipments',
    '/dashboard/settings',
  ],
  shipper: [
    '/dashboard',
    '/dashboard/tracking',
    '/dashboard/fleet',
    '/dashboard/shipments',
    '/dashboard/analytics',
    '/dashboard/settings',
  ],
  admin: [
    '/dashboard',
    '/dashboard/tracking',
    '/dashboard/fleet',
    '/dashboard/shipments',
    '/dashboard/analytics',
    '/dashboard/settings',
    '/dashboard/users',
    '/dashboard/compliance',
  ],
};
```

## User Experience

### Complete Step UI
The `CompleteStep` component displays role-specific messaging:
```tsx
<p className="text-sm text-blue-800">
  <strong>Next steps:</strong> You'll be redirected to your {portalNames[userRole]} 
  where you can start managing your operations.
</p>

<Button>Go to {portalNames[userRole]}</Button>
```

**Portal Names:**
- Driver → "Driver Portal"
- Shipper → "Shipper Dashboard"  
- Admin → "Admin Portal"

### Security

#### Middleware Protection
- All dashboard routes require authentication
- Unauthorized route access triggers redirect to role-specific portal
- Session validation via Clerk

#### Route Guards
```typescript
const isAllowed = allowedRoutes.some(allowedPath => 
  pathWithoutLocale === allowedPath || 
  pathWithoutLocale.startsWith(`${allowedPath}/`)
);

if (!isAllowed) {
  // Redirect to role-specific default page
  const defaultPath = DEFAULT_REDIRECTS[userRole];
  return NextResponse.redirect(redirectUrl);
}
```

## Testing Scenarios

### ✅ Test Cases

1. **Driver Onboarding**
   - Complete onboarding as Driver
   - Should redirect to `/dashboard/tracking`
   - Cannot access `/dashboard/fleet` or `/dashboard/analytics`

2. **Shipper Onboarding**
   - Complete onboarding as Shipper
   - Should redirect to `/dashboard`
   - Can access all shipper routes
   - Cannot access `/dashboard/users` (admin only)

3. **Admin Onboarding**
   - Complete onboarding as Admin
   - Should redirect to `/dashboard/analytics`
   - Can access all routes

4. **Sign-In Redirect**
   - Sign in as any role
   - Navigate to `/dashboard`
   - Should auto-redirect to role-specific portal

5. **Unauthorized Access**
   - Sign in as Driver
   - Manually navigate to `/dashboard/analytics`
   - Should redirect to `/dashboard/tracking`

## Maintenance

### Adding New Roles
1. Add role to `UserRole` enum in `lib/auth/roles.ts`
2. Define permissions in `PERMISSIONS` object
3. Add protected routes to `PROTECTED_ROUTES`
4. Add default redirect to `DEFAULT_REDIRECTS`
5. Update `OnboardingWizard` step logic
6. Update `CompleteStep` portal names

### Changing Default Routes
Edit the `DEFAULT_REDIRECTS` object in `lib/auth/roles.ts`:
```typescript
export const DEFAULT_REDIRECTS = {
  [UserRole.DRIVER]: '/new-driver-route',
  // ...
};
```

## Files Modified

### Components
- ✅ `components/onboarding/OnboardingWizard.tsx` - Added role-based redirect logic
- ✅ `components/onboarding/steps/CompleteStep.tsx` - Added role-specific UI messaging

### API Routes
- ✅ `app/api/onboarding/complete/route.ts` - Returns role-specific redirect URL

### Middleware
- ✅ `middleware.ts` - Handles automatic redirects on sign-in and unauthorized access

### Configuration
- ✅ `lib/auth/roles.ts` - Defines `DEFAULT_REDIRECTS` for all roles

## Benefits

1. **Better UX:** Users land on the most relevant page for their role
2. **Security:** Prevents unauthorized access to restricted routes
3. **Clarity:** Clear separation of concerns per user type
4. **Flexibility:** Easy to add new roles or change default routes
5. **Performance:** Reduces unnecessary redirects and navigation

## Future Enhancements

- [ ] Add role-specific onboarding tutorials
- [ ] Implement role switching for multi-role users
- [ ] Add dashboard customization per role
- [ ] Create role-specific welcome emails with correct portal links
- [ ] Add analytics tracking for role-based navigation patterns

---

**Last Updated:** January 21, 2026  
**Status:** ✅ Implemented and Ready for Testing
