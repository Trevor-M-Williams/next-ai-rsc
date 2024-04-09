"use client";

import React from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
    },
  },
};

export default function Trends() {
  const trends = [
    {
      label: "Consumer Sentiment",
      data: [78, 80, 81, 73, 67, 55, 45, 58, 62],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      tension: 0.4,
    },
    {
      label: "Risk Coverage",
      data: [48, 52, 59, 76, 85, 90, 88, 94, 78],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      tension: 0.4,
    },
    {
      label: "Best Practice Alignment",
      data: [90, 92, 88, 89, 85, 75, 82, 80, 86],
      borderColor: "rgb(255, 205, 86)",
      backgroundColor: "rgba(255, 205, 86, 0.5)",
      tension: 0.4,
    },
  ];

  const data = {
    labels,
    datasets: trends,
  };

  return (
    <div className="h-full w-full px-4 pb-2">
      <Line data={data} options={options as any} />
    </div>
  );
}
