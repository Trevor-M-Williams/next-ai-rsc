"use client";
import React from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const labels = ["Q1", "Q2", "Q3", "Q4"];

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {},
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function Innovation() {
  const data = {
    labels,
    datasets: [
      {
        label: "Product Launches",
        data: [3, 5, 2, 6], // Example data
        backgroundColor: "#00ccff",
      },
      {
        label: "Market Entries",
        data: [1, 2, 1, 3], // Example data
        backgroundColor: "#0099ff",
      },
    ],
  };

  return (
    <div className="h-full w-full px-4 pb-6">
      <div className=" font-semibold">Innovation</div>
      <Bar data={data} options={options} />
    </div>
  );
}
