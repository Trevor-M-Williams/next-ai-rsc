"use client";
import React from "react";
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: {
        display: true,
      },
      suggestedMin: 0,
      suggestedMax: 100,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    line: {
      borderWidth: 3,
    },
  },
};

export default function Performance() {
  const data = {
    labels: [
      "Satisfaction",
      "Market Share",
      "Innovation",
      "Sustainability",
      "Engagement",
    ],
    datasets: [
      {
        label: "Company Performance",
        data: [85, 75, 90, 75, 88],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  return (
    <div className="h-full w-full px-4 pb-6">
      <div className="font-semibold">Performance</div>
      <Radar data={data} options={options} />
    </div>
  );
}
