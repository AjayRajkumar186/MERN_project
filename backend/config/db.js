const mongoose = require('mongoose');

// Your direct connection string with the database name "myDatabase"
const MONGO_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    // Note: Use the variable MONGO_URI directly, not process.env.MONGO_URI
    const conn = await mongoose.connect(MONGO_URL);
    
    console.log(`✅ Connected to Database: ${conn.connection.name}`);
    console.log(`🚀 Host: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

