"use client";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

import { formatNumberInMillions } from "@/lib/utils";

export function BarChart({ data }: { data: IncomeStatement[] }) {
  const datasets = [
    {
      data: data
        .map((item) => ({
          date: item.date,
          value: item.revenue,
        }))
        .reverse(),
      label: "Revenue",
    },
    {
      data: data
        .map((item) => ({
          date: item.date,
          value: item.grossProfit,
        }))
        .reverse(),
      label: "Gross Income",
    },
    //operating income
    {
      data: data
        .map((item) => ({
          date: item.date,
          value: item.operatingIncome,
        }))
        .reverse(),
      label: "Operating Income",
    },
    // {
    //   data: data
    //     .map((item) => ({
    //       date: item.date,
    //       value: item.netIncome,
    //     }))
    //     .reverse(),
    //   label: "Net Income",
    // },
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
      <div className="hidden xl:block absolute top-4 left-3 text-xs text-gray-500">
        (M USD)
      </div>
    </div>
  );
}
