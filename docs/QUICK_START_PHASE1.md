# GoTruck Phase 1 - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or Atlas)
- Redis instance (local or cloud)
- Clerk account ([clerk.com](https://clerk.com))
- Cloudinary account ([cloudinary.com](https://cloudinary.com))
- Resend account ([resend.com](https://resend.com)) - for emails

---

## 📋 Setup Steps

### 1. Environment Configuration

Create `.env.local` in the project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# MongoDB
MONGODB_URI=mongodb://localhost:27017/gotruck
MONGODB_DB_NAME=gotruck

# Redis
REDIS_URL=redis://localhost:6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=gotruck_uploads

# Email (Resend)
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=noreply@gotruck.app

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Enable authentication providers:
   - **Email/Password** ✅
   - **Google OAuth** ✅
   - **Apple OAuth** ✅
4. Copy API keys to `.env.local`
5. Set up webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Events to listen: `user.created`, `user.updated`, `session.created`

### 4. Configure Cloudinary

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy Cloud Name, API Key, API Secret
3. Create upload preset:
   - Name: `gotruck_uploads`
   - Signing Mode: Unsigned
   - Folder: `gotruck`

### 5. Configure Resend (Email)

1. Go to [Resend Dashboard](https://resend.com/overview)
2. Create API key
3. Verify domain (or use sandbox for testing)
4. Copy API key to `.env.local`

### 6. Start MongoDB & Redis

**Option A: Docker Compose (Recommended)**
```bash
docker-compose up -d mongodb redis
```

**Option B: Local Installation**
```bash
# Start MongoDB
mongod

# Start Redis
redis-server
```

### 7. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing Authentication

### Test User Roles

Create test users for each role:

1. **Shipper Account**
   - Go to `/sign-up`
   - Select "Shipper" role
   - Complete registration
   - Should redirect to `/onboarding`

2. **Driver Account**
   - Sign up as "Driver"
   - Should see driver-specific onboarding

3. **Admin Account**
   - Create via Clerk Dashboard
   - Manually set `publicMetadata.role = "admin"`

### Test Workflows

#### Sign-Up Flow
```
1. Visit /sign-up
2. Select role (Shipper/Driver/Admin)
3. Fill in details
4. Submit form
5. Verify email
6. Complete onboarding
7. Redirect to dashboard
```

#### Sign-In Flow
```
1. Visit /sign-in
2. Enter credentials OR click social login
3. Authenticate
4. Redirect based on role:
   - Driver → /dashboard/tracking
   - Shipper → /dashboard
   - Admin → /dashboard/analytics
```

#### Role-Based Access
```
# Test as Driver
- ✅ Can access: /dashboard/tracking, /dashboard/shipments
- ❌ Cannot access: /dashboard/fleet, /dashboard/analytics

# Test as Shipper
- ✅ Can access: All dashboard pages except admin
- ❌ Cannot access: /dashboard/users

# Test as Admin
- ✅ Can access: Everything
```

---

## 🔍 Verification Checklist

### Authentication
- [ ] Email/password sign-up works
- [ ] Google OAuth works
- [ ] Apple OAuth works
- [ ] Email verification sent
- [ ] Role selection persists
- [ ] Webhook syncs to MongoDB

### Authorization
- [ ] Middleware protects routes
- [ ] Role-based redirects work
- [ ] Permission checks work
- [ ] ProtectedRoute component works
- [ ] RoleGate conditional rendering works

### Profile Management
- [ ] Profile API GET returns data
- [ ] Profile API PUT updates data
- [ ] Profile completion calculated correctly
- [ ] Image upload to Cloudinary works
- [ ] Images display in profile

### Session Management
- [ ] Session timeout warning appears
- [ ] Session extends on activity
- [ ] Auto-logout after timeout
- [ ] Error messages display correctly

### Onboarding
- [ ] Wizard navigation works
- [ ] Step progression works
- [ ] Form data persists between steps
- [ ] Completion redirects to dashboard

---

## 🐛 Troubleshooting

### Clerk Integration Issues

**Problem**: "Missing publishable key" error
```
Solution: Check NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in .env.local
```

**Problem**: OAuth not working
```
Solution:
1. Check redirect URLs in Clerk Dashboard
2. Add http://localhost:3000/sso-callback
3. Restart dev server
```

### MongoDB Connection Issues

**Problem**: "Cannot connect to MongoDB"
```
Solution:
1. Ensure MongoDB is running: mongod
2. Check MONGODB_URI in .env.local
3. Verify network connectivity
```

### Image Upload Issues

**Problem**: "Failed to upload image"
```
Solution:
1. Check Cloudinary credentials
2. Verify upload preset exists
3. Check file size (max 5MB)
4. Ensure file type is JPEG/PNG/WebP
```

### Permission Denied Errors

**Problem**: User can't access page
```
Solution:
1. Check user role in Clerk Dashboard
2. Verify role in MongoDB users collection
3. Check PERMISSIONS matrix in lib/auth/roles.ts
4. Clear browser cache and re-login
```

---

## 📊 Database Schema

### Users Collection

```javascript
{
  clerkId: "user_abc123",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "shipper", // driver | shipper | admin
  isVerified: false,
  onboardingComplete: false,
  companyName: "Acme Logistics",
  phoneNumber: "+254700000000",
  country: "KE",
  profileCompletionPercentage: 60,
  documents: [],
  preferences: {
    language: "en",
    currency: "KES",
    notifications: { email: true, sms: true, push: true }
  },
  createdAt: ISODate("2026-01-20T00:00:00.000Z"),
  updatedAt: ISODate("2026-01-20T00:00:00.000Z")
}
```

---

## 🔗 Useful Links

- **Clerk Documentation**: https://clerk.com/docs
- **Clerk Dashboard**: https://dashboard.clerk.com
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Resend Docs**: https://resend.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## 🆘 Need Help?

- Check [PHASE1_IMPLEMENTATION_SUMMARY.md](./PHASE1_IMPLEMENTATION_SUMMARY.md) for detailed documentation
- Review [AUTH_README.md](./AUTH_README.md) for authentication specifics
- Check console logs for error messages
- Verify environment variables are set correctly

---

## ✅ Next Steps

After completing Phase 1 setup:

1. ✅ Test all authentication flows
2. ✅ Create test users for each role
3. ✅ Complete onboarding wizard steps
4. ✅ Test profile updates
5. ✅ Test image uploads
6. ⏭️ Move to **Phase 2: Shipment Management**

---

**Last Updated**: January 20, 2026  
**Version**: Phase 1 - v1.0
