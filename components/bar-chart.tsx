"use client";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

import { formatNumberInMillions } from "@/lib/utils";

export function BarChart() {
  const data = {
    incomeStatements: [
      {
        date: "2019-09-30",
        revenue: 80000000,
        grossProfit: 30000000,
        netIncome: 15000000,
      },
      {
        date: "2020-09-30",
        revenue: 123950000,
        grossProfit: 59200000,
        netIncome: 18000000,
      },
      {
        date: "2021-09-30",
        revenue: 118000000,
        grossProfit: 52000000,
        netIncome: 15000000,
      },
      {
        date: "2022-09-30",
        revenue: 138000000,
        grossProfit: 69000000,
        netIncome: 26000000,
      },
      {
        date: "2023-09-30",
        revenue: 145000000,
        grossProfit: 75000000,
        netIncome: 30000000,
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

  const colors = ["#00bbdd", "#00ddbb", "#00aaff"];

  const chartData = {
    labels: datasets[0]?.data.map((item) => item.date.slice(0, 4)) || [],
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data.map((item) => item.value),
      borderColor: colors[index],
      //   backgroundColor: "#00bbbb33",
      backgroundColor: `${colors[index]}88`,
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
        labels: { boxWidth: datasets.length > 5 ? 30 : 40 },
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
    <div className="h-full p-4 border">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}
