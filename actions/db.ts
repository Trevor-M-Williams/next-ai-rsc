"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { companies, financialStatements, stocks, symbols } from "../db/schema";

import { generateCompanyData } from "./insights";
import {
  fetchBalanceSheets,
  fetchCashFlowStatements,
  fetchHistoricalData,
  fetchIncomeStatements,
} from "./fetch";

export async function addCompany(name: string) {
  try {
    const companyData = await generateCompanyData(name);
    const data = {
      name,
      data: companyData,
    };

    await db.insert(companies).values(data);
  } catch (error) {
    console.error(error);
  }
}

export async function getCompanyData(name: string) {
  try {
    const data = await db.query.companies.findFirst({
      where: eq(companies.name, name),
    });

    if (data) {
      return data.data;
    }

    return {};
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function getCompanyName(symbol: string) {
  try {
    const data = await db.query.symbols.findFirst({
      where: eq(symbols.symbol, symbol.toUpperCase()),
    });

    if (data) {
      return data.name;
    }

    return "";
  } catch (error) {
    console.error(error);
    return "";
  }
}

export async function getCompanies() {
  try {
    const data = await db.query.companies.findMany();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getHistoricalData(symbol: string) {
  try {
    const stockData = await db.query.stocks.findFirst({
      where: eq(stocks.name, symbol.toUpperCase()),
    });

    if (!stockData || !stockData.data) {
      const fetchedData = await fetchHistoricalData(symbol);

      const stockData = {
        name: symbol.toUpperCase(),
        data: fetchedData,
      };
      await db.insert(stocks).values(stockData);

      console.log("No data");
      console.log(`Stock data fetched for ${symbol} - API`);
      return fetchedData;
    }

    const updatedAt = stockData?.updatedAt;
    const dataIsStale = calculateIsStale(updatedAt);

    if (dataIsStale) {
      const fetchedData = await fetchHistoricalData(symbol);
      await db
        .update(stocks)
        .set({ data: fetchedData, updatedAt: new Date() })
        .where(eq(stocks.name, symbol.toUpperCase()));

      console.log("Stale data");
      console.log(`Stock data fetched for ${symbol} - API`);
      return fetchedData;
    }

    console.log(`Stock data fetched for ${symbol} - DB`);
    return stockData.data;
  } catch (error) {
    console.error(error);
    return [];
  }

  function calculateIsStale(updatedAt: Date | undefined): boolean {
    if (!updatedAt) return true;

    const updatedAtDate = new Date(updatedAt);
    const currentDate = new Date();

    console.log(updatedAtDate.toDateString(), currentDate.toDateString());

    return updatedAtDate.toDateString() !== currentDate.toDateString();
  }
}

export async function getFinancialData(symbol: string) {
  try {
    const financialData = await db.query.financialStatements.findFirst({
      where: eq(financialStatements.name, symbol.toUpperCase()),
    });

    if (financialData) {
      console.log(`Financial data fetched for ${symbol} - DB`);
      return financialData;
    }

    const [balanceSheets, cashFlowStatements, incomeStatements] =
      await Promise.all([
        fetchBalanceSheets(symbol),
        fetchCashFlowStatements(symbol),
        fetchIncomeStatements(symbol),
      ]);

    const data = {
      name: symbol.toUpperCase(),
      balanceSheets,
      cashFlowStatements,
      incomeStatements,
    };

    await db.insert(financialStatements).values(data);

    console.log(`Financial data fetched for ${symbol} - API`);
    return { balanceSheets, cashFlowStatements, incomeStatements };
  } catch (error) {
    console.error(error);
    return { balanceSheets: [], cashFlowStatements: [], incomeStatements: [] };
  }
}

// this isnt used anywhere atm
export async function insertStockData(symbol: string, data: StockChartData[]) {
  try {
    const stockData = {
      name: symbol.toUpperCase(),
      data,
    };
    await db.insert(stocks).values(stockData);
  } catch (error) {
    console.error(error);
  }
}
