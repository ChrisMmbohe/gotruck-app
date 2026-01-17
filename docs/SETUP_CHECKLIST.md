# 🚀 GoTruck Sign-Up Setup - Quick Checklist

## ⚡ Quick Setup (5 Minutes)

### 1. Environment Configuration
```bash
# Copy example file
cp .env.local.example .env.local
```

Edit `.env.local` and add:
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (from Clerk dashboard)
- [ ] `CLERK_SECRET_KEY` (from Clerk dashboard)
- [ ] `CLERK_WEBHOOK_SECRET` (from Clerk webhook settings)
- [ ] `MONGODB_URI` (MongoDB connection string)

### 2. Clerk Dashboard Setup
Visit: https://dashboard.clerk.com

- [ ] Create new application
- [ ] Copy API keys to `.env.local`
- [ ] Enable Email/Password authentication
- [ ] Enable Google OAuth (optional)
- [ ] Enable Apple OAuth (optional)
- [ ] Set Sign-up URL: `/sign-up`
- [ ] Set After Sign-up URL: `/onboarding`

### 3. Configure Webhook
In Clerk Dashboard → Webhooks:
- [ ] Add endpoint: `https://your-domain.com/api/webhooks/clerk`
- [ ] Copy webhook secret to `.env.local`
- [ ] Subscribe to events:
  - [x] user.created
  - [x] user.updated
  - [x] user.deleted
  - [x] session.created

### 4. Start Development
```bash
npm install
npm run dev
```

Visit: http://localhost:3000

---

## ✅ Testing Checklist

### Basic Flow
- [ ] Open http://localhost:3000
- [ ] Click "Sign Up" or "Get Started"
- [ ] Complete sign-up form
- [ ] Verify redirect to `/onboarding`
- [ ] Select role (Driver/Shipper/Admin)
- [ ] Fill profile details
- [ ] Click "Complete Setup"
- [ ] Verify redirect to role-specific dashboard

### Driver Sign-Up
- [ ] Sign up as new user
- [ ] Select "Driver" role
- [ ] Enter company name
- [ ] Enter phone number
- [ ] Select country
- [ ] Enter driver license number (required)
- [ ] Enter vehicle plate (optional)
- [ ] Complete setup
- [ ] Verify redirect to `/dashboard/tracking`

### Shipper Sign-Up
- [ ] Sign up as new user
- [ ] Select "Shipper" role
- [ ] Enter company name
- [ ] Enter phone number
- [ ] Select country
- [ ] Complete setup
- [ ] Verify redirect to `/dashboard`

### Admin Sign-Up
- [ ] Sign up as new user
- [ ] Select "Administrator" role
- [ ] Enter company name
- [ ] Enter phone number
- [ ] Select country
- [ ] Complete setup
- [ ] Verify redirect to `/dashboard/analytics`

### Legal Pages
- [ ] Visit `/terms` page
- [ ] Verify Terms of Service displays
- [ ] Click "Back to Sign Up"
- [ ] Visit `/privacy` page
- [ ] Verify Privacy Policy displays
- [ ] Click "Back to Sign Up"

### OAuth (If Configured)
- [ ] Click "Sign up with Google"
- [ ] Complete Google OAuth flow
- [ ] Verify redirect to `/onboarding`
- [ ] Complete onboarding
- [ ] Click "Sign up with Apple"
- [ ] Complete Apple OAuth flow

---

## 🔧 Troubleshooting

### Issue: "Missing Clerk keys" error
**Solution:** Ensure `.env.local` has both:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### Issue: Webhook not firing
**Solution:** 
1. Check webhook URL is correct
2. Verify `CLERK_WEBHOOK_SECRET` matches Clerk dashboard
3. Test webhook with "Send test event" in Clerk

### Issue: Stuck on onboarding page
**Solution:**
1. Check browser console for errors
2. Verify `/api/onboarding` endpoint is accessible
3. Check MongoDB connection

### Issue: User not syncing to MongoDB
**Solution:**
1. Verify webhook is configured
2. Check MongoDB connection string
3. Look at server logs for webhook errors

---

## 📦 Files Created/Modified

### New Files
- [x] `app/(root)/[locale]/(auth)/terms/page.tsx`
- [x] `app/(root)/[locale]/(auth)/privacy/page.tsx`
- [x] `docs/SIGNUP_FLOW_COMPLETE.md`
- [x] `docs/SETUP_CHECKLIST.md` (this file)

### Modified Files
- [x] `.env.local.example` - Added comprehensive environment variables
- [x] `app/(root)/[locale]/(auth)/sign-up/[[...sign-up]]/page.tsx` - Added legal links
- [x] `app/(root)/[locale]/onboarding/page.tsx` - Added two-step flow with profile collection
- [x] `app/api/onboarding/route.ts` - Updated to handle profile data
- [x] `middleware.ts` - Added terms/privacy to public routes

---

## 📊 Sign-Up Flow Summary

```
User Journey:
1. Landing Page → Click "Sign Up"
2. Sign-Up Page → Email/password or OAuth
3. Clerk creates account
4. Webhook syncs to MongoDB
5. Redirect to Onboarding
   Step 1: Select role (Driver/Shipper/Admin)
   Step 2: Enter profile details
6. API updates user metadata
7. Redirect to role-specific dashboard

Tech Stack:
- Clerk: Authentication
- MongoDB: User data storage
- Next.js: Full-stack framework
- Webhooks: Real-time sync
- JWT: Session management
```

---

## 🎯 Next Steps

After completing this checklist:

1. **Production Deployment**
   - Deploy to Vercel/AWS/your hosting
   - Update webhook URL in Clerk
   - Configure production environment variables

2. **Email Verification**
   - Enable in Clerk dashboard (Settings → Email/Phone)
   - Customize email templates

3. **Rate Limiting**
   - Configure in Clerk dashboard
   - Recommended: 5 sign-ups per hour per IP

4. **Analytics**
   - Track sign-up conversion rates
   - Monitor drop-off points
   - A/B test onboarding flow

5. **Enhancements**
   - Add profile photo upload
   - Add company logo upload
   - Add multi-step form progress saving
   - Add SMS verification for phone numbers

---

## 📚 Documentation

Full documentation available in:
- `/docs/SIGNUP_FLOW_COMPLETE.md` - Complete flow documentation
- `/docs/CLERK_INTEGRATION.md` - Clerk integration guide
- `/docs/AUTH_README.md` - Authentication system overview

---

## ✅ Setup Complete!

Once all checkboxes are checked, your sign-up flow is ready to go! 🎉

**Questions?** See troubleshooting section or check documentation.

---

**Last Updated:** January 15, 2026
