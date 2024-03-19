"use client";

import { Line } from "react-chartjs-2";
import "chart.js/auto";

export function Chart({ datasets }: ChartProps) {
  const chartData = {
    labels: datasets[0].data.map((item) => item.date.slice(0, 4)).reverse(),
    datasets: datasets.map((dataset) => ({
      label: dataset.ticker,
      data: dataset.data.map((item) => item.revenue),
      borderWidth: 2,
    })),
  };

  const chartOptions = {
    // animation: false as false | {},
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
            return formatNumber(value);
          },
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          title: function (context: any) {
            return context[0].dataset.label;
          },
          label: function (context: any) {
            const value = context.parsed.y;
            return formatNumber(value);
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="relative p-4 bg-white border rounded-xl overflow-hidden">
      <div className="h-[20rem]">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="pt-2 text-xs text-gray-400">*Values in M USD</div>
    </div>
  );
}

function formatNumber(value: number) {
  if (value === 0) return "0";
  if (!value) return "N/A";
  const number = Math.round(value / 1000000);
  const formattedNumber = new Intl.NumberFormat("en-US").format(number);
  return formattedNumber;
}
