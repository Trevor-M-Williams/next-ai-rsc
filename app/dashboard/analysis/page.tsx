import Link from "next/link";
import { getCompanies } from "@/actions/db";
import { NewCompanyDialog } from "@/components/new-company-dialog";

export default async function AnalysisPage() {
  const companies = await getCompanies();

  return (
    <div className="h-full w-full p-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-4">
          <NewCompanyDialog />
        </div>
        <div className="flex flex-col divide-y">
          {companies
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(({ name, symbol }) => (
              <Link
                key={symbol}
                href={`/dashboard/analysis/${symbol.replaceAll(" ", "-")}`}
                className="relative flex items-center justify-between p-4 cursor-pointer hover:bg-muted"
              >
                <div className="text-lg font-semibold">{name}</div>
                <div>{symbol}</div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
