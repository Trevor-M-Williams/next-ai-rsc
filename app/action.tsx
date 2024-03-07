import "server-only";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Stock,
} from "@/components/llm-stocks";
import { StockSkeleton } from "@/components/llm-stocks/stock-skeleton";

import {
  runAsyncFnWithoutBlocking,
  sleep,
  formatNumber,
  runOpenAICompletion,
} from "@/lib/utils";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

async function confirmPurchase(symbol: string, price: number, amount: number) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>
  );

  const systemMessage = createStreamableUI(null);

  runAsyncFnWithoutBlocking(async () => {
    // You can update the UI at any point.
    await sleep(1000);

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>
    );

    await sleep(1000);

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{" "}
          {formatNumber(amount * price)}
        </p>
      </div>
    );

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={" "}
        {formatNumber(amount * price)}.
      </SystemMessage>
    );

    aiState.done([
      ...aiState.get(),
      {
        role: "system",
        content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
          amount * price
        }]`,
      },
    ]);
  });

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: Date.now(),
      display: systemMessage.value,
    },
  };
}

async function submitUserMessage(content: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content,
    },
  ]);

  const reply = createStreamableUI(
    <BotMessage className="items-center">{spinner}</BotMessage>
  );

  const completion = runOpenAICompletion(openai, {
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: `\
          You are a financial analysis bot.
          You and the user can discuss public company financials.

          Messages inside [] means that it's a UI element or a user event. For example:
          - "[Price of AAPL = 100]" means that an interface of the stock price of AAPL is shown to the user.

          If the user wants data on a specific stock, call \`show_stock_chart\` to show the data.

          Otherwise, answer user questions and do calculations if needed.
        `,
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    functions: [
      {
        name: "show_stock_chart",
        description:
          "Get historical stock price data for a given stock. Use this to show the chart to the user.",
        parameters: z.object({
          symbol: z
            .string()
            .describe("The name or symbol of the stock. e.g. GOOG/AAPL/MSFT."),
        }),
      },
    ],
    temperature: 0,
  });

  completion.onTextContent((content: string, isFinal: boolean) => {
    reply.update(<BotMessage>{content}</BotMessage>);
    if (isFinal) {
      reply.done();
      aiState.done([...aiState.get(), { role: "assistant", content }]);
    }
  });

  completion.onFunctionCall("show_stock_chart", async ({ symbol }) => {
    reply.update(
      <BotCard>
        <StockSkeleton />
      </BotCard>
    );

    const from = new Date(new Date().setMonth(new Date().getMonth() - 6))
      .toISOString()
      .split("T")[0];
    const to = new Date().toISOString().split("T")[0];

    let stockData: StockChartData[] = [];
    let price = 0;
    const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${process.env.STOCK_API_KEY}&from=${from}&to=${to}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      stockData = data.historical
        .map((item: StockChartData) => ({
          date: formatDate(item.date),
          close: item.close,
        }))
        .reverse();

      function formatDate(dateStr: string): string {
        const dateObj = new Date(dateStr);
        const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear().toString().slice(2)}`;
        return formattedDate;
      }

      price = stockData[stockData.length - 1].close;

      console.log("Successfully fetched stock data for", symbol);
    } catch (error) {
      console.error("Error fetching historical price data:", error);
    }

    reply.done(
      <BotCard>
        <Stock name={symbol} data={stockData} />
      </BotCard>
    );

    aiState.done([
      ...aiState.get(),
      {
        role: "function",
        name: "show_stock_chart",
        content: `[Price of ${symbol} = ${price}]`,
      },
    ]);
  });

  return {
    id: Date.now(),
    display: reply.value,
  };
}

// Define necessary types and create the AI.

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
    confirmPurchase,
  },
  initialUIState,
  initialAIState,
});
