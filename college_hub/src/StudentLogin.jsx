import React, { useState } from 'react';
import './StudentLogin.css'; // Changed CSS import to StudentLogin.css

function StudentLoginForm({ onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    console.log('Logging in as student with:', { username, password });
    // In a real application, you would send this data to your backend for student authentication.
  };

  return (
    <div className="student-login-form-card"> {/* Changed class name */}
      <h2>Student Login</h2> {/* Changed heading */}
      <div className="student-avatar-container">
        <i className="fas fa-graduation-cap student-avatar-icon"></i> {/* Changed icon and class name */}
      </div>
      <div className="student-input-group"> {/* Changed class name */}
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter your username" //Kept generic
        />
      </div>
      <div className="student-input-group"> {/* Changed class name */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password" //Kept generic
        />
      </div>
      <button className="student-login-button" onClick={handleLogin}> {/* Changed class name */}
        Login
      </button>
      <p className="student-register-link"> {/* Changed class name */}
        <a href="/register/student">Click to Register as Student</a> {/* Changed link */}
      </p>
      <button className="student-back-button" onClick={onBack}> {/* Changed class name */}
        Back
      </button>
    </div>
  );
}

export default StudentLoginForm;
