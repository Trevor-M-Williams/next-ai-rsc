import { Line } from "react-chartjs-2";
import "chart.js/auto";

type StockChartProps = {
  data: StockChartData[];
  ticker: string;
};

export function StockChart({ data, ticker }: StockChartProps) {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: `${ticker} Stock Price`,
        data: data.map((item) => item.price),
        borderColor: "#20f160",
        borderWidth: 2,
        backgroundColor: "#20f16022",
        fill: true,
        pointRadius: 10,
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
            return `$${value.toFixed(2)}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-60 w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
