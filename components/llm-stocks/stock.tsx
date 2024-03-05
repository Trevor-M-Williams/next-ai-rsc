"use client";

import { useState, useRef, useEffect, useId } from "react";
import { scaleLinear } from "d3-scale";
import { subMonths, format } from "date-fns";
import { useResizeObserver } from "usehooks-ts";
import { useAIState } from "ai/rsc";
import { StockChart } from "./stock-chart";
import moment from "moment-timezone";

import type { AI } from "../../app/action";

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

export function Stock({ name = "DOGE", data }: { name: string; data: any }) {
  const price = data[data.length - 1].close;
  const delta = data[data.length - 1].close - data[data.length - 2].close;

  const [history, setHistory] = useAIState<typeof AI>();
  const id = useId();

  const [priceAtTime, setPriceAtTime] = useState({
    time: "00:00",
    value: price.toFixed(2),
    x: 0,
  });

  const [startHighlight, setStartHighlight] = useState(0);
  const [endHighlight, setEndHighlight] = useState(0);

  const chartRef = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({
    ref: chartRef,
    box: "border-box",
  });

  const xToDate = scaleLinear(
    [0, width],
    [subMonths(new Date(), 6), new Date()]
  );
  const xToValue = scaleLinear(
    [0, width],
    [price - price / 2, price + price / 2]
  );

  useEffect(() => {
    if (startHighlight && endHighlight) {
      const message = {
        id,
        role: "system" as const,
        content: `[User has highlighted dates between between ${format(
          xToDate(startHighlight),
          "d LLL"
        )} and ${format(xToDate(endHighlight), "d LLL, yyyy")}`,
      };

      if (history[history.length - 1]?.id === id) {
        setHistory((prevHistory) => [...prevHistory.slice(0, -1), message]);
      } else {
        setHistory((prevHistory) => [...prevHistory, message]);
      }
    }
  }, [startHighlight, endHighlight]);

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

      <div
        className="relative -mx-4 cursor-col-resize"
        onPointerDown={(event) => {
          if (chartRef.current) {
            const { clientX } = event;
            const { left } = chartRef.current.getBoundingClientRect();

            setStartHighlight(clientX - left);
            setEndHighlight(0);

            setPriceAtTime({
              time: format(xToDate(clientX), "dd LLL yy"),
              value: xToValue(clientX).toFixed(2),
              x: clientX - left,
            });
          }
        }}
        onPointerUp={(event) => {
          if (chartRef.current) {
            const { clientX } = event;
            const { left } = chartRef.current.getBoundingClientRect();

            setEndHighlight(clientX - left);
          }
        }}
        onPointerMove={(event) => {
          if (chartRef.current) {
            const { clientX } = event;
            const { left } = chartRef.current.getBoundingClientRect();

            setPriceAtTime({
              time: format(xToDate(clientX), "dd LLL yy"),
              value: xToValue(clientX).toFixed(2),
              x: clientX - left,
            });
          }
        }}
        onPointerLeave={() => {
          setPriceAtTime({
            time: "00:00",
            value: price.toFixed(2),
            x: 0,
          });
        }}
        ref={chartRef}
      >
        {priceAtTime.x > 0 ? (
          <div
            className="absolute z-10 flex gap-2 p-2 rounded-md pointer-events-none select-none bg-zinc-800 w-fit"
            style={{
              left: priceAtTime.x - 124 / 2,
              top: 30,
            }}
          >
            <div className="text-xs tabular-nums">${priceAtTime.value}</div>
            <div className="text-xs text-zinc-400 tabular-nums">
              {priceAtTime.time}
            </div>
          </div>
        ) : null}

        {startHighlight ? (
          <div
            className="absolute w-5 h-32 border rounded-md pointer-events-none select-none bg-zinc-500/20 border-zinc-500"
            style={{
              left: startHighlight,
              width: endHighlight
                ? endHighlight - startHighlight
                : priceAtTime.x - startHighlight,
              bottom: 0,
            }}
          ></div>
        ) : null}
      </div>
      <StockChart data={data} ticker={name} />
    </div>
  );
}
