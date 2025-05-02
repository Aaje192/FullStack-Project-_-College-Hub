import React, { useState } from 'react';
import './LoginPage.css';
import StaffLoginForm from './StaffLogin';
import StudentLoginForm from './StudentLogin'; // Uncomment this line

function LoginPage() {
  const [userType, setUserType] = useState(null);

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    console.log('User type selected:', type);
  };

  const handleGoBack = () => {
    setUserType(null);
    console.log('Going back to user selection');
  };

  const renderUserSelection = () => (
    <div className="selection-card">
      <h2>Select User Type</h2>
      <div className="button-group">
        <button onClick={() => handleUserTypeSelection('staff')}>
          <i className="fas fa-briefcase"></i>
          Staff
        </button>
        <button onClick={() => handleUserTypeSelection('student')}>
          <i className="fas fa-graduation-cap"></i>
          Student
        </button>
      </div>
      <p className="register-link">
        <a href="/register">Click to Register</a>
      </p>
    </div>
  );

  const renderLoginForm = (type) => {
    if (type === 'staff') {
      return <StaffLoginForm onBack={handleGoBack} />;
    } else if (type === 'student') {
      return <StudentLoginForm onBack={handleGoBack} />; // Change this line
    }
    return null;
  };

  return (
    <div className="login-page-container">
      <div className="logo-container">
        <i className="fas fa-university logo-icon"></i>
        <h1>KOLLEGE</h1>
      </div>

      {userType === null ? renderUserSelection() : renderLoginForm(userType)}
    </div>
  );
}

export default LoginPage;
