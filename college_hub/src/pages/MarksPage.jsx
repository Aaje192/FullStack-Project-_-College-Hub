import React, { useEffect, useState } from 'react';
import MarksForm from '../components/MarksForm';
import MarksTable from '../components/MarksTable';
import MarksChart from '../components/MarksChart';
import { getMarks, addMark, deleteMark } from '../api/Marksapi';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { Grade, TrendingUp, Assessment } from '@mui/icons-material';

const MarksPage = ({ userId }) => {
  const [marks, setMarks] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(true);

  const reloadMarks = async () => {
    setLoading(true);
    try {
      const data = await getMarks(userId);
      setMarks(data);
      setFilteredMarks(data);
    } catch (error) {
      console.error('Error loading marks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMarks(userId);
        setMarks(data);
        setFilteredMarks(data);
        console.log('Fetched marks:', data); // <--- Add here
      } catch (error) {
        console.error('Error loading marks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      if (filterCriteria === 'all' || filterValue === '') {
        setFilteredMarks(marks);
      } else {
        const filtered = marks.filter(mark =>
          String(mark[filterCriteria]).toLowerCase() === filterValue.toLowerCase()
        );
        setFilteredMarks(filtered);
      }
    };
    
    filterData();
  }, [filterCriteria, filterValue, marks]);

  const uniqueValues = (field) => {
    return [...new Set(marks.map(mark => mark[field]))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  };

  const handleMarkDeleted = (deletedMarkId) => {
    setMarks(marks.filter(mark => mark._id !== deletedMarkId));
    setFilteredMarks(filteredMarks.filter(mark => mark._id !== deletedMarkId));
  };

  console.log('marks:', marks); // <--- Add here
  console.log('filteredMarks:', filteredMarks); // <--- And here

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
          <Grade sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color: '#667eea' }} />
          Academic Marks
        </Typography>
        <Typography variant={{ xs: 'body2', md: 'subtitle1' }} color="text.secondary">
          Track your academic performance and progress
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 4 } }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
          }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant={{ xs: 'h5', md: 'h4' }} sx={{ fontWeight: 700 }}>
                    {marks.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Marks
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(245, 87, 108, 0.3)'
          }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant={{ xs: 'h5', md: 'h4' }} sx={{ fontWeight: 700 }}>
                    {marks.length > 0 ? Math.round(marks.reduce((sum, mark) => sum + mark.marks, 0) / marks.length) : 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Average Score
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Marks Form */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 }, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant={{ xs: 'subtitle1', md: 'h6' }} sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
          Add New Mark
        </Typography>
        <MarksForm onMarkAdded={reloadMarks} userId={userId} />
      </Paper>
      
      {/* Filter Controls */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
          Filter Marks
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter By</InputLabel>
              <Select
                value={filterCriteria}
                label="Filter By"
                onChange={(e) => {
                  setFilterCriteria(e.target.value);
                  setFilterValue('');
                }}
              >
                <MenuItem value="all">All Marks</MenuItem>
                <MenuItem value="subject">Subject</MenuItem>
                <MenuItem value="examType">Exam Type</MenuItem>
                <MenuItem value="semester">Semester</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {filterCriteria !== 'all' && (
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Select {filterCriteria}</InputLabel>
                <Select
                  value={filterValue}
                  label={`Select ${filterCriteria}`}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <MenuItem value="">All {filterCriteria}</MenuItem>
                  {uniqueValues(filterCriteria).map((value) => (
                    <MenuItem key={value} value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {filterValue && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Chip 
                  label={`Filtered by: ${filterValue}`} 
                  onDelete={() => setFilterValue('')}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                Marks Table
              </Typography>
              <MarksTable marks={filteredMarks} onMarkDeleted={handleMarkDeleted} />
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                Performance Chart
              </Typography>
              <MarksChart marks={filteredMarks} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MarksPage;