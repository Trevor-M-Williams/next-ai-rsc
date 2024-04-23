"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { FinancialStatement } from "@/types";

import {
  getCompanyData,
  getHistoricalData,
  getFinancialData,
  getCompetitorData,
} from "@/actions";

import { Stock } from "@/components/stocks";
import { FullFinancialStatement } from "@/components/financials/full-financial-statement";
import { BarChart } from "@/components/charts/bar-chart";
import { FinancialChart } from "@/components/charts/financial-chart";
import { DashboardCard } from "@/components/dashboard-card";
import { MarkdownProse } from "@/components/chat/markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IndustryFinancials } from "@/components/financials/industry-financials";
import { Subnav } from "@/components/subnav";

function CompanyAnalysis({
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
      className="h-full grid gap-4 p-4"
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
                <MarkdownProse content={data} />
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

function IndustryAnalysis({
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
  const datasets = [
    {
      data: financialData?.incomeStatements,
      ticker: company,
    },
    ...competitorData.map((data: any) => ({
      data: data.incomeStatements,
      ticker: data.symbol,
    })),
  ];

  return (
    <div
      className="h-full grid gap-4 p-4"
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
                <MarkdownProse content={data} />
              </div>
            ))}
        </ScrollArea>
      </DashboardCard>
      <DashboardCard colSpan={1} rowSpan={1}>
        <FinancialChart
          datasets={datasets}
          field={"revenue" as keyof FinancialStatement}
        />
      </DashboardCard>
      <DashboardCard colSpan={1} rowSpan={1}>
        <IndustryFinancials />
      </DashboardCard>
    </div>
  );
}

export default function CompanyPage() {
  const { company: symbol } = useParams<{ company: string }>();
  const [name, setName] = useState<string>("");
  const [companyData, setCompanyData] = useState<any>();
  const [industryData, setIndustryData] = useState<any>();
  const [competitorData, setCompetitorData] = useState<any>();
  const [stockData, setStockData] = useState<any>();
  const [financialData, setFinancialData] = useState<any>(null);
  const [activeLink, setActiveLink] = useState("Company");

  useEffect(() => {
    const fetchData = async () => {
      const promises = [
        getCompanyData(symbol),
        getCompetitorData({ name, symbol }), // bottleneck
        getHistoricalData(symbol), // bottleneck
        getFinancialData(symbol),
      ];

      const [
        data,
        competitorData,
        stockData,
        { balanceSheets, cashFlowStatements, incomeStatements },
      ] = await Promise.all(promises);

      setName(data.name || "");
      setCompanyData(data.companyData);
      setIndustryData(data.industryData);
      setCompetitorData(competitorData);
      setStockData(stockData);
      setFinancialData({ balanceSheets, cashFlowStatements, incomeStatements });
    };

    fetchData();
  }, [symbol]);

  return (
    <div className="flex h-full">
      <Subnav
        links={["Company", "Industry", "Financials"]}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />
      <div className="flex-grow flex flex-col">
        {activeLink === "Overview" && <div> Overview </div>}

        {activeLink === "Company" && (
          <CompanyAnalysis
            companyData={companyData}
            stockData={stockData}
            financialData={financialData}
            name={name}
            company={symbol}
          />
        )}

        {activeLink === "Industry" && (
          <IndustryAnalysis
            industryData={industryData}
            financialData={financialData}
            competitorData={competitorData}
            name={name}
            company={symbol}
          />
        )}

        {activeLink === "Financials" && (
          <div className="p-4 flex-grow">
            {financialData && (
              <FullFinancialStatement
                symbol={symbol}
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
