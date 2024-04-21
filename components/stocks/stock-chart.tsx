import { Line } from "react-chartjs-2";
import "chart.js/auto";

type StockChartProps = {
  data: StockChartData[];
  ticker: string;
  percentChange: number;
  color?: string;
};

export function StockChart({
  data,
  ticker,
  percentChange,
  color,
}: StockChartProps) {
  let borderColor;
  let backgroundColor;
  if (color) {
    borderColor = color;
    backgroundColor = `${color}22`;
  } else {
    borderColor = percentChange > 0 ? "#20f160" : "#ff4d4f";
    backgroundColor = percentChange > 0 ? "#20f16022" : "#ff4d4f22";
  }

  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: `${ticker} Stock Price`,
        data: data.map((item) => item.price),
        borderWidth: 2,
        borderColor,
        backgroundColor,
        fill: true,
        pointRadius: 5,
        pointBorderColor: "rgba(0, 0, 0, 0)",
        pointBackgroundColor: "rgba(0, 0, 0, 0)",
      },
    ],
  };

  const chartOptions = {
    animation: false as false | {},
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 6,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {},
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
            return `$${value.toFixed(2)}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-[75%] flex-grow w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
