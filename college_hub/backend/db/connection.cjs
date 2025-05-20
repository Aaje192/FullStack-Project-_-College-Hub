// db/connection.js
const mongoose = require('mongoose');

const uri = "mongodb+srv://lokesh:root@collegehub.ikldziw.mongodb.net/?retryWrites=true&w=majority&appName=CollegeHub";

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas with Mongoose!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
