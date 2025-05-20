const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const marksRoutes = require('./routes/marksRoutes.cjs');
const studentRoutes = require('./routes/RegisterRoutes.cjs'); // Add this line

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/marksdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/marks', marksRoutes);
app.use('/api/students', studentRoutes); // Add this line

app.listen(5174, () => {
  console.log('Server running on port 4000');
});