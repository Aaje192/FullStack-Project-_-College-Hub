// ===== frontend/src/components/MarksForm.jsx =====
import React, { useState } from 'react';
import { addMark } from '../api/Marksapi';

const MarksForm = ({ onMarkAdded, userId }) => {
  const [subject, setSubject] = useState('');
  const [examType, setExamType] = useState('');
  const [semester, setSemester] = useState('');
  const [mark, setMark] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      subject,
      examType,
      semester,
      mark,
      studentId: userId,
    };
    console.log('Submitting payload:', payload);
    try {
      await addMark(payload);
      if (onMarkAdded) onMarkAdded();
      // Reset form fields
      setSubject('');
      setExamType('');
      setSemester('');
      setMark('');
    } catch (error) {
      console.error('Error adding mark:', error);
    }
  };

  const formStyles = {
    container: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#333333',
      fontWeight: '600',
      fontSize: '16px'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #cccccc',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: 'white',
      color: '#333333'
    },
    button: {
      backgroundColor: '#1976d2',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      marginTop: '10px',
      '&:hover': {
        backgroundColor: '#1565c0'
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.container}>
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={formStyles.input}
          required
          placeholder="Enter subject name"
        />
      </div>
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Exam Type</label>
        <input
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          style={formStyles.input}
          required
          placeholder="Enter exam type"
        />
      </div>
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Semester</label>
        <input
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          style={formStyles.input}
          required
          placeholder="Enter semester"
        />
      </div>
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Mark</label>
        <input
          value={mark}
          type="number"
          onChange={(e) => setMark(e.target.value)}
          style={formStyles.input}
          required
          placeholder="Enter mark"
          min="0"
          max="100"
        />
      </div>
      <button type="submit" style={formStyles.button}>
        Add Mark
      </button>
    </form>
  );
};

export default MarksForm;
