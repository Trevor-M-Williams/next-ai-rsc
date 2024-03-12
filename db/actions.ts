"use server";

import { eq } from "drizzle-orm";
import { db } from ".";
import { stocks } from "./schema";

export async function getHistoricalData(symbol: string) {
  try {
    const stockData = await db.query.stocks.findFirst({
      where: eq(stocks.name, symbol),
    });

    if (!stockData || !stockData.data) {
      const fetchedData = await fetchHistoricalData(symbol);

      const stockData = {
        name: symbol,
        data: fetchedData,
      };
      await db.insert(stocks).values(stockData);

      console.log(`Stock data fetched for ${symbol} - API`);
      return fetchedData;
    }

    console.log(`Stock data fetched for ${symbol} - DB`);
    return stockData.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getFinancialData(symbol: string) {
  try {
    const incomeStatement = await fetchIncomeStatement(symbol);
    return incomeStatement;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function insertStockData(symbol: string, data: StockChartData[]) {
  try {
    const stockData = {
      name: symbol,
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

async function fetchIncomeStatement(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=annual&apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const incomeStatement = data.map((item: IncomeStatement) => ({
    date: item.date,
    revenue: item.revenue,
    costOfRevenue: item.costOfRevenue,
    grossProfit: item.grossProfit,
    operatingExpense: item.operatingExpense,
    operatingIncome: item.operatingIncome,
    ebitda: item.ebitda,
    netIncome: item.netIncome,
    eps: item.eps,
  }));
  return incomeStatement;
}

// 383_285_000_000
