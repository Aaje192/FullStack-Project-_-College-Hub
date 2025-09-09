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
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar
} from "@mui/material";
import {
  Schedule,
  School,
  AccessTime,
  MenuBook,
  Coffee
} from "@mui/icons-material";

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

  // Mock data for UI testing
  const mockTimetableData = [
    {
      day: "Monday",
      studentId: userId,
      periods: ["Mathematics", "Physics", "Chemistry", "Break", "Computer Science", "English", "Lab", "Free Period"]
    },
    {
      day: "Tuesday", 
      studentId: userId,
      periods: ["Physics", "Mathematics", "English", "Break", "Chemistry", "Computer Science", "Lab", "Free Period"]
    },
    {
      day: "Wednesday",
      studentId: userId,
      periods: ["Chemistry", "Computer Science", "Mathematics", "Break", "Physics", "English", "Free Period", "Lab"]
    },
    {
      day: "Thursday",
      studentId: userId,
      periods: ["English", "Chemistry", "Physics", "Break", "Mathematics", "Lab", "Computer Science", "Free Period"]
    },
    {
      day: "Friday",
      studentId: userId,
      periods: ["Computer Science", "English", "Mathematics", "Break", "Physics", "Chemistry", "Free Period", "Lab"]
    }
  ];

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
        console.log('Database error, using mock data for timetable');
        setTimetableData(mockTimetableData);
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

  const totalSubjects = timetableData.reduce((acc, day) => {
    const subjects = day.periods.filter(period => period && period !== 'Break' && period !== 'Free Period');
    return acc + subjects.length;
  }, 0);

  const uniqueSubjects = [...new Set(
    timetableData.flatMap(day => 
      day.periods.filter(period => period && period !== 'Break' && period !== 'Free Period')
    )
  )].length;

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': '#FF6B6B',
      'Physics': '#4ECDC4',
      'Chemistry': '#45B7D1',
      'Computer Science': '#96CEB4',
      'English': '#FECA57',
      'Break': '#FF9FF3',
      'Lab': '#54A0FF',
      'Free Period': '#C7ECEE'
    };
    return colors[subject] || '#DDA0DD';
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, md: 4 }, textAlign: 'center' }}>
        <Typography variant={{ xs: 'h5', md: 'h4' }} sx={{ 
          fontWeight: 700, 
          color: '#2c3e50',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 1, md: 2 },
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Schedule sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color: '#667eea' }} />
          Class Timetable
        </Typography>
        <Typography variant={{ xs: 'body2', md: 'subtitle1' }} color="text.secondary">
          Your weekly class schedule and academic calendar
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 4 } }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
          }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant={{ xs: 'h6', md: 'h4' }} sx={{ fontWeight: 700 }}>
                    {defaultPeriods * defaultDays.length}
                  </Typography>
                  <Typography variant={{ xs: 'caption', md: 'body2' }} sx={{ opacity: 0.9 }}>
                    Total Periods
                  </Typography>
                </Box>
                <AccessTime sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' }, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)'
          }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant={{ xs: 'h6', md: 'h4' }} sx={{ fontWeight: 700 }}>
                    {totalSubjects}
                  </Typography>
                  <Typography variant={{ xs: 'caption', md: 'body2' }} sx={{ opacity: 0.9 }}>
                    Classes Scheduled
                  </Typography>
                </Box>
                <School sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' }, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(255, 152, 0, 0.3)'
          }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant={{ xs: 'h6', md: 'h4' }} sx={{ fontWeight: 700 }}>
                    {uniqueSubjects}
                  </Typography>
                  <Typography variant={{ xs: 'caption', md: 'body2' }} sx={{ opacity: 0.9 }}>
                    Unique Subjects
                  </Typography>
                </Box>
                <MenuBook sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' }, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(245, 87, 108, 0.3)'
          }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant={{ xs: 'h6', md: 'h4' }} sx={{ fontWeight: 700 }}>
                    {defaultDays.length}
                  </Typography>
                  <Typography variant={{ xs: 'caption', md: 'body2' }} sx={{ opacity: 0.9 }}>
                    Working Days
                  </Typography>
                </Box>
                <Coffee sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' }, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {message && (
        <Alert severity={severity} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {/* Timetable */}
      <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant={{ xs: 'subtitle1', md: 'h6' }} sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule />
            Weekly Schedule
          </Typography>
        </Box>
        
        <TableContainer sx={{ 
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#667eea',
            borderRadius: 4,
          }
        }}>
          <Table sx={{ minWidth: { xs: 800, md: 650 } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  width: "120px", 
                  color: '#2c3e50',
                  borderRight: '2px solid #e1e8ed'
                }}>
                  Day
                </TableCell>
                {timeSlots.map((time, idx) => (
                  <TableCell key={idx} align="center" sx={{ 
                    fontWeight: 600, 
                    color: '#2c3e50',
                    minWidth: 140
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Period {idx + 1}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: '#667eea' }}>
                      {time}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timetableData.map((row, rowIdx) => (
                <TableRow key={row.day} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                  <TableCell component="th" scope="row" sx={{ 
                    fontWeight: 700, 
                    bgcolor: '#667eea', 
                    color: 'white',
                    borderRight: '2px solid #e1e8ed'
                  }}>
                    {row.day}
                  </TableCell>
                  {row.periods.map((period, periodIdx) => (
                    <TableCell
                      key={periodIdx}
                      align="center"
                      sx={{ 
                        minWidth: 150, 
                        bgcolor: 'background.paper', 
                        border: '1px solid #e1e8ed', 
                        p: 1 
                      }}
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
                            borderRadius: 2,
                            minHeight: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: period ? getSubjectColor(period) : '#f8f9fa',
                            color: period ? 'white' : '#7f8c8d',
                            fontWeight: period ? 600 : 400,
                            fontSize: '0.875rem',
                            transition: 'all 0.2s ease',
                            border: period ? 'none' : '2px dashed #bdc3c7',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          {period ? (
                            <Chip
                              label={period}
                              sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 600,
                                border: 'none'
                              }}
                            />
                          ) : (
                            "Click to edit"
                          )}
                        </Box>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default TimetablePage;
