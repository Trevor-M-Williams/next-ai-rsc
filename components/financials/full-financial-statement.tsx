import { BalanceSheet, CashFlowStatement, IncomeStatement } from "@/types";

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
  balanceSheets: BalanceSheet[];
  years: string[];
}) {
  const metrics = [
    { key: "cashAndCashEquivalents", title: "Cash & Cash Equivalents" },
    { key: "shortTermInvestments", title: "Short Term Investments" },
    {
      key: "cashAndShortTermInvestments",
      title: "Cash & Short Term Investments",
    },
    { key: "netReceivables", title: "Net Receivables" },
    { key: "inventory", title: "Inventory" },
    { key: "otherCurrentAssets", title: "Other Current Assets" },
    { key: "totalCurrentAssets", title: "Total Current Assets" },
    { key: "propertyPlantEquipmentNet", title: "Property, Plant & Equipment" },
    { key: "goodwill", title: "Goodwill" },
    { key: "intangibleAssets", title: "Intangible Assets" },
    {
      key: "goodwillAndIntangibleAssets",
      title: "Goodwill & Intangible Assets",
    },
    { key: "longTermInvestments", title: "Long Term Investments" },
    { key: "taxAssets", title: "Tax Assets" },
    { key: "otherNonCurrentAssets", title: "Other Non-Current Assets" },
    { key: "totalNonCurrentAssets", title: "Total Non-Current Assets" },
    { key: "otherAssets", title: "Other Assets" },
    { key: "totalAssets", title: "Total Assets" },
    { key: "accountPayables", title: "Account Payables" },
    { key: "shortTermDebt", title: "Short Term Debt" },
    { key: "taxPayables", title: "Tax Payables" },
    { key: "deferredRevenue", title: "Deferred Revenue" },
    { key: "otherCurrentLiabilities", title: "Other Current Liabilities" },
    { key: "totalCurrentLiabilities", title: "Total Current Liabilities" },
    { key: "longTermDebt", title: "Long Term Debt" },
    {
      key: "deferredRevenueNonCurrent",
      title: "Deferred Revenue (Non-Current)",
    },
    {
      key: "deferredTaxLiabilitiesNonCurrent",
      title: "Deferred Tax Liabilities (Non-Current)",
    },
    {
      key: "otherNonCurrentLiabilities",
      title: "Other Non-Current Liabilities",
    },
    {
      key: "totalNonCurrentLiabilities",
      title: "Total Non-Current Liabilities",
    },
    { key: "otherLiabilities", title: "Other Liabilities" },
    { key: "capitalLeaseObligations", title: "Capital Lease Obligations" },
    { key: "totalLiabilities", title: "Total Liabilities" },
    { key: "preferredStock", title: "Preferred Stock" },
    { key: "commonStock", title: "Common Stock" },
    { key: "retainedEarnings", title: "Retained Earnings" },
    {
      key: "accumulatedOtherComprehensiveIncomeLoss",
      title: "Accumulated Other Comprehensive Income/Loss",
    },
    {
      key: "othertotalStockholdersEquity",
      title: "Other Total Stockholders Equity",
    },
    { key: "totalStockholdersEquity", title: "Total Stockholders Equity" },
    { key: "totalEquity", title: "Total Equity" },
    {
      key: "totalLiabilitiesAndStockholdersEquity",
      title: "Total Liabilities & Stockholders Equity",
    },
    { key: "minorityInterest", title: "Minority Interest" },
    {
      key: "totalLiabilitiesAndTotalEquity",
      title: "Total Liabilities & Total Equity",
    },
    { key: "totalInvestments", title: "Total Investments" },
    { key: "totalDebt", title: "Total Debt" },
    { key: "netDebt", title: "Net Debt" },
  ];

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
        metrics={metrics}
      />
    </ScrollArea>
  );
}

