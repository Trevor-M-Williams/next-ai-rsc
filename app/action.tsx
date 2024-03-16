import "server-only";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";

import { BotCard, BotMessage, Stock, StockSkeleton } from "@/components/stocks";
import { FinancialStatement, FinancialSkeleton } from "@/components/financials";
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

  if (content.startsWith("/")) {
    const response = await handleCommand(content, reply, aiState);
    return response;
  } else {
    const completion = runOpenAICompletion(openai, {
      // model: "gpt-3.5-turbo",
      model: "gpt-4-0125-preview",
      stream: true,
      messages: [
        {
          role: "system",
          content: `\
          You are a financial analysis bot.
          You and the user can discuss public company financials.

          Messages inside [] means that it's a UI element or a user event. For example:
          "[Price of AAPL = 100]" means that an interface of the stock price of AAPL is shown to the user.
          "[Financial statements for AAPL: ...data]" means that the financial statements for AAPL are shown to the user.

          If the user asks you a specific question about the financial data (e.g. what was the change in profit margin from 22 to 23), use the financial data in the chat history to answer the question.
          If the financial data is not in the chat history, ask the user for the stock symbol if necessary and then call \`get_financial_data\` to get the data.

          When doing calculations don't provide formulas, just the result.
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
          name: "get_financial_data",
          description:
            "Get the financial statements for a given stock. e.g. AAPL/GOOG/MSFT.",
          parameters: z.object({
            symbol: z
              .string()
              .describe(
                "The name or symbol of the stock. e.g. GOOG/AAPL/MSFT."
              ),
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

    completion.onFunctionCall("get_financial_data", async ({ symbol }) => {
      const { balanceSheets, cashFlowStatements, incomeStatements } =
        await getFinancialData(symbol);

      //how to pass the data back to the model?

      reply.done(
        <BotCard>
          <FinancialStatement
            name={symbol}
            balanceSheets={balanceSheets}
            cashFlowStatements={cashFlowStatements}
            incomeStatements={incomeStatements}
          />
        </BotCard>
      );

      aiState.done([
        ...aiState.get(),
        {
          role: "function",
          name: "show_financial_data",
          content: `[Financial statements for ${symbol}: 
          Balance sheets: ${JSON.stringify(balanceSheets)}, 
          Cash flow statements: ${JSON.stringify(cashFlowStatements)},
          Income statements: ${JSON.stringify(incomeStatements)}
        ]`,
        },
      ]);
    });

    return {
      id: Date.now(),
      display: reply.value,
    };
  }
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

async function handleCommand(
  content: string,
  reply: ReturnType<typeof createStreamableUI>,
  aiState: ReturnType<typeof getMutableAIState>
) {
  console.log("Command:", content);

  const command = content.split(":")[0] || "";
  const symbol = content.split(":")[1].toUpperCase() || "";

  if (!symbol) {
    reply.done(<BotMessage>Please provide a company symbol</BotMessage>);

    aiState.done([
      ...aiState.get(),
      {
        role: "system",
        content: `No symbol provided for command: ${content}`,
      },
    ]);

    return {
      id: Date.now(),
      display: reply.value,
    };
  }

  console.log("Test");

  switch (command) {
    case "/stock": {
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

      return {
        id: Date.now(),
        display: reply.value,
      };
    }
    case "/financials": {
      reply.update(
        <BotCard>
          <FinancialSkeleton />
        </BotCard>
      );

      const { balanceSheets, cashFlowStatements, incomeStatements } =
        await getFinancialData(symbol);

      reply.done(
        <BotCard>
          <FinancialStatement
            name={symbol}
            balanceSheets={balanceSheets}
            cashFlowStatements={cashFlowStatements}
            incomeStatements={incomeStatements}
          />
        </BotCard>
      );

      aiState.done([
        ...aiState.get(),
        {
          role: "function",
          name: "show_financial_data",
          content: `[Financial statements for ${symbol}: 
          Balance sheets: ${JSON.stringify(balanceSheets)}, 
          Cash flow statements: ${JSON.stringify(cashFlowStatements)},
          Income statements: ${JSON.stringify(incomeStatements)}
        ]`,
        },
      ]);

      return {
        id: Date.now(),
        display: reply.value,
      };
    }
    default: {
      reply.done(
        <BotCard>
          <BotMessage>Command not found</BotMessage>
        </BotCard>
      );

      aiState.done([
        ...aiState.get(),
        {
          role: "system",
          content: `Command not found: ${content}`,
        },
      ]);

      return {
        id: Date.now(),
        display: reply.value,
      };
    }
  }
}
