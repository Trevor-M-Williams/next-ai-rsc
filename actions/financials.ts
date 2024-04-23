export async function fetchHistoricalData(symbol: string) {
  try {
    const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${process.env.STOCK_API_KEY}`;
    const response = await fetch(url, { cache: "no-store" });

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

export async function fetchBalanceSheets(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?period=annual&apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function fetchCashFlowStatements(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?period=annual&apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function fetchIncomeStatements(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=annual&apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
