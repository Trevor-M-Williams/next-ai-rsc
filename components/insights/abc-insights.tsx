import { AgendaInsights2 } from "@/components/insights/agenda-insights2";
import { IndustryInsights2 } from "@/components/insights/industry-insights2";
import Trends2 from "@/components/insights/trends2";
import Performance2 from "@/components/insights/performance2";
import Innovation2 from "@/components/insights/innovation2";
import Sales2 from "@/components/insights/sales2";

import { DashboardCard } from "@/components/dashboard-card";

export default async function ABCInsights() {
  return (
    <div
      className="h-full grid gap-4 p-4"
      style={{
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 10rem",
        gridTemplateRows: "1fr 1fr 1fr",
      }}
    >
      <DashboardCard colSpan={2} rowSpan={2}>
        <AgendaInsights2 />
      </DashboardCard>
      <DashboardCard colSpan={2} rowSpan={2}>
        <IndustryInsights2 />
      </DashboardCard>
      <DashboardCard colSpan={2} rowSpan={1}>
        <Performance2 />
      </DashboardCard>
      <DashboardCard colSpan={2} rowSpan={1}>
        <Innovation2 />
      </DashboardCard>
      <DashboardCard colSpan={4} rowSpan={1}>
        <Trends2 />
      </DashboardCard>
      <DashboardCard colSpan={2} rowSpan={1}>
        <Sales2 />
      </DashboardCard>
    </div>
  );
}
