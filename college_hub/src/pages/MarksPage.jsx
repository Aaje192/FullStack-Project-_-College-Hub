import React, { useEffect, useState } from 'react';
import MarksForm from '../components/MarksForm';
import MarksTable from '../components/MarksTable';
import MarksChart from '../components/MarksChart';
import { getMarks, addMark, deleteMark } from '../api/Marksapi';
import '../styles/MarksPage.css';

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
    <div className="container">
      <MarksForm onMarkAdded={reloadMarks} userId={userId} />
      
      <div className="filter-controls">
        <div className="filter-row">
          <div className="filter-group">
            <label>Filter By:</label>
            <select
              value={filterCriteria}
              onChange={(e) => {
                setFilterCriteria(e.target.value);
                setFilterValue('');
              }}
            >
              <option value="all">All Marks</option>
              <option value="subject">Subject</option>
              <option value="examType">Exam Type</option>
              <option value="semester">Semester</option>
            </select>
          </div>

          {filterCriteria !== 'all' && (
            <div className="filter-group">
              <label>Select {filterCriteria}:</label>
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              >
                <option value="">All {filterCriteria}</option>
                {uniqueValues(filterCriteria).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading marks...</div>
      ) : (
        <div className="main-content">
          <MarksTable marks={filteredMarks} onMarkDeleted={handleMarkDeleted} />
          <MarksChart marks={filteredMarks} />
        </div>
      )}
    </div>
  );
};

export default MarksPage;