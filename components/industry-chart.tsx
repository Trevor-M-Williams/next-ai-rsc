import { Chart } from "@/components/chart";

export function IndustryChart({
  datasets,
  field,
}: {
  datasets: any[];
  field: string;
}) {
  return (
    <div>
      <Chart datasets={datasets} field={field as keyof FinancialStatement} />
    </div>
  );
}
