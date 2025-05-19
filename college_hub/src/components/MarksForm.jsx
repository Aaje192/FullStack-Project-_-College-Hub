// ===== frontend/src/components/MarksForm.jsx =====
import React, { useState } from 'react';
import { addMark } from '../api/Marksapi';

const MarksForm = ({ onMarkAdded }) => {
  const [subject, setSubject] = useState('');
  const [examType, setExamType] = useState('');
  const [semester, setSemester] = useState('');
  const [mark, setMark] = useState('');

  const studentId = '1234567890';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !examType || !semester || !mark) return;

    await addMark({ studentId, subject, examType, semester, mark });
    setSubject('');
    setExamType('');
    setSemester('');
    setMark('');
    onMarkAdded();
  };

  return (
    <form className="marks-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Subject</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Exam Type</label>
        <input value={examType} onChange={(e) => setExamType(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Semester</label>
        <input value={semester} onChange={(e) => setSemester(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Mark</label>
        <input value={mark} type="number" onChange={(e) => setMark(e.target.value)} />
      </div>
      <button type="submit">Add Mark</button>
    </form>
  );
};

export default MarksForm;
