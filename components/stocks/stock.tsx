import { useState, useEffect } from "react";

import { StockChart } from "./stock-chart";
import moment from "moment-timezone";

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

    let newChartData = chartData.filter((item) =>
      moment(item.date).isSameOrAfter(startDate)
    );

    if (newChartData.length > 500) {
      newChartData = newChartData.filter((_, index) => index % 6 < 1);
    }

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
          className={`w-10 flex justify-center py-1 text-sm rounded hover:bg-green-400/10`}
        >
          {tf}
        </button>
      ))}

      {/* underline */}
      <div
        className="absolute bottom-0 left-0 w-6 h-px bg-green-400 transition-transform duration-300"
        style={{
          transform: `translateX(calc(0.5rem + 2.5 * ${timeframes.indexOf(timeframe)}rem))`,
        }}
      />
    </div>
  );
}

function MarketStatus() {
  const currentDateMoment = moment().tz("America/New_York");
  const formattedDate = currentDateMoment.format("h:mm:ss A z");

  const currentDay = currentDateMoment.day();
  const currentHour = currentDateMoment.hour();
  const currentMinute = currentDateMoment.minute();
  const isOpen =
    currentDay >= 1 &&
    currentDay <= 5 &&
    (currentHour > 9 || (currentHour === 9 && currentMinute >= 30)) &&
    (currentHour < 16 || (currentHour === 16 && currentMinute === 0));

  return (
    <div className="mt-1 text-xs text-zinc-500">
      {isOpen ? "Open" : "Closed"} {formattedDate}
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
    <div className="relative p-4 text-green-400 border rounded-xl bg-zinc-950 overflow-hidden">
      <div className="flex justify-between">
        <div className="">
          <div className="text-lg text-zinc-300">{name}</div>
          <div className="text-3xl font-bold">${price.toFixed(2)}</div>
          <MarketStatus />
        </div>

        <div className="flex flex-col items-end justify-between">
          <div className="px-2 py-1 text-xs rounded-full bg-white/10">
            {`${percentChange.toFixed(2)}% ${percentChange > 0 ? "↑" : "↓"}`}
          </div>
          <ChartButtons
            chartData={data}
            setChartData={setChartData}
            setPercentChange={setPercentChange}
          />
        </div>
      </div>

      <div className="mt-4">
        <StockChart data={chartData} ticker={name} />
      </div>
    </div>
  );
}
