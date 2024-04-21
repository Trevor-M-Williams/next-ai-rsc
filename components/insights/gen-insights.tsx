import { AgendaInsights } from "@/components/insights/agenda-insights";
import { IndustryInsights } from "@/components/insights/industry-insights";
import Trends from "@/components/insights/trends";
import Performance from "@/components/insights/performance";
import Innovation from "@/components/insights/innovation";
import Sales from "@/components/insights/sales";

import { DashboardCard } from "@/components/dashboard-card";

export default async function GenInsights() {
  return (
    <div
      className="h-full grid gap-4 p-4"
      style={{
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 10rem",
        gridTemplateRows: "1fr 1fr 1fr",
      }}
    >
      <DashboardCard colSpan={2} rowSpan={2}>
        <AgendaInsights />
      </DashboardCard>
      <DashboardCard colSpan={2} rowSpan={2}>
        <IndustryInsights />
      </DashboardCard>
      <DashboardCard colSpan={2} rowSpan={1}>
        <Performance />
      </DashboardCard>
      <DashboardCard colSpan={2} rowSpan={1}>
        <Innovation />
      </DashboardCard>
      <DashboardCard colSpan={4} rowSpan={1}>
        <Trends />
      </DashboardCard>
      <DashboardCard colSpan={2} rowSpan={1}>
        <Sales />
      </DashboardCard>
    </div>
  );
}
