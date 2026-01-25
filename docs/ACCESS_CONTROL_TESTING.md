# 🧪 Access Control Testing Guide

## Quick Test Scenarios

### How to Test Each Role

#### 1. **Test as Driver** 🚚

**Setup:**
```typescript
// In Clerk Dashboard, set user metadata:
{
  role: "driver",
  onboardingComplete: true,
  companyId: "company-123"
}
```

**Expected Behavior:**
- ✅ Redirected to `/dashboard/tracking` after login
- ✅ Can see: Overview, Tracking, Shipments, Settings in nav
- ❌ Cannot see: Fleet, Analytics in nav
- ✅ Dashboard shows limited data (no revenue)
- ❌ Accessing `/dashboard/fleet` → Redirected with access_denied
- ❌ Accessing `/dashboard/analytics` → Redirected with access_denied

**Test Commands:**
```bash
# Navigate to these URLs manually and verify redirects:
http://localhost:3001/en/dashboard/fleet     # Should redirect
http://localhost:3001/en/dashboard/analytics # Should redirect
http://localhost:3001/en/dashboard/tracking  # Should allow
```

---

#### 2. **Test as Shipper** 📦

**Setup:**
```typescript
// In Clerk Dashboard, set user metadata:
{
  role: "shipper",
  onboardingComplete: true,
  companyId: "company-123"
}
```

**Expected Behavior:**
- ✅ Redirected to `/dashboard` after login
- ✅ Can see: All pages in navigation
- ✅ Dashboard shows full metrics including revenue
- ✅ Can access all pages
- ✅ Fleet page shows data (but edit buttons hidden)
- ✅ Can create/edit shipments

**Test Commands:**
```bash
# All should work:
http://localhost:3001/en/dashboard
http://localhost:3001/en/dashboard/fleet
http://localhost:3001/en/dashboard/analytics
http://localhost:3001/en/dashboard/shipments
```

---

#### 3. **Test as Admin** 👑

**Setup:**
```typescript
// In Clerk Dashboard, set user metadata:
{
  role: "admin",
  onboardingComplete: true,
  companyId: "company-123"
}
```

**Expected Behavior:**
- ✅ Redirected to `/dashboard/analytics` after login
- ✅ Can see: ALL pages in navigation
- ✅ Dashboard shows complete data
- ✅ Can access all pages
- ✅ All action buttons visible
- ✅ Can manage everything

**Test Commands:**
```bash
# Everything should work:
http://localhost:3001/en/dashboard
http://localhost:3001/en/dashboard/fleet
http://localhost:3001/en/dashboard/analytics
http://localhost:3001/en/dashboard/tracking
http://localhost:3001/en/dashboard/shipments
http://localhost:3001/en/dashboard/settings
```

---

## 🔍 Detailed Test Cases

### Test Case 1: Navigation Visibility

| Page | Driver | Shipper | Admin |
|------|--------|---------|-------|
| Overview | ✅ | ✅ | ✅ |
| Tracking | ✅ | ✅ | ✅ |
| Fleet | ❌ | ✅ | ✅ |
| Shipments | ✅ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Settings | ✅ | ✅ | ✅ |

**How to Test:**
1. Sign in as each role
2. Check sidebar navigation
3. Count visible menu items

**Expected Results:**
- Driver: 4 items (Overview, Tracking, Shipments, Settings)
- Shipper: 6 items (all pages)
- Admin: 6 items (all pages)

---

### Test Case 2: Direct URL Access

**Test URLs:**
```
/en/dashboard/fleet
/en/dashboard/analytics
/en/dashboard/tracking
```

**As Driver:**
```
/dashboard/fleet      → Redirect to /dashboard/tracking?error=access_denied ✅
/dashboard/analytics  → Redirect to /dashboard/tracking?error=access_denied ✅
/dashboard/tracking   → Allow access ✅
```

**As Shipper:**
```
/dashboard/fleet      → Allow access ✅
/dashboard/analytics  → Allow access ✅
/dashboard/tracking   → Allow access ✅
```

**As Admin:**
```
All URLs → Allow access ✅
```

---

### Test Case 3: Dashboard Content Visibility

**Check these elements on `/dashboard`:**

| Element | Driver | Shipper | Admin |
|---------|--------|---------|-------|
| Active Shipments | ✅ | ✅ | ✅ |
| On-Time % | ✅ | ✅ | ✅ |
| Response Time | ✅ | ✅ | ✅ |
| Today's Revenue | ❌ | ✅ | ✅ |
| Fleet Utilization Card | ❌ | ✅ | ✅ |

