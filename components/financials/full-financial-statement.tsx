import { balanceSheetMetrics, cashflowMetrics, incomeMetrics } from "./metrics";

import {
  BalanceSheetType,
  CashFlowStatementType,
  IncomeStatementType,
} from "@/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatNumberInMillions } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

function FinancialDataTable({
  data,
  years,
  metrics,
}: {
  data: any[];
  years: string[];
  metrics: { key: string; title: string }[];
}) {
  return (
    <Table>
      <TableHeader className="text-xs">
        <TableRow className="hover:bg-inherit">
          <TableHead className="">Category</TableHead>
          {years.map((year) => (
            <TableHead key={year} className="w-32 text-right">
              {year}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {metrics.map((metric) => (
          <TableRow key={metric.key} className="text-base hover:bg-inherit">
            <TableCell className="py-4">{metric.title}</TableCell>
            {years.map((year) => {
              const currentYearData = data.find((item) =>
                item.date.includes(year)
              );
              const value = currentYearData
                ? formatNumberInMillions(
                    currentYearData[
                      metric.key as keyof typeof currentYearData
                    ] as number
                  )
                : "-";

              return (
                <TableCell key={year} className="text-right">
                  {value}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function FullBalanceSheet({
  balanceSheets,
  years,
}: {
  balanceSheets: BalanceSheetType[];
  years: string[];
}) {
  return (
    <ScrollArea
      className="p-4 bg-background rounded"
      style={{
        height: "calc(100vh - 5rem)",
      }}
    >
      <FinancialDataTable
        data={balanceSheets}
        years={years}
        metrics={balanceSheetMetrics}
      />
    </ScrollArea>
  );
}

function FullCashFlowStatement({
  cashFlowStatements,
  years,
}: {
  cashFlowStatements: CashFlowStatementType[];
  years: string[];
}) {
  return (
    <ScrollArea
      className="p-4 bg-background rounded"
      style={{
        height: "calc(100vh - 5rem)",
      }}
    >
      <FinancialDataTable
        data={cashFlowStatements}
        years={years}
        metrics={cashflowMetrics}
      />
    </ScrollArea>
  );
}

function FullIncomeStatement({
  incomeStatements,
  years,
}: {
  incomeStatements: IncomeStatementType[];
  years: string[];
}) {
  return (
    <ScrollArea
      className="p-4 bg-background rounded"
      style={{
        height: "calc(100vh - 5rem)",
      }}
    >
      <FinancialDataTable
        data={incomeStatements}
        years={years}
        metrics={incomeMetrics}
      />
    </ScrollArea>
  );
}

type FinancialStatementProps = {
  balanceSheets: BalanceSheetType[];
  cashFlowStatements: CashFlowStatementType[];
  incomeStatements: IncomeStatementType[];
};

export function FullFinancialStatement({
  balanceSheets,
  cashFlowStatements,
  incomeStatements,
}: FinancialStatementProps) {
  const years = [
    ...new Set(balanceSheets.map((is) => is.date.split("-")[0])),
  ].sort();

  return (
    <Tabs defaultValue="income-statement" className="relative">
      <div className="absolute top-2 right-2 text-sm text-gray-500">
        *Values in M USD
      </div>
      <TabsList>
        <TabsTrigger value="income-statement">Income Statement</TabsTrigger>
        <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
        <TabsTrigger value="cash-flow-statement">
          Cash Flow Statement
        </TabsTrigger>
      </TabsList>
      <TabsContent value="income-statement">
        <FullIncomeStatement
          incomeStatements={incomeStatements}
          years={years}
        />
      </TabsContent>
      <TabsContent value="balance-sheet">
        <FullBalanceSheet balanceSheets={balanceSheets} years={years} />
      </TabsContent>
      <TabsContent value="cash-flow-statement">
        <FullCashFlowStatement
          cashFlowStatements={cashFlowStatements}
          years={years}
        />
      </TabsContent>
    </Tabs>
  );
}
