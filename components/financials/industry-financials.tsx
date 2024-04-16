import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export function IndustryFinancials() {
  // Sample data
  const companyMetrics = {
    eps: 3.24,
    pe: 15.2,
    grossMargin: "40%",
    operatingMargin: "25%",
    netMargin: "18%",
    roe: "22%",
    revenueGrowth: "5%",
  };

  const industryAverage = {
    eps: 2.98,
    pe: 20.3,
    grossMargin: "35%",
    operatingMargin: "20%",
    netMargin: "15%",
    roe: "18%",
    revenueGrowth: "3%",
  };

  // Table rows mapping
  const metricsRows = [
    { label: "ROE", key: "roe" },
    { label: "Revenue Growth", key: "revenueGrowth" },
    { label: "Gross Margin", key: "grossMargin" },
    { label: "Operating Margin", key: "operatingMargin" },
    { label: "Net Margin", key: "netMargin" },
    { label: "EPS", key: "eps" },
    { label: "P/E", key: "pe" },
  ];

  return (
    <ScrollArea className="h-full p-4">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-inherit">
            <TableHead>Metric</TableHead>
            <TableHead className="text-right">Company</TableHead>
            <TableHead className="text-right">Industry Average</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-lg">
          {metricsRows.map((metric) => (
            <TableRow key={metric.key} className="hover:bg-inherit">
              <TableCell>{metric.label}</TableCell>
              <TableCell className="py-3 text-right">
                {companyMetrics[metric.key as keyof typeof companyMetrics]}
              </TableCell>
              <TableCell className="text-right">
                {industryAverage[metric.key as keyof typeof industryAverage]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
