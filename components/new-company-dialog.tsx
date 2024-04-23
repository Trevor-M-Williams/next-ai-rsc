"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { addCompany } from "@/actions";

export function NewCompanyDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companySymbol, setCompanySymbol] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    await addCompany(companySymbol);
    setOpen(false);
    router.push(`/dashboard/analysis/${companySymbol.replaceAll(" ", "-")}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="">Add</Button>
      </DialogTrigger>
      <DialogContent className="top-40 xl:top-[50%]">
        <DialogHeader>
          <DialogTitle>New Company</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter a company name"
            onChange={(e) => setCompanySymbol(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Initializing..." : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
