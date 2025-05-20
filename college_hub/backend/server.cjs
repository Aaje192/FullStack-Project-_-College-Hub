const express = require('express');
const cors = require('cors');
const marksRoutes = require('./routes/marksRoutes.cjs');
const chatForumRoutes = require('./routes/ChatForumRoutes.cjs');
const { connectDB } = require('./db/connection.cjs'); // Use your connection utility

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas, then start the server
connectDB().then(() => {
  app.use('/api/marks', marksRoutes);
  app.use('/api/chat', chatForumRoutes);

  app.listen(5174, () => {
    console.log('Server running on port 5174');
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});