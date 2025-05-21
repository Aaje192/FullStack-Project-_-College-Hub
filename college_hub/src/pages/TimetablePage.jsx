import React, { useState } from 'react';
import '../styles/TimeTablePage.css';

const Button = ({ children, onClick, style = {} }) => {
  return (
    <button onClick={onClick} className="custom-button" style={style}>
      {children}
    </button>
  );
};

const TimeTablePage = () => {
  const [timetableData, setTimetableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedPeriods, setEditedPeriods] = useState([]);
  const [newDay, setNewDay] = useState('');
  const [newPeriods, setNewPeriods] = useState(Array(8).fill(''));

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedPeriods([...timetableData[index].periods]);
  };

  const handleSave = (index) => {
    const updated = [...timetableData];
    updated[index].periods = editedPeriods;
    setTimetableData(updated);
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this day?')) {
      const updated = timetableData.filter((_, i) => i !== index);
      setTimetableData(updated);
    }
  };

  const handleChange = (value, periodIndex) => {
    const updated = [...editedPeriods];
    updated[periodIndex] = value;
    setEditedPeriods(updated);
  };

  const handleNewPeriodChange = (value, index) => {
    const updated = [...newPeriods];
    updated[index] = value;
    setNewPeriods(updated);
  };

  const handleAddDay = () => {
    if (!newDay.trim()) {
      alert('Day cannot be empty');
      return;
    }

    if (newPeriods.some(p => !p.trim())) {
      alert('All periods must be filled');
      return;
    }

    const newEntry = { day: newDay.trim(), periods: [...newPeriods] };
    const updated = [...timetableData.filter(d => d.day.toLowerCase() !== newDay.trim().toLowerCase()), newEntry];

    updated.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

    setTimetableData(updated);
    setNewDay('');
    setNewPeriods(Array(8).fill(''));
  };

  return (
    <div className="timetable-container">
      <h1 className="timetable-title">Class Timetable for Staff</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Day (e.g., Monday)"
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
          className="day-input"
        />
        <div className="periods-input">
          {newPeriods.map((value, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Period ${index + 1}`}
              value={value}
              onChange={(e) => handleNewPeriodChange(e.target.value, index)}
              className="period-input"
            />
          ))}
        </div>
        <Button onClick={handleAddDay} style={{ backgroundColor: '#28a745' }}>
          Add Day
        </Button>
      </div>

      <table className="timetable-table">
        <thead>
          <tr>
            <th>Day</th>
            {[...Array(8)].map((_, i) => (
              <th key={i}>Period {i + 1}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timetableData.map((row, index) => (
            <tr key={index}>
              <td>{row.day}</td>
              {editIndex === index
                ? editedPeriods.map((className, i) => (
                    <td key={i}>
                      <input
                        type="text"
                        value={className}
                        onChange={(e) => handleChange(e.target.value, i)}
                        className="period-input"
                      />
                    </td>
                  ))
                : row.periods.map((className, i) => <td key={i}>{className}</td>)}
              <td>
                {editIndex === index ? (
                  <Button onClick={() => handleSave(index)} style={{ backgroundColor: 'green' }}>
                    Save
                  </Button>
                ) : (
                  <Button onClick={() => handleEdit(index)}>Edit</Button>
                )}
                <Button onClick={() => handleDelete(index)} style={{ backgroundColor: 'red' }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button onClick={() => alert('Back to Dashboard')} style={{ marginTop: '40px' }}>
        Back
      </Button>
    </div>
  );
};

export default TimeTablePage;
