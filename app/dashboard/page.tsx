import { getHistoricalData } from "@/actions/db";
import { getHeadlines } from "@/actions/news";

import { Stock } from "@/components/stocks";
import { Calendar } from "@/components/ui/calendar";
import { BarChart } from "@/components/overview/bar-chart";
import { Articles } from "@/components/overview/articles";
import { DashboardCard } from "@/components/dashboard-card";

import { cn } from "@/lib/utils";

function Metric({
  title,
  value,
  unit,
  bg,
}: {
  title: string;
  value: string;
  unit?: string;
  bg: string;
}) {
  return (
    <div
      className={cn(
        "h-full flex items-center justify-center text-white cursor-pointer gap-4 lg:gap-6",
        bg
      )}
    >
      <div className="flex items-center justify-center text-5xl lg:text-6xl xl:text-7xl">
        {value}
        <span className="text-3xl">{unit}</span>
      </div>
      <div className="w-24 text-base leading-tight lg:text-lg lg:leading-tight">
        {title}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const data = await getHistoricalData("WMT");

  // const headlines = await getHeadlines("Walmart");
  // console.log(headlines);

  return (
    <div
      className="h-screen grid gap-4 p-4"
      style={{
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 18rem",
        gridTemplateRows: "1fr 45vh 35vh",
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
        <BarChart />
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