**How to Test:**
1. Open `/dashboard` as each role
2. Inspect the page
3. Check which KPI cards are visible

---

### Test Case 4: Action Buttons

**On Shipments Page:**

| Action | Driver | Shipper | Admin |
|--------|--------|---------|-------|
| View Button | ✅ | ✅ | ✅ |
| Create Button | ❌ | ✅ | ✅ |
| Edit Button | ❌ | ✅ | ✅ |
| Delete Button | ❌ | ❌ | ✅ |

**On Fleet Page:**

| Action | Driver | Shipper | Admin |
|--------|--------|---------|-------|
| Access Page | ❌ | ✅ | ✅ |
| View Vehicles | ❌ | ✅ | ✅ |
| Add Vehicle | ❌ | ❌ | ✅ |
| Edit Vehicle | ❌ | ❌ | ✅ |

---

### Test Case 5: Access Denied UI

**Trigger Access Denial:**
1. Sign in as Driver
2. Navigate to: `http://localhost:3001/en/dashboard/fleet`

**Expected Result:**
```
┌──────────────────────────────────────┐
│           🛡️                          │
│        Access Denied                  │
│                                       │
│  You don't have permission to         │
│  access this resource.                │
│                                       │
│  ┌─────────────────────────────┐    │
│  │     Go to Dashboard         │    │
│  └─────────────────────────────┘    │
└──────────────────────────────────────┘
```

---

## 🔧 Developer Testing

### Using Browser Console

```javascript
// Check current user role
const user = await clerk.user;
console.log(user.publicMetadata.role);

// Test permission check
import { hasPermission } from '@/hooks/use-permissions';
console.log(hasPermission('VIEW_FLEET')); // true or false
```

### Using React DevTools

1. Open React DevTools
2. Find `DashboardPage` component
3. Check props:
   - `requiredPermission`
   - User state
   - Access granted/denied

---

## 🚨 Edge Cases to Test

### 1. **No Role Assigned**
- User has no role in metadata
- Expected: Denied access, show error

### 2. **Invalid Role**
- User has `role: "invalid"`
- Expected: Denied access, redirect to sign-in

### 3. **Onboarding Not Complete**
- User has role but `onboardingComplete: false`
- Expected: Redirect to `/onboarding`

### 4. **Direct Component Access**
- Try to render protected component directly
- Expected: Component checks and denies access

---

## ✅ Automated Test Checklist

```bash
# Run these commands to verify

# 1. Check TypeScript compilation
npm run build

# 2. Check for type errors
npx tsc --noEmit

# 3. Run development server
npm run dev

# 4. Test each role manually
# - Create 3 test users in Clerk
# - Assign each a different role
# - Test navigation and access
```

---

## 📊 Test Results Template

```
Date: _____________
Tester: ___________

[ ] Driver Role Tests
  [ ] Navigation shows correct items
  [ ] Can access allowed pages
  [ ] Cannot access restricted pages
  [ ] Content filtered correctly
  [ ] Access denied UI works
  
[ ] Shipper Role Tests
  [ ] Navigation shows all items
  [ ] Can access all shipper pages
  [ ] Content visible correctly
  [ ] Create/edit permissions work
  
[ ] Admin Role Tests
  [ ] Full navigation access
  [ ] Can access all pages
  [ ] All content visible
  [ ] All actions available
  
[ ] Edge Cases
  [ ] No role assigned handled
  [ ] Invalid role handled
  [ ] Direct URL access blocked
  [ ] Component-level protection works

Status: ✅ PASS / ❌ FAIL
Notes: ________________
```

---

## 🎯 Success Criteria

Access control is working correctly when:

✅ **Navigation** filters based on role  
✅ **Pages** validate permissions on load  
✅ **Content** shows/hides based on role  
✅ **URLs** cannot be accessed directly without permission  
✅ **Buttons** appear only when user has permission  
✅ **Access denied** UI displays correctly  
✅ **Redirects** go to appropriate pages  
✅ **No errors** in browser console  
✅ **No flashing** of unauthorized content  
✅ **Smooth UX** with loading states  

---

## 📞 Troubleshooting

### Issue: "Access denied for valid user"
**Solution:** Check Clerk metadata has correct role and onboardingComplete

### Issue: "Can access restricted pages"
**Solution:** Clear browser cache, restart dev server

### Issue: "Navigation not filtering"
**Solution:** Check usePermissions hook is working, verify role in Clerk

### Issue: "TypeScript errors"
**Solution:** Run `npm run build` to see specific errors

---

**Happy Testing! 🧪**

Remember: Test with actual users, not just localhost. Security should work in production too!
