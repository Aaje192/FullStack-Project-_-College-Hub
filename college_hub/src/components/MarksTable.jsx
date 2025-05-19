// ======= frontend/src/components/MarksTable.jsx =======
import React from 'react';
import { deleteMark } from '../api/Marksapi';

const MarksTable = ({ marks = [], onMarkDeleted }) => {
  const handleDelete = async (markId) => {
    try {
      await deleteMark(markId);
      onMarkDeleted(markId);
    } catch (error) {
      console.error('Error deleting mark:', error);
    }
  };

  return (
    <div className="marks-table">
      <table>
        <thead>
          <tr>
            <th>Exam</th>
            <th>Subject</th>
            <th>Semester</th>
            <th>Mark</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {marks.map(mark => (
            <tr key={mark._id}>
              <td>{mark.examType}</td>
              <td>{mark.subject}</td>
              <td>{mark.semester}</td>
              <td>{mark.mark}</td>
              <td>
                <button onClick={() => handleDelete(mark._id)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarksTable;
