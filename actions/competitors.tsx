"use server";

import { db } from "@/db";
import { companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFinancialData } from "@/actions/db";

import OpenAI from "openai";

const openai = new OpenAI();

export async function getCompetitors({
  name,
  symbol,
}: {
  name: string;
  symbol: string;
}) {
  try {
    const dbData = await db.query.companies.findFirst({
      where: eq(companies.name, symbol),
    });

    if (dbData) {
      console.log("Competitors found - DB");
      return dbData.competitors;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `
              Return a string array of the top competitors for ${name} (${symbol}).
              Provide only the stock symbols. (e.g. ["AAPL", "GOOGL"])
              Note that Facebook is now called Meta Platforms (META).
              The response must be in JSON format as shown:

              {
                "competitors": string[],
              }
            `,
        },
      ],
    });

    const data = response.choices[0].message.content;
    if (!data) {
      console.error("No data found");
      return [];
    }

    const { competitors } = JSON.parse(data);
    const index = competitors.indexOf(symbol);
    if (index > -1) {
      competitors.splice(index, 1);
    }
    return competitors;
  } catch (error) {
    console.error("Error getting competitors", error);
    return [];
  }
}

export async function getCompetitorData({
  name,
  symbol,
}: {
  name: string;
  symbol: string;
}) {
  const competitors = await getCompetitors({ name, symbol });
  if (!competitors.length) return [];

  const financialDataPromises = competitors.map(async (symbol: string) => {
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
