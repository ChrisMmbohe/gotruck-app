import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * GPS Log Document Interface
 */
export interface IGPSLog extends Document {
  truckId: string;
  shipmentId?: string;
  fleetId?: string;
  userId: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number; // Bearing in degrees (0-360)
  speed?: number; // km/h
  altitude?: number;
  batteryLevel?: number; // For mobile devices
  isOfflineData?: boolean;
  syncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date; // TTL: 30 days
}

/**
 * GPS Log Schema with GeoJSON support for spatial queries
 */
const gpsLogSchema = new Schema<IGPSLog>(
  {
    truckId: {
      type: String,
      required: true,
      index: true,
    },
    shipmentId: {
      type: String,
      index: true,
    },
    fleetId: {
      type: String,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: (v: number[]) => Array.isArray(v) && v.length === 2,
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    accuracy: {
      type: Number,
      min: 0,
    },
    heading: {
      type: Number,
      min: 0,
      max: 360,
    },
    speed: {
      type: Number,
      min: 0,
    },
    altitude: {
      type: Number,
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
    },
    isOfflineData: {
      type: Boolean,
      default: false,
      index: true,
    },
    syncedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      index: { expireAfterSeconds: 0 }, // TTL index
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for location queries
gpsLogSchema.index({ 'location.coordinates': '2dsphere' });

// Compound indexes for common queries
gpsLogSchema.index({ truckId: 1, createdAt: -1 });
gpsLogSchema.index({ shipmentId: 1, createdAt: -1 });
gpsLogSchema.index({ fleetId: 1, createdAt: -1 });
gpsLogSchema.index({ userId: 1, createdAt: -1 });
gpsLogSchema.index({ isOfflineData: 1, syncedAt: 1 });

/**
 * GPSLog Model
 */
let GPSLogModel: Model<IGPSLog>;

try {
  GPSLogModel = mongoose.model<IGPSLog>('GPSLog');
} catch {
  GPSLogModel = mongoose.model<IGPSLog>('GPSLog', gpsLogSchema);
}

export { GPSLogModel as default };

/**
 * Helper function to create a GPS log entry
 */
export async function createGPSLog(data: Partial<IGPSLog>): Promise<IGPSLog> {
  const gpsLog = new GPSLogModel({
    ...data,
    location: {
      type: 'Point',
      coordinates: [data.longitude, data.latitude],
    },
  });
  return gpsLog.save();
}

/**
 * Helper function to get latest GPS for a truck
 */
export async function getLatestGPSForTruck(
  truckId: string
): Promise<IGPSLog | null> {
  return GPSLogModel.findOne({ truckId })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
}

/**
 * Helper function to get GPS history for a truck
 */
export async function getGPSHistory(
  truckId: string,
  limit = 100
): Promise<IGPSLog[]> {
  return GPSLogModel.find({ truckId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();
}

/**
 * Helper function to get unsynced offline GPS data
 */
export async function getUnsyncedGPSData(
  userId: string,
  limit = 1000
): Promise<IGPSLog[]> {
  return GPSLogModel.find({
    userId,
    isOfflineData: true,
    syncedAt: { $exists: false },
  })
    .sort({ createdAt: 1 })
    .limit(limit)
    .lean()
    .exec();
}

/**
 * Helper function to batch insert GPS logs
 */
export async function batchInsertGPSLogs(
  logs: Partial<IGPSLog>[]
): Promise<IGPSLog[]> {
  const logsWithLocation = logs.map((log) => ({
    ...log,
    location: {
      type: 'Point' as const,
      coordinates: [log.longitude, log.latitude],
    },
  }));

  return GPSLogModel.insertMany(logsWithLocation, {
    ordered: false,
  }).catch((error) => {
    // Handle partial failures in batch insert
    console.error('Batch insert error:', error);
    // Return successfully inserted documents
    return error.insertedDocs || [];
  });
}

/**
 * Helper function to mark GPS logs as synced
 */
export async function markGPSLogsAsSynced(ids: string[]): Promise<number> {
  const result = await GPSLogModel.updateMany(
    { _id: { $in: ids } },
    { syncedAt: new Date() }
  );
  return result.modifiedCount || 0;
}

/**
 * Helper function to cleanup old GPS data (manual cleanup, TTL index handles auto)
 */
export async function cleanupOldGPSData(daysOld = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await GPSLogModel.deleteMany({
    createdAt: { $lt: cutoffDate },
  });

  return result.deletedCount || 0;
}
