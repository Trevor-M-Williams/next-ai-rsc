type StockChartData = {
  date: string;
  price: number;
};

type StockAPIData = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
  unadjustedVolume: number;
  change: number;
  changePercent: number;
  vwap: number;
  label: string;
  changeOverTime: number;
};

type IncomeStatement = {
  date: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  ebitda: number;
  netIncome: number;
  eps: number;
};

// type FullIncomeStatement = {
//   date: string;
//   symbol: string;
//   reportedCurrency: string;
//   cik: string;
//   fillingDate: string;
//   acceptedDate: string;
//   calendarYear: string;
//   period: string;
//   revenue: number;
//   costOfRevenue: number;
//   grossProfit: number;
//   grossProfitRatio: number;
//   researchAndDevelopmentExpenses: number;
//   generalAndAdministrativeExpenses: number;
//   sellingAndMarketingExpenses: number;
//   sellingGeneralAndAdministrativeExpenses: number;
//   otherExpenses: number;
//   operatingExpenses: number;
//   costAndExpenses: number;
//   interestIncome: number;
//   interestExpense: number;
//   depreciationAndAmortization: number;
//   ebitda: number;
//   ebitdaratio: number;
//   operatingIncome: number;
//   operatingIncomeRatio: number;
//   totalOtherIncomeExpensesNet: number;
//   incomeBeforeTax: number;
//   incomeBeforeTaxRatio: number;
//   incomeTaxExpense: number;
//   netIncome: number;
//   netIncomeRatio: number;
//   eps: number;
//   epsdiluted: number;
//   weightedAverageShsOut: number;
//   weightedAverageShsOutDil: number;
//   link: string;
//   finalLink: string;
// }
