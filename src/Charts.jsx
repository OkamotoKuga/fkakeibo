import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import './Charts.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

export function IncomeExpenseChart({ records }) {
  const totalIncome = records
    .filter(r => r.type === '収入')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const totalExpense = records
    .filter(r => r.type === '支出')
    .reduce((sum, r) => sum + r.amount, 0);

  const data = {
    labels: ['収入', '支出'],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderColor: ['#45a049', '#da190b'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ¥${context.raw.toLocaleString()}`;
          }
        }
      }
    },
  };

  return (
    <div className="chart-container">
      <h3>収入・支出の割合</h3>
      <div className="chart-wrapper">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export function DailyTrendChart({ records }) {
  const dailyData = records.reduce((acc, record) => {
    const dateStr = new Date(record.date).toLocaleDateString('ja-JP');
    if (!acc[dateStr]) {
      acc[dateStr] = { income: 0, expense: 0 };
    }
    if (record.type === '収入') {
      acc[dateStr].income += record.amount;
    } else {
      acc[dateStr].expense += record.amount;
    }
    return acc;
  }, {});

  const sortedDates = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b));
  const last7Days = sortedDates.slice(-7);

  const data = {
    labels: last7Days,
    datasets: [
      {
        label: '収入',
        data: last7Days.map(date => dailyData[date].income),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
      },
      {
        label: '支出',
        data: last7Days.map(date => dailyData[date].expense),
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ¥${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '¥' + value.toLocaleString();
          }
        }
      }
    },
  };

  return (
    <div className="chart-container">
      <h3>直近7日間の推移</h3>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export function MonthlyComparisonChart({ records }) {
  const monthlyData = records.reduce((acc, record) => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { income: 0, expense: 0 };
    }
    if (record.type === '収入') {
      acc[monthKey].income += record.amount;
    } else {
      acc[monthKey].expense += record.amount;
    }
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlyData).sort();
  const last6Months = sortedMonths.slice(-6);

  const data = {
    labels: last6Months,
    datasets: [
      {
        label: '収入',
        data: last6Months.map(month => monthlyData[month].income),
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
        borderColor: '#4CAF50',
        borderWidth: 1,
      },
      {
        label: '支出',
        data: last6Months.map(month => monthlyData[month].expense),
        backgroundColor: 'rgba(244, 67, 54, 0.8)',
        borderColor: '#F44336',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ¥${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '¥' + value.toLocaleString();
          }
        }
      }
    },
  };

  return (
    <div className="chart-container">
      <h3>月別比較 (直近6ヶ月)</h3>
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}