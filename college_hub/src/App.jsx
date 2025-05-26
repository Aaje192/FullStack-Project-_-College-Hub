import React, { useState, useEffect } from 'react';
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
import ResetPasswordPage from './pages/ResetPasswordPage';
import './styles/global.css';
import './styles/common.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId');
  });

  const handleLogin = (userId) => {
    setUserId(userId);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userId', userId);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/marks" />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected Routes */}
        <Route element={isAuthenticated ? <DashboardLayout onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route path="/marks" element={<MarksPage userId={userId} />} />
          <Route path="/attendance" element={<AttendancePage userId={userId} />} />
          <Route path="/timetable" element={<TimetablePage userId={userId} />} />
          <Route path="/profile" element={<ProfilePage userId={userId} />} />
          <Route path="/tasks" element={<TasksPage userId={userId} />} />
          <Route path="/chat" element={<ChatForumsPage userId={userId} />} />
          <Route path="/notes" element={<NotesPage userId={userId} />} />
          <Route path="/" element={<Navigate to="/marks" />} />
          <Route path="*" element={<Navigate to="/marks" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;