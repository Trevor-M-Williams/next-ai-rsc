"use server";

import { getFinancialData } from "./db";

export async function getCompetitorData() {
  const competitors = ["AAPL", "AMZN", "GOOG", "META", "MSFT"];

  const financialDataPromises = competitors.map(async (symbol) => {
    const { balanceSheets, cashFlowStatements, incomeStatements } =
      await getFinancialData(symbol);
    return {
      symbol: symbol.toUpperCase(),
      balanceSheets,
      cashFlowStatements,
      incomeStatements,
    };
  });

  return Promise.all(financialDataPromises);
}
