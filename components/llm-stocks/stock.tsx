import { StockChart } from "./stock-chart";
import moment from "moment-timezone";

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
    <div className="mt-1 mb-4 text-xs text-zinc-500">
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
  const price = data[data.length - 1]?.close || 0;
  const delta = price - data[data.length - 2]?.close || 0;

  return (
    <div className="relative p-4 text-green-400 border rounded-xl bg-zinc-950 overflow-hidden">
      <div className="inline-block float-right px-2 py-1 text-xs rounded-full bg-white/10">
        {`${delta > 0 ? "+" : ""}${((delta / price) * 100).toFixed(2)}% ${
          delta > 0 ? "↑" : "↓"
        }`}
      </div>
      <div className="text-lg text-zinc-300">{name}</div>
      <div className="text-3xl font-bold">${price}</div>

      <MarketStatus />

      <StockChart data={data} ticker={name} />
    </div>
  );
}
