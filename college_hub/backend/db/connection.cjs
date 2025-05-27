// db/connection.js
const mongoose = require('mongoose');

const uri = "mongodb://127.0.0.1:27017/collegehub";

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to Local MongoDB with Mongoose!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
