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

function formatNumber(value: number) {
  if (!value) return "N/A";
  const number = Math.round(value / 1000000);
  const formattedNumber = new Intl.NumberFormat("en-US").format(number);
  return `${formattedNumber}`;
}

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
            <TableHead className="w-32 text-right">(USD M)</TableHead>
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
                {item.change}%
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
      change: 6.23,
    },
    {
      title: "Total assets",
      value: formatNumber(data.totalAssets),
      change: -2.45,
    },
    {
      title: "Total liabilities",
      value: formatNumber(data.totalLiabilities),
      change: 4.9,
    },
    {
      title: "Total equity",
      value: formatNumber(data.totalEquity),
      change: 6.19,
    },
    {
      title: "Total current assets",
      value: formatNumber(data.totalCurrentAssets),
      change: 6.19,
    },
    {
      title: "Total current liabilities",
      value: formatNumber(data.totalCurrentLiabilities),
      change: 4.9,
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
      change: 6.23,
    },
    {
      title: "Cash from operations",
      value: formatNumber(data.netCashProvidedByOperatingActivities),
      change: 6.23,
    },
    {
      title: "Cash from investing",
      value: formatNumber(data.netCashUsedForInvestingActivites),
      change: -2.45,
    },
    {
      title: "Cash from financing",
      value: formatNumber(data.netCashUsedProvidedByFinancingActivities),
      change: 4.9,
    },
    {
      title: "Net change in cash",
      value: formatNumber(data.netChangeInCash),
      change: 6.19,
    },
    {
      title: "Free cash flow",
      value: formatNumber(data.freeCashFlow),
      change: 6.19,
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
      change: 6.23,
    },
    {
      title: "Cost of revenue",
      value: formatNumber(data.costOfRevenue),
      change: -2.45,
    },
    {
      title: "Gross profit",
      value: formatNumber(data.grossProfit),
      change: 4.9,
    },
    {
      title: "EBITDA",
      value: formatNumber(data.ebitda),
      change: -0.31,
    },
    {
      title: "Net income",
      value: formatNumber(data.netIncome),
      change: 6.19,
    },
    {
      title: "Earnings per share",
      value: data.eps.toString(),
      change: 4.77,
    },
  ];

  return <DataTable data={tableData} />;
}

type FinancialStatementProps = {
  balanceSheets: BalanceSheet[];
  cashFlowStatements: CashFlowStatement[];
  incomeStatements: IncomeStatement[];
};

export function FinancialStatement({
  balanceSheets,
  cashFlowStatements,
  incomeStatements,
}: FinancialStatementProps) {
  const years = balanceSheets.map((item) => item.date.split("-")[0]);
  const [year, setYear] = useState(years[0]);

  return (
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
  );
}
