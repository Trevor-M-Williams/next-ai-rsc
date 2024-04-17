import { getFinancialData, getHistoricalData } from "@/actions/db";

import { Stock } from "@/components/stocks";
import { Calendar } from "@/components/ui/calendar";
import { BarChart } from "@/components/overview/bar-chart";
import { Articles } from "@/components/overview/articles";
import { Metric } from "@/components/overview/metric";
import { DashboardCard } from "@/components/dashboard-card";

export default async function HomePage() {
  const data = await getHistoricalData("WMT");
  const { incomeStatements } = await getFinancialData("WMT");

  return (
    <div
      className="h-full grid grid-rows-[7rem_1fr_35vh] gap-4 p-4"
      style={{
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 18rem",
        // gridTemplateRows: "1fr 40vh 35vh",
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
        <Stock symbol="GEN" name="Gen Goods Inc." data={data} color="#00aaff" />
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
