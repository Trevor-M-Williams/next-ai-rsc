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

import { getCompanyName, getHistoricalData } from "@/db/actions";
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

  If the user wants to see company financials, call \`show_financial_data\` with the required symbols to get and display the data.
  "Show me the financials for Microsoft and Meta" -> show_financial_data(["MSFT", "META"])

  If the user asks a question that requires financial data call \`get_financial_data\` with the required symbols to get the data.
  "Compare Apple and Google's profit margin" -> get_financial_data(["AAPL", "GOOG"])

  If the user wants to see a chart, call \`show_financial_chart\` with the required symbols and field to plot.
  "Plot revenue for Apple and Google" -> show_financial_chart(["AAPL", "GOOG"], "revenue")
  
  The field should be one of the following:
  cashAndCashEquivalents,
  shortTermInvestments,
  cashAndShortTermInvestments,
  netReceivables,
  inventory,
  otherCurrentAssets,
  totalCurrentAssets,
  propertyPlantEquipmentNet,
  goodwill,
  intangibleAssets,
  goodwillAndIntangibleAssets,
  longTermInvestments,
  taxAssets,
  otherNonCurrentAssets,
  totalNonCurrentAssets,
  otherAssets,
  totalAssets,
  accountPayables,
  shortTermDebt,
  taxPayables,
  deferredRevenue,
  otherCurrentLiabilities,
  totalCurrentLiabilities,
  longTermDebt,
  deferredRevenueNonCurrent,
  deferredTaxLiabilitiesNonCurrent,
  otherNonCurrentLiabilities,
  totalNonCurrentLiabilities,
  otherLiabilities,
  capitalLeaseObligations,
  totalLiabilities,
  preferredStock,
  commonStock,
  retainedEarnings,
  accumulatedOtherComprehensiveIncomeLoss,
  othertotalStockholdersEquity,
  totalStockholdersEquity,
  totalEquity,
  totalLiabilitiesAndStockholdersEquity,
  minorityInterest,
  totalLiabilitiesAndTotalEquity,
  totalInvestments,
  totalDebt,
  netDebt,
  ---------------------
  netIncome,
  depreciationAndAmortization,
  deferredIncomeTax,
  stockBasedCompensation,
  changeInWorkingCapital,
  accountsReceivables,
  inventory,
  accountsPayables,
  otherWorkingCapital,
  otherNonCashItems,
  netCashProvidedByOperatingActivities,
  investmentsInPropertyPlantAndEquipment,
  acquisitionsNet,
  purchasesOfInvestments,
  salesMaturitiesOfInvestments,
  otherInvestingActivites,
  netCashUsedForInvestingActivites,
  debtRepayment,
  commonStockIssued,
  commonStockRepurchased,
  dividendsPaid,
  otherFinancingActivites,
  netCashUsedProvidedByFinancingActivities,
  effectOfForexChangesOnCash,
  netChangeInCash,
  cashAtEndOfPeriod,
  cashAtBeginningOfPeriod,
  operatingCashFlow,
  capitalExpenditure,
  freeCashFlow,
  ---------------------
  revenue,
  costOfRevenue,
  grossProfit,
  grossProfitRatio,
  researchAndDevelopmentExpenses,
  generalAndAdministrativeExpenses,
  sellingAndMarketingExpenses,
  sellingGeneralAndAdministrativeExpenses,
  otherExpenses,
  operatingExpenses,
  costAndExpenses,
  interestIncome,
  interestExpense,
  depreciationAndAmortization,
  ebitda,
  ebitdaratio,
  operatingIncome,
  operatingIncomeRatio,
  totalOtherIncomeExpensesNet,
  incomeBeforeTax,
  incomeBeforeTaxRatio,
  incomeTaxExpense,
  netIncome,
  netIncomeRatio,
  eps,
  epsdiluted,
  weightedAverageShsOut,
  weightedAverageShsOutDil,
`;

async function submitUserMessage(content: string) {
  "use server";
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
          name: "show_financial_chart",
          content: `[Plot]`,
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
            <Stock
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name || ""}
              data={stock.data}
            />
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
        name: "show_financial_chart",
        description: "Show the financial statements for a given company.",
        parameters: z.object({
          symbols: z
            .array(z.string())
            .describe(
              "An array of the symbols of the companies. e.g. ['GOOG', 'AAPL', 'MSFT']"
            ),
          field: z.string().optional().describe("The field to plot."),
        }),
      },
      {
        name: "show_financial_data",
        description: "Show the financial statements for a given company.",
        parameters: z.object({
          symbols: z
            .array(z.string())
            .describe(
              "An array of the symbols of the companies. e.g. ['GOOG', 'AAPL', 'MSFT']"
            ),
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
            <MarkdownLatex content={content} />
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
    "show_financial_chart",
    async ({ symbols, field }: { symbols: string[]; field: string }) => {
      console.log("Function call: Show Financial Chart", symbols, field);

      if (!field) field = "revenue";

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
          name: "show_financial_chart",
          content: `[Plot]`,
        },
      ]);
    }
  );

  completion.onFunctionCall(
    "show_financial_data",
    async ({ symbols }: { symbols: string[] }) => {
      console.log("Function call: Show Financial Data", symbols);

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
    }
  );

  return {
    id: Date.now(),
    display: reply.value,
  };
}
