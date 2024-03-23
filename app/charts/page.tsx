"use client";
import { useEffect, useState } from "react";

import { getFinancialData } from "@/db/actions";

import { Chart } from "@/components/chart";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import CheckIcon from "@mui/icons-material/Check";

export default function ChartBuilder() {
  const companies = ["AAPL", "AMZN", "GOOGL", "META", "MSFT", "NVDA", "TSLA"];

  const fields = [
    "revenue",
    "costOfRevenue",
    "grossProfit",
    "grossProfitRatio",
    "sellingGeneralAndAdministrativeExpenses",
    "operatingExpenses",
    "ebitda",
    "ebitdaratio",
    "operatingIncome",
    "operatingIncomeRatio",
    "netIncome",
    "netIncomeRatio",
    "eps",
    "weightedAverageShsOut",
  ];

  const [datasets, setDatasets] = useState<any[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([
    "AAPL",
  ]);
  const [selectedField, setSelectedField] = useState<string>("revenue");
  const [companyCommandsOpen, setCompanyCommandsOpen] = useState(false);
  const [fieldCommandsOpen, setFieldCommandsOpen] = useState(false);

  function updateCompanies(company: string) {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  }

  function updateFields(field: string) {
    setSelectedField(field);
  }

  useEffect(() => {
    if (selectedCompanies.length === 0) return;

    (async () => {
      const promises = selectedCompanies.map((company) =>
        getFinancialData(company)
      );
      const results = await Promise.all(promises);

      const newDatasets = results.map((result, index) => ({
        data: result.incomeStatements,
        ticker: selectedCompanies[index],
      }));

      setDatasets(newDatasets);
    })();
  }, [selectedCompanies]);

  return (
    <div className="relative w-full max-w-3xl mx-auto pt-[15vh]">
      <Chart
        datasets={datasets}
        field={selectedField as keyof FinancialStatement}
      />

      <div className=" w-full flex gap-8 mt-8">
        <Command
          onFocus={() => setCompanyCommandsOpen(true)}
          onBlur={() => setCompanyCommandsOpen(false)}
        >
          <CommandInput placeholder="Type a company symbol (e.g. AAPL)" />
          <CommandList className={companyCommandsOpen ? "" : "hidden"}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Companies">
              {companies.map((company) => (
                <CommandItem
                  key={company}
                  onSelect={() => updateCompanies(company)}
                  className="w-full flex justify-between"
                >
                  <div>{company}</div>
                  {selectedCompanies.includes(company) && (
                    <CheckIcon fontSize={"small"} className={"text-blue-500"} />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <Command
          onFocus={() => setFieldCommandsOpen(true)}
          onBlur={() => setFieldCommandsOpen(false)}
        >
          <CommandInput placeholder="Type a field name (e.g. revenue)" />
          <CommandList className={fieldCommandsOpen ? "" : "hidden"}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Fields">
              {fields.map((field) => (
                <CommandItem
                  key={field}
                  onSelect={() => updateFields(field)}
                  className="w-full flex justify-between"
                >
                  <div>{field}</div>
                  {selectedField === field && (
                    <CheckIcon fontSize={"small"} className={"text-blue-500"} />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
}
