import React, { useState } from 'react';
import './StaffLogin.css'; // Make sure this path is correct

function StaffLoginForm({ onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    console.log('Logging in as staff with:', { username, password });
    // In a real application, you would send this data to your backend for authentication.
  };

  return (
    <div className="staff-login-form-card">
      <h2>Staff Login</h2>
      <div className="staff-avatar-container">
        <i className="fas fa-briefcase staff-avatar-icon"></i>
      </div>
      <div className="staff-input-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter your username"
        />
      </div>
      <div className="staff-input-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your  password"
        />
      </div>
      <button className="staff-login-button" onClick={handleLogin}>
        Login
      </button>
      <p className="staff-register-link">
        <a href="/register/staff">Click to Register as Staff</a>
      </p>
      <button className="staff-back-button" onClick={onBack}>
        Back
      </button>
    </div>
  );
}

export default StaffLoginForm;