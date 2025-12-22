import mongoose, { Connection } from 'mongoose';

/**
 * Global declaration for cached MongoDB connection
 * Prevents TypeScript errors when accessing global.mongooseCache
 */
declare global {
  // Allow global to have a mongooseCache property
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

/**
 * Initialize the global mongoose cache if it doesn't exist
 */
if (!global.mongooseCache) {
  global.mongooseCache = {
    conn: null,
    promise: null,
  };
}

/**
 * MongoDB Connection URI from environment variables
 * Falls back to localhost if MONGODB_URI is not set (development only)
 */
const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextjs-app';

/**
 * Validates that the MongoDB URI is configured
 */
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Connects to MongoDB using Mongoose with caching
 * 
 * This function implements a caching strategy to prevent multiple connections
 * during development. The cache is stored in the global scope, which persists
 * across module reloads in Next.js development mode.
 *
 * @returns Promise<Connection> - A Mongoose connection object
 * 
 * @example
 * // In your API route or server component:
 * const conn = await connectDB();
 * const User = conn.model('User', userSchema);
 */
async function connectDB(): Promise<Connection> {
  // If we already have a cached connection, return it immediately
  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn;
  }

  // If a connection promise is already in progress, wait for it
  if (global.mongooseCache.promise) {
    return global.mongooseCache.promise;
  }

  // Create a new connection promise
  global.mongooseCache.promise = mongoose
    .connect(MONGODB_URI, {
      // Connection pool size - number of connections to maintain
      maxPoolSize: 10,
      minPoolSize: 5,
      // Automatically attempt to reconnect
      retryWrites: true,
      // Wait up to 10 seconds for a connection
      serverSelectionTimeoutMS: 10000,
      // Socket timeout - close socket after 45 seconds of inactivity
      socketTimeoutMS: 45000,
    })
    .then((mongoose) => {
      // Connection successful
      global.mongooseCache.conn = mongoose.connection;
      console.log('✅ MongoDB connected successfully');
      return mongoose.connection;
    })
    .catch((error) => {
      // Clear the promise cache on error to allow retries
      global.mongooseCache.promise = null;
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    });

  // Cache the promise while connection is being established
  return global.mongooseCache.promise;
}

export default connectDB;
