# 🚀 Quick Start - Clerk Authentication

Get authentication working in 5 minutes!

## Step 1: Get Clerk API Keys (2 min)

1. Go to https://clerk.com and sign up
2. Create a new application
3. Go to API Keys section
4. Copy your keys

## Step 2: Configure Environment (1 min)

Create `.env.local` in project root:

```bash
# Clerk Keys (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# Clerk URLs (Optional - defaults work)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# MongoDB (REQUIRED for webhooks)
MONGODB_URI=mongodb://localhost:27017/gotruck
```

## Step 3: Enable Social Login (1 min)

In Clerk Dashboard:
1. Go to "Social Connections"
2. Enable Google
3. Enable Apple (optional)
4. Save

## Step 4: Set Up Webhook (1 min)

1. In Clerk Dashboard, go to "Webhooks"
2. Click "Add Endpoint"
3. URL: `http://localhost:3001/api/webhooks/clerk` (for dev)
4. Subscribe to these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `session.created`
5. Copy the signing secret to `CLERK_WEBHOOK_SECRET`

## Step 5: Start Dev Server

```bash
npm install
npm run dev
```

## Test It! 🎉

1. Go to http://localhost:3001/sign-up
2. Create an account
3. Select your role (Driver, Shipper, or Admin)
4. You're in!

## Test Different Roles

### Test as Driver
1. Sign up with a new email
2. Select "Driver" role
3. You'll see: Dashboard → Tracking page
4. Can't access Fleet or Analytics

### Test as Shipper
1. Sign up with another email
2. Select "Shipper" role
3. You'll see: Full Dashboard
4. Can access Fleet and Analytics
5. Can't access Admin settings

### Test as Admin
1. Sign up with third email
2. Select "Admin" role
3. Full access to everything

## Troubleshooting

### "Clerk keys not found"
➡️ Add keys to `.env.local` and restart server

### Webhook fails
➡️ Ensure MongoDB is running: `mongod`

### Redirect loop
➡️ Complete onboarding flow for test user

### Social login doesn't work
➡️ Enable providers in Clerk Dashboard

## What's Next?

✅ Authentication is working!

Now you can:
1. Customize user metadata in onboarding
2. Add more fields to user profile
3. Build protected dashboard features
4. Add email notifications
5. Implement 2FA

## Need Help?

- 📖 Full Guide: `/docs/CLERK_INTEGRATION.md`
- 📋 Summary: `/docs/CLERK_IMPLEMENTATION_SUMMARY.md`
- 🌐 Clerk Docs: https://clerk.com/docs

---

**That's it!** You now have production-ready authentication! 🎉
