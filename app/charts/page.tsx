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
  const companies = ["AAPL", "AMZN", "GOOG", "META", "MSFT", "NVDA", "TSLA"];

  const fields = [
    { name: "costOfRevenue", label: "Cost Of Revenue" },
    { name: "ebitda", label: "Ebitda" },
    { name: "ebitdaratio", label: "Ebitda Ratio" },
    { name: "eps", label: "Eps" },
    { name: "grossProfit", label: "Gross Profit" },
    { name: "grossProfitRatio", label: "Gross Profit Ratio" },
    { name: "netIncome", label: "Net Income" },
    { name: "netIncomeRatio", label: "Net Income Ratio" },
    { name: "operatingExpenses", label: "Operating Expenses" },
    { name: "operatingIncome", label: "Operating Income" },
    { name: "operatingIncomeRatio", label: "Operating Income Ratio" },
    { name: "revenue", label: "Revenue" },
    {
      name: "sellingGeneralAndAdministrativeExpenses",
      label: "SG&A Expenses",
    },
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
    <div className="relative w-full max-w-3xl mx-auto pt-8">
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
                  key={field.name}
                  onSelect={() => updateFields(field.name)}
                  className="w-full flex justify-between"
                >
                  <div>{field.label}</div>
                  {selectedField === field.name && (
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
