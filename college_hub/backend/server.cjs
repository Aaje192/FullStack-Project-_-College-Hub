const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const marksRoutes = require('./routes/marksRoutes.cjs');
const chatForumRoutes = require('./routes/ChatForumRoutes.cjs');
app.use('/api/chat', chatForumRoutes);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/marksdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/marks', marksRoutes);

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
