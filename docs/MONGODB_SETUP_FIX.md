# MongoDB Connection Fix Guide

## Problem
MongoDB Atlas connection timing out with error:
```
MongoServerSelectionError: connect ETIMEDOUT 159.41.88.73:27017
```

## Root Cause
Your IP address is **not whitelisted** in MongoDB Atlas Network Access settings.

## Solutions

### Option 1: Fix MongoDB Atlas (RECOMMENDED)

#### Step 1: Whitelist Your IP
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on your project
3. Navigate to **Network Access** (left sidebar)
4. Click **"Add IP Address"**
5. Choose one of:
   - **"Add Current IP Address"** ✅ (Recommended for dev)
   - **"Allow Access from Anywhere"** (0.0.0.0/0)
     - ⚠️ Less secure, but easier for development
     - Good if you have dynamic IP or travel

#### Step 2: Verify Connection
```bash
npx tsx scripts/test-mongodb-connection.ts
```

#### Step 3: Restart Dev Server
```bash
npm run dev
```

---

### Option 2: Use Local MongoDB (Quick Alternative)

#### Step 1: Start MongoDB Locally
Using Docker (easiest):
```bash
docker run -d -p 27017:27017 --name gotruck-mongo mongo:7
```

Or install MongoDB Community Edition from:
https://www.mongodb.com/try/download/community

#### Step 2: Update .env.local
Uncomment the local MongoDB URI:
```env
# MONGODB_URI=mongodb+srv://chrismmbohe_db_user:lkHXKQndhv8UHgqy@cluster0.0xp39lr.mongodb.net/gotruck?retryWrites=true&w=majority&appName=Cluster0

# Local MongoDB (fallback for development)
MONGODB_URI=mongodb://localhost:27017/gotruck
```

#### Step 3: Restart Dev Server
```bash
npm run dev
```

---

### Option 3: Check Cluster Status

Your MongoDB Atlas cluster might be:
- **Paused** (go to Atlas → Resume Cluster)
- **Deleted** (recreate cluster)
- **In wrong region** (check cluster location)

---

## Verification

Test your connection:
```bash
npx tsx scripts/test-mongodb-connection.ts
```

Expected output:
```
✅ Connected successfully!
✅ Ping successful!
✅ Available databases:
  - admin (0.00 MB)
  - gotruck (0.00 MB)
✅ MongoDB Atlas connection test PASSED!
```

---

## Prevention

### For MongoDB Atlas:
1. Use **"Allow Access from Anywhere"** during development
2. Add specific IPs for production
3. Enable **"Terminate After"** for temporary IP addresses

### For Production:
1. Whitelist only your server IPs
2. Use MongoDB Atlas Private Endpoints
3. Enable VPC Peering (for AWS/GCP/Azure)

---

## Current Code Improvements

The following improvements have been added:

### 1. Better Timeout Configuration
`lib/db/mongodb.ts` now includes:
- `serverSelectionTimeoutMS: 10000` (10 seconds)
- `connectTimeoutMS: 10000`
- `socketTimeoutMS: 45000`

### 2. Connection Verification
```typescript
await client.db("admin").command({ ping: 1 });
```

### 3. Enhanced Error Handling
Better error messages with specific troubleshooting steps

---

## Need Help?

1. **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
2. **Support Docs**: https://docs.atlas.mongodb.com/security-whitelist/
3. **Local Setup**: Use Docker command above
