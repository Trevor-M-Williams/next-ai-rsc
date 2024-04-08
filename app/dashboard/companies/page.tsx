import Link from "next/link";
import AppleIcon from "@mui/icons-material/Apple";
import { getCompanies } from "@/actions/db";
import { NewCompanyDialog } from "@/components/new-company-dialog";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-4 flex justify-end">
        <NewCompanyDialog />
      </div>
      {companies.map(({ name }) => (
        <Link
          href={`/dashboard/companies/${name.replaceAll(" ", "-")}`}
          className="relative h-80 flex items-center justify-center p-4 bg-background rounded-lg shadow-sm cursor-pointer hover:shadow-md"
        >
          <div className="absolute top-4 left-4 text-lg font-semibold">
            {name}
          </div>
          <AppleIcon className="scale-[5]" />
        </Link>
      ))}
    </div>
  );
}
