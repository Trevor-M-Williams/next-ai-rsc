import "server-only";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";

import { BotCard, BotMessage, Stock, StockSkeleton } from "@/components/stocks";
import { FinancialStatement, FinancialSkeleton } from "@/components/financials";
import { DynamicChart } from "@/components/dynamic-chart";
import { MarkdownProse } from "@/components/chat/markdown";
import { spinner } from "@/components/spinner";

import { runOpenAICompletion } from "@/lib/utils";
import { z } from "zod";

import {
  getCompanyName,
  getHistoricalData,
  getFinancialData,
} from "@/actions/db";
import { getPineconeContext } from "@/actions/pinecone";
import { getSearchResults } from "@/actions/cohere";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const systemMessage = `\
  You are an ai assistant for board directors.
  You help them analyze company/industry/economic data.
  Use the chat history and context info to provide relevant responses.
  If relevant information is not found in the context, call get_search_results to get relevant data from the web.
  When providing company analysis, call get_search_results to find supporting data.
  If the user asks about financials specifically, call get_financial_data to get the financial statements for the companies.

  e.g. "Why is AAPL down this month?" -> get_search_results("AAPL stock news")
  e.g. "Compare eps for Apple and Google" -> get_financial_data(["AAPL", "GOOG"])

  Today is ${new Date().toDateString()}

  Messages inside [] indicate UI elements.
  "[Price of AAPL = 100]" means that an interface of the stock price of AAPL is shown to the user.
  "[Financial statements for GOOG]" means that the financial statements for GOOG are shown to the user.
`;

