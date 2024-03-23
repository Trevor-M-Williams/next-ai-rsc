"use client";

import { Line } from "react-chartjs-2";
import "chart.js/auto";

export function Chart<T extends FinancialStatement>({
  datasets,
  field,
}: ChartProps<T>) {
  if (!datasets || datasets.length === 0) return null;

  const value = datasets[0].data[0][field];
  const valuesInMillions =
    (typeof value === "number" && Math.abs(value) > 10000000) || false;

  const colors = [
    "#FF6633",
    "#00B3E6",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#FF99E6",
    "#CCFF1A",
  ];

  const chartData = {
    labels: datasets[0].data.map((item) => item.date.slice(0, 4)).reverse(),
    datasets: datasets.map((dataset) => ({
      label: dataset.ticker,
      data: dataset.data.map((item) => item[field]).reverse(),
      borderWidth: 2,
      borderColor: colors[datasets.indexOf(dataset)],
      backgroundColor: colors[datasets.indexOf(dataset) % colors.length] + "33",
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
            return formatNumber(value);
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="relative p-4 pt-6 bg-white border rounded-xl overflow-hidden">
      <div className="absolute top-4 text-lg font-bold">
        {formatFieldName(field.toString())}
      </div>
      <div className="h-[20rem] pt-4">
        <Line data={chartData} options={chartOptions} />
      </div>
      {valuesInMillions && (
        <div className="w-full flex justify-center pt-2 text-xs text-gray-500">
          *Values in M USD
        </div>
      )}
    </div>
  );
}

function formatNumber(value: number) {
  if (value === 0) return "0";
  if (Math.abs(value) < 10000000) return value.toFixed(2);
  if (!value) return "N/A";
  const number = Math.round(value / 1000000);
  const formattedNumber = new Intl.NumberFormat("en-US").format(number);
  return formattedNumber;
}

function formatFieldName(fieldName: string) {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}
