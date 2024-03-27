import { getFinancialData, getHistoricalData } from "@/db/actions";

import { Stock } from "@/components/stocks";

import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { BarChart } from "@/components/bar-chart";

type CardProps = {
  colSpan: number;
  rowSpan: number;
  children?: React.ReactNode;
};

function Card({ colSpan, rowSpan, children }: CardProps) {
  return (
    <div
      className={cn(" bg-background rounded-md shadow-sm")}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      {children}
    </div>
  );
}

export default async function HomePage() {
  const data = await getHistoricalData("PG");
  // const financialData = await getFinancialData("PG");

  return (
    <div
      className="h-screen grid gap-4 p-4"
      style={{
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 18rem",
        gridTemplateRows: "1fr 45vh 35vh",
      }}
    >
      <Card colSpan={2} rowSpan={1}></Card>
      <Card colSpan={2} rowSpan={1}></Card>
      <Card colSpan={2} rowSpan={1}></Card>
      <Card colSpan={1} rowSpan={2}></Card>
      <Card colSpan={6} rowSpan={1}>
        <Stock symbol="GEN" name="Gen Goods Inc." data={data} />
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
