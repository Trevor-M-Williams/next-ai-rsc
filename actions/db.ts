"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  companies,
  financialStatements,
  organizations,
  stocks,
  symbols,
} from "@/db/schema";

import { generateCompanyAnalysis, generateIndustryAnalysis } from "./insights";
import {
  fetchBalanceSheets,
  fetchCashFlowStatements,
  fetchHistoricalData,
  fetchIncomeStatements,
} from "./fetch";
import { getCompetitors } from "./competitors";

export async function getOrganization() {
  const { orgId } = auth();
  if (!orgId) return null;

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.name, orgId),
  });

  return org || null;
}

export async function addCompany(symbol: string) {
  try {
    const name = await getCompanyName(symbol);
    const organization = await getOrganization();
    const organizationId = organization?.id;

    if (!organizationId) return;

    const promises = [
      generateCompanyAnalysis(name || symbol),
      generateIndustryAnalysis(name || symbol),
      getCompetitors({
        name: name || "",
        symbol,
      }),
    ];

    const [companyData, industryData, competitors] =
      await Promise.all(promises);

    const data = {
      name: name || symbol,
      symbol,
      companyData,
      industryData,
      competitors,
      organizationId,
    };

    await db.insert(companies).values(data);
    revalidatePath("/dashboard/analysis");
  } catch (error) {
    console.error(error);
  }
}

export async function getCompanyData(symbol: string) {
  try {
    const organization = await getOrganization();
    const organizationId = organization?.id;

    if (!organizationId) return;

    const data = await db.query.companies.findFirst({
      where:
        eq(companies.symbol, symbol) &&
        eq(companies.organizationId, organizationId),
    });

    if (data) return data;

    return {
      name: "",
      symbol,
      companyData: [],
      industryData: [],
    };
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
    const organization = await getOrganization();
    const organizationId = organization?.id;

    if (!organizationId) return;

    const data = await db.query.companies.findMany({
      where: eq(companies.organizationId, organizationId),
    });
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

      return fetchedData;
    }

    return stockData.data;
  } catch (error) {
    console.error(error);
    return [];
  }

  function calculateIsStale(updatedAt: Date | undefined): boolean {
    if (!updatedAt) return true;

    const updatedAtDate = new Date(updatedAt);
    const currentDate = new Date();

    return updatedAtDate.toDateString() !== currentDate.toDateString();
  }
}

export async function getFinancialData(symbol: string) {
  try {
    const financialData = await db.query.financialStatements.findFirst({
      where: eq(financialStatements.name, symbol.toUpperCase()),
    });

    if (financialData) return financialData;

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

    return { balanceSheets, cashFlowStatements, incomeStatements };
  } catch (error) {
    console.error(error);
    return { balanceSheets: [], cashFlowStatements: [], incomeStatements: [] };
  }
}
