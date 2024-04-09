"use client";
import React from "react";
import { Chart, Tooltip, Legend, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(Tooltip, Legend, ArcElement);

const options = {
  plugins: {
    legend: {
      position: "right" as any,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

export default function Sales() {
  const data = {
    labels: [
      "Personal Care",
      "Home Essentials",
      "Food & Beverages",
      "Electronics",
      "Outdoor & Leisure",
    ],
    datasets: [
      {
        data: [25, 20, 30, 15, 10], // Example sales distribution percentages
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-full w-full px-4 pb-2">
      <div className=" font-semibold">Sales Distribution</div>
      <Doughnut data={data} options={options} />
    </div>
  );
}
