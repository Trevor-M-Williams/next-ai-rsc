import { NextRequest, NextResponse } from "next/server";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL as string) as any;

const db = drizzle(sql, {
  schema,
});

export async function GET(request: NextRequest) {
  console.log(request.method);
  try {
    const stockData = await db.query.stocks.findFirst();

    console.log(stockData);

    if (!stockData || !stockData.data) {
      return NextResponse.json(
        { error: "Failed to fetch stock data" },
        { status: 500 }
      );
    }

    console.log(stockData.data[0]);
    return NextResponse.json(stockData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
