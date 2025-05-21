import React, { useEffect, useState } from "react";
import { getTimetable, addDay, updatePeriod, deleteDay } from "../api/TimeTableapi.js";
import "../styles/TimeTablePage.css";

const defaultPeriods = 8;
const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Button = ({ children, onClick, style = {} }) => {
  return (
    <button onClick={onClick} className="custom-button" style={style}>
      {children}
    </button>
  );
};

function TimetablePage({ userId }) {
  const [timetableData, setTimetableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedPeriods, setEditedPeriods] = useState([]);
  const [newDay, setNewDay] = useState("");
  const [newPeriods, setNewPeriods] = useState(Array(defaultPeriods).fill(""));
  const [message, setMessage] = useState("");

  const dayOrder = defaultDays;

  // Load timetable or initialize with blank periods
  useEffect(() => {
    getTimetable(userId)
      .then((res) => {
        const data = res.data;
        const filled = defaultDays.map((day) => {
          const found = data.find((row) => row.day === day);
          return found
            ? { ...found, periods: [...found.periods, ...Array(defaultPeriods - found.periods.length).fill("")].slice(0, defaultPeriods) }
            : { day, studentId: userId, periods: Array(defaultPeriods).fill("") };
        });
        setTimetableData(filled);
      })
      .catch(() => {
        setTimetableData(
          defaultDays.map((day) => ({
            day,
            studentId: userId,
            periods: Array(defaultPeriods).fill(""),
          }))
        );
      });
  }, [userId]);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedPeriods([...timetableData[index].periods]);
  };

  const handleSave = async (index) => {
    const day = timetableData[index].day;
    try {
      await Promise.all(
        editedPeriods.map((value, periodIdx) =>
          updatePeriod({ studentId: userId, day, periodIdx, value })
        )
      );
      const updated = [...timetableData];
      updated[index].periods = editedPeriods;
      setTimetableData(updated);
      setEditIndex(null);
      setMessage(`Saved changes for ${day}.`);
    } catch {
      setMessage("Failed to save changes.");
    }
  };

  const handleDelete = async (index) => {
    const day = timetableData[index].day;
    if (window.confirm("Are you sure you want to delete this day?")) {
      try {
        await deleteDay(userId, day);
        const updated = timetableData.filter((_, i) => i !== index);
        setTimetableData(updated);
        setMessage("Day deleted.");
      } catch {
        setMessage("Failed to delete day.");
      }
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

  const handleAddDay = async () => {
    if (!newDay.trim() || newPeriods.some((p) => !p.trim())) {
      setMessage("Please fill all fields for the new day.");
      return;
    }

    try {
      const res = await addDay({ studentId: userId, day: newDay.trim(), periods: newPeriods });
      const updated = [...timetableData.filter(d => d.day.toLowerCase() !== newDay.trim().toLowerCase()), res.data];
      updated.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
      setTimetableData(updated);
      setNewDay("");
      setNewPeriods(Array(defaultPeriods).fill(""));
      setMessage("Day added successfully.");
    } catch {
      setMessage("Failed to add day.");
    }
  };

  const handleEditPeriod = async (rowIdx, periodIdx, value) => {
    const day = timetableData[rowIdx].day;
    try {
      await updatePeriod({ studentId: userId, day, periodIdx, value });
      setTimetableData((prev) =>
        prev.map((row, i) =>
          i === rowIdx
            ? { ...row, periods: row.periods.map((p, j) => (j === periodIdx ? value : p)) }
            : row
        )
      );
      setMessage("Period updated.");
    } catch {
      setMessage("Failed to update period.");
    }
  };

  return (
    <div className="timetable-container">
      <h1 className="timetable-title">Class Timetable for Staff</h1>

      {message && <p className="timetable-message">{message}</p>}

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
        <Button onClick={handleAddDay} style={{ backgroundColor: "#28a745" }}>
          Add Day
        </Button>
      </div>

      <table className="timetable-table">
        <thead>
          <tr>
            <th>Day</th>
            {Array.from({ length: defaultPeriods }).map((_, i) => (
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
                : row.periods.map((className, i) => (
                    <td key={i}>
                      <input
                        value={className}
                        onChange={(e) => handleEditPeriod(index, i, e.target.value)}
                      />
                    </td>
                  ))}
              <td>
                {editIndex === index ? (
                  <Button onClick={() => handleSave(index)} style={{ backgroundColor: "green" }}>
                    Save
                  </Button>
                ) : (
                  <Button onClick={() => handleEdit(index)}>Edit</Button>
                )}
                <Button onClick={() => handleDelete(index)} style={{ backgroundColor: "red" }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button onClick={() => alert("Back to Dashboard")} style={{ marginTop: "40px" }}>
        Back
      </Button>
    </div>
  );
}

export default TimetablePage;
