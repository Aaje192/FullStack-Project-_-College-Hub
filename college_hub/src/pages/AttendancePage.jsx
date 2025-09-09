import React, { useState, useEffect } from "react";
import { getAttendance, markAttendance } from "../api/Attendanceapi";
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  LinearProgress
} from "@mui/material";
import { 
  CheckCircle, 
  Cancel, 
  CalendarToday, 
  TrendingUp,
  Warning 
} from "@mui/icons-material";

function AttendancePage({ userId }) {
  const [paper, setPaper] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [totalHours, setTotalHours] = useState("");

  // Mock data for UI testing
  const mockAttendanceData = [
    {
      _id: "1",
      paper: "Mathematics",
      date: "2024-01-15",
      hour: "1st Hour",
      status: "Present",
      totalHours: 45,
      attendedHours: 42
    },
    {
      _id: "2", 
      paper: "Physics",
      date: "2024-01-15",
      hour: "2nd Hour",
      status: "Present",
      totalHours: 40,
      attendedHours: 38
    },
    {
      _id: "3",
      paper: "Chemistry",
      date: "2024-01-14",
      hour: "3rd Hour", 
      status: "Absent",
      totalHours: 42,
      attendedHours: 35
    },
    {
      _id: "4",
      paper: "Computer Science",
      date: "2024-01-14",
      hour: "4th Hour",
      status: "Present",
      totalHours: 48,
      attendedHours: 46
    },
    {
      _id: "5",
      paper: "English",
      date: "2024-01-13",
      hour: "1st Hour",
      status: "Present", 
      totalHours: 35,
      attendedHours: 34
    }
  ];

  useEffect(() => {
    if (paper && userId) {
      getAttendance({ paper, studentId: userId })
        .then((res) => setAttendanceRecords(res.data))
        .catch(() => {
          console.log("Database error, using mock data for attendance");
          // Use mock data filtered by selected paper
          const filteredMockData = mockAttendanceData.filter(record => record.paper === paper);
          setAttendanceRecords(filteredMockData);
          if (filteredMockData.length > 0) {
            setTotalHours(filteredMockData[0].totalHours.toString());
          }
        });
    } else {
      // Show all mock data when no paper is selected
      setAttendanceRecords(mockAttendanceData);
      setTotalHours("");
    }
  }, [paper, userId]);

  const attendancePercentage = totalHours > 0 ? Math.round((presentHours / Number(totalHours)) * 100) : 0;

  const handleSubmit = async () => {
    if (!paper || !date || !hour || !status) {
      setMessage("Please fill in all fields.");
      return;
    }
    try {
      const response = await markAttendance({ studentId: userId, paper, date, hour, status });
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        setMessage(data.message || "Attendance marked successfully.");
        setPaper("");
        setDate("");
        setHour("");
        setStatus("");
        setTotalHours("");
        getAttendance({ paper, studentId: userId })
          .then((res) => setAttendanceRecords(res.data))
          .catch(() => setAttendanceRecords([]));
      } else {
        setMessage(data.message || "Failed to mark attendance.");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
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
          <CheckCircle sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color: '#667eea' }} />
          Attendance Tracker
        </Typography>
        <Typography variant={{ xs: 'body2', md: 'subtitle1' }} color="text.secondary">
          Monitor your class attendance and academic presence
        </Typography>
      </Box>

      {/* Attendance Form */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 }, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant={{ xs: 'subtitle1', md: 'h6' }} sx={{ mb: { xs: 2, md: 3 }, fontWeight: 600, color: '#2c3e50' }}>
          Mark Attendance
        </Typography>
        
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Paper/Subject"
              value={paper}
              onChange={(e) => setPaper(e.target.value)}
              placeholder="Enter paper name"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Hour"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="Enter hour"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Attendance Status</InputLabel>
              <Select
                value={status}
                label="Attendance Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label={`Total Hours for ${paper || "Paper"}`}
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
              placeholder="Enter total hours"
              inputProps={{ min: 0 }}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              Mark Attendance
            </Button>
          </Grid>
          {message && (
            <Grid item xs={12}>
              <Alert severity={message.includes('successfully') ? 'success' : 'error'}>
                {message}
              </Alert>
            </Grid>
          )}
        </Grid>
      </Paper>

      {paper && (
        <Grid container spacing={3}>
          {/* Attendance Stats */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                Attendance Summary - {paper}
              </Typography>
              
              {/* Stats Cards */}
              <Box sx={{ mb: 3 }}>
                <Card sx={{ 
                  mb: 2,
                  background: attendancePercentage >= 75 ? 
                    'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)' :
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white'
                }}>
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {attendancePercentage}%
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Attendance Rate
                        </Typography>
                      </Box>
                      <TrendingUp sx={{ fontSize: '2.5rem', opacity: 0.8 }} />
                    </Box>
                  </CardContent>
                </Card>

                <LinearProgress 
                  variant="determinate" 
                  value={attendancePercentage} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      background: attendancePercentage >= 75 ? 
                        'linear-gradient(90deg, #4CAF50, #8BC34A)' :
                        'linear-gradient(90deg, #f093fb, #f5576c)'
                    }
                  }}
                />
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                      {presentHours}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Present
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#f5576c' }}>
                      {absentHours}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Absent
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Hours: <strong>{totalHours || 0}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Minimum Required (75%): <strong>{minRequired}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Leaves Available: <strong>{Math.max(0, canLeave)}</strong>
                </Typography>
              </Box>

              {attendancePercentage < 75 && (
                <Alert severity="warning" icon={<Warning />}>
                  Your attendance is below 75%. Consider attending more classes.
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* Attendance Records */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                Attendance Records
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Hour</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceRecords.map((rec, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarToday sx={{ fontSize: '1rem', color: '#667eea' }} />
                            {rec.date}
                          </Box>
                        </TableCell>
                        <TableCell>{rec.hour}</TableCell>
                        <TableCell>
                          <Chip
                            label={rec.status}
                            color={rec.status === 'Present' ? 'success' : 'error'}
                            icon={rec.status === 'Present' ? <CheckCircle /> : <Cancel />}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {attendanceRecords.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No attendance records found for {paper}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default AttendancePage;