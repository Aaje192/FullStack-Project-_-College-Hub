import React, { useEffect, useState } from "react";
import { getTimetable, updatePeriod } from "../api/TimeTableapi.js";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import "../styles/TimeTablePage.css";

const defaultPeriods = 8;
const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const commonSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "Break",
  "Lab",
  "Free Period"
];

const timeSlots = [
  "9:00 - 9:50",
  "10:00 - 10:50",
  "11:00 - 11:50",
  "12:00 - 12:50",
  "1:00 - 1:50",
  "2:00 - 2:50",
  "3:00 - 3:50",
  "4:00 - 4:50"
];

function TimetablePage({ userId }) {
  const [timetableData, setTimetableData] = useState([]);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [editCell, setEditCell] = useState(null);

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

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setSeverity(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = async (rowIdx, periodIdx, value) => {
    const day = timetableData[rowIdx].day;
    try {
      const updatedData = timetableData.map((row, i) =>
        i === rowIdx
          ? { ...row, periods: row.periods.map((p, j) => (j === periodIdx ? value : p)) }
          : row
      );
      setTimetableData(updatedData);

      await updatePeriod({
        studentId: userId,
        day,
        periodIdx,
        value
      });

      showMessage("Period updated successfully");
      setEditCell(null);
    } catch (error) {
      console.error('Update error:', error);
      getTimetable(userId).then(res => {
        const data = res.data;
        const filled = defaultDays.map((day) => {
          const found = data.find((row) => row.day === day);
          return found
            ? { ...found, periods: [...found.periods, ...Array(defaultPeriods - found.periods.length).fill("")].slice(0, defaultPeriods) }
            : { day, studentId: userId, periods: Array(defaultPeriods).fill("") };
        });
        setTimetableData(filled);
      });
      showMessage("Failed to update period: " + (error.response?.data?.message || "Server error"), "error");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold', color: '#000000', textAlign: 'center' }}>
        My Timetable
      </Typography>

      {message && (
        <Alert severity={severity} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#2C3E50' }}>
              <TableCell sx={{ fontWeight: "bold", width: "120px", color: 'white' }}>
                Day
              </TableCell>
              {timeSlots.map((time, idx) => (
                <TableCell key={idx} align="center" sx={{ fontWeight: "bold", color: 'white' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Period {idx + 1}
                  </Typography>
                  <Typography variant="caption" display="block">{time}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timetableData.map((row, rowIdx) => (
              <TableRow key={row.day} hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: "bold", bgcolor: '#2C3E50', color: 'white' }}>
                  {row.day}
                </TableCell>
                {row.periods.map((period, periodIdx) => (
                  <TableCell
                    key={periodIdx}
                    align="center"
                    sx={{ minWidth: 150, bgcolor: 'background.paper', border: '1px solid rgba(224, 224, 224, 0.4)', p: 1 }}
                  >
                    {editCell?.rowIdx === rowIdx && editCell?.periodIdx === periodIdx ? (
                      <Select
                        size="small"
                        value={period}
                        fullWidth
                        onChange={(e) => handleEdit(rowIdx, periodIdx, e.target.value)}
                        onBlur={() => setEditCell(null)}
                        autoFocus
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {commonSubjects.map((subject) => (
                          <MenuItem key={subject} value={subject}>
                            {subject}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <Box
                        onClick={() => setEditCell({ rowIdx, periodIdx })}
                        sx={{
                          cursor: "pointer",
                          p: 1.5,
                          borderRadius: 1,
                          minHeight: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: period ? 'text.primary' : 'text.secondary',
                          fontWeight: period ? 500 : 400,
                          fontSize: '0.875rem',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.04)',
                            transform: 'scale(1.02)'
                          }
                        }}
                      >
                        {period || "Click to edit"}
                      </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TimetablePage;
