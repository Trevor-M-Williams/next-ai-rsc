import { getHistoricalData } from "@/db/actions";

import { Stock } from "@/components/stocks";
import { cn } from "@/lib/utils";

type CardProps = {
  colSpan: number;
  rowSpan: number;
  children?: React.ReactNode;
};

function Card({ colSpan, rowSpan, children }: CardProps) {
  return (
    <div
      className={cn("flex items-center bg-background rounded-md shadow-sm")}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      <div className="w-full ">{children}</div>
    </div>
  );
}

export default async function HomePage() {
  const data = await getHistoricalData("GEN");

  return (
    <div
      className="h-screen grid grid-rows-5 gap-4 p-4"
      style={{
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 3.25fr",
        gridTemplateRows: "0.5fr 1.5fr 1fr",
      }}
    >
      <Card colSpan={2} rowSpan={1}></Card>
      <Card colSpan={2} rowSpan={1}></Card>
      <Card colSpan={2} rowSpan={1}></Card>
      <Card colSpan={1} rowSpan={2}></Card>
      <Card colSpan={6} rowSpan={1}>
        <Stock symbol="GEN" name="Gen Goods Inc." data={data} />
      </Card>
      <Card colSpan={6} rowSpan={1}></Card>
      <Card colSpan={1} rowSpan={1}></Card>
    </div>
  );
}
