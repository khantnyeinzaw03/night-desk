import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const pool = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job-scraper');
    console.log(`🚀 MongoDB Connected: ${pool.connection.name}`);
  } catch (error: unknown) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
};

export default connectDB;
