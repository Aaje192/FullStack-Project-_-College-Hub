import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import MarksPage from './pages/MarksPage';
import AttendancePage from './pages/AttendancePage';
import TimetablePage from './pages/TimetablePage';
import ProfilePage from './pages/ProfilePage';
import TasksPage from './pages/TasksPage';
import ChatForumsPage from './pages/ChatForumsPage';
import NotesPage from './pages/NotesPage';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null); // <-- Add this

  // Pass a callback to LoginPage to set userId and isAuthenticated
  const handleLogin = (userId) => {
    setUserId(userId);
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
          </>
        ) : (
          <Route path="/*" element={<DashboardLayout onLogout={() => { setIsAuthenticated(false); setUserId(null); }} />}>
            <Route path="marks" element={<MarksPage userId={userId} />} />
            <Route path="attendance" element={<AttendancePage userId={userId} />} />
            <Route path="timetable" element={<TimetablePage userId={userId} />} />
            <Route path="profile" element={<ProfilePage userId={userId} />} />
            <Route path="tasks" element={<TasksPage userId={userId} />} />
            <Route path="chat" element={<ChatForumsPage userId={userId} />} />
            <Route path="notes" element={<NotesPage userId={userId} />} />
            <Route index element={<Navigate to="/marks" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;