import "server-only";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";

import { BotCard, BotMessage, Stock, StockSkeleton } from "@/components/stocks";
import { FinancialStatement, FinancialSkeleton } from "@/components/financials";
import { Chart } from "@/components/chart";
import { spinner } from "@/components/spinner";
import { MarkdownLatex } from "@/components/markdown-latex";

import { runOpenAICompletion } from "@/lib/utils";
import { z } from "zod";

import { getHistoricalData } from "@/db/actions";
import { getFinancialData } from "@/db/actions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const systemMessage = `\
  You are a financial analysis bot.
  You and the user can discuss public company financials.

  Messages inside [] indicate UI elements.
  "[Price of AAPL = 100]" means that an interface of the stock price of AAPL is shown to the user.
  "[Financial statements for GOOG]" means that the financial statements for GOOG are shown to the user.

  If the user asks a question that requires financial data (e.g. what was MSFT's change in profit margin from 22 to 23) call \`get_financial_data\` to get the data.
`;

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
    const response = await handleAIResponse(reply, aiState);
    return response;
  }
}

// --------------------- Create AI --------------------- //

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

// --------------------- Handle Command --------------------- //

async function handleCommand(
  content: string,
  reply: ReturnType<typeof createStreamableUI>,
  aiState: ReturnType<typeof getMutableAIState>
) {
  const command = content.split(":")[0] || "";
  const symbols = content.split(":")[1].split(",");

  if (!symbols) {
    reply.done(<BotMessage>Please provide a company symbol</BotMessage>);

    aiState.done([
      ...aiState.get().filter((info: any) => info.role !== "function"),
      {
        role: "assistant",
        content: `No symbol provided for command: ${content}`,
      },
    ]);

    return {
      id: Date.now(),
      display: reply.value,
    };
  }

  switch (command) {
    case "/chart": {
      reply.update(<BotCard>Loading...</BotCard>);

      const field = content.split(":")[2] || "revenue";

      const chartDataPromises = symbols.map(async (symbol) => {
        const { balanceSheets, cashFlowStatements, incomeStatements } =
          await getFinancialData(symbol);

        let fieldType;
        if (field in balanceSheets[0]) fieldType = "balanceSheets";
        if (field in cashFlowStatements[0]) fieldType = "cashFlowStatements";
        if (field in incomeStatements[0]) fieldType = "incomeStatements";

        switch (fieldType) {
          case "balanceSheets":
            return {
              ticker: symbol.toUpperCase(),
              data: balanceSheets,
            };
          case "cashFlowStatements":
            return {
              ticker: symbol.toUpperCase(),
              data: cashFlowStatements,
            };
          case "incomeStatements":
            return {
              ticker: symbol.toUpperCase(),
              data: incomeStatements,
            };
          default:
            return { ticker: symbol.toUpperCase(), data: [] };
        }
      });

      const datasets = await Promise.all(chartDataPromises);

      reply.done(
        <BotCard>
          <Chart
            datasets={datasets}
            field={field as keyof FinancialStatement}
          />
        </BotCard>
      );

      aiState.done([
        ...aiState.get().filter((info: any) => info.role !== "function"),
        {
          role: "assistant",
          name: "get_financial_data",
          content: `[Plot]`,
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

      const symbol = symbols[0].toUpperCase();

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
        ...aiState.get().filter((info: any) => info.role !== "function"),
        {
          role: "assistant",
          name: "get_financial_data",
          content: `[Financial statements for ${symbols}]`,
        },
      ]);

      return {
        id: Date.now(),
        display: reply.value,
      };
    }

    case "/stock": {
      reply.update(
        <BotCard>
          <StockSkeleton />
        </BotCard>
      );

      const symbol = symbols[0].toUpperCase();

      const stockData: StockChartData[] = await getHistoricalData(symbol);
      const price = stockData[stockData.length - 1]?.price || 0;

      reply.done(
        <BotCard>
          <Stock name={symbol} data={stockData} />
        </BotCard>
      );

      aiState.done([
        ...aiState.get().filter((info: any) => info.role !== "function"),
        {
          role: "assistant",
          name: "show_stock_chart",
          content: `[Price of ${symbol} = ${price}]`,
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
        ...aiState.get().filter((info: any) => info.role !== "function"),
        {
          role: "assistant",
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

// --------------------- Handle AI Response --------------------- //

async function handleAIResponse(
  reply: ReturnType<typeof createStreamableUI>,
  aiState: ReturnType<typeof getMutableAIState>
) {
  const completion = runOpenAICompletion(openai, {
    // model: "gpt-4-0125-preview",
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: systemMessage,
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
          "Get the financial statements for a given company. e.g. AAPL/GOOG/MSFT.",
        parameters: z.object({
          symbol: z
            .string()
            .describe("The symbol of the company. e.g. GOOG/AAPL/MSFT."),
        }),
      },
      {
        name: "show_financial_data",
        description:
          "Show the financial statements for a given company. e.g. AAPL/GOOG/MSFT.",
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              "The name or symbol of the company. e.g. GOOG/AAPL/MSFT."
            ),
          balanceSheets: z.any(),
          cashFlowStatements: z.any(),
          incomeStatements: z.any(),
        }),
      },
    ],
    temperature: 0,
  });

  completion.onTextContent((content: string, isFinal: boolean) => {
    reply.update(
      <BotMessage>
        <MarkdownLatex content={content} />
      </BotMessage>
    );

    if (isFinal) {
      reply.done();
      aiState.done([
        ...aiState.get().filter((info: any) => info.role !== "function"),
        { role: "assistant", content },
      ]);
    }
  });

  completion.onFunctionCall("get_financial_data", async ({ symbol }) => {
    const { balanceSheets, cashFlowStatements, incomeStatements } =
      await getFinancialData(symbol);

    aiState.update([
      ...aiState.get().filter((info: any) => info.role !== "function"),
      {
        role: "function",
        name: "get_financial_data",
        content: `
            Financial statements for ${symbol}:
            Balance sheets: ${JSON.stringify(balanceSheets)},
            Cash flow statements: ${JSON.stringify(cashFlowStatements)},
            Income statements: ${JSON.stringify(incomeStatements)}
        `,
      },
    ]);

    const nestedCompletion = runOpenAICompletion(openai, {
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "Respond to the user's prompt using the given financial data.",
        },
        ...aiState.get().map((info: any) => ({
          role: info.role,
          content: info.content,
          name: info.name,
        })),
      ],
      temperature: 0,
    });

    nestedCompletion.onTextContent((content: string, isFinal: boolean) => {
      reply.update(
        <BotMessage>
          <MarkdownLatex content={content} />
        </BotMessage>
      );

      if (isFinal) {
        reply.done();
        aiState.done([...aiState.get(), { role: "assistant", content }]);
      }
    });
  });

  return {
    id: Date.now(),
    display: reply.value,
  };
}
