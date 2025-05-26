import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MarksChart = ({ marks }) => {
  const data = {
    labels: marks.map(m => m.subject),
    datasets: [{
      label: 'Marks',
      data: marks.map(m => m.mark),
      backgroundColor: [
        'rgba(74, 74, 74, 0.7)',  // Primary gray
        'rgba(46, 204, 113, 0.7)',  // Green
        'rgba(155, 89, 182, 0.7)',  // Purple
        'rgba(241, 196, 15, 0.7)',  // Yellow
        'rgba(231, 76, 60, 0.7)',   // Red
        'rgba(52, 73, 94, 0.7)',    // Dark Gray
        'rgba(52, 152, 219, 0.7)',  // Blue
      ],
      borderColor: [
        'rgba(74, 74, 74, 1)',
        'rgba(46, 204, 113, 1)',
        'rgba(155, 89, 182, 1)',
        'rgba(241, 196, 15, 1)',
        'rgba(231, 76, 60, 1)',
        'rgba(52, 73, 94, 1)',
        'rgba(52, 152, 219, 1)',
      ],
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: [
        'rgba(74, 74, 74, 0.9)',
        'rgba(46, 204, 113, 0.9)',
        'rgba(155, 89, 182, 0.9)',
        'rgba(241, 196, 15, 0.9)',
        'rgba(231, 76, 60, 0.9)',
        'rgba(52, 73, 94, 0.9)',
        'rgba(52, 152, 219, 0.9)',
      ],
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Subject-wise Marks Distribution',
        font: {
          size: 16,
          weight: 'bold',
          family: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
        },
        padding: 20,
        color: '#2c3e50'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2c3e50',
        bodyColor: '#2c3e50',
        bodyFont: {
          size: 14
        },
        padding: 12,
        boxPadding: 8,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `Mark: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#2c3e50'
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#f0f4f8'
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#2c3e50',
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart'
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 10
      }
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  };

  return (
    <div className="marks-chart">
      <Bar data={data} options={options} />
    </div>
  );
};

export default MarksChart;
