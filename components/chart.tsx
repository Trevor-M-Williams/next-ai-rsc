"use client";

import { Line } from "react-chartjs-2";
import "chart.js/auto";

export function Chart<T extends FinancialStatement>({
  datasets,
  field,
}: ChartProps<T>) {
  const value = datasets[0]?.data[0][field] || 0;
  const valuesInMillions =
    (typeof value === "number" && Math.abs(value) > 10000000) || false;

  const colors = [
    "#4363D8", // Blue
    "#3CB44B", // Green
    "#46F0F0", // Cyan
    "#E6194B", // Red
    "#F58231", // Orange
    "#911EB4", // Purple
    "#F032E6", // Magenta
    "#FFE119", // Yellow
  ];

  const chartData = {
    labels:
      datasets[0]?.data.map((item) => item.date.slice(0, 4)).reverse() || [],
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
        {datasets.length > 0 && formatFieldName(field.toString())}
      </div>
      <div className="h-[20rem] pt-4">
        {datasets.length > 0 && (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
      <div className="w-full flex justify-center items-center h-8 pt-2 text-xs text-gray-500">
        {valuesInMillions && "*Values in M USD"}
      </div>
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
  if (fieldName === "ebitdaratio") return "Ebitda Ratio";
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}
