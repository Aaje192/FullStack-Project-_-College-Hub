import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import MarksPage from './pages/MarksPage';
import AttendancePage from './pages/AttendancePage';
import TimetablePage from './pages/TimetablePage';
import ProfilePage from './pages/ProfilePage';
import TasksPage from './pages/TasksPage';
import ChatForumsPage from './pages/ChatForumsPage';
import NotesPage from './pages/NotesPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <Route path="*" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        ) : (
          <Route path="/*" element={<DashboardLayout onLogout={() => setIsAuthenticated(false)} />}>
            <Route path="marks" element={<MarksPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="chat" element={<ChatForumsPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route index element={<Navigate to="/marks" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;