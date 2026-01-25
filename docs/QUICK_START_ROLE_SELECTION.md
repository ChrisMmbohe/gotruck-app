# Quick Start: Testing Role Selection

## 🚀 Test the New Role Selection Feature

### Prerequisites
- Development server running (`npm run dev`)
- Clerk authentication configured
- MongoDB connection (optional for testing UI)

---

## Method 1: Test in Browser (Recommended)

### Step 1: Start Development Server
```powershell
npm run dev
```

### Step 2: Clear Existing Session (if logged in)
1. Open browser DevTools (F12)
2. Application tab → Clear site data
3. Or use Incognito/Private window

### Step 3: Sign Up as New User
1. Navigate to `http://localhost:3001/sign-up`
2. Fill out signup form:
   - Email: `test-driver@example.com`
   - Password: `TestPassword123!`
3. Click "Sign Up"

### Step 4: Experience Role Selection
1. Automatically redirected to `/onboarding`
2. See role selection screen (first step)
3. Click on "Driver" card (green gradient with truck icon)
4. Notice visual feedback:
   - Card border becomes primary color
   - Checkmark appears in top-right corner
   - Ring glow effect
   - "Selected" button state
5. Click "Continue" button
6. Role saved to Clerk metadata
7. Wizard advances to Welcome step

### Step 5: Verify Role Assignment
1. Open DevTools → Console
2. Look for log: `✅ Role assigned to user {userId}: driver`
3. Check Clerk Dashboard:
   - Users → Find your test user
   - Public Metadata should show: `{ "role": "driver" }`

### Step 6: Complete Driver Onboarding
Continue through all driver-specific steps:
- Welcome → Profile → Driver Info → Documents → Preferences → Complete

---

## Method 2: Test Different Roles

### Test Shipper Flow
```powershell
# Sign up with different email
Email: test-shipper@example.com
Password: TestPassword123!

# On role selection:
# Click "Shipper" (blue gradient with package icon)
# Verify steps: Role → Welcome → Profile → Company → Documents → Preferences → Complete
```

### Test Admin Flow
```powershell
# Sign up with different email
Email: test-admin@example.com
Password: TestPassword123!

# On role selection:
# Click "Admin" (purple gradient with shield icon)
# Verify steps: Role → Welcome → Profile → Preferences → Complete (shorter flow)
```

---

## Method 3: Test API Directly

### Test Role Assignment API

#### Using PowerShell
```powershell
# Get auth token from Clerk (must be logged in)
$token = "YOUR_CLERK_SESSION_TOKEN"

# Assign Driver role
$body = @{
    role = "driver"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/onboarding/role" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    } `
    -Body $body

# Expected response:
# {
#   "success": true,
#   "role": "driver",
#   "message": "Role assigned successfully"
# }
```

#### Using cURL
```bash
curl -X POST http://localhost:3001/api/onboarding/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_SESSION_TOKEN" \
  -d '{"role":"driver"}'
