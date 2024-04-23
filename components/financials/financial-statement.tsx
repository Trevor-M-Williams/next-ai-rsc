"use client";
import { useState } from "react";

import {
  BalanceSheetType,
  CashFlowStatementType,
  FinancialStatementType,
  IncomeStatementType,
} from "@/types";

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

import { cn, formatNumberInMillions } from "@/lib/utils";

type DataTableProps = {
  data: {
    title: string;
    value: string;
    change: number | null;
  }[];
};

function DataTable({ data }: DataTableProps) {
  return (
    <div className="relative p-4 bg-background rounded-xl">
      <Table>
        <TableHeader className="text-xs">
          <TableRow className=" hover:bg-inherit">
            <TableHead className="">Category</TableHead>
            <TableHead className="w-32 text-right">(M USD)</TableHead>
            <TableHead className="w-32 text-right">Y/Y CHANGE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="text-base hover:bg-inherit">
              <TableCell className="py-4">{item.title}</TableCell>
              <TableCell className="text-right">{item.value}</TableCell>
              <TableCell
                className={cn(
                  "text-right",
                  item.change && item.change > 0
                    ? "text-green-600"
                    : "text-red-700"
                )}
              >
                {item.change ? (
                  <>
                    {item.change > 0 ? "↑" : "↓"} {item.change}%
                  </>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type TabProps = {
  statements: FinancialStatementType[];
  year: string;
  fields: { title: string; key: string }[];
};

function FinancialStatementTab({ statements, year, fields }: TabProps) {
  if (!statements.length) return null;

  const data = statements.find((item) => item.date.includes(year));
  if (!data) return null;

  const tableData = fields.map((field) => {
    const rawValue = data[field.key as keyof (typeof statements)[0]];

    if (!rawValue) {
      return {
        title: field.title,
        value: "-",
        change: null,
      };
    }

    return {
      title: field.title,
      value: formatNumberInMillions(parseFloat(rawValue)),
      change: calculateChange(statements, year, field.key),
    };
  });

  return <DataTable data={tableData} />;
}

type FinancialStatementProps = {
  symbol: string;
  name: string;
  balanceSheets: BalanceSheetType[];
  cashFlowStatements: CashFlowStatementType[];
  incomeStatements: IncomeStatementType[];
};

export function FinancialStatement({
  symbol,
  name,
  balanceSheets,
  cashFlowStatements,
  incomeStatements,
}: FinancialStatementProps) {
  let years = balanceSheets.map((item) => item.date.split("-")[0]);
  years.pop();

  const [year, setYear] = useState(years[0]) || "2023";

  return (
    <div className="">
      <div className="flex items-center gap-2 ml-2 mb-2">
        <div className="text-xl font-semibold">{symbol}</div>
        {name && (
          <div className="text-xl">
            {"-"} {name}
          </div>
        )}
      </div>

      <Tabs defaultValue="income-statement" className="relative">
        <div className="absolute right-2">
          <Select defaultValue={year} onValueChange={(val) => setYear(val)}>
            <SelectTrigger className="w-[100px] bg-background">
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
          <FinancialStatementTab
            statements={incomeStatements}
            year={year}
            fields={incomeStatementFields}
          />
        </TabsContent>
        <TabsContent value="balance-sheet">
          <FinancialStatementTab
            statements={balanceSheets}
            year={year}
            fields={balanceSheetFields}
          />
        </TabsContent>
        <TabsContent value="cash-flow">
          <FinancialStatementTab
            statements={cashFlowStatements}
            year={year}
            fields={cashFlowFields}
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

const incomeStatementFields = [
  { title: "Revenue", key: "revenue" },
  { title: "Cost of revenue", key: "costOfRevenue" },
  { title: "EBITDA", key: "ebitda" },
  { title: "Net Income", key: "netIncome" },
  { title: "Net Profit Margin", key: "netIncomeRatio" },
  { title: "Earnins Per Share", key: "eps" },
];

const balanceSheetFields = [
  {
    title: "Cash & short term investments",
    key: "cashAndShortTermInvestments",
  },
  {
    title: "Total assets",
    key: "totalAssets",
  },
  {
    title: "Total liabilities",
    key: "totalLiabilities",
  },
  {
    title: "Total equity",
    key: "totalEquity",
  },
  {
    title: "Total current assets",
    key: "totalCurrentAssets",
  },
  {
    title: "Total current liabilities",
    key: "totalCurrentLiabilities",
  },
];

const cashFlowFields = [
  {
    title: "Net income",
    key: "netIncome",
  },
  {
    title: "Cash from operations",
    key: "netCashProvidedByOperatingActivities",
  },
  {
    title: "Cash from investing",
    key: "netCashUsedForInvestingActivites",
  },
  {
    title: "Cash from financing",
    key: "netCashUsedProvidedByFinancingActivities",
  },
  {
    title: "Net change in cash",
    key: "netChangeInCash",
  },
  {
    title: "Free cash flow",
    key: "freeCashFlow",
  },
];
