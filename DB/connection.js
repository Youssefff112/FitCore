// src/DB/connection.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set. Add it to your .env file.');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 6+ no longer needs these options, but keeping for compatibility
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

