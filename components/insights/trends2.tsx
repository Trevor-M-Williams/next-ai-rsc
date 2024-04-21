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

export default function Trends2() {
  const trends = [
    {
      label: "Consumer Sentiment",
      data: [50, 52, 55, 58, 54, 62, 66, 59, 63],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      tension: 0.4,
    },
    {
      label: "Risk Coverage",
      data: [88, 90, 91, 82, 77, 72, 80, 84, 87],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      tension: 0.4,
    },
    {
      label: "Best Practice Alignment",
      data: [80, 82, 76, 82, 86, 84, 72, 80, 81],
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
