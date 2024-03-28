import { getHistoricalData } from "@/db/actions";

import { Stock } from "@/components/stocks";

import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { BarChart } from "@/components/bar-chart";
import { Articles } from "@/components/articles";

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
        "h-full flex items-center justify-center text-white cursor-pointer gap-6",
        bg
      )}
    >
      <div className="flex items-center justify-center text-7xl">
        {value}
        <span className="text-3xl">{unit}</span>
      </div>
      <div className="w-24 text-lg leading-tight">{title}</div>
    </div>
  );
}

export default async function HomePage() {
  const data = await getHistoricalData("PG");

  return (
    <div
      className="h-screen grid gap-4 p-4"
      style={{
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 18rem",
        gridTemplateRows: "1fr 45vh 35vh",
      }}
    >
      <Card colSpan={2} rowSpan={1}>
        <Metric title="New Governance Insights" value="3" bg="bg-blue-400" />
      </Card>
      <Card colSpan={2} rowSpan={1}>
        <Metric
          title="Consumer Sentiment Increase"
          value="12"
          unit="%"
          bg="bg-green-400"
        />
      </Card>
      <Card colSpan={2} rowSpan={1}>
        <Metric title="Weekly Media Mentions" value="7" bg="bg-teal-400" />
      </Card>
      <Card colSpan={1} rowSpan={2}>
        <Articles />
      </Card>
      <Card colSpan={6} rowSpan={1}>
        <Stock symbol="GEN" name="Gen Goods Inc." data={data} color="#00aaff" />
      </Card>
      <Card colSpan={6} rowSpan={1}>
        <BarChart />
      </Card>
      <Card colSpan={1} rowSpan={1}>
        <Calendar
          mode="single"
          selected={new Date()}
          className="h-full w-full"
        />
      </Card>
    </div>
  );
}
