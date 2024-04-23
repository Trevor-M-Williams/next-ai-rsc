"use client";
import { useEffect, useState } from "react";

import { getFinancialData } from "@/actions";

import { FinancialStatementType } from "@/types";

import { FinancialChart } from "@/components/charts/financial-chart";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import CheckIcon from "@mui/icons-material/Check";

export function DynamicFinancialChart({
  symbols,
  field,
}: {
  symbols: string[];
  field: string;
}) {
  const companies = [
    "AAPL",
    "AMZN",
    "GOOG",
    "META",
    "MSFT",
    "NVDA",
    "TSLA",
    "UMBF",
    "BANF",
  ];

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
    ...symbols,
  ]);
  const [selectedField, setSelectedField] = useState<string>(field);
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
    setFieldCommandsOpen(false);
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
    <div className="h-full flex flex-col">
      <div className="relative min-h-10 w-full flex gap-8 mb-2">
        <Command
          onFocus={() => setCompanyCommandsOpen(true)}
          onBlur={() => setCompanyCommandsOpen(false)}
          className="absolute z-10 h-auto min-h-10 w-[48%]"
        >
          <CommandInput placeholder="Ticker" />
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
          className="absolute z-10 right-0 h-auto min-h-10 w-[48%]"
        >
          <CommandInput placeholder="Field" />
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
      <div className="flex-grow">
        <FinancialChart
          datasets={datasets}
          field={selectedField as keyof FinancialStatementType}
        />
      </div>
    </div>
  );
}
