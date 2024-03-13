import { useState, useEffect } from "react";

import { StockChart } from "./stock-chart";
import moment from "moment-timezone";
import { cn } from "@/lib/utils";

function ChartButtons({
  chartData,
  setChartData,
  setPercentChange,
}: {
  chartData: StockChartData[];
  setChartData: (data: StockChartData[]) => void;
  setPercentChange: (percentChange: number) => void;
}) {
  const [timeframe, setTimeframe] = useState("3M");
  const timeframes = ["1M", "3M", "6M", "1Y", "5Y"];

  useEffect(() => {
    handleTimeframe(timeframe);
  }, []);

  function handleTimeframe(tf: string) {
    setTimeframe(tf);
    const currentDate = moment();
    let startDate = currentDate.clone().subtract(1, "day");
    switch (tf) {
      case "5D":
        startDate = currentDate.clone().subtract(5, "day");
        break;
      case "1M":
        startDate = currentDate.clone().subtract(1, "month");
        break;
      case "3M":
        startDate = currentDate.clone().subtract(3, "month");
        break;
      case "6M":
        startDate = currentDate.clone().subtract(6, "month");
        break;
      case "1Y":
        startDate = currentDate.clone().subtract(1, "year");
        break;
      case "5Y":
        startDate = currentDate.clone().subtract(5, "year");
        break;
    }

    const newChartData = chartData.filter((item) =>
      moment(item.date).isSameOrAfter(startDate)
    );

    setChartData(newChartData);

    const startPrice = newChartData[0].price;
    const endPrice = newChartData[newChartData.length - 1].price;
    const delta = endPrice - startPrice;
    const newPercentChange = (delta / startPrice) * 100;
    setPercentChange(newPercentChange);
  }

  return (
    <div className="relative flex">
      {timeframes.map((tf) => (
        <button
          key={tf}
          onClick={() => handleTimeframe(tf)}
          className={`w-10 flex justify-center py-1 text-sm font-semibold rounded hover:bg-green-400/10`}
        >
          {tf}
        </button>
      ))}

      {/* underline */}
      <div
        className="absolute bottom-0 left-0 w-6 h-px bg-white transition-transform duration-300"
        style={{
          transform: `translateX(calc(0.5rem + 2.5 * ${timeframes.indexOf(timeframe)}rem))`,
        }}
      />
    </div>
  );
}

export function Stock({
  name,
  data,
}: {
  name: string;
  data: StockChartData[];
}) {
  const price = data[data.length - 1]?.price || 0;

  const [percentChange, setPercentChange] = useState(0);
  const [chartData, setChartData] = useState(data);

  return (
    <div className="relative p-4 text-zinc-300 border rounded-xl bg-zinc-950 overflow-hidden">
      <div className="flex justify-between">
        <div className="">
          <div className="flex items-center gap-2">
            <div className="text-xl font-medium ">{name}</div>
            {/* <div className="text-sm">Apple Inc.</div> */}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold text-white">
              ${price.toFixed(2)}
            </div>
            <div
              className={cn(
                "text-xs",
                percentChange > 0 ? "text-green-600" : "text-red-500"
              )}
            >
              {`${percentChange > 0 ? "↑" : "↓"} ${percentChange.toFixed(2)}% `}
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <ChartButtons
            chartData={data}
            setChartData={setChartData}
            setPercentChange={setPercentChange}
          />
        </div>
      </div>

      <div className="mt-4">
        <StockChart
          data={chartData}
          ticker={name}
          percentChange={percentChange}
        />
      </div>
    </div>
  );
}
