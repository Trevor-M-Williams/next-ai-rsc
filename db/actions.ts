"use server";

import { eq } from "drizzle-orm";
import { db } from ".";
import { financialStatements, stocks, symbols } from "./schema";

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

export async function getHistoricalData(symbol: string) {
  try {
    const stockData = await db.query.stocks.findFirst({
      where: eq(stocks.name, symbol.toUpperCase()),
    });

    if (!stockData || !stockData.data) {
      console.log(`Stock data not found for ${symbol}`);
      const fetchedData = await fetchHistoricalData(symbol);

      const stockData = {
        name: symbol,
        data: fetchedData,
      };
      await db.insert(stocks).values(stockData);

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
      name: symbol,
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

// Utilities

async function fetchHistoricalData(symbol: string) {
  try {
    const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${process.env.STOCK_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const stockData = data.historical
      .map((item: StockAPIData) => ({
        date: formatDate(item.date),
        price: item.close,
      }))
      .reverse();

    return stockData;
  } catch (error) {
    console.error(error);
    return [];
  }

  function formatDate(dateStr: string): string {
    const dateObj = new Date(dateStr);
    const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear().toString().slice(2)}`;
    return formattedDate;
  }
}

async function fetchBalanceSheets(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?period=annual&apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function fetchCashFlowStatements(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?period=annual&apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function fetchIncomeStatements(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=annual&apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
