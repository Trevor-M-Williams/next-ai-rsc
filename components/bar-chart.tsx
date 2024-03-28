"use client";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

import { formatNumberInMillions } from "@/lib/utils";

export function BarChart() {
  const data = {
    incomeStatements: [
      {
        date: "2019-09-30",
        revenue: 8000000000,
        grossProfit: 3000000000,
        netIncome: 1050000000,
      },
      {
        date: "2020-09-30",
        revenue: 12395000000,
        grossProfit: 5920000000,
        netIncome: 1800000000,
      },
      {
        date: "2021-09-30",
        revenue: 11800000000,
        grossProfit: 5200000000,
        netIncome: 1500000000,
      },
      {
        date: "2022-09-30",
        revenue: 13800000000,
        grossProfit: 6900000000,
        netIncome: 2600000000,
      },
      {
        date: "2023-09-30",
        revenue: 14500000000,
        grossProfit: 7500000000,
        netIncome: 3000000000,
      },
    ],
  };

  const datasets = [
    {
      data: data.incomeStatements.map((item) => ({
        date: item.date,
        value: item.revenue,
      })),
      label: "Revenue",
    },
    {
      data: data.incomeStatements.map((item) => ({
        date: item.date,
        value: item.grossProfit,
      })),
      label: "Gross Profit",
    },
    {
      data: data.incomeStatements.map((item) => ({
        date: item.date,
        value: item.netIncome,
      })),
      label: "Net Income",
    },
  ];

  const colors = ["#00ccff", "#0099ff", "#0033ff"];

  const chartData = {
    labels: datasets[0]?.data.map((item) => item.date.slice(0, 4)) || [],
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data.map((item) => item.value),
      borderColor: colors[index],
      backgroundColor: `${colors[index]}66`,
      fill: true,
      borderWidth: 1,
    })),
  };

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 6,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return formatNumberInMillions(value);
          },
        },
      },
    },
    plugins: {
      legend: {
        align: "end" as "end",
        labels: {
          boxWidth: datasets.length > 5 ? 30 : 40,
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: function (context: any) {
            return context[0].dataset.label;
          },
          label: function (context: any) {
            const value = context.parsed.y;
            return formatNumberInMillions(value);
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="relative h-full p-4 pb-6">
      <Bar data={chartData} options={chartOptions} />
      <div className="absolute top-4 left-3 text-xs text-gray-500">(M USD)</div>
    </div>
  );
}
