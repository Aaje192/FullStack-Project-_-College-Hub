const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db/connection.cjs');
const marksRoutes = require('./routes/marksRoutes.cjs');
const chatForumRoutes = require('./routes/ChatForumRoutes.cjs');
const taskRoutes = require('./routes/TaskRoute.cjs');
const noteRoutes = require('./routes/NoteRoute.cjs');
const attendanceRoutes = require('./routes/AttendanceRoutes.cjs');
const timetableRoutes = require('./routes/TimeTableRoutes.cjs');
const userRoutes = require('./routes/UserRoute.cjs');

const app = express();

// CORS configuration
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/marks', marksRoutes);
app.use('/api/chat', chatForumRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

