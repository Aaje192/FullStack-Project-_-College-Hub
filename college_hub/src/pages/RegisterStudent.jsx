import React, { useState } from 'react';

const initialState = {
  username: '',
  studentId: '',
  email: '',
  dob: '',
  year: '',
  semester: '',
  department: '',
  password: '',
  confirmPassword: '',
};

const RegisterStudent = () => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
      } else {
        setSuccess('Registration successful!');
        setForm(initialState);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="register-fullpage">
      <div className="register-container">
        <h2>Student Registration</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
          <input name="studentId" placeholder="Student ID" value={form.studentId} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="dob" type="date" placeholder="Date of Birth" value={form.dob} onChange={handleChange} required />
          <input name="year" placeholder="Year" value={form.year} onChange={handleChange} required />
          <input name="semester" placeholder="Semester" value={form.semester} onChange={handleChange} required />
          <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
          <button type="submit">Register</button>
        </form>
        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}
      </div>
      <style>{`
        .register-fullpage {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(120deg, #e0e7ff 0%, #f0f4f8 100%);
        }
        .register-container {
          width: 100%;
          max-width: 420px;
          margin: 0;
          padding: 40px 32px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
        }
        .register-container h2 {
          text-align: center;
          margin-bottom: 28px;
          color: #2d3a4b;
        }
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .register-form input {
          padding: 12px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: border 0.2s;
        }
        .register-form input:focus {
          border-color: #4f8cff;
          outline: none;
        }
        .register-form button {
          padding: 12px 0;
          background: #4f8cff;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: background 0.2s;
        }
        .register-form button:hover {
          background: #2563eb;
        }
        .register-error {
          color: #e53e3e;
          background: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 6px;
          padding: 10px;
          margin-top: 18px;
          text-align: center;
        }
        .register-success {
          color: #38a169;
          background: #f0fff4;
          border: 1px solid #c6f6d5;
          border-radius: 6px;
          padding: 10px;
          margin-top: 18px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default RegisterStudent;