import { useState } from "react";

import { StockChart } from "./stock-chart";
import moment from "moment-timezone";

function ChartButtons() {
  const [timeframe, setTimeframe] = useState("6M");
  const timeframes = ["1D", "5D", "1M", "6M", "1Y", "5Y"];

  return (
    <div className="relative flex">
      {timeframes.map((tf) => (
        <button
          key={tf}
          onClick={() => setTimeframe(tf)}
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
  console.log(data);
  const price = data[data.length - 1]?.close || 0;
  const delta = price - data[data.length - 2]?.close || 0;

  return (
    <div className="relative p-4 text-green-400 border rounded-xl bg-zinc-950 overflow-hidden">
      <div className="flex justify-between">
        <div className="">
          <div className="text-lg text-zinc-300">{name}</div>
          <div className="text-3xl font-bold">${price}</div>
          <MarketStatus />
        </div>

        <div className="flex flex-col items-end justify-between">
          <div className="px-2 py-1 text-xs rounded-full bg-white/10">
            {`${delta > 0 ? "+" : ""}${((delta / price) * 100).toFixed(2)}% ${
              delta > 0 ? "↑" : "↓"
            }`}
          </div>
          <ChartButtons />
        </div>
      </div>

      <div className="mt-4">
        <StockChart data={data} ticker={name} />
      </div>
    </div>
  );
}
