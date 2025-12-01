import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';

// Register the Chart.js components we're using
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip
);

function BarChart({ chartData }) {
  // 1. Create a helper object to hold counts for 1-5 stars
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  // 2. Fill the helper object with data from the API
  for (const item of chartData) {
    counts[item.rating] = item.count;
  }

  // 3. Format the data for Chart.js
  const data = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: '# of Votes',
        data: [counts[1], counts[2], counts[3], counts[4], counts[5]],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1 // Only show whole numbers (e.g., 1, 2, 3 votes)
        }
      },
    },
    plugins: {
      legend: {
        display: false // Hide the " # of Votes" label
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default BarChart;