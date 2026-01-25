/**
 * MongoDB Connection Test Script
 * Run with: npx tsx scripts/test-mongodb-connection.ts
 */

import { MongoClient, ServerApiVersion } from 'mongodb';

// Read the MongoDB URI from environment variable
const uri = process.env.MONGODB_URI || '';

if (!uri) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

console.log('🔍 Testing MongoDB Atlas connection...');
console.log('📝 Connection URI:', uri.replace(/:[^:@]+@/, ':***@')); // Hide password

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

async function testConnection() {
  const client = new MongoClient(uri, options);

  try {
    console.log('\n⏳ Connecting to MongoDB Atlas...');
    await client.connect();
    
    console.log('✅ Connected successfully!');
    
    // Ping the database
    console.log('\n⏳ Pinging database...');
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Ping successful!');
    
    // List databases
    console.log('\n⏳ Listing databases...');
    const databases = await client.db().admin().listDatabases();
    console.log('✅ Available databases:');
    databases.databases.forEach((db: any) => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    // Test gotruck database
    console.log('\n⏳ Checking gotruck database...');
    const db = client.db('gotruck');
    const collections = await db.listCollections().toArray();
    console.log('✅ Collections in gotruck database:');
    if (collections.length === 0) {
      console.log('  (No collections yet - database is empty)');
    } else {
      collections.forEach((col: any) => {
        console.log(`  - ${col.name}`);
      });
    }
    
    console.log('\n✅ MongoDB Atlas connection test PASSED!');
    
  } catch (error) {
    console.error('\n❌ MongoDB connection test FAILED!');
    console.error('\n📋 Error Details:');
    
    if (error instanceof Error) {
      console.error(`  Name: ${error.name}`);
      console.error(`  Message: ${error.message}`);
      
      // Check for specific error types
      if (error.message.includes('ETIMEDOUT')) {
        console.error('\n💡 Possible causes:');
        console.error('  1. Your IP address is not whitelisted in MongoDB Atlas');
        console.error('     → Go to MongoDB Atlas → Network Access → Add your IP');
        console.error('  2. Firewall or VPN blocking MongoDB Atlas');
        console.error('     → Try disabling VPN or check firewall settings');
        console.error('  3. MongoDB Atlas cluster is paused or deleted');
        console.error('     → Check your cluster status in MongoDB Atlas');
      } else if (error.message.includes('authentication')) {
        console.error('\n💡 Authentication error:');
        console.error('  → Check your username and password in MONGODB_URI');
        console.error('  → Ensure the database user has proper permissions');
      } else if (error.message.includes('ENOTFOUND')) {
        console.error('\n💡 DNS resolution error:');
        console.error('  → Check your internet connection');
        console.error('  → Verify the cluster hostname is correct');
      }
    }
    
    process.exit(1);
  } finally {
    await client.close();
  }
}

testConnection();
