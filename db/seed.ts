import { eq } from "drizzle-orm";
import { db } from ".";
import { symbols } from "./schema";

main();

async function main() {
  const AAPL = await db.query.symbols.findFirst({
    where: eq(symbols.symbol, "AAPL"),
  });

  console.log(AAPL);
}

async function seedSymbols() {
  try {
    console.log("Seeding database");

    await db.delete(symbols);

    // Get symbols from API
    const url = `https://financialmodelingprep.com/api/v3/stock/list?apikey=${process.env.STOCK_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // Split data into chunks of 100
    const dataChunks = chunkArray(data, 100);

    // Insert each chunk into the database
    for (const chunk of dataChunks) {
      await db.insert(symbols).values(chunk);
    }

    console.log("Seeded database");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
}

// Function to split data into chunks of a specific size
function chunkArray(array: [], chunkSize: number) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
