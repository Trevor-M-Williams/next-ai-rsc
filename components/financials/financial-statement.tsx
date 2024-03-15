"use client";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

type DataTableProps = {
  data: {
    title: string;
    value: string;
    change: number;
  }[];
};

function DataTable({ data }: DataTableProps) {
  return (
    <div className="relative p-4 bg-muted rounded-xl">
      <Table>
        <TableHeader className="text-xs">
          <TableRow>
            <TableHead className="">2023</TableHead>
            <TableHead className="w-32 text-right">(M USD)</TableHead>
            <TableHead className="w-32 text-right">Y/Y CHANGE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="text-base">
              <TableCell className="py-4">{item.title}</TableCell>
              <TableCell className="text-right">{item.value}</TableCell>
              <TableCell
                className={cn(
                  "text-right",
                  item.change > 0 ? "text-green-600" : "text-red-700"
                )}
              >
                {item.change > 0 ? "↑" : "↓"} {item.change}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function BalanceSheet({
  balanceSheets,
  year,
}: {
  balanceSheets: BalanceSheet[];
  year: string;
}) {
  if (!balanceSheets.length) return null;

  const data = balanceSheets.find((item) => item.date.includes(year));
  if (!data) return null;

  const tableData = [
    {
      title: "Cash & short term investments",
      value: formatNumber(data.cashAndShortTermInvestments),
      change: calculateChange(
        balanceSheets,
        year,
        "cashAndShortTermInvestments"
      ),
    },
    {
      title: "Total assets",
      value: formatNumber(data.totalAssets),
      change: calculateChange(balanceSheets, year, "totalAssets"),
    },
    {
      title: "Total liabilities",
      value: formatNumber(data.totalLiabilities),
      change: calculateChange(balanceSheets, year, "totalLiabilities"),
    },
    {
      title: "Total equity",
      value: formatNumber(data.totalEquity),
      change: calculateChange(balanceSheets, year, "totalEquity"),
    },
    {
      title: "Total current assets",
      value: formatNumber(data.totalCurrentAssets),
      change: calculateChange(balanceSheets, year, "totalCurrentAssets"),
    },
    {
      title: "Total current liabilities",
      value: formatNumber(data.totalCurrentLiabilities),
      change: calculateChange(balanceSheets, year, "totalCurrentLiabilities"),
    },
  ];

  return <DataTable data={tableData} />;
}

function CashFlowStatement({
  cashFlowStatements,
  year,
}: {
  cashFlowStatements: CashFlowStatement[];
  year: string;
}) {
  if (!cashFlowStatements.length) return null;

  const data = cashFlowStatements.find((item) => item.date.includes(year));
  if (!data) return null;

  const tableData = [
    {
      title: "Net income",
      value: formatNumber(data.netIncome),
      change: calculateChange(cashFlowStatements, year, "netIncome"),
    },
    {
      title: "Cash from operations",
      value: formatNumber(data.netCashProvidedByOperatingActivities),
      change: calculateChange(
        cashFlowStatements,
        year,
        "netCashProvidedByOperatingActivities"
      ),
    },
    {
      title: "Cash from investing",
      value: formatNumber(data.netCashUsedForInvestingActivites),
      change: calculateChange(
        cashFlowStatements,
        year,
        "netCashUsedForInvestingActivites"
      ),
    },
    {
      title: "Cash from financing",
      value: formatNumber(data.netCashUsedProvidedByFinancingActivities),
      change: calculateChange(
        cashFlowStatements,
        year,
        "netCashUsedProvidedByFinancingActivities"
      ),
    },
    {
      title: "Net change in cash",
      value: formatNumber(data.netChangeInCash),
      change: calculateChange(cashFlowStatements, year, "netChangeInCash"),
    },
    {
      title: "Free cash flow",
      value: formatNumber(data.freeCashFlow),
      change: calculateChange(cashFlowStatements, year, "freeCashFlow"),
    },
  ];

  return <DataTable data={tableData} />;
}

function IncomeStatement({
  incomeStatements,
  year,
}: {
  incomeStatements: IncomeStatement[];
  year: string;
}) {
  if (!incomeStatements.length) return null;

  const data = incomeStatements.find((item) => item.date.includes(year));
  if (!data) return null;

  const tableData = [
    {
      title: "Revenue",
      value: formatNumber(data.revenue),
      change: calculateChange(incomeStatements, year, "revenue"),
    },
    {
      title: "Cost of revenue",
      value: formatNumber(data.costOfRevenue),
      change: calculateChange(incomeStatements, year, "costOfRevenue"),
    },
    {
      title: "EBITDA",
      value: formatNumber(data.ebitda),
      change: calculateChange(incomeStatements, year, "ebitda"),
    },
    {
      title: "Net income",
      value: formatNumber(data.netIncome),
      change: calculateChange(incomeStatements, year, "netIncome"),
    },
    {
      title: "Net profit margin",
      value: (data.netIncomeRatio * 100).toFixed(2),
      change: calculateChange(incomeStatements, year, "netIncomeRatio"),
    },
    {
      title: "Earnings per share",
      value: data.eps.toString(),
      change: calculateChange(incomeStatements, year, "eps"),
    },
  ];

  return <DataTable data={tableData} />;
}

type FinancialStatementProps = {
  name: string;
  balanceSheets: BalanceSheet[];
  cashFlowStatements: CashFlowStatement[];
  incomeStatements: IncomeStatement[];
};

export function FinancialStatement({
  name,
  balanceSheets,
  cashFlowStatements,
  incomeStatements,
}: FinancialStatementProps) {
  let years = balanceSheets.map((item) => item.date.split("-")[0]);
  years.pop();

  const [year, setYear] = useState(years[0]);

  return (
    <div className="">
      <div className="text-xl font-semibold ml-2 mb-2">{name}</div>

      <Tabs defaultValue="income-statement" className="">
        <div className="absolute right-2">
          <Select defaultValue={years[0]} onValueChange={(val) => setYear(val)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((item, index) => (
                <SelectItem key={index} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsList>
          <TabsTrigger value="income-statement">Income Statement</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
        </TabsList>
        <TabsContent value="income-statement">
          <IncomeStatement incomeStatements={incomeStatements} year={year} />
        </TabsContent>
        <TabsContent value="balance-sheet">
          <BalanceSheet balanceSheets={balanceSheets} year={year} />
        </TabsContent>
        <TabsContent value="cash-flow">
          <CashFlowStatement
            cashFlowStatements={cashFlowStatements}
            year={year}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Utils

function calculateChange(data: any, year: string, field: string) {
  const currentYear = data.find((item: any) => item.date.includes(year));
  const previousYear = data.find((item: any) =>
    item.date.includes(parseInt(year) - 1)
  );
  if (!currentYear || !previousYear) return 0;
  const percentChange =
    ((currentYear[field] - previousYear[field]) /
      Math.abs(previousYear[field])) *
    100;
  return parseFloat(percentChange.toFixed(2)) || 0;
}

function formatNumber(value: number) {
  if (!value) return "N/A";
  const number = Math.round(value / 1000000);
  const formattedNumber = new Intl.NumberFormat("en-US").format(number);
  return formattedNumber;
}
