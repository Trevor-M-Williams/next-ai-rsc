import { getHistoricalData } from "@/db/actions";

import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import Performance from "@/components/performance";
import Trends from "@/components/trends";
import { AgendaInsights } from "@/components/agend-insights";
import Innovation from "@/components/innovation";
import Sales from "@/components/sales";
import { IndustryInsights } from "@/components/industry-insights";

type CardProps = {
  colSpan: number;
  rowSpan: number;
  children?: React.ReactNode;
};

function Card({ colSpan, rowSpan, children }: CardProps) {
  return (
    <div
      className={cn("bg-background rounded-md shadow-sm overflow-hidden")}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      {children}
    </div>
  );
}

export default async function InsightsPage() {
  const data = await getHistoricalData("PG");

  return (
    <div
      className="h-screen grid gap-4 p-4"
      style={{
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 10rem",
        gridTemplateRows: "1fr 1fr 1fr",
      }}
    >
      <Card colSpan={2} rowSpan={2}>
        <AgendaInsights />
      </Card>
      <Card colSpan={2} rowSpan={2}>
        <IndustryInsights />
      </Card>
      <Card colSpan={2} rowSpan={1}>
        <Performance />
      </Card>
      <Card colSpan={2} rowSpan={1}>
        <Innovation />
      </Card>
      <Card colSpan={4} rowSpan={1}>
        <Trends />
      </Card>
      <Card colSpan={2} rowSpan={1}>
        <Sales />
      </Card>
    </div>
  );
}
