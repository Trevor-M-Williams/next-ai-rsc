import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

type StockChartProps = {
  data: {
    date: string;
    close: number;
  }[];
  ticker: string;
};

export function StockChart({ data, ticker }: StockChartProps) {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: `${ticker} Stock Price`,
        data: data.map((item) => item.close),
        borderColor: "#20f160",
        backgroundColor: "#20f16022",
        fill: true,
        pointRadius: 10,
        pointBorderColor: "rgba(0, 0, 0, 0)",
        pointBackgroundColor: "rgba(0, 0, 0, 0)",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 6,
          autoSkip: true,
        },
        grid: {
          color: "#ffffff22",
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "#ffffff22",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            return `$${value}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-60">
      <Line data={chartData} options={options} />
    </div>
  );
}
