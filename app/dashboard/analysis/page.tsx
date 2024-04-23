import Link from "next/link";
import { getCompanies } from "@/actions";
import { CompanyDialog } from "@/components/analysis/company-dialog";

export const dynamic = "force-dynamic";

export default async function AnalysisPage() {
  const companies = await getCompanies();

  return (
    <div className="h-full w-full p-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-4">
          <CompanyDialog />
        </div>
        <div className="flex flex-col divide-y">
          {companies &&
            companies
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(({ name, symbol }) => (
                <Link
                  key={symbol}
                  href={`/dashboard/analysis/${symbol.replaceAll(" ", "-")}`}
                  className="relative flex items-center justify-between p-4 cursor-pointer hover:bg-muted"
                >
                  <div className="text-xl font-semibold">{name}</div>
                  <div className="text-lg">{symbol}</div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
