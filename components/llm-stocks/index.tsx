"use client";

import dynamic from "next/dynamic";
import { StockSkeleton } from "./stock-skeleton";

export { spinner } from "./spinner";
export { BotCard, BotMessage, SystemMessage } from "./message";

const Stock = dynamic(() => import("./stock").then((mod) => mod.Stock), {
  ssr: false,
  loading: () => <StockSkeleton />,
});

export { Stock };
