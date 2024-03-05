import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // deconstruct the query parameters
  const searchParams = request.nextUrl.searchParams;
  const ticker = searchParams.get("ticker");
  let from = searchParams.get("from");
  let to = searchParams.get("to");

  if (!ticker) {
    return new Response("No ticker provided", { status: 400 });
  }

  if (!to) {
    // set to to today
    to = new Date().toISOString().split("T")[0];
  }

  if (!from) {
    // set from to 6 months ago
    from = new Date(new Date().setMonth(new Date().getMonth() - 6))
      .toISOString()
      .split("T")[0];
  }

  console.log(
    "Fetching historical price data for",
    ticker,
    "from",
    from,
    "to",
    to
  );

  const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?apikey=${process.env.STOCK_API_KEY}&from=${from}&to=${to}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const stockData = data.historical
      .map((item: any) => ({
        date: item.date,
        close: item.close,
      }))
      .reverse();

    return new Response(JSON.stringify(stockData), { status: 200 });
  } catch (error) {
    console.error("Error fetching historical price data:", error);
    return new Response("Error fetching historical price data", {
      status: 500,
    });
  }
}
