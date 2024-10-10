import React from 'react';
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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressGraphProps {
  equipmentName: string;
  data: { date: string; sets: number; weight: number }[];
}

const ProgressGraph: React.FC<ProgressGraphProps> = ({ equipmentName, data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'סטים',
        data: data.map(item => item.sets),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        yAxisID: 'y-sets',
      },
      {
        label: 'משקל (ק"ג)',
        data: data.map(item => item.weight),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        yAxisID: 'y-weight',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: `התקדמות עבור ${equipmentName}`,
      },
    },
    scales: {
      'y-sets': {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'סטים',
        },
      },
      'y-weight': {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'משקל (ק"ג)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ProgressGraph;