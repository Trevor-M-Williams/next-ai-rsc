"use client";

export function FinancialStatement({ data }: { data: IncomeStatement }) {
  const year = data.date.slice(0, 4);

  const revenue = formatNumber(data.revenue);
  const costOfRevenue = formatNumber(data.costOfRevenue);
  const grossProfit = formatNumber(data.grossProfit);
  const operatingExpenses = formatNumber(data.operatingExpenses);
  const operatingIncome = formatNumber(data.operatingIncome);
  const ebitda = formatNumber(data.ebitda);
  const netIncome = formatNumber(data.netIncome);

  function formatNumber(value: number) {
    if (!value) return "N/A";
    const number = Math.round(value / 1000000);
    const formattedNumber = new Intl.NumberFormat("en-US").format(number);
    return `$${formattedNumber}M`;
  }

  return (
    <div className="relative p-4 bg-zinc-100 border rounded-xl overflow-hidden">
      <div className="grid grid-cols-2">
        <div className="font-medium text-lg">Income Statement</div>
        <div className="font-medium text-lg">{year}</div>
        <div>Revenue</div>
        <div>{revenue}</div>
        <div>Cost of Revenue</div>
        <div>{costOfRevenue}</div>
        <div>Gross Profit</div>
        <div>{grossProfit}</div>
        <div>Operating Expenses</div>
        <div>{operatingExpenses}</div>
        <div>Operating Income</div>
        <div>{operatingIncome}</div>
        <div>EBITDA</div>
        <div>{ebitda}</div>
        <div>Net Income</div>
        <div>{netIncome}</div>
        <div>EPS</div>
        <div>{data.eps}</div>
      </div>
    </div>
  );
}
