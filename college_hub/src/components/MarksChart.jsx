import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale);

const MarksChart = ({ marks }) => {
  const data = {
    labels: marks.map(m => m.subject),
    datasets: [{
      label: 'Marks',
      data: marks.map(m => m.mark),
      backgroundColor: 'rgba(0, 123, 255, 0.5)'
    }]
  };

  return (
    <div className="marks-chart">
      <Bar data={data} />
    </div>
  );
};

export default MarksChart;
