"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getCompanyData,
  getCompanyName,
  getFinancialData,
  getHistoricalData,
} from "@/actions/db";

import { AnalysisSidebar } from "@/components/secondary-sidebar";

import { Stock } from "@/components/stocks";
import { FinancialStatement } from "@/components/financials";
import { IndustryChart } from "@/components/industry-chart";
import { BarChart } from "@/components/overview/bar-chart";
import { DashboardCard } from "@/components/dashboard-card";
import { FullFinancialStatement } from "@/components/financials/full-financial-statement";
import { MarkdownLatex } from "@/components/chat/markdown-latex";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCompetitorData } from "@/actions/competitors";

export function CompanyAnalysis({
  companyData,
  stockData,
  financialData,
  name,
  company,
}: {
  companyData: any;
  stockData: any;
  financialData: any;
  name: string;
  company: string;
}) {
  const analysisHeadings = ["Company Overview", "Financial Overview"];

  return (
    <div
      className="h-screen grid gap-4 p-4"
      style={{
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
      }}
    >
      <DashboardCard colSpan={1} rowSpan={2}>
        <ScrollArea className="h-full p-4">
          {companyData &&
            companyData.map((data: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="text-2xl font-semibold mb-2">
                  {analysisHeadings[index]}
                </div>
                <MarkdownLatex content={data} />
              </div>
            ))}
        </ScrollArea>
      </DashboardCard>
      <DashboardCard colSpan={1} rowSpan={1}>
        {stockData && <Stock name={name} symbol={company} data={stockData} />}
      </DashboardCard>
      <DashboardCard colSpan={1} rowSpan={1}>
        {financialData && <BarChart data={financialData.incomeStatements} />}
      </DashboardCard>
    </div>
  );
}

export function IndustryAnalysis({
  industryData,
  financialData,
  competitorData,
  name,
  company,
}: {
  industryData: any;
  financialData: any;
  competitorData: any;
  name: string;
  company: string;
}) {
  const analysisHeadings = ["Industry Overview", "Industry Trends"];
  const datasets = competitorData.map((data: any) => ({
    data: data.incomeStatements,
    ticker: data.symbol,
  }));

  return (
    <div
      className="h-screen grid gap-4 p-4"
      style={{
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
      }}
    >
      <DashboardCard colSpan={1} rowSpan={2}>
        <ScrollArea className="h-full p-4">
          {industryData &&
            industryData.map((data: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="text-2xl font-semibold mb-2">
                  {analysisHeadings[index]}
                </div>
                <MarkdownLatex content={data} />
              </div>
            ))}
        </ScrollArea>
      </DashboardCard>
      <DashboardCard colSpan={1} rowSpan={1}>
        <IndustryChart datasets={datasets} field="revenue" />
      </DashboardCard>
      <DashboardCard colSpan={1} rowSpan={1}></DashboardCard>
    </div>
  );
}

export default function CompanyPage() {
  const { company } = useParams<{ company: string }>();
  const [name, setName] = useState<string>("");
  const [companyData, setCompanyData] = useState<any>();
  const [industryData, setIndustryData] = useState<any>();
  const [competitorData, setCompetitorData] = useState<any>();
  const [stockData, setStockData] = useState<any>();
  const [financialData, setFinancialData] = useState<any>(null);
  const [activeLink, setActiveLink] = useState("Company");

  useEffect(() => {
    const fetchData = async () => {
      const name = (await getCompanyName(company)) || "";
      const insights = await getCompanyData(company);
      const competitorsData = await getCompetitorData();
      const stockData = await getHistoricalData(company);
      const { balanceSheets, cashFlowStatements, incomeStatements } =
        await getFinancialData(company);
      setName(name);
      setCompanyData(insights.companyData);
      setIndustryData(insights.industryData);
      setCompetitorData(competitorsData);
      setStockData(stockData);
      setFinancialData({ balanceSheets, cashFlowStatements, incomeStatements });
    };

    fetchData();
  }, [company]);

  return (
    <div className="flex h-full">
      <AnalysisSidebar activeLink={activeLink} setActiveLink={setActiveLink} />
      <div className="flex-grow flex flex-col">
        {activeLink === "Overview" && <div> Overview </div>}

        {activeLink === "Company" && (
          <CompanyAnalysis
            companyData={companyData}
            stockData={stockData}
            financialData={financialData}
            name={name}
            company={company}
          />
        )}

        {activeLink === "Industry" && (
          <IndustryAnalysis
            industryData={industryData}
            financialData={financialData}
            competitorData={competitorData}
            name={name}
            company={company}
          />
        )}

        {activeLink === "Financials" && (
          <div className="p-4 flex-grow">
            {financialData && (
              <FullFinancialStatement
                symbol={company}
                name={name}
                balanceSheets={financialData.balanceSheets}
                cashFlowStatements={financialData.cashFlowStatements}
                incomeStatements={financialData.incomeStatements}
              />
            )}
          </div>
        )}

        {activeLink === "News" && <div> News </div>}
      </div>
    </div>
  );
}
