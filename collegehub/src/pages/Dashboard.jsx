import React from 'react';

const Dashboard = () => {
  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  };

  const headerStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  };

  const sectionStyle = {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  };

  const listItemStyle = {
    padding: '8px 0',
    borderBottom: '1px solid #eee',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>📊 Dashboard – Student & Staff Management</div>

      <div style={sectionStyle}>
        <h3>👨‍🎓 Student Modules</h3>
        <ul style={listStyle}>
          <li style={listItemStyle}>📅 Timetable</li>
          <li style={listItemStyle}>📝 Attendance</li>
          <li style={listItemStyle}>📊 Marks Analysis</li>
          <li style={listItemStyle}>📚 Notes Upload</li>
          <li style={listItemStyle}>✅ Task Manager</li>
          <li style={listItemStyle}>💬 Chat Forum</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h3>👩‍🏫 Staff Modules</h3>
        <ul style={listStyle}>
          <li style={listItemStyle}>📅 Timetable Management</li>
          <li style={listItemStyle}>👥 Student List</li>
          <li style={listItemStyle}>📝 Attendance Tracker</li>
          <li style={listItemStyle}>📊 Marks Entry & Analytics</li>
          <li style={listItemStyle}>✅ Task Manager</li>
          <li style={listItemStyle}>💬 Chat Forum</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
