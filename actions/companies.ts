import { revalidatePath } from "next/cache";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { companies, symbols } from "@/db/schema";

import { generateCompanyAnalysis, generateIndustryAnalysis } from "./analysis";
import { getCompetitors } from "./competitors";
import { getOrganization } from "./auth";

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

export async function getCompanyData(symbol: string) {
  try {
    const organization = await getOrganization();
    const organizationId = organization?.id;

    if (!organizationId) return;

    const data = await db
      .select()
      .from(companies)
      .where(
        and(
          eq(companies.symbol, symbol.toUpperCase()),
          eq(companies.organizationId, organizationId)
        )
      );

    if (!data[0]) {
      return {
        name: "",
        symbol,
        companyData: [],
        industryData: [],
      };
    }
    return data[0];
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
