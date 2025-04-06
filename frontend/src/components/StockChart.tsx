import React, { useState } from 'react';
import { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScriptableLineSegmentContext,
} from 'chart.js';

interface Quiz {
  id: number;
  name: string; // Name of the quiz
  correct: number; // Number of correct answers
  balancechange: number; // Net money gained/lost
  previousMoney: number; // Money from the previous quiz
  currentMoney: number; // Dynamically calculated current money
}

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function StockChart({ quizzes }: { quizzes: Quiz[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dataPoints = quizzes.map((quiz) => quiz.currentMoney);
  const labels = quizzes.map((quiz) => `Quiz ${quiz.id}`);

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataPoints,
        borderWidth: 2,
        segment: {
          borderColor: (ctx: ScriptableLineSegmentContext) => {
            const { p0, p1 } = ctx;
            const isHovered = hoveredIndex !== null && (ctx.p0DataIndex === hoveredIndex || ctx.p1DataIndex === hoveredIndex);
            return isHovered
              ? 'orange' // Highlighted color
              : p1.parsed.y < p0.parsed.y
              ? 'red' // Red if decreasing
              : 'green'; // Green if increasing
          },
        },
        tension: 0, // No curvature (straight line)
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'History',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.84)', // Tooltip background color
        borderColor: 'lightgray', // Tooltip border color
        borderWidth: 1, // Tooltip border width
        titleColor: 'white', // Tooltip title text color
        bodyColor: 'black', // Tooltip body text color
        callbacks: {
          labelColor: function(context) {
            return {
              borderColor: 'rgba(0, 0, 0)',
              backgroundColor: 'rgba(0, 0, 0)',
            }
          },
          label: (tooltipItem: any) => {
            const index = tooltipItem.dataIndex;
            const quiz = quizzes[index];
            const percentageChange = ((quiz.balancechange / quiz.previousMoney) * 100).toFixed(2);
            const isPositive = quiz.balancechange >= 0;
            return [
              `  Change: ${isPositive ? '+' : ''}${percentageChange}%`,
              `  Net Money: ${isPositive ? '+$' : ''}${quiz.balancechange}`,
            ];
          },
          labelTextColor: (tooltipItem: any) => {
            const index = tooltipItem.dataIndex;
            const quiz = quizzes[index];
            return quiz.balancechange >= 0 ? 'green' : 'red'; // Green for positive, red for negative
          },
        },
        bodyFont: {
          size: 14, // Tooltip body font size
        },
        titleFont: {
          size: 16, // Tooltip title font size
        },
        padding: 12, // Tooltip padding
      },
    },
    interaction: {
      mode: 'nearest', // Make the tooltip more sensitive
      axis: 'x', // Trigger tooltip when hovering near the x-axis
      intersect: false, // Allow tooltip to show even if not directly on a point
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Quiz', // Label for the x-axis
        },
        grid: {
          display: true, // Show grid lines for the x-axis
        },
      },
      y: {
        title: {
          display: true,
          text: 'Current Money ($)', // Label for the y-axis
        },
        ticks: {
          callback: (value) => `$${value}`, // Format y-axis ticks as currency
        },
        grid: {
          display: true, // Show grid lines for the y-axis
        },
      },
    },
  };

  return (
    <div style={{ height: '70vh', width: '200vh' }}>
      <Line data={data} options={options} />
    </div>
  );
}