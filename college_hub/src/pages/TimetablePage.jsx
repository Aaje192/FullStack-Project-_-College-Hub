import React, { useEffect, useState } from "react";
import { getTimetable, addDay, updatePeriod, deleteDay } from "../api/TimeTableapi.js";
import "../styles/TimeTablePage.css";

const defaultPeriods = 8;

function TimetablePage({ userId }) {
  const [timetableData, setTimetableData] = useState([]);
  const [newDay, setNewDay] = useState("");
  const [newPeriods, setNewPeriods] = useState(Array(defaultPeriods).fill(""));
  const [message, setMessage] = useState("");

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

  const handleAddDay = async () => {
    if (!newDay.trim() || newPeriods.some((p) => !p.trim())) {
      setMessage("Please fill all fields for the new day.");
      return;
    }
    try {
      const res = await addDay({ studentId: userId, day: newDay, periods: newPeriods });
      setTimetableData((prev) => [...prev, res.data]);
      setNewDay("");
      setNewPeriods(Array(defaultPeriods).fill(""));
      setMessage("Day added successfully.");
    } catch {
      setMessage("Failed to add day.");
    }
  };

  // Handle period input change (local state only)
  const handlePeriodChange = (rowIdx, periodIdx, value) => {
    setTimetableData((prev) =>
      prev.map((row, i) =>
        i === rowIdx
          ? { ...row, periods: row.periods.map((p, j) => (j === periodIdx ? value : p)) }
          : row
      )
    );
  };

  // Save all periods for a day
  const handleModify = async (rowIdx) => {
    const row = timetableData[rowIdx];
    try {
      // Save each period (or you can create a backend API to update all at once)
      await Promise.all(
        row.periods.map((value, periodIdx) =>
          updatePeriod({ studentId: userId, day: row.day, periodIdx, value })
        )
      );
      setMessage(`Saved changes for ${row.day}.`);
    } catch {
      setMessage("Failed to save changes.");
    }
  };

  const handleEdit = async (rowIdx, periodIdx, value) => {
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

  const handleDeleteRow = async (rowIdx) => {
    const day = timetableData[rowIdx].day;
    try {
      await deleteDay(userId, day);
      setTimetableData((prev) => prev.filter((_, i) => i !== rowIdx));
      setMessage("Day deleted.");
    } catch {
      setMessage("Failed to delete day.");
    }
  };

  return (
    <div className="timetable-container">
      <h1 className="timetable-title">Timetable</h1>
      <div className="timetable-add-row">
        <input
          type="text"
          placeholder="Day"
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
        />
        {newPeriods.map((p, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Period ${idx + 1}`}
            value={p}
            onChange={(e) =>
              setNewPeriods((arr) => arr.map((v, i) => (i === idx ? e.target.value : v)))
            }
          />
        ))}
        <button onClick={handleAddDay}>Add Day</button>
      </div>
      {message && <p className="timetable-message">{message}</p>}
      <table className="timetable-table">
        <thead>
          <tr>
            <th>Day</th>
            {Array.from({ length: defaultPeriods }).map((_, idx) => (
              <th key={idx}>Period {idx + 1}</th>
            ))}
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {timetableData.map((row, rowIdx) => (
            <tr key={row.day}>
              <td>{row.day}</td>
              {row.periods.map((period, periodIdx) => (
                <td key={periodIdx}>
                  <input
                    value={period}
                    onChange={(e) => handleEdit(rowIdx, periodIdx, e.target.value)}
                  />
                </td>
              ))}
              <td>
                <button onClick={() => handleDeleteRow(rowIdx)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TimetablePage;