```

#### Test Invalid Role
```powershell
$body = @{
    role = "invalid_role"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/onboarding/role" `
    -Method POST `
    -Headers @{ "Content-Type" = "application/json" } `
    -Body $body

# Expected error:
# {
#   "error": "Invalid role. Must be 'driver', 'shipper', or 'admin'"
# }
```

---

## Method 4: Automated Testing (Coming Soon)

### Component Test (Jest + React Testing Library)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { RoleSelectionStep } from '@/components/onboarding/steps/RoleSelectionStep';

describe('RoleSelectionStep', () => {
  it('renders all three role options', () => {
    render(<RoleSelectionStep data={{}} onChange={jest.fn()} onNext={jest.fn()} />);
    
    expect(screen.getByText('I need to ship goods')).toBeInTheDocument();
    expect(screen.getByText('I want to drive and deliver')).toBeInTheDocument();
    expect(screen.getByText('I manage operations')).toBeInTheDocument();
  });

  it('selects role on card click', () => {
    const onChange = jest.fn();
    render(<RoleSelectionStep data={{}} onChange={onChange} onNext={jest.fn()} />);
    
    const driverCard = screen.getByText('I want to drive and deliver').closest('div');
    fireEvent.click(driverCard!);
    
    expect(screen.getByText('Selected')).toBeInTheDocument();
  });
});
```

---

## 🔍 What to Verify

### Visual Checks
- [ ] All 3 role cards display correctly
- [ ] Gradient backgrounds show proper colors
- [ ] Icons render (Package, Truck, Shield)
- [ ] Feature lists are readable
- [ ] Hover effects work smoothly
- [ ] Selected state is clearly visible
- [ ] Continue button enables when role selected
- [ ] Loading spinner shows during API call

### Functional Checks
- [ ] Clicking card selects the role
- [ ] Only one role can be selected at a time
- [ ] Continue button disabled when no role selected
- [ ] API call completes successfully
- [ ] Role saved to Clerk metadata
- [ ] Wizard advances to next step
- [ ] Role-specific steps display correctly
- [ ] Browser back button works

### Responsive Checks
- [ ] Mobile (375px): Cards stack vertically
- [ ] Tablet (768px): 2-column grid
- [ ] Desktop (1440px): 3-column grid
- [ ] Touch targets are at least 44px
- [ ] Text is readable on all screen sizes

### Accessibility Checks
- [ ] Can navigate with keyboard (Tab, Enter)
- [ ] Focus indicators are visible
- [ ] Screen reader announces role descriptions
- [ ] Color contrast meets WCAG AA standards
- [ ] No keyboard traps

---

## 🐛 Common Issues & Solutions

### Issue: Role not saving
**Solution**: Check Clerk API keys in `.env.local`
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Issue: Cards not displaying gradients
**Solution**: Ensure Tailwind CSS is properly configured
```javascript
// tailwind.config.ts should include:
content: [
  './components/**/*.{js,ts,jsx,tsx}',
  './app/**/*.{js,ts,jsx,tsx}',
]
```

### Issue: Continue button not enabling
**Solution**: Check browser console for errors
- Verify `onChange` callback is firing
- Check `selectedRole` state updates

### Issue: API returns 401 Unauthorized
**Solution**: User must be authenticated
- Sign up/sign in first
- Check Clerk session is active
- Verify middleware allows `/api/onboarding/*`

---

## 📝 Test Scenarios

### Scenario 1: Happy Path (Driver)
1. Sign up as new user
2. Select "Driver" role
3. Complete all 7 steps
4. Verify redirect to driver dashboard

### Scenario 2: Change Mind
1. Select "Shipper" role
2. Click browser back button
3. Select "Driver" instead
4. Verify driver flow shows

### Scenario 3: Skip Documents
1. Select "Shipper" role
2. Proceed through steps
3. On Documents step, click "Skip for Now"
4. Verify onboarding completes successfully

### Scenario 4: Network Error
1. Select role
2. Disable internet (DevTools → Network → Offline)
3. Click "Continue"
4. Verify error handling (alert message)

---

## 🎥 Screen Recording Checklist

When recording demo video:
1. Show clean sign-up flow
2. Highlight role selection screen
3. Click each role card to show hover effects
4. Select one role and show selected state
5. Click Continue and show loading state
6. Show role-specific steps (e.g., Driver Info for drivers)
7. Complete full onboarding
8. Show final dashboard

---

## 🔄 Reset Testing Environment

### Clear User Data
```powershell
# In browser DevTools Console:
localStorage.clear();
sessionStorage.clear();
indexedDB.databases().then(dbs => dbs.forEach(db => indexedDB.deleteDatabase(db.name)));
```

### Delete Test Users from Clerk
1. Go to Clerk Dashboard → Users
2. Filter by email: `test-*@example.com`
3. Delete all test users
4. Start fresh

### Reset MongoDB (if needed)
```javascript
// In MongoDB Compass or shell:
db.users.deleteMany({ email: { $regex: /^test-/ } })
```

---

## 📊 Performance Testing

### Measure Load Time
```javascript
// In browser console:
performance.mark('role-selection-start');
// ... render component ...
performance.mark('role-selection-end');
performance.measure('role-selection', 'role-selection-start', 'role-selection-end');

// Get measurement
performance.getEntriesByName('role-selection')[0].duration;
// Should be < 100ms
```

### Lighthouse Audit
```powershell
# Using Chrome DevTools:
# 1. F12 → Lighthouse tab
# 2. Categories: Performance, Accessibility
# 3. Generate report
# 4. Aim for 95+ scores
```

---

## ✅ Success Criteria

Your implementation is working correctly if:
- ✅ All 3 role cards render with correct styling
- ✅ Role selection saves to Clerk metadata
- ✅ Wizard shows role-specific steps
- ✅ User can complete full onboarding
- ✅ No console errors
- ✅ Responsive on all screen sizes
- ✅ Build compiles without errors

---

## 🆘 Need Help?

### Check Logs
```powershell
# Server logs (terminal running npm run dev)
# Look for: "✅ Role assigned to user..."

# Browser console (F12)
# Look for: errors, warnings, API responses
```

### Debug Mode
```typescript
// Add to RoleSelectionStep.tsx temporarily:
console.log('Selected Role:', selectedRole);
console.log('Form Data:', data);
console.log('Is Submitting:', isSubmitting);
```

### Common Debugging Commands
```powershell
# Restart dev server
Ctrl+C
npm run dev

# Clear Next.js cache
Remove-Item .next -Recurse -Force
npm run dev

# Check TypeScript errors
npm run type-check

# Run linter
npm run lint
```

---

Happy testing! 🎉
