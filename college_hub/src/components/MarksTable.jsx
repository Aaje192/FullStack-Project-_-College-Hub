// ======= frontend/src/components/MarksTable.jsx =======
import React, { useState } from 'react';
import { deleteMark } from '../api/Marksapi';
import { IconButton, Tooltip, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const MarksTable = ({ marks = [], onMarkDeleted }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleDelete = async (markId) => {
    try {
      await deleteMark(markId);
      onMarkDeleted(markId);
    } catch (error) {
      console.error('Error deleting mark:', error);
    }
  };

  const getMarkColor = (mark) => {
    if (mark >= 90) return '#27ae60';
    if (mark >= 80) return '#2980b9';
    if (mark >= 70) return '#8e44ad';
    if (mark >= 60) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="marks-table">
      <Box sx={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>exam</th>
              <th>subject</th>
              <th>semester</th>
              <th>mark</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((mark, index) => (
              <tr
                key={mark._id}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  backgroundColor: hoveredRow === index ? '#f8fafc' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                <td style={{
                  transition: 'all 0.3s ease',
                  backgroundColor: hoveredRow === index ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  fontWeight: hoveredRow === index ? '600' : '400',
                  textShadow: hoveredRow === index ? '0 0 1px rgba(0,0,0,0.2)' : 'none',
                  color: '#000000'
                }}>
                  {mark.examType}
                </td>
                <td style={{
                  transition: 'all 0.3s ease',
                  backgroundColor: hoveredRow === index ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  fontWeight: hoveredRow === index ? '600' : '400',
                  textShadow: hoveredRow === index ? '0 0 1px rgba(0,0,0,0.2)' : 'none',
                  color: '#000000'
                }}>
                  {mark.subject}
                </td>
                <td style={{
                  transition: 'all 0.3s ease',
                  backgroundColor: hoveredRow === index ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  fontWeight: hoveredRow === index ? '600' : '400',
                  textShadow: hoveredRow === index ? '0 0 1px rgba(0,0,0,0.2)' : 'none',
                  color: '#000000'
                }}>
                  {mark.semester}
                </td>
                <td>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '40px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor: `${getMarkColor(mark.mark)}20`,
                      color: getMarkColor(mark.mark),
                      fontWeight: hoveredRow === index ? '700' : '600',
                      fontSize: '0.875rem',
                      transition: 'all 0.3s ease',
                      transform: hoveredRow === index ? 'scale(1.1)' : 'scale(1)',
                      textShadow: hoveredRow === index ? '0 0 1px rgba(0,0,0,0.2)' : 'none'
                    }}
                  >
                    {mark.mark}
                  </Box>
                </td>
                <td>
                  <Tooltip title="Delete mark" placement="left">
                    <IconButton
                      onClick={() => handleDelete(mark._id)}
                      size="small"
                      sx={{
                        color: hoveredRow === index ? '#e74c3c' : '#cbd5e1',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#fee2e2',
                          color: '#e74c3c'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default MarksTable;