async function submitUserMessage(query: string) {
  "use server";
  const content = query;
  try {
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
  } catch (error) {
    console.log(error);
    return {
      id: Date.now(),
      display: <BotMessage>Sorry, something went wrong.</BotMessage>,
    };
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
  const symbols = content
    .split(":")[1]
    .split(",")
    .map((symbol) => symbol.trim().toUpperCase());

  if (!symbols.length || !symbols[0]) {
    reply.done(
      <BotMessage>A company symbol is required to run a command.</BotMessage>
    );

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
    case "/analyze": {
      const symbol = symbols[0].toUpperCase();
      const { balanceSheets, cashFlowStatements, incomeStatements } =
        await getFinancialData(symbol);
      const name = await getCompanyName(symbol);
      const stockData = await getHistoricalData(symbol);

      reply.done(
        <BotCard>
          <FinancialStatement
            name={name || ""}
            symbol={symbol}
            balanceSheets={balanceSheets}
            cashFlowStatements={cashFlowStatements}
            incomeStatements={incomeStatements}
          />

          <div className="h-96">
            <Stock symbol={symbol} name={name || ""} data={stockData} />
          </div>

          <div className="h-96">
            <DynamicChart symbols={symbols} field={"revenue"} />
          </div>
        </BotCard>
      );

      aiState.done([
        ...aiState.get().filter((info: any) => info.role !== "function"),
        {
          role: "assistant",
          name: "analyze_company",
          content: `[Analyze ${symbol}]`,
        },
      ]);

      return {
        id: Date.now(),
        display: reply.value,
      };
    }
    case "/chart": {
      // TODO: make chart dynamic

      reply.done(
        <BotCard>
          <div className="h-96">
            <DynamicChart symbols={symbols} field={"revenue"} />
          </div>
        </BotCard>
      );

      aiState.done([
        ...aiState.get().filter((info: any) => info.role !== "function"),
        {
          role: "assistant",
          name: "show_financial_chart",
          content: `[Dynamic Chart]`,
        },
      ]);

      return {
        id: Date.now(),
        display: reply.value,
      };
    }

    case "/financials": {
      const financialDataPromises = symbols.map(async (symbol) => {
        const { balanceSheets, cashFlowStatements, incomeStatements } =
          await getFinancialData(symbol);
        const name = await getCompanyName(symbol);
        return {
          symbol: symbol.toUpperCase(),
          name,
          balanceSheets,
          cashFlowStatements,
          incomeStatements,
        };
      });

      const financialData = await Promise.all(financialDataPromises);

      reply.done(
        <BotCard>
          {financialData.map((data) => (
            <FinancialStatement
              key={data.symbol}
              name={data.name || ""}
              symbol={data.symbol}
              balanceSheets={data.balanceSheets}
              cashFlowStatements={data.cashFlowStatements}
              incomeStatements={data.incomeStatements}
            />
          ))}
        </BotCard>
      );

      aiState.done([
        ...aiState.get().filter((info: any) => info.role !== "function"),
        {
          role: "assistant",
          name: "show_financial_data",
          content: `[Financial statements for ${symbols}]`,
        },
      ]);

      return {
        id: Date.now(),
        display: reply.value,
      };
    }

    case "/stock": {
      const stockDataPromises = symbols.map(async (symbol) => {
        const data = await getHistoricalData(symbol);
        const name = await getCompanyName(symbol);
        return { symbol: symbol.toUpperCase(), name, data };
      });

      const stockData = await Promise.all(stockDataPromises);

      reply.done(
        <BotCard>
          {stockData.map((stock) => (
            <div className="h-96">
              <Stock
                key={stock.symbol}
                symbol={stock.symbol}
                name={stock.name || ""}
                data={stock.data}
              />
            </div>
          ))}
        </BotCard>
      );

      aiState.done([
        ...aiState.get().filter((info: any) => info.role !== "function"),
        {
          role: "assistant",
          name: "show_stock_chart",
          content: `[Show stock chart for ${symbols}]`,
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
  const messages = aiState.get();
  const prompt = messages[messages.length - 1].content;
  const { pineconeContext, pineconeCitations } =
    await getPineconeContext(prompt);

  const completion = runOpenAICompletion(openai, {
    model: "gpt-4-turbo",
    // model: "gpt-3.5-turbo",
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
      {
        role: "function",
        name: "context",
        content: `
        Context: ${pineconeContext}
        `,
      },
    ],
    functions: [
      {
        name: "get_financial_data",
        description: "Get the financial statements for the listed companies.",
        parameters: z.object({
          symbols: z
            .array(z.string())
            .describe(
              "An array of the symbols of the companies. e.g. ['GOOG', 'AAPL', 'MSFT']"
            ),
        }),
      },
      {
        name: "get_search_results",
        description: "Get web search results.",
        parameters: z.object({
          query: z
            .string()
            .describe("An optimized search query based on the user's input."),
        }),
      },
    ],
    temperature: 0,
  });

  completion.onTextContent((content: string, isFinal: boolean) => {
    reply.update(
      <BotMessage>
        <MarkdownProse content={content} />
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

  completion.onFunctionCall(
    "get_financial_data",
    async ({ symbols }: { symbols: string[] }) => {
      console.log("Function call: Get Financial Data", symbols);
      const financialDataForCompanies = [];

      for (const symbol of symbols) {
        const { balanceSheets, cashFlowStatements, incomeStatements } =
          await getFinancialData(symbol);

        financialDataForCompanies.push({
          symbol: symbol.toUpperCase(),
          balanceSheets,
          cashFlowStatements,
          incomeStatements,
        });
      }

      aiState.update([
        ...aiState.get().filter((info: any) => info.role !== "function"),
        {
          role: "function",
          name: "get_financial_data",
          content: financialDataForCompanies
            .map(
              (companyData) => `
                Financial statements for ${companyData.symbol}:
                Balance sheets: ${JSON.stringify(companyData.balanceSheets)},
                Cash flow statements: ${JSON.stringify(companyData.cashFlowStatements)},
                Income statements: ${JSON.stringify(companyData.incomeStatements)}
              `
            )
            .join("\n\n"),
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
            <MarkdownProse content={content} />
          </BotMessage>
        );

        if (isFinal) {
          reply.done();
          aiState.done([...aiState.get(), { role: "assistant", content }]);
        }
      });
    }
  );

  completion.onFunctionCall(
    "get_search_results",
    async ({ query }: { query: string }) => {
      console.log("Function call: Get Search Results", query);
      const { searchResults, searchCitations } = await getSearchResults(query);

      aiState.update([
        ...aiState.get().filter((info: any) => info.role !== "function"),
        {
          role: "function",
          name: "get_search_results",
          content: `
            Search results: ${searchResults}
            Search citations: {{${searchCitations}}}
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
              "Respond to the user's prompt using the given search data.",
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
            <MarkdownProse content={content} />
          </BotMessage>
        );

        if (isFinal) {
          reply.done();
          aiState.done([...aiState.get(), { role: "assistant", content }]);
        }
      });
    }
  );

  return {
    id: Date.now(),
    display: reply.value,
  };
}
