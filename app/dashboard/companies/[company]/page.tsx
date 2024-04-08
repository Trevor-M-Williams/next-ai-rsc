"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getCompanyData } from "@/actions/db";

export default function CompanyPage() {
  const { company } = useParams<{ company: string }>();
  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCompanyData(company.replaceAll("-", " "));
      setData(data);
    };

    fetchData();
  }, [company]);

  return (
    <div className="h-full w-full bg-background p-8">
      <div className="w-full max-w-5xl mx-auto prose">
        <h1>{company}</h1>
        {data && (
          <div>
            <h2>Overview</h2>
            <p>{data.overview}</p>
            <h2>Financial Overview</h2>
            <p>{data.financialOverview}</p>
          </div>
        )}
      </div>
    </div>
  );
}
