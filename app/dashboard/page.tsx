import {
  getFinancialData,
  getHistoricalData,
  getOrganization,
} from "@/actions/db";

import { Stock } from "@/components/stocks";
import { Calendar } from "@/components/ui/calendar";
import { BarChart } from "@/components/overview/bar-chart";
import { Articles } from "@/components/overview/articles";
import { Metric } from "@/components/overview/metric";
import { DashboardCard } from "@/components/dashboard-card";

export default async function HomePage() {
  const organization = await getOrganization();
  if (!organization) return;

  const symbol = organization.symbol;

  const ticker = symbol === "GEN" ? "WMT" : "INTC";
  const name = symbol === "GEN" ? "GenGoods Inc." : "ABC Technologies";

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
        <Metric title="New Governance Insights" value="3" bg="bg-blue-400" />
      </DashboardCard>
      <DashboardCard colSpan={2} rowSpan={1}>
        <Metric
          title="Consumer Sentiment Increase"
          value="12"
          unit="%"
          bg="bg-green-400"
        />
      </DashboardCard>
      <DashboardCard colSpan={2} rowSpan={1}>
        <Metric title="Weekly Media Mentions" value="7" bg="bg-teal-400" />
      </DashboardCard>
      <DashboardCard colSpan={1} rowSpan={2}>
        <Articles />
      </DashboardCard>
      <DashboardCard colSpan={6} rowSpan={1}>
        <Stock symbol={symbol} name={name} data={data} color="#00aaff" />
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
