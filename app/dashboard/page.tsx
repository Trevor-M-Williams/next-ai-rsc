import {
  getFinancialData,
  getHistoricalData,
  getOrganization,
} from "@/actions";

import { Stock } from "@/components/stocks";
import { Calendar } from "@/components/ui/calendar";
import { BarChart } from "@/components/charts/bar-chart";
import { Articles } from "@/components/overview/articles";
import { Metric } from "@/components/overview/metric";
import { DashboardCard } from "@/components/dashboard-card";
import { Articles2 } from "@/components/overview/articles2";

export default async function HomePage() {
  const organization = await getOrganization();
  if (!organization) return;

  const symbol = organization.symbol;
  const orgId = organization.id;

  const ticker = symbol === "GEN" ? "KMB" : "INTC";
  const name = symbol === "GEN" ? "GenGoods Inc." : "ABC Technologies";
  const metrics = [
    [3, 12, 7],
    [5, 2, 9],
  ];

  const data = await getHistoricalData(ticker);
  const { incomeStatements } = await getFinancialData(ticker);

  return (
    <div
      className="h-full grid gap-4 p-4"
      style={{
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 18rem",
        gridTemplateRows: "7rem 1fr 35vh",
      }}
    >
      <DashboardCard colSpan={2} rowSpan={1}>
        <Metric
          title="New Industry Insights"
          value={metrics[orgId - 1][0].toString()}
          bg="bg-blue-400"
        />
      </DashboardCard>
      <DashboardCard colSpan={2} rowSpan={1}>
        <Metric
          title="Consumer Sentiment Increase"
          value={metrics[orgId - 1][1].toString()}
          unit="%"
          bg="bg-green-400"
        />
      </DashboardCard>
      <DashboardCard colSpan={2} rowSpan={1}>
        <Metric
          title="Weekly Media Mentions"
          value={metrics[orgId - 1][2].toString()}
          bg="bg-teal-400"
        />
      </DashboardCard>
      <DashboardCard colSpan={1} rowSpan={2}>
        {orgId === 1 ? <Articles /> : <Articles2 />}
      </DashboardCard>
      <DashboardCard colSpan={6} rowSpan={1}>
        <Stock symbol={symbol} name={name} data={data} />
      </DashboardCard>
      <DashboardCard colSpan={6} rowSpan={1}>
        <BarChart data={incomeStatements} />
      </DashboardCard>
      <DashboardCard colSpan={1} rowSpan={1}>
        <Calendar
          mode="single"
          selected={new Date()}
          className="h-full w-full"
        />
      </DashboardCard>
    </div>
  );
}
