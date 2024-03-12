import "server-only";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";

import { BotCard, BotMessage, Stock, StockSkeleton } from "@/components/stocks";
import { FinancialStatement } from "@/components/financials/financial-statement";
import { spinner } from "@/components/spinner";

import { runOpenAICompletion } from "@/lib/utils";
import { z } from "zod";

import { getHistoricalData } from "@/db/actions";
import { getFinancialData } from "@/db/actions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

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
          If the user wants company financial data, call \`get_financial_data\` to show the data.

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
      {
        name: "get_financial_data",
        description:
          "Get the income statement for a given stock. Use this to show the income statement to the user.",
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

    const stockData: StockChartData[] = await getHistoricalData(symbol);

    const price = stockData[stockData.length - 1]?.price || 0;

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

  completion.onFunctionCall("get_financial_data", async ({ symbol }) => {
    reply.update(<BotCard>Loading...</BotCard>);

    const data = await getFinancialData(symbol);

    reply.done(
      <BotCard>
        <FinancialStatement data={data[0]} />
      </BotCard>
    );

    aiState.done([
      ...aiState.get(),
      {
        role: "function",
        name: "get_financial_data",
        content: `[Income statement of ${symbol}]`,
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
  },
  initialUIState,
  initialAIState,
});
