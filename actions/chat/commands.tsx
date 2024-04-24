"use server";

import { createStreamableUI, getMutableAIState } from "ai/rsc";

import { BotCard, BotMessage } from "@/components/chat/message";
import { Stock, StockSkeleton } from "@/components/stocks";
import { FinancialStatement, FinancialSkeleton } from "@/components/financials";
import { DynamicFinancialChart } from "@/components/charts/dynamic-financial-chart";

import { getCompanyName, getHistoricalData, getFinancialData } from "@/actions";

export async function handleCommand(
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
            <DynamicFinancialChart symbols={symbols} field={"revenue"} />
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
            <DynamicFinancialChart symbols={symbols} field={"revenue"} />
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
            <div className="h-96" key={stock.symbol}>
              <Stock
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
