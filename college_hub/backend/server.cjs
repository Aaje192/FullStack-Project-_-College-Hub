const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db/connection.cjs');
const marksRoutes = require('./routes/marksRoutes.cjs');
const chatForumRoutes = require('./routes/ChatForumRoutes.cjs');
const taskRoutes = require('./routes/TaskRoute.cjs');
const noteRoutes = require('./routes/NoteRoute.cjs');
const attendanceRoutes = require('./routes/AttendanceRoutes.cjs');
const timetableRoutes = require('./routes/TimeTableRoutes.cjs');
const userRoutes = require('./routes/UserRoute.cjs'); // Add user route

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using connection.cjs and start the server
connectDB()
  .then(() => {
    app.use('/api/marks', marksRoutes);
    app.use('/api/chat', chatForumRoutes);
    app.use('/api/tasks', taskRoutes);
    app.use('/api/notes', noteRoutes);
    app.use('/api/attendance', attendanceRoutes);
    app.use('/api/timetable', timetableRoutes);
    app.use('/api/user', userRoutes); // Register user routes

    app.listen(4000, () => {
      console.log('Server running on port 4000');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