function FullCashFlowStatement({
  cashFlowStatements,
  years,
}: {
  cashFlowStatements: CashFlowStatement[];
  years: string[];
}) {
  const metrics = [
    { key: "netIncome", title: "Net Income" },
    {
      key: "depreciationAndAmortization",
      title: "Depreciation & Amortization",
    },
    { key: "deferredIncomeTax", title: "Deferred Income Tax" },
    { key: "stockBasedCompensation", title: "Stock Based Compensation" },
    { key: "changeInWorkingCapital", title: "Change in Working Capital" },
    { key: "accountsReceivables", title: "Accounts Receivables" },
    { key: "inventory", title: "Inventory" },
    { key: "accountsPayables", title: "Accounts Payables" },
    { key: "otherWorkingCapital", title: "Other Working Capital" },
    { key: "otherNonCashItems", title: "Other Non-Cash Items" },
    {
      key: "netCashProvidedByOperatingActivities",
      title: "Net Cash Provided by Operating Activities",
    },
    {
      key: "investmentsInPropertyPlantAndEquipment",
      title: "Investments in Property, Plant & Equipment",
    },
    { key: "acquisitionsNet", title: "Acquisitions Net" },
    { key: "purchasesOfInvestments", title: "Purchases of Investments" },
    {
      key: "salesMaturitiesOfInvestments",
      title: "Sales/Maturities of Investments",
    },
    { key: "otherInvestingActivites", title: "Other Investing Activities" },
    {
      key: "netCashUsedForInvestingActivites",
      title: "Net Cash Used for Investing Activities",
    },
    { key: "debtRepayment", title: "Debt Repayment" },
    { key: "commonStockIssued", title: "Common Stock Issued" },
    { key: "commonStockRepurchased", title: "Common Stock Repurchased" },
    { key: "dividendsPaid", title: "Dividends Paid" },
    { key: "otherFinancingActivites", title: "Other Financing Activities" },
    {
      key: "netCashUsedProvidedByFinancingActivities",
      title: "Net Cash Used Provided by Financing Activities",
    },
    {
      key: "effectOfForexChangesOnCash",
      title: "Effect of Forex Changes on Cash",
    },
    { key: "netChangeInCash", title: "Net Change in Cash" },
    { key: "cashAtEndOfPeriod", title: "Cash at End of Period" },
    { key: "cashAtBeginningOfPeriod", title: "Cash at Beginning of Period" },
    { key: "operatingCashFlow", title: "Operating Cash Flow" },
    { key: "capitalExpenditure", title: "Capital Expenditure" },
    { key: "freeCashFlow", title: "Free Cash Flow" },
  ];

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
        metrics={metrics}
      />
    </ScrollArea>
  );
}

function FullIncomeStatement({
  incomeStatements,
  years,
}: {
  incomeStatements: IncomeStatement[];
  years: string[];
}) {
  const metrics = [
    { key: "revenue", title: "Revenue" },
    { key: "costOfRevenue", title: "Cost of Revenue" },
    { key: "grossProfit", title: "Gross Profit" },
    { key: "grossProfitRatio", title: "Gross Profit Ratio" },
    { key: "researchAndDevelopmentExpenses", title: "R&D Expenses" },
    {
      key: "generalAndAdministrativeExpenses",
      title: "General & Administrative Expenses",
    },
    {
      key: "sellingAndMarketingExpenses",
      title: "Selling & Marketing Expenses",
    },
    { key: "sellingGeneralAndAdministrativeExpenses", title: "SG&A Expenses" },
    { key: "otherExpenses", title: "Other Expenses" },
    { key: "operatingExpenses", title: "Operating Expenses" },
    { key: "costAndExpenses", title: "Cost and Expenses" },
    { key: "interestIncome", title: "Interest Income" },
    { key: "interestExpense", title: "Interest Expense" },
    {
      key: "depreciationAndAmortization",
      title: "Depreciation & Amortization",
    },
    { key: "ebitda", title: "EBITDA" },
    { key: "ebitdaratio", title: "EBITDA Ratio " },
    { key: "operatingIncome", title: "Operating Income" },
    { key: "operatingIncomeRatio", title: "Operating Income Ratio " },
    { key: "totalOtherIncomeExpensesNet", title: "Other Income/Expenses Net" },
    { key: "incomeBeforeTax", title: "Income Before Tax" },
    { key: "incomeBeforeTaxRatio", title: "Income Before Tax Ratio " },
    { key: "incomeTaxExpense", title: "Income Tax Expense" },
    { key: "netIncome", title: "Net Income" },
    { key: "netIncomeRatio", title: "Net Income Ratio " },
    { key: "eps", title: "Earnings Per Share (EPS)" },
    { key: "epsdiluted", title: "Diluted EPS" },
    {
      key: "weightedAverageShsOut",
      title: "Weighted Average Shares Outstanding",
    },
    {
      key: "weightedAverageShsOutDil",
      title: "Weighted Average Diluted Shares Outstanding",
    },
  ];

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
        metrics={metrics}
      />
    </ScrollArea>
  );
}

type FinancialStatementProps = {
  symbol: string;
  name: string;
  balanceSheets: BalanceSheet[];
  cashFlowStatements: CashFlowStatement[];
  incomeStatements: IncomeStatement[];
};

export function FullFinancialStatement({
  symbol,
  name,
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